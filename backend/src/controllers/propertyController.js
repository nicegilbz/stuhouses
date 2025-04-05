const { db } = require('../config/database');

/**
 * Get all properties
 * @route   GET /api/properties
 * @access  Public
 */
exports.getAllProperties = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { 
      bedrooms, 
      minPrice, 
      maxPrice,
      billsIncluded = true,
      city,
      sort = 'price-asc', // default sort
      page = 1,
      limit = 12
    } = req.query;
    
    // Start building the query
    let query = db('properties').select('*');
    
    // Apply filters if provided
    if (bedrooms) {
      query = query.where('bedrooms', bedrooms);
    }
    
    if (minPrice) {
      query = query.where('price_per_person_per_week', '>=', parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query = query.where('price_per_person_per_week', '<=', parseFloat(maxPrice));
    }
    
    if (billsIncluded) {
      query = query.where('bills_included', true);
    }
    
    if (city) {
      // Join with cities table to filter by city name
      query = query.join('cities', 'properties.city_id', 'cities.id')
        .where('cities.slug', city.toLowerCase());
    }
    
    // Apply sorting
    switch (sort) {
      case 'price-asc':
        query = query.orderBy('price_per_person_per_week', 'asc');
        break;
      case 'price-desc':
        query = query.orderBy('price_per_person_per_week', 'desc');
        break;
      case 'bedrooms-asc':
        query = query.orderBy('bedrooms', 'asc');
        break;
      case 'bedrooms-desc':
        query = query.orderBy('bedrooms', 'desc');
        break;
      default:
        query = query.orderBy('price_per_person_per_week', 'asc');
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    const totalQuery = db.from('properties').count('id as count').first();
    
    // Apply the same filters to the count query
    if (bedrooms) {
      totalQuery.where('bedrooms', bedrooms);
    }
    
    if (minPrice) {
      totalQuery.where('price_per_person_per_week', '>=', parseFloat(minPrice));
    }
    
    if (maxPrice) {
      totalQuery.where('price_per_person_per_week', '<=', parseFloat(maxPrice));
    }
    
    if (billsIncluded) {
      totalQuery.where('bills_included', true);
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
        properties
      }
    });
  } catch (error) {
    console.error(`Error fetching properties: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching properties'
    });
  }
};

/**
 * Get property by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = await db('properties')
      .where({ id })
      .first();
    
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        property
      }
    });
  } catch (error) {
    console.error(`Error fetching property by ID: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching property details'
    });
  }
};

/**
 * Get property availability
 * @route   GET /api/properties/:id/availability
 * @access  Public
 */
exports.getPropertyAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if property exists
    const property = await db('properties')
      .where({ id })
      .first();
    
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }
    
    // Get property availability dates
    const availability = await db('property_availability')
      .where({ property_id: id })
      .select('start_date', 'end_date', 'status');
    
    return res.status(200).json({
      status: 'success',
      data: {
        property_id: id,
        availability
      }
    });
  } catch (error) {
    console.error(`Error fetching property availability: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching property availability'
    });
  }
};

/**
 * Get property location
 * @route   GET /api/properties/:id/location
 * @access  Public
 */
exports.getPropertyLocation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if property exists
    const property = await db('properties')
      .where({ id })
      .first();
    
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }
    
    // Get property location
    const location = {
      latitude: property.latitude,
      longitude: property.longitude,
      address: {
        line_1: property.address_line_1,
        line_2: property.address_line_2,
        city: property.city,
        postcode: property.postcode
      }
    };
    
    return res.status(200).json({
      status: 'success',
      data: {
        property_id: id,
        location
      }
    });
  } catch (error) {
    console.error(`Error fetching property location: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching property location'
    });
  }
};

/**
 * Search properties with filtering
 * @route   GET /api/properties
 * @access  Public
 */
exports.searchProperties = async (req, res) => {
  try {
    // This is essentially the same as getAllProperties but with more search options
    return exports.getAllProperties(req, res);
  } catch (error) {
    console.error(`Error searching properties: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while searching properties'
    });
  }
};

/**
 * Get featured properties
 * @route   GET /api/properties/featured
 * @access  Public
 */
exports.getFeaturedProperties = async (req, res) => {
  try {
    const featuredProperties = await db('properties')
      .where({ is_featured: true })
      .limit(6)
      .orderBy('created_at', 'desc');
    
    return res.status(200).json({
      status: 'success',
      results: featuredProperties.length,
      data: {
        properties: featuredProperties
      }
    });
  } catch (error) {
    console.error(`Error fetching featured properties: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching featured properties'
    });
  }
};

/**
 * Get property by slug
 * @route   GET /api/properties/:slug
 * @access  Public
 */
exports.getPropertyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const property = await db('properties')
      .where({ slug })
      .first();
    
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }
    
    // Get property images
    const images = await db('property_images')
      .where({ property_id: property.id })
      .select('id', 'url', 'is_primary', 'description');
      
    // Get property features
    const features = await db('property_features')
      .join('features', 'property_features.feature_id', 'features.id')
      .where({ property_id: property.id })
      .select('features.id', 'features.name', 'features.icon');
      
    return res.status(200).json({
      status: 'success',
      data: {
        property: {
          ...property,
          images,
          features
        }
      }
    });
  } catch (error) {
    console.error(`Error fetching property by slug: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching property details'
    });
  }
};

/**
 * Send inquiry about property
 * @route   POST /api/properties/:id/inquire
 * @access  Public
 */
exports.inquireAboutProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message, moveInDate } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name, email and message are required'
      });
    }
    
    // First check if property exists
    const property = await db('properties')
      .where({ id })
      .first();
    
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }
    
    // Create inquiry
    const inquiry = {
      property_id: id,
      name,
      email,
      phone: phone || null,
      message,
      move_in_date: moveInDate || null,
      created_at: new Date()
    };
    
    const [inquiryId] = await db('property_inquiries').insert(inquiry).returning('id');
    
    return res.status(201).json({
      status: 'success',
      message: 'Your inquiry has been sent successfully',
      data: {
        inquiry_id: inquiryId
      }
    });
  } catch (error) {
    console.error(`Error creating property inquiry: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while sending your inquiry'
    });
  }
};

/**
 * Add property to user's shortlist
 * @route   POST /api/properties/:id/shortlist
 * @access  Private
 */
exports.addToShortlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // First check if property exists
    const property = await db('properties')
      .where({ id })
      .first();
    
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }
    
    // Check if already in shortlist
    const existing = await db('user_shortlist')
      .where({
        user_id: userId,
        property_id: id
      })
      .first();
      
    if (existing) {
      return res.status(400).json({
        status: 'fail',
        message: 'Property is already in your shortlist'
      });
    }
    
    // Add to shortlist
    await db('user_shortlist').insert({
      user_id: userId,
      property_id: id,
      created_at: new Date()
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'Property added to your shortlist'
    });
  } catch (error) {
    console.error(`Error adding property to shortlist: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while adding property to shortlist'
    });
  }
};

/**
 * Remove property from user's shortlist
 * @route   DELETE /api/properties/:id/shortlist
 * @access  Private
 */
exports.removeFromShortlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Delete from shortlist
    const deleted = await db('user_shortlist')
      .where({
        user_id: userId,
        property_id: id
      })
      .del();
    
    if (deleted === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found in your shortlist'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Property removed from your shortlist'
    });
  } catch (error) {
    console.error(`Error removing property from shortlist: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while removing property from shortlist'
    });
  }
}; 