const winston = require('winston');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'stuhouses-api' },
  transports: [
    // Write logs with level 'error' and below to error.log
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

// Sanitize sensitive data from request bodies
const sanitizeRequestBody = (body) => {
  if (!body) return {};
  
  const sanitized = { ...body };
  
  // List of fields to sanitize
  const sensitiveFields = ['password', 'token', 'secret', 'creditCard', 'ssn', 'authorisation'];
  
  // Recursively sanitize nested objects
  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    Object.keys(obj).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (sensitiveFields.some(field => lowerKey.includes(field))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    });
    
    return obj;
  };
  
  return sanitizeObject(sanitized);
};

// Create request logger middleware
const requestLogger = (req, res, next) => {
  // Generate unique transaction ID
  const transactionId = uuidv4();
  req.transactionId = transactionId;
  
  // Add transaction ID to response headers
  res.set('X-Transaction-ID', transactionId);
  
  const startHrTime = process.hrtime();
  
  // Safely stringify large request bodies
  const safeStringify = (obj) => {
    try {
      return JSON.stringify(obj);
    } catch (e) {
      return '[Object too large to stringify]';
    }
  };
  
  // Log request with sanitized body in development
  const logData = {
    type: 'request',
    transactionId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };
  
  // Only log request bodies in development and if not a GET request
  if (process.env.NODE_ENV === 'development' && req.method !== 'GET') {
    logData.body = sanitizeRequestBody(req.body);
  }
  
  logger.info(logData);
  
  // Log response
  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1000000;
    
    // Determine log level based on status code
    let level = 'info';
    if (res.statusCode >= 500) {
      level = 'error';
    } else if (res.statusCode >= 400) {
      level = 'warn';
    }
    
    logger[level]({
      type: 'response',
      transactionId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: elapsedTimeInMs,
      contentLength: res.get('content-length'),
    });
  });
  
  next();
};

// Error logging function that can be used throughout the app
const logError = (message, errorObj, additionalInfo = {}) => {
  logger.error(message, { 
    error: errorObj.message, 
    stack: errorObj.stack,
    ...additionalInfo 
  });
};

// Performance logging for slow operations
const logPerformance = (operation, timeMs, metadata = {}) => {
  // Log slow operations as warnings
  const isSlowOperation = timeMs > 1000; // Consider operations over 1 second as slow
  const level = isSlowOperation ? 'warn' : 'debug';
  
  logger[level]({
    type: 'performance',
    operation,
    executionTime: timeMs,
    slow: isSlowOperation,
    ...metadata
  });
};

// Log unhandled exceptions and rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  // Allow the process to gracefully terminate
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});

module.exports = { 
  logger, 
  requestLogger,
  logError,
  logPerformance 
}; 