const csrf = require('csurf');
const { logger } = require('../config/logger');

/**
 * CSRF protection middleware
 * Ignore specific routes like API endpoints
 */
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

/**
 * Handle CSRF errors
 */
const handleCsrfError = (err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }

  // Log CSRF attack attempt
  logger.warn('CSRF attack detected', {
    ip: req.ip,
    method: req.method,
    path: req.originalUrl,
    headers: req.headers,
    transactionId: req.transactionId
  });

  // Send error response
  res.status(403).json({
    status: 'error',
    message: 'Invalid CSRF token, form has been tampered with'
  });
};

/**
 * Setup CSRF middleware
 * Excludes API endpoints and GET requests
 */
exports.setupCsrf = (app) => {
  // CSRF protection for web routes
  app.use((req, res, next) => {
    // Skip CSRF for API routes and non-mutating methods
    if (
      req.path.startsWith('/api/') || 
      ['GET', 'HEAD', 'OPTIONS'].includes(req.method)
    ) {
      return next();
    }
    
    // Apply CSRF protection for web routes
    csrfProtection(req, res, next);
  });
  
  // Handle CSRF errors
  app.use(handleCsrfError);
  
  // Route to get CSRF token
  app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });
}; 