const { db } = require('../config/database');
const { logger } = require('../config/logger');

/**
 * Get all properties with pagination and filtering
 * @param {Object} filters - Filter criteria
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Properties and pagination metadata
 */
exports.getAllProperties = async (filters = {}, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    
    // Start building the query
    let query = db('properties')
      .select(
        'properties.*',
        'cities.name as city_name',
        db.raw('(SELECT url FROM property_images WHERE property_id = properties.id AND is_primary = true LIMIT 1) as primary_image')
      )
      .leftJoin('cities', 'properties.city_id', 'cities.id');
    
    // Apply filters if provided
    if (filters.city_id) {
      query = query.where('properties.city_id', filters.city_id);
    }
    
    if (filters.university_id) {
      query = query.whereIn('properties.id', function() {
        this.select('property_id')
          .from('property_universities')
          .where('university_id', filters.university_id);
      });
    }
    
    if (filters.min_price) {
      query = query.where('price_per_person_per_week', '>=', filters.min_price);
    }
    
    if (filters.max_price) {
      query = query.where('price_per_person_per_week', '<=', filters.max_price);
    }
    
    if (filters.bedrooms) {
      query = query.where('bedrooms', filters.bedrooms);
    }
    
    if (filters.bills_included !== undefined) {
      query = query.where('bills_included', filters.bills_included);
    }
    
    if (filters.available_from) {
      query = query.where('available_from', '>=', filters.available_from);
    }
    
    if (filters.property_type) {
      query = query.where('property_type', filters.property_type);
    }
    
    // Add search term functionality
    if (filters.search) {
      query = query.where(function() {
        this.where('properties.title', 'ILIKE', `%${filters.search}%`)
          .orWhere('properties.description', 'ILIKE', `%${filters.search}%`)
          .orWhere('properties.address_line_1', 'ILIKE', `%${filters.search}%`)
          .orWhere('cities.name', 'ILIKE', `%${filters.search}%`);
      });
    }
    
    // Get total count for pagination
    const countQuery = query.clone().count('properties.id as count').first();
    
    // Get paginated results
    const dataQuery = query.clone()
      .orderBy(filters.sort_by || 'properties.created_at', filters.sort_order || 'desc')
      .limit(limit)
      .offset(offset);
    
    // Execute both queries in parallel
    const [countResult, properties] = await Promise.all([
      countQuery,
      dataQuery
    ]);
    
    const total = parseInt(countResult.count);
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: properties,
      pagination: {
        total,
        per_page: limit,
        current_page: page,
        total_pages: totalPages,
        has_more: page < totalPages
      }
    };
  } catch (error) {
    logger.error(`Error in getAllProperties: ${error.message}`, { error });
    throw new Error('Failed to fetch properties');
  }
};

/**
 * Get property by ID or slug
 * @param {number|string} identifier - Property ID or slug
 * @returns {Object} Property details with images and features
 */
exports.getPropertyById = async (identifier) => {
  try {
    // Determine if identifier is ID or slug
    const isId = !isNaN(identifier);
    
    // Build base query
    const property = await db('properties')
      .select(
        'properties.*',
        'cities.name as city_name',
        'cities.slug as city_slug'
      )
      .leftJoin('cities', 'properties.city_id', 'cities.id')
      .where(isId ? { 'properties.id': identifier } : { 'properties.slug': identifier })
      .first();
    
    if (!property) {
      throw new Error('Property not found');
    }
    
    // Get property images
    const images = await db('property_images')
      .where({ property_id: property.id })
      .orderBy([
        { column: 'is_primary', order: 'desc' },
        { column: 'display_order', order: 'asc' }
      ]);
    
    // Get property features
    const features = await db('features')
      .select('features.*')
      .join('property_features', 'features.id', 'property_features.feature_id')
      .where('property_features.property_id', property.id)
      .orderBy('features.name');
    
    // Get nearby universities
    const universities = await db('universities')
      .select(
        'universities.*',
        db.raw('ST_Distance(ST_MakePoint(universities.longitude, universities.latitude), ST_MakePoint(?, ?)) as distance', 
          [property.longitude, property.latitude])
      )
      .whereRaw('ST_DWithin(ST_MakePoint(universities.longitude, universities.latitude), ST_MakePoint(?, ?), 10000)', 
        [property.longitude, property.latitude])
      .orderBy('distance')
      .limit(5);
    
    // Update views count
    await db('properties')
      .where({ id: property.id })
      .increment('views_count', 1);
    
    return {
      ...property,
      images,
      features,
      nearby_universities: universities
    };
  } catch (error) {
    logger.error(`Error in getPropertyById: ${error.message}`, { error });
    throw error;
  }
};

/**
 * Create a new property
 * @param {Object} propertyData - Property data
 * @returns {Object} Newly created property
 */
exports.createProperty = async (propertyData) => {
  try {
    // Use transaction to ensure data integrity
    return await db.transaction(async trx => {
      // Create the property record
      const [propertyId] = await trx('properties').insert({
        title: propertyData.title,
        slug: propertyData.slug,
        description: propertyData.description,
        city_id: propertyData.city_id,
        address_line_1: propertyData.address_line_1,
        address_line_2: propertyData.address_line_2,
        postcode: propertyData.postcode,
        latitude: propertyData.latitude,
        longitude: propertyData.longitude,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        price_per_person_per_week: propertyData.price_per_person_per_week,
        bills_included: propertyData.bills_included,
        available_from: propertyData.available_from,
        property_type: propertyData.property_type,
        is_featured: propertyData.is_featured || false,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('id');
      
      // Add images if provided
      if (propertyData.images && propertyData.images.length > 0) {
        const imageRecords = propertyData.images.map((image, index) => ({
          property_id: propertyId,
          url: image.url,
          is_primary: index === 0 || image.is_primary,
          description: image.description || null,
          display_order: index,
          created_at: new Date(),
          updated_at: new Date()
        }));
        
        await trx('property_images').insert(imageRecords);
      }
      
      // Add features if provided
      if (propertyData.features && propertyData.features.length > 0) {
        const featureRecords = propertyData.features.map(featureId => ({
          property_id: propertyId,
          feature_id: featureId,
          created_at: new Date(),
          updated_at: new Date()
        }));
        
        await trx('property_features').insert(featureRecords);
      }
      
      // Update city property count
      await trx('cities')
        .where({ id: propertyData.city_id })
        .increment('property_count', 1);
      
      // Return the created property
      const newProperty = await trx('properties')
        .where({ id: propertyId })
        .first();
      
      return newProperty;
    });
  } catch (error) {
    logger.error(`Error in createProperty: ${error.message}`, { error });
    throw error;
  }
};

/**
 * Update a property
 * @param {number} id - Property ID
 * @param {Object} propertyData - Updated property data
 * @returns {Object} Updated property
 */
exports.updateProperty = async (id, propertyData) => {
  try {
    return await db.transaction(async trx => {
      // Cheque if property exists
      const property = await trx('properties')
        .where({ id })
        .first();
      
      if (!property) {
        throw new Error('Property not found');
      }
      
      // Update the property record
      await trx('properties')
        .where({ id })
        .update({
          ...propertyData,
          updated_at: new Date()
        });
      
      // Handle images if provided
      if (propertyData.images) {
        // Clear existing images if flag is set
        if (propertyData.replace_images) {
          await trx('property_images')
            .where({ property_id: id })
            .delete();
        }
        
        // Add new images
        if (propertyData.images.length > 0) {
          const imageRecords = propertyData.images.map((image, index) => ({
            property_id: id,
            url: image.url,
            is_primary: image.is_primary || index === 0,
            description: image.description || null,
            display_order: image.display_order || index,
            created_at: new Date(),
            updated_at: new Date()
          }));
          
          await trx('property_images').insert(imageRecords);
        }
      }
      
      // Handle features if provided
      if (propertyData.features) {
        // Clear existing features
        await trx('property_features')
          .where({ property_id: id })
          .delete();
        
        // Add new features
        if (propertyData.features.length > 0) {
          const featureRecords = propertyData.features.map(featureId => ({
            property_id: id,
            feature_id: featureId,
            created_at: new Date(),
            updated_at: new Date()
          }));
          
          await trx('property_features').insert(featureRecords);
        }
      }
      
      // Return the updated property
      const updatedProperty = await trx('properties')
        .where({ id })
        .first();
      
      return updatedProperty;
    });
  } catch (error) {
    logger.error(`Error in updateProperty: ${error.message}`, { error });
    throw error;
  }
};

/**
 * Delete a property
 * @param {number} id - Property ID
 * @returns {boolean} Success status
 */
exports.deleteProperty = async (id) => {
  try {
    return await db.transaction(async trx => {
      // Get property details for updating city count
      const property = await trx('properties')
        .where({ id })
        .first();
      
      if (!property) {
        throw new Error('Property not found');
      }
      
      // Delete the property (related records will be deleted via cascade)
      await trx('properties')
        .where({ id })
        .delete();
      
      // Update city property count
      await trx('cities')
        .where({ id: property.city_id })
        .decrement('property_count', 1);
      
      return true;
    });
  } catch (error) {
    logger.error(`Error in deleteProperty: ${error.message}`, { error });
    throw error;
  }
}; 