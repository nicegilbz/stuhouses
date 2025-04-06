const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { db } = require('../config/database');
const logger = require('../config/logger');

/**
 * Custom error for authentication failures
 */
class AuthError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
    this.status = 'fail';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware to protect routes that require user authentication
 */
exports.protect = async (req, res, next) => {
  try {
    // 1) Get token from request
    let token;
    if (req.headers.authorisation && req.headers.authorisation.startsWith('Bearer')) {
      token = req.headers.authorisation.split(' ')[1];
    } else if (req.biscuits && req.biscuits.jwt) {
      token = req.biscuits.jwt;
    }

    if (!token) {
      throw new AuthError('You are not logged in. Please log in to access this resource.', 401);
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Cheque if user still exists
    const user = await db('users')
      .where({ id: decoded.id })
      .first();

    if (!user) {
      throw new AuthError('The user associated with this token no longer exists.', 401);
    }

    // 4) Store user on request
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your token has expired. Please log in again.',
      });
    }
    
    return res.status(error.statusCode || 500).json({
      status: error.status || 'error',
      message: error.message || 'An error occurred during authentication.',
    });
  }
};

/**
 * Middleware to protect routes that require agent authentication
 */
exports.protectAgent = async (req, res, next) => {
  try {
    // 1) Get token from request
    let token;
    if (req.headers.authorisation && req.headers.authorisation.startsWith('Bearer')) {
      token = req.headers.authorisation.split(' ')[1];
    } else if (req.biscuits && req.biscuits.agent_jwt) {
      token = req.biscuits.agent_jwt;
    }

    if (!token) {
      throw new AuthError('You are not logged in. Please log in to access this resource.', 401);
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Cheque if agent still exists
    const agent = await db('agents')
      .where({ id: decoded.id })
      .first();

    if (!agent) {
      throw new AuthError('The agent associated with this token no longer exists.', 401);
    }

    // 4) Store agent on request
    req.agent = agent;
    next();
  } catch (error) {
    logger.error(`Agent authentication error: ${error.message}`);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your token has expired. Please log in again.',
      });
    }
    
    return res.status(error.statusCode || 500).json({
      status: error.status || 'error',
      message: error.message || 'An error occurred during authentication.',
    });
  }
};

/**
 * Middleware to restrict access to certain user roles
 * @param  {...string} roles - The roles that are allowed to access the route
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
}; 