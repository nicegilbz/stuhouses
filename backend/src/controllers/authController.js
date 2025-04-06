const { logger } = require('../config/logger');
const authService = require('../services/authService');

/**
 * Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    
    // Set JWT as HTTP-only cookie
    res.cookie('jwt', result.token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return res.status(201).json({
      status: 'success',
      token: result.token,
      data: {
        user: result.user
      }
    });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message || 'An error occurred while registering user'
    });
  }
};

/**
 * Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    
    // Set JWT as HTTP-only cookie
    res.cookie('jwt', result.token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return res.status(200).json({
      status: 'success',
      token: result.token,
      data: {
        user: result.user
      }
    });
  } catch (error) {
    logger.error(`Error logging in: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message || 'An error occurred while logging in'
    });
  }
};

/**
 * Reset password request
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    
    // In a real app, we would send an email with the reset link/token
    // For this demo, we'll just return a success response
    
    return res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email',
      // For testing/demo purposes only, never expose in production
      resetToken: result.resetToken,
      resetUrl: result.resetUrl
    });
  } catch (error) {
    logger.error(`Error requesting password reset: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message || 'An error occurred while processing your request'
    });
  }
};

/**
 * Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    
    return res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    logger.error(`Error resetting password: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message || 'An error occurred while resetting password'
    });
  }
};

/**
 * Logout user
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = (req, res) => {
  try {
    // Clear JWT cookie
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error(`Error logging out: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while logging out'
    });
  }
};

/**
 * Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // User is already available from auth middleware
    const { id } = req.user;
    const user = await authService.getUserById(id);
    
    return res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    logger.error(`Error getting current user: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message || 'An error occurred while fetching user details'
    });
  }
}; 