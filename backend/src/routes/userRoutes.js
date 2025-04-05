const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', userController.register);

/**
 * @route   POST /api/users/login
 * @desc    User login
 * @access  Public
 */
router.post('/login', userController.login);

/**
 * @route   GET /api/users/logout
 * @desc    User logout
 * @access  Private
 */
router.get('/logout', authMiddleware.protect, userController.logout);

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware.protect, userController.getMe);

/**
 * @route   PATCH /api/users/me
 * @desc    Update user profile
 * @access  Private
 */
router.patch('/me', authMiddleware.protect, userController.updateMe);

/**
 * @route   GET /api/users/shortlist
 * @desc    Get user's shortlisted properties
 * @access  Private
 */
router.get('/shortlist', authMiddleware.protect, userController.getShortlist);

/**
 * @route   POST /api/users/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', userController.forgotPassword);

/**
 * @route   PATCH /api/users/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
router.patch('/reset-password/:token', userController.resetPassword);

/**
 * @route   GET /api/users/verify/:token
 * @desc    Verify email address
 * @access  Public
 */
router.get('/verify/:token', userController.verifyEmail);

module.exports = router; 