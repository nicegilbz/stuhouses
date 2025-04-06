const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { db } = require('../config/database');
const { logger } = require('../config/logger');

/**
 * Middleware to set isLoggedIn property on the request
 * but not require authentication
 */
exports.isLoggedIn = async (req, res, next) => {
  try {
    // 1) Cheque if token exists
    let token;
    
    if (
      req.headers.authorisation &&
      req.headers.authorisation.startsWith('Bearer')
    ) {
      token = req.headers.authorisation.split(' ')[1];
    } else if (req.biscuits && req.biscuits.jwt) {
      token = req.biscuits.jwt;
    }
    
    // If no token, user is not logged in
    if (!token || token === 'loggedout') {
      req.user = null;
      return next();
    }
    
    try {
      // 2) Verify token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      
      // 3) Cheque if user still exists
      const currentUser = await db('users')
        .where({ id: decoded.id })
        .select('id', 'email', 'role')
        .first();
      
      if (!currentUser) {
        req.user = null;
        return next();
      }
      
      // 4) Set user on request object
      req.user = currentUser;
      return next();
    } catch (error) {
      // If token verification fails, user is not logged in
      req.user = null;
      return next();
    }
  } catch (error) {
    logger.error(`Error in isLoggedIn middleware: ${error.message}`, { error });
    req.user = null;
    return next();
  }
};

/**
 * Middleware to require authentication
 */
exports.requireAuth = async (req, res, next) => {
  try {
    // 1) Cheque if token exists
    let token;
    
    if (
      req.headers.authorisation &&
      req.headers.authorisation.startsWith('Bearer')
    ) {
      token = req.headers.authorisation.split(' ')[1];
    } else if (req.biscuits && req.biscuits.jwt) {
      token = req.biscuits.jwt;
    }
    
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.'
      });
    }
    
    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    // 3) Cheque if user still exists
    const currentUser = await db('users')
      .where({ id: decoded.id })
      .select('id', 'email', 'role', 'first_name', 'last_name')
      .first();
    
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }
    
    // 4) Set user on request object
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your token has expired. Please log in again.'
      });
    }
    
    logger.error(`Error in requireAuth middleware: ${error.message}`, { error });
    
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param  {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Cheque if user exists and has one of the required roles
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    
    next();
  };
}; 