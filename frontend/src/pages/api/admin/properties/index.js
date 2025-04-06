import db from '../../../../utils/dbService';

export default async function handler(req, res) {
  // Check authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  
  try {
    switch (req.method) {
      case 'GET':
        const properties = await getProperties(req.query);
        return res.status(200).json({ 
          success: true, 
          data: properties 
        });
        
      case 'POST':
        const newProperty = await createProperty(req.body);
        return res.status(201).json({ 
          success: true, 
          data: newProperty 
        });
        
      default:
        return res.status(405).json({ 
          success: false, 
          message: 'Method not allowed' 
        });
    }
  } catch (error) {
    console.error('Properties API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
}

/**
 * Get properties with pagination and filtering
 */
async function getProperties(query) {
  const { page = 1, limit = 10, city, type, minPrice, maxPrice, search } = query;
  const offset = (page - 1) * limit;
  
  // Build the query conditions
  let conditions = [];
  let params = [];
  let paramIndex = 1;
  
  if (city) {
    conditions.push(`city_id = $${paramIndex++}`);
    params.push(city);
  }
  
  if (type) {
    conditions.push(`property_type = $${paramIndex++}`);
    params.push(type);
  }
  
  if (minPrice) {
    conditions.push(`price >= $${paramIndex++}`);
    params.push(minPrice);
  }
  
  if (maxPrice) {
    conditions.push(`price <= $${paramIndex++}`);
    params.push(maxPrice);
  }
  
  if (search) {
    conditions.push(`(title ILIKE $${paramIndex} OR address ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }
  
  // Construct WHERE clause if conditions exist
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  // Get total count for pagination
  const countQuery = `
    SELECT COUNT(*) FROM properties
    ${whereClause}
  `;
  
  const countResult = await db.query(countQuery, params);
  const totalCount = parseInt(countResult.rows[0].count);
  
  // Get properties with pagination
  const propertiesQuery = `
    SELECT 
      p.id, p.title, p.description, p.property_type, p.bedrooms, 
      p.bathrooms, p.price, p.address, p.status, p.available_from,
      p.created_at, p.updated_at, p.featured,
      c.name as city_name, c.id as city_id,
      u.name as university_name, u.id as university_id,
      (
        SELECT json_agg(json_build_object(
          'id', i.id,
          'url', i.url,
          'alt', i.alt,
          'is_primary', i.is_primary
        ))
        FROM property_images i
        WHERE i.property_id = p.id
      ) as images
    FROM properties p
    LEFT JOIN cities c ON p.city_id = c.id
    LEFT JOIN universities u ON p.nearest_university_id = u.id
    ${whereClause}
    ORDER BY p.created_at DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;
  
  params.push(parseInt(limit), parseInt(offset));
  
  const result = await db.query(propertiesQuery, params);
  
  // Format properties
  const properties = result.rows.map(formatProperty);
  
  return {
    properties,
    pagination: {
      total: totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(totalCount / limit)
    }
  };
}

/**
 * Create a new property
 */
async function createProperty(propertyData) {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Insert property
    const { 
      title, description, propertyType, bedrooms, bathrooms, 
      price, address, cityId, nearestUniversityId, 
      availableFrom, status, featured, images 
    } = propertyData;
    
    const propertyResult = await client.query(`
      INSERT INTO properties (
        title, description, property_type, bedrooms, bathrooms,
        price, address, city_id, nearest_university_id,
        available_from, status, featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      title,
      description,
      propertyType,
      bedrooms,
      bathrooms,
      price,
      address,
      cityId,
      nearestUniversityId,
      availableFrom || new Date(),
      status || 'available',
      featured || false
    ]);
    
    const property = propertyResult.rows[0];
    
    // Insert images if provided
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const { url, alt, isPrimary } = images[i];
        
        await client.query(`
          INSERT INTO property_images (
            property_id, url, alt, is_primary
          ) VALUES ($1, $2, $3, $4)
        `, [
          property.id,
          url,
          alt || `Image for ${title}`,
          isPrimary || i === 0 // First image is primary by default
        ]);
      }
    }
    
    // Get the complete property with images
    const completePropertyResult = await client.query(`
      SELECT 
        p.id, p.title, p.description, p.property_type, p.bedrooms, 
        p.bathrooms, p.price, p.address, p.status, p.available_from,
        p.created_at, p.updated_at, p.featured,
        c.name as city_name, c.id as city_id,
        u.name as university_name, u.id as university_id,
        (
          SELECT json_agg(json_build_object(
            'id', i.id,
            'url', i.url,
            'alt', i.alt,
            'is_primary', i.is_primary
          ))
          FROM property_images i
          WHERE i.property_id = p.id
        ) as images
      FROM properties p
      LEFT JOIN cities c ON p.city_id = c.id
      LEFT JOIN universities u ON p.nearest_university_id = u.id
      WHERE p.id = $1
    `, [property.id]);
    
    await client.query('COMMIT');
    
    return formatProperty(completePropertyResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating property:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Format a property object
 */
function formatProperty(property) {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    propertyType: property.property_type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    price: parseFloat(property.price),
    address: property.address,
    status: property.status,
    availableFrom: property.available_from,
    createdAt: property.created_at,
    updatedAt: property.updated_at,
    featured: property.featured,
    city: {
      id: property.city_id,
      name: property.city_name
    },
    university: property.university_id ? {
      id: property.university_id,
      name: property.university_name
    } : null,
    images: property.images || []
  };
} 