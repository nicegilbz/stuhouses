require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('./config/database');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { isLoggedIn } = require('./middleware/auth');
const { logger, requestLogger } = require('./config/logger');
const { setupCsrf } = require('./middleware/csrf');
const { swaggerDocs } = require('./config/swagger');
const net = require('net');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const DEFAULT_PORT = process.env.PORT || 5000;

// Find an available port
const findAvailablePort = (port, maxAttempts = 10) => {
  return new Promise((resolve, reject) => {
    let currentPort = parseInt(port, 10);
    let attempts = 0;

    const tryPort = (port) => {
      attempts++;
      const server = net.createServer();
      
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          logger.warn(`Port ${port} is in use, trying ${port + 1} instead.`);
          server.close();
          if (attempts < maxAttempts) {
            tryPort(port + 1);
          } else {
            reject(new Error(`Could not find an available port after ${maxAttempts} attempts`));
          }
        } else {
          reject(err);
        }
      });

      server.once('listening', () => {
        const foundPort = server.address().port;
        server.close();
        resolve(foundPort);
      });

      server.listen(port);
    };

    tryPort(currentPort);
  });
};

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Transaction ID middleware
app.use((req, res, next) => {
  req.transactionId = uuidv4();
  res.setHeader('X-Transaction-ID', req.transactionId);
  next();
});

// Middleware
app.use(cors({
  origin: isProduction ? [frontendURL, /\.vercel\.app$/] : '*',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DOS attacks
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(helmet()); // Security headers
app.use(requestLogger); // Request/response logging

// Set up CSRF protection
setupCsrf(app);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply more strict rate limiting to auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // limit each IP to 10 requests per window
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again after an hour'
  }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Apply isLoggedIn middleware to all routes
app.use(isLoggedIn);

// API health cheque route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Load routes
const cityRoutes = require('./routes/cityRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const universityRoutes = require('./routes/universityRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const agentRoutes = require('./routes/agentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Route mounting
app.use('/api/cities', cityRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Special route for Stripe webhooks - needs to be before the express.json() middleware
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  // Store raw body for Stripe webhook signature verification
  req.rawBody = req.body;
  next();
});

// 404 handler for unknown routes
app.all('*', (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  
  // Log the error
  const logLevel = statusCode >= 500 ? 'error' : 'warn';
  logger[logLevel](`${req.method} ${req.originalUrl} - ${err.message}`, { 
    stack: err.stack,
    statusCode,
    path: req.originalUrl,
    transactionId: req.transactionId
  });
  
  // Send response
  res.status(statusCode).json({
    status,
    message: err.message,
    transactionId: req.transactionId,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

// Database connection status cheque
const checkDatabaseConnection = async () => {
  try {
    await db.raw('SELECT 1');
    logger.info('Database connection established');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', { error: error.message });
    // In production, we might want to exit, but in development just log the error
    if (isProduction) {
      process.exit(1);
    }
    return false;
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught exception: ${error.message}`, { 
    stack: error.stack,
    name: error.name
  });
  
  // Give the logger time to write to file before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled promise rejection:', { 
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined
  });
});

// Cheque if we're running in Vercel serverless environment
const isVercel = process.env.VERCEL === '1';

if (isVercel) {
  // In Vercel, we don't need to start a server
  // Vercel will handle the request/response cycle
  logger.info('Running in Vercel serverless environment');
  
  // Cheque database connection
  checkDatabaseConnection();
  
  // Export the Express app for Vercel serverless function
  module.exports = app;
} else {
  // Start the server for local development
  (async () => {
    try {
      const port = await findAvailablePort(DEFAULT_PORT);
      const server = app.listen(port, () => {
        logger.info(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
        logger.info(`API available at http://localhost:${port}/api`);
        
        // Setup Swagger
        swaggerDocs(app, port);
        
        // Cheque database connection
        checkDatabaseConnection();
      });
      
      // Graceful shutdown
      const shutdown = () => {
        logger.info('Graceful shutdown signal received, closing server');
        server.close(() => {
          logger.info('Server closed');
          process.exit(0);
        });
        
        // Force shutdown if server doesn't close in 10 seconds
        setTimeout(() => {
          logger.error('Server did not close gracefully within timeout, forcing shutdown');
          process.exit(1);
        }, 10000);
      };
      
      process.on('SIGTERM', shutdown);
      process.on('SIGINT', shutdown);
    } catch (error) {
      logger.error(`Failed to start server: ${error.message}`, { stack: error.stack });
      process.exit(1);
    }
  })();
}

// In development, export the app for testing
if (process.env.NODE_ENV === 'development') {
  module.exports = app;
} 