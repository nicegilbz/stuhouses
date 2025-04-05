const { db } = require('../config/database');

/**
 * Get all universities
 * @route   GET /api/universities
 * @access  Public
 */
exports.getAllUniversities = async (req, res) => {
  try {
    const universities = await db('universities')
      .select('*')
      .orderBy('name', 'asc');
    
    return res.status(200).json({
      status: 'success',
      results: universities.length,
      data: {
        universities
      }
    });
  } catch (error) {
    console.error(`Error fetching universities: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching universities'
    });
  }
};

/**
 * Get university by slug
 * @route   GET /api/universities/:slug
 * @access  Public
 */
exports.getUniversityBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const university = await db('universities')
      .where({ slug })
      .first();
    
    if (!university) {
      return res.status(404).json({
        status: 'fail',
        message: 'University not found'
      });
    }
    
    // Get properties near this university
    const nearbyProperties = await db('properties')
      .join('cities', 'properties.city_id', 'cities.id')
      .where('cities.id', university.city_id)
      .select('properties.*')
      .limit(6);
    
    return res.status(200).json({
      status: 'success',
      data: {
        university,
        nearbyProperties
      }
    });
  } catch (error) {
    console.error(`Error fetching university by slug: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching university details'
    });
  }
};

/**
 * Get universities by city
 * @route   GET /api/universities/city/:citySlug
 * @access  Public
 */
exports.getUniversitiesByCity = async (req, res) => {
  try {
    const { citySlug } = req.params;
    
    const universities = await db('universities')
      .join('cities', 'universities.city_id', 'cities.id')
      .where('cities.slug', citySlug)
      .select('universities.*')
      .orderBy('universities.name', 'asc');
    
    return res.status(200).json({
      status: 'success',
      results: universities.length,
      data: {
        universities
      }
    });
  } catch (error) {
    console.error(`Error fetching universities by city: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching universities by city'
    });
  }
};

/**
 * Get properties near a university
 * @route   GET /api/universities/:slug/properties
 * @access  Public
 */
exports.getPropertiesByUniversity = async (req, res) => {
  try {
    const { slug } = req.params;
    const { 
      bedrooms, 
      minPrice, 
      maxPrice,
      billsIncluded,
      sort = 'price-asc', // default sort
      page = 1,
      limit = 12
    } = req.query;
    
    // First, get the university
    const university = await db('universities')
      .where({ slug })
      .first();
    
    if (!university) {
      return res.status(404).json({
        status: 'fail',
        message: 'University not found'
      });
    }
    
    // Start building the query for properties in the same city as the university
    let query = db('properties')
      .join('cities', 'properties.city_id', 'cities.id')
      .where('cities.id', university.city_id)
      .select('properties.*');
    
    // Apply filters if provided
    if (bedrooms) {
      query = query.where('properties.bedrooms', bedrooms);
    }
    
    if (minPrice) {
      query = query.where('properties.price_per_person_per_week', '>=', parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query = query.where('properties.price_per_person_per_week', '<=', parseFloat(maxPrice));
    }
    
    if (billsIncluded === 'true') {
      query = query.where('properties.bills_included', true);
    }
    
    // Apply sorting
    switch (sort) {
      case 'price-asc':
        query = query.orderBy('properties.price_per_person_per_week', 'asc');
        break;
      case 'price-desc':
        query = query.orderBy('properties.price_per_person_per_week', 'desc');
        break;
      case 'bedrooms-asc':
        query = query.orderBy('properties.bedrooms', 'asc');
        break;
      case 'bedrooms-desc':
        query = query.orderBy('properties.bedrooms', 'desc');
        break;
      default:
        query = query.orderBy('properties.price_per_person_per_week', 'asc');
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    const totalQuery = db('properties')
      .join('cities', 'properties.city_id', 'cities.id')
      .where('cities.id', university.city_id)
      .count('properties.id as count')
      .first();
    
    // Apply the same filters to the count query
    if (bedrooms) {
      totalQuery.where('properties.bedrooms', bedrooms);
    }
    
    if (minPrice) {
      totalQuery.where('properties.price_per_person_per_week', '>=', parseFloat(minPrice));
    }
    
    if (maxPrice) {
      totalQuery.where('properties.price_per_person_per_week', '<=', parseFloat(maxPrice));
    }
    
    if (billsIncluded === 'true') {
      totalQuery.where('properties.bills_included', true);
    }
    
    // Execute both queries
    const [properties, totalResult] = await Promise.all([
      query.limit(limit).offset(offset),
      totalQuery
    ]);
    
    const total = totalResult ? totalResult.count : 0;
    const totalPages = Math.ceil(total / limit);
    
    return res.status(200).json({
      status: 'success',
      results: properties.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages
      },
      data: {
        university,
        properties
      }
    });
  } catch (error) {
    console.error(`Error fetching properties by university: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching properties near this university'
    });
  }
}; 