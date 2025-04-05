const express = require('express');
const cityController = require('../controllers/cityController');
const router = express.Router();

/**
 * @route   GET /api/cities
 * @desc    Get all cities
 * @access  Public
 */
router.get('/', cityController.getAllCities);

/**
 * @route   GET /api/cities/featured
 * @desc    Get featured cities
 * @access  Public
 */
router.get('/featured', cityController.getFeaturedCities);

/**
 * @route   GET /api/cities/:slug
 * @desc    Get city by slug
 * @access  Public
 */
router.get('/:slug', cityController.getCityBySlug);

/**
 * @route   GET /api/cities/:slug/properties
 * @desc    Get properties by city
 * @access  Public
 */
router.get('/:slug/properties', cityController.getPropertiesByCity);

/**
 * @route   GET /api/cities/:slug/universities
 * @desc    Get universities by city
 * @access  Public
 */
router.get('/:slug/universities', cityController.getUniversitiesByCity);

module.exports = router; 