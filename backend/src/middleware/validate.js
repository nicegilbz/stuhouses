const { validationResult } = require('express-validator');
const { logger } = require('../config/logger');

/**
 * Middleware to validate requests using express-validator
 * @param {Array} validations - Array of express-validator validation rules
 * @returns {Function} Express middleware
 */
exports.validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Cheque for validation errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      logger.warn('Validation error', { 
        path: req.originalUrl, 
        method: req.method,
        errors: errors.array(),
        transactionId: req.transactionId
      });
      
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
          value: err.value
        }))
      });
    }
    
    next();
  };
}; 