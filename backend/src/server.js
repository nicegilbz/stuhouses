require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('./config/database');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { isLoggedIn } = require('./middleware/auth');
const { logger, requestLogger } = require('./config/logger');
const net = require('net');

// Initialize Express app
const app = express();
const DEFAULT_PORT = process.env.PORT || 5000;

// Find an available port
const findAvailablePort = (port, maxAttempts = 10) => {
  return new Promise((resolve, reject) => {
    let currentPort = port;
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

// Middleware
app.use(cors({
  origin: isProduction ? [frontendURL, /\.vercel\.app$/] : '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet()); // Security headers
app.use(requestLogger); // Request/response logging

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api/', apiLimiter);

// Apply isLoggedIn middleware to all routes
app.use(isLoggedIn);

// API health check route
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

// Route mounting
app.use('/api/cities', cityRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/admin', adminRoutes);

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
  
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, { 
    stack: err.stack,
    statusCode,
    path: req.originalUrl,
    transactionId: req.transactionId // Will be set by request logger
  });
  
  res.status(statusCode).json({
    status,
    message: err.message,
    transactionId: req.transactionId,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Database connection status check
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

// Check if we're running in Vercel serverless environment
const isVercel = process.env.VERCEL === '1';

if (isVercel) {
  // In Vercel, we don't need to start a server
  // Vercel will handle the request/response cycle
  logger.info('Running in Vercel serverless environment');
  
  // Check database connection
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
        
        // Check database connection
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