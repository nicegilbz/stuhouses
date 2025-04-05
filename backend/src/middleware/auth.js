const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

/**
 * Middleware to protect routes that require authentication
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from authorization header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      // Get token from cookies
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await db('users')
      .where({ id: decoded.id })
      .first();

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // Grant access to protected route
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

    console.error(`Authentication error: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred during authentication'
    });
  }
};

/**
 * Middleware to check if a user is logged in (for optional auth)
 */
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // Verify token
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      // Check if user still exists
      const currentUser = await db('users')
        .where({ id: decoded.id })
        .first();

      if (currentUser) {
        // Add user to request object
        req.user = currentUser;
      }
    }
    next();
  } catch (error) {
    // Continue even if token is invalid
    next();
  }
}; 