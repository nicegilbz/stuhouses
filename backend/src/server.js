require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('./config/database');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { isLoggedIn } = require('./middleware/auth');
const { logger, requestLogger } = require('./config/logger');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// Route mounting
app.use('/api/cities', cityRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/agents', agentRoutes);

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
    path: req.originalUrl
  });
  
  res.status(statusCode).json({
    status,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Database connection status check
app.once('ready', async () => {
  try {
    await db.raw('SELECT 1');
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Database connection failed:', { error: error.message });
    process.exit(1);
  }
});

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

// Start the server
app.listen(port, () => {
  logger.info(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
  logger.info(`API available at http://localhost:${port}/api`);
  app.emit('ready');
}); 