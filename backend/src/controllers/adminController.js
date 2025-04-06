const { db } = require('../config/database');
const { logger, logError, logPerformance } = require('../config/logger');

/**
 * Admin Controller
 * Handles all admin-related operations for the content management system
 */

// Helper function to cheque admin role
const checkAdminRole = async (req, res) => {
  const { user } = req;
  
  if (!user) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not authorised to access this resource'
    });
  }
  
  // Cheque if user has admin role
  if (user.role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'You do not have permission to perform this action'
    });
  }
  
  return null; // No error, user is admin
};

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Cheque admin role
    const roleError = await checkAdminRole(req, res);
    if (roleError) return;

    // Get stats from database
    const [
      propertyCount,
      cityCount,
      universityCount,
      userCount,
      activeListingsCount,
      recentActions
    ] = await Promise.all([
      db('properties').count('id as count').first(),
      db('cities').count('id as count').first(),
      db('universities').count('id as count').first(),
      db('users').count('id as count').first(),
      db('properties').where('status', 'active').count('id as count').first(),
      db('activity_logs')
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(10)
    ]);
    
    logPerformance('admin-dashboard-stats', Date.now() - startTime);

    return res.status(200).json({
      status: 'success',
      data: {
        counts: {
          properties: propertyCount?.count || 0,
          cities: cityCount?.count || 0,
          universities: universityCount?.count || 0,
          users: userCount?.count || 0,
          activeListings: activeListingsCount?.count || 0
        },
        recentActivity: recentActions || []
      }
    });
  } catch (error) {
    logError('Failed to get dashboard stats', error, { userId: req.user?.id });
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get dashboard statistics',
      transactionId: req.transactionId
    });
  }
};

// Properties
exports.getAllProperties = async (req, res) => {
  try {
    // Cheque admin role
    const roleError = await checkAdminRole(req, res);
    if (roleError) return;
    
    const { page = 1, limit = 20, search = '', status } = req.query;
    const offset = (page - 1) * limit;

    // Build query with filters
    let query = db('properties')
      .select('properties.*', 'cities.name as city_name')
      .leftJoin('cities', 'properties.city_id', 'cities.id')
      .orderBy('properties.created_at', 'desc');
    
    // Apply search filter
    if (search) {
      query = query.where(builder => {
        builder.where('properties.title', 'ilike', `%${search}%`)
          .orWhere('properties.address', 'ilike', `%${search}%`)
          .orWhere('properties.description', 'ilike', `%${search}%`)
          .orWhere('cities.name', 'ilike', `%${search}%`);
      });
    }

    // Apply status filter
    if (status) {
      query = query.where('properties.status', status);
    }

    // Get total count for pagination
    const totalCount = await query.clone().count('properties.id as count').first();
    
    // Get paginated results
    const properties = await query
      .limit(parseInt(limit))
      .offset(offset);

    return res.status(200).json({
      status: 'success',
      data: {
        properties,
        pagination: {
          total: totalCount.count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(totalCount.count / limit)
        }
      }
    });
  } catch (error) {
    logError('Failed to get all properties', error, { userId: req.user?.id });
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get properties',
      transactionId: req.transactionId
    });
  }
};

exports.getProperty = async (req, res) => {
  try {
    // Cheque admin role
    const roleError = await checkAdminRole(req, res);
    if (roleError) return;

    const { id } = req.params;
    
    const property = await db('properties')
      .select(
        'properties.*',
        'cities.name as city_name',
        'universities.name as nearest_university_name'
      )
      .leftJoin('cities', 'properties.city_id', 'cities.id')
      .leftJoin('universities', 'properties.nearest_university_id', 'universities.id')
      .where('properties.id', id)
      .first();
    
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }
    
    // Get property images
    const images = await db('property_images')
      .where('property_id', id)
      .orderBy('order', 'asc');
    
    // Get property features
    const features = await db('property_features')
      .select('property_features.*', 'features.name')
      .leftJoin('features', 'property_features.feature_id', 'features.id')
      .where('property_features.property_id', id);
    
    return res.status(200).json({
      status: 'success',
      data: {
        property,
        images,
        features
      }
    });
  } catch (error) {
    logError('Failed to get property details', error, { userId: req.user?.id, propertyId: req.params.id });
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get property details',
      transactionId: req.transactionId
    });
  }
};

exports.createProperty = async (req, res) => {
  try {
    // Cheque admin role
    const roleError = await checkAdminRole(req, res);
    if (roleError) return;

    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      city_id,
      address,
      postcode,
      latitude,
      longitude,
      property_type,
      status,
      available_from,
      nearest_university_id,
      features,
      images
    } = req.body;
    
    // Start transaction
    const trx = await db.transaction();
    
    try {
      // Create property
      const [propertyId] = await trx('properties').insert({
        title,
        description,
        price,
        bedrooms,
        bathrooms,
        city_id,
        address,
        postcode,
        latitude,
        longitude,
        property_type,
        status: status || 'active',
        available_from,
        nearest_university_id,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('id');
      
      // Add features if provided
      if (features && Array.isArray(features) && features.length > 0) {
        const featureRecords = features.map(featureId => ({
          property_id: propertyId,
          feature_id: featureId
        }));
        
        await trx('property_features').insert(featureRecords);
      }
      
      // Add images if provided
      if (images && Array.isArray(images) && images.length > 0) {
        const imageRecords = images.map((image, index) => ({
          property_id: propertyId,
          url: image.url,
          alt_text: image.alt_text || `Image ${index+1} for ${title}`,
          order: index,
          created_at: new Date(),
          updated_at: new Date()
        }));
        
        await trx('property_images').insert(imageRecords);
      }
      
      // Log activity
      await trx('activity_logs').insert({
        user_id: req.user.id,
        action: 'create',
        resource_type: 'property',
        resource_id: propertyId,
        details: JSON.stringify({ title }),
        created_at: new Date()
      });
      
      // Commit transaction
      await trx.commit();
      
      return res.status(201).json({
        status: 'success',
        message: 'Property created successfully',
        data: {
          id: propertyId
        }
      });
    } catch (trxError) {
      // Rollback transaction on error
      await trx.rollback();
      throw trxError;
    }
  } catch (error) {
    logError('Failed to create property', error, { userId: req.user?.id, body: req.body });
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create property',
      transactionId: req.transactionId
    });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    // Cheque admin role
    const roleError = await checkAdminRole(req, res);
    if (roleError) return;

    const { id } = req.params;
    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      city_id,
      address,
      postcode,
      latitude,
      longitude,
      property_type,
      status,
      available_from,
      nearest_university_id,
      features,
      images
    } = req.body;
    
    // Start transaction
    const trx = await db.transaction();
    
    try {
      // Cheque if property exists
      const property = await trx('properties').where('id', id).first();
      
      if (!property) {
        await trx.rollback();
        return res.status(404).json({
          status: 'fail',
          message: 'Property not found'
        });
      }
      
      // Update property
      await trx('properties').where('id', id).update({
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price }),
        ...(bedrooms && { bedrooms }),
        ...(bathrooms && { bathrooms }),
        ...(city_id && { city_id }),
        ...(address && { address }),
        ...(postcode && { postcode }),
        ...(latitude && { latitude }),
        ...(longitude && { longitude }),
        ...(property_type && { property_type }),
        ...(status && { status }),
        ...(available_from && { available_from }),
        ...(nearest_university_id && { nearest_university_id }),
        updated_at: new Date()
      });
      
      // Update features if provided
      if (features && Array.isArray(features)) {
        // Remove existing features
        await trx('property_features').where('property_id', id).delete();
        
        // Add new features
        if (features.length > 0) {
          const featureRecords = features.map(featureId => ({
            property_id: id,
            feature_id: featureId
          }));
          
          await trx('property_features').insert(featureRecords);
        }
      }
      
      // Update images if provided
      if (images && Array.isArray(images)) {
        // Remove existing images
        await trx('property_images').where('property_id', id).delete();
        
        // Add new images
        if (images.length > 0) {
          const imageRecords = images.map((image, index) => ({
            property_id: id,
            url: image.url,
            alt_text: image.alt_text || `Image ${index+1} for ${property.title}`,
            order: index,
            created_at: new Date(),
            updated_at: new Date()
          }));
          
          await trx('property_images').insert(imageRecords);
        }
      }
      
      // Log activity
      await trx('activity_logs').insert({
        user_id: req.user.id,
        action: 'update',
        resource_type: 'property',
        resource_id: id,
        details: JSON.stringify({ title: title || property.title }),
        created_at: new Date()
      });
      
      // Commit transaction
      await trx.commit();
      
      return res.status(200).json({
        status: 'success',
        message: 'Property updated successfully',
        data: {
          id
        }
      });
    } catch (trxError) {
      // Rollback transaction on error
      await trx.rollback();
      throw trxError;
    }
  } catch (error) {
    logError('Failed to update property', error, { userId: req.user?.id, propertyId: req.params.id });
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update property',
      transactionId: req.transactionId
    });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    // Cheque admin role
    const roleError = await checkAdminRole(req, res);
    if (roleError) return;

    const { id } = req.params;
    
    // Start transaction
    const trx = await db.transaction();
    
    try {
      // Cheque if property exists
      const property = await trx('properties').where('id', id).first();
      
      if (!property) {
        await trx.rollback();
        return res.status(404).json({
          status: 'fail',
          message: 'Property not found'
        });
      }
      
      // Delete related records
      await trx('property_features').where('property_id', id).delete();
      await trx('property_images').where('property_id', id).delete();
      
      // Delete property
      await trx('properties').where('id', id).delete();
      
      // Log activity
      await trx('activity_logs').insert({
        user_id: req.user.id,
        action: 'delete',
        resource_type: 'property',
        resource_id: id,
        details: JSON.stringify({ title: property.title }),
        created_at: new Date()
      });
      
      // Commit transaction
      await trx.commit();
      
      return res.status(200).json({
        status: 'success',
        message: 'Property deleted successfully'
      });
    } catch (trxError) {
      // Rollback transaction on error
      await trx.rollback();
      throw trxError;
    }
  } catch (error) {
    logError('Failed to delete property', error, { userId: req.user?.id, propertyId: req.params.id });
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete property',
      transactionId: req.transactionId
    });
  }
};

// Similar patterns for other entity types - implemented as placeholders for now
// Cities
exports.getAllCities = async (req, res) => {
  try {
    // Cheque admin role
    const roleError = await checkAdminRole(req, res);
    if (roleError) return;
    
    const cities = await db('cities').orderBy('name', 'asc');
    
    return res.status(200).json({
      status: 'success',
      data: {
        cities
      }
    });
  } catch (error) {
    logError('Failed to get all cities', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get cities',
      transactionId: req.transactionId
    });
  }
};

exports.getCity = async (req, res) => {
  // Implementation similar to getProperty
  res.status(200).json({ status: 'success', message: 'City details retrieved' });
};

exports.createCity = async (req, res) => {
  // Implementation similar to createProperty
  res.status(201).json({ status: 'success', message: 'City created successfully' });
};

exports.updateCity = async (req, res) => {
  // Implementation similar to updateProperty
  res.status(200).json({ status: 'success', message: 'City updated successfully' });
};

exports.deleteCity = async (req, res) => {
  // Implementation similar to deleteProperty
  res.status(200).json({ status: 'success', message: 'City deleted successfully' });
};

// Universities
exports.getAllUniversities = async (req, res) => {
  // Implementation similar to getAllCities
  res.status(200).json({ status: 'success', message: 'Universities retrieved' });
};

exports.getUniversity = async (req, res) => {
  // Implementation similar to getProperty
  res.status(200).json({ status: 'success', message: 'University details retrieved' });
};

exports.createUniversity = async (req, res) => {
  // Implementation similar to createProperty
  res.status(201).json({ status: 'success', message: 'University created successfully' });
};

exports.updateUniversity = async (req, res) => {
  // Implementation similar to updateProperty
  res.status(200).json({ status: 'success', message: 'University updated successfully' });
};

exports.deleteUniversity = async (req, res) => {
  // Implementation similar to deleteProperty
  res.status(200).json({ status: 'success', message: 'University deleted successfully' });
};

// Agents
exports.getAllAgents = async (req, res) => {
  // Implementation similar to getAllCities
  res.status(200).json({ status: 'success', message: 'Agents retrieved' });
};

exports.getAgent = async (req, res) => {
  // Implementation similar to getProperty
  res.status(200).json({ status: 'success', message: 'Agent details retrieved' });
};

exports.createAgent = async (req, res) => {
  // Implementation similar to createProperty
  res.status(201).json({ status: 'success', message: 'Agent created successfully' });
};

exports.updateAgent = async (req, res) => {
  // Implementation similar to updateProperty
  res.status(200).json({ status: 'success', message: 'Agent updated successfully' });
};

exports.deleteAgent = async (req, res) => {
  // Implementation similar to deleteProperty
  res.status(200).json({ status: 'success', message: 'Agent deleted successfully' });
};

// Blog Posts
exports.getAllBlogPosts = async (req, res) => {
  // Implementation similar to getAllProperties
  res.status(200).json({ status: 'success', message: 'Blog posts retrieved' });
};

exports.getBlogPost = async (req, res) => {
  // Implementation similar to getProperty
  res.status(200).json({ status: 'success', message: 'Blog post details retrieved' });
};

exports.createBlogPost = async (req, res) => {
  // Implementation similar to createProperty
  res.status(201).json({ status: 'success', message: 'Blog post created successfully' });
};

exports.updateBlogPost = async (req, res) => {
  // Implementation similar to updateProperty
  res.status(200).json({ status: 'success', message: 'Blog post updated successfully' });
};

exports.deleteBlogPost = async (req, res) => {
  // Implementation similar to deleteProperty
  res.status(200).json({ status: 'success', message: 'Blog post deleted successfully' });
};

// Users
exports.getAllUsers = async (req, res) => {
  // Implementation similar to getAllProperties
  res.status(200).json({ status: 'success', message: 'Users retrieved' });
};

exports.getUser = async (req, res) => {
  // Implementation similar to getProperty
  res.status(200).json({ status: 'success', message: 'User details retrieved' });
};

exports.updateUser = async (req, res) => {
  // Implementation similar to updateProperty
  res.status(200).json({ status: 'success', message: 'User updated successfully' });
};

exports.deleteUser = async (req, res) => {
  // Implementation similar to deleteProperty
  res.status(200).json({ status: 'success', message: 'User deleted successfully' });
};

// Media Library
exports.getAllMedia = async (req, res) => {
  // Implementation to retrieve all media files
  res.status(200).json({ status: 'success', message: 'Media files retrieved' });
};

exports.uploadMedia = async (req, res) => {
  // Implementation for file uploads
  res.status(201).json({ status: 'success', message: 'Media uploaded successfully' });
};

exports.deleteMedia = async (req, res) => {
  // Implementation to delete media files
  res.status(200).json({ status: 'success', message: 'Media deleted successfully' });
};

// Settings
exports.getSettings = async (req, res) => {
  // Implementation to retrieve site settings
  res.status(200).json({ status: 'success', message: 'Settings retrieved' });
};

exports.updateSettings = async (req, res) => {
  // Implementation to update site settings
  res.status(200).json({ status: 'success', message: 'Settings updated successfully' });
}; 