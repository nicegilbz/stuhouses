const { db } = require('../config/database');

/**
 * Get all cities
 * @route   GET /api/cities
 * @access  Public
 */
exports.getAllCities = async (req, res) => {
  try {    
    const cities = await db('cities')
      .select('id', 'name', 'slug', 'description', 'image_url', 'property_count')
      .orderBy('property_count', 'desc');
    
    return res.status(200).json({
      status: 'success',
      results: cities.length,
      data: {
        cities
      }
    });
  } catch (error) {
    console.error(`Error fetching cities: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching cities'
    });
  }
};

/**
 * Get featured cities (cities with most properties)
 * @route   GET /api/cities/featured
 * @access  Public
 */
exports.getFeaturedCities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const cities = await db('cities')
      .select('id', 'name', 'slug', 'description', 'image_url', 'property_count')
      .orderBy('property_count', 'desc')
      .limit(limit);
    
    return res.status(200).json({
      status: 'success',
      results: cities.length,
      data: {
        cities
      }
    });
  } catch (error) {
    console.error(`Error fetching featured cities: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching featured cities'
    });
  }
};

/**
 * Get city by slug
 * @route   GET /api/cities/:slug
 * @access  Public
 */
exports.getCityBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const city = await db('cities')
      .where({ slug })
      .first();
    
    if (!city) {
      return res.status(404).json({
        status: 'fail',
        message: 'City not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        city
      }
    });
  } catch (error) {
    console.error(`Error fetching city by slug: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching city details'
    });
  }
};

/**
 * Get properties by city
 * @route   GET /api/cities/:slug/properties
 * @access  Public
 */
exports.getPropertiesByCity = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Check if city exists
    const city = await db('cities')
      .where({ slug })
      .first();
    
    if (!city) {
      return res.status(404).json({
        status: 'fail',
        message: 'City not found'
      });
    }
    
    // In a real app, we would fetch properties here
    // For now, just return an empty array
    
    return res.status(200).json({
      status: 'success',
      results: 0,
      data: {
        city,
        properties: []
      }
    });
  } catch (error) {
    console.error(`Error fetching properties by city: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching properties'
    });
  }
};

/**
 * Get universities by city
 * @route   GET /api/cities/:slug/universities
 * @access  Public
 */
exports.getUniversitiesByCity = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Check if city exists
    const city = await db('cities')
      .where({ slug })
      .first();
    
    if (!city) {
      return res.status(404).json({
        status: 'fail',
        message: 'City not found'
      });
    }
    
    // In a real app, we would fetch universities here
    // For now, just return an empty array
    
    return res.status(200).json({
      status: 'success',
      results: 0,
      data: {
        city,
        universities: []
      }
    });
  } catch (error) {
    console.error(`Error fetching universities by city: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching universities'
    });
  }
}; 