const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.get('/logout', authController.logout);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, authController.getCurrentUser);

/**
 * @route   GET /api/auth/google
 * @desc    Login with Google (OAuth)
 * @access  Public
 */
// To be implemented - would require passport.js or similar

/**
 * @route   GET /api/auth/facebook
 * @desc    Login with Facebook (OAuth)
 * @access  Public
 */
// To be implemented - would require passport.js or similar

module.exports = router; 