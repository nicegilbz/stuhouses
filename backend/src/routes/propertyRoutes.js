const express = require('express');
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @route   GET /api/properties
 * @desc    Search properties with filtering
 * @access  Public
 */
router.get('/', propertyController.searchProperties);

/**
 * @route   GET /api/properties/featured
 * @desc    Get featured properties
 * @access  Public
 */
router.get('/featured', propertyController.getFeaturedProperties);

/**
 * @route   GET /api/properties/:slug
 * @desc    Get property by slug
 * @access  Public
 */
router.get('/:slug', propertyController.getPropertyBySlug);

/**
 * @route   POST /api/properties/:id/inquire
 * @desc    Send inquiry about property
 * @access  Public
 */
router.post('/:id/inquire', propertyController.inquireAboutProperty);

/**
 * @route   POST /api/properties/:id/shortlist
 * @desc    Add property to user's shortlist
 * @access  Private
 */
router.post('/:id/shortlist', authMiddleware.protect, propertyController.addToShortlist);

/**
 * @route   DELETE /api/properties/:id/shortlist
 * @desc    Remove property from user's shortlist
 * @access  Private
 */
router.delete('/:id/shortlist', authMiddleware.protect, propertyController.removeFromShortlist);

module.exports = router; 