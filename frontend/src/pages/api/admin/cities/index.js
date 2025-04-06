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
        const cities = await getCities(req.query);
        return res.status(200).json({ 
          success: true, 
          data: cities 
        });
        
      case 'POST':
        const newCity = await createCity(req.body);
        return res.status(201).json({ 
          success: true, 
          data: newCity 
        });
        
      default:
        return res.status(405).json({ 
          success: false, 
          message: 'Method not allowed' 
        });
    }
  } catch (error) {
    console.error('Cities API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
}

/**
 * Get cities with pagination and filtering
 */
async function getCities(query) {
  const { page = 1, limit = 10, search } = query;
  const offset = (page - 1) * limit;
  
  // Build the query conditions
  let conditions = [];
  let params = [];
  let paramIndex = 1;
  
  if (search) {
    conditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }
  
  // Construct WHERE clause if conditions exist
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  // Get total count for pagination
  const countQuery = `
    SELECT COUNT(*) FROM cities
    ${whereClause}
  `;
  
  const countResult = await db.query(countQuery, params);
  const totalCount = parseInt(countResult.rows[0].count);
  
  // Get cities with pagination
  const citiesQuery = `
    SELECT 
      c.id, c.name, c.description, c.image_url, c.created_at, c.updated_at,
      (SELECT COUNT(*) FROM properties p WHERE p.city_id = c.id) as property_count,
      (SELECT COUNT(*) FROM universities u WHERE u.city_id = c.id) as university_count
    FROM cities c
    ${whereClause}
    ORDER BY c.name ASC
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;
  
  params.push(parseInt(limit), parseInt(offset));
  
  const result = await db.query(citiesQuery, params);
  
  // Format cities
  const cities = result.rows.map(formatCity);
  
  return {
    cities,
    pagination: {
      total: totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(totalCount / limit)
    }
  };
}

/**
 * Create a new city
 */
async function createCity(cityData) {
  try {
    const { name, description, imageUrl } = cityData;
    
    const result = await db.query(`
      INSERT INTO cities (name, description, image_url)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [name, description, imageUrl]);
    
    return formatCity(result.rows[0]);
  } catch (error) {
    console.error('Error creating city:', error);
    throw error;
  }
}

/**
 * Format a city object
 */
function formatCity(city) {
  return {
    id: city.id,
    name: city.name,
    description: city.description,
    imageUrl: city.image_url,
    createdAt: city.created_at,
    updatedAt: city.updated_at,
    propertyCount: parseInt(city.property_count) || 0,
    universityCount: parseInt(city.university_count) || 0
  };
} 