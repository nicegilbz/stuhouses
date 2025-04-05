const express = require('express');
const universityController = require('../controllers/universityController');
const router = express.Router();

/**
 * @route   GET /api/universities
 * @desc    Get all universities
 * @access  Public
 */
router.get('/', universityController.getAllUniversities);

/**
 * @route   GET /api/universities/:slug
 * @desc    Get university by slug
 * @access  Public
 */
router.get('/:slug', universityController.getUniversityBySlug);

/**
 * @route   GET /api/universities/:slug/properties
 * @desc    Get properties near a university
 * @access  Public
 */
router.get('/:slug/properties', universityController.getPropertiesByUniversity);

module.exports = router; 