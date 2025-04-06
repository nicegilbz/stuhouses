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
  
  // Get city ID from route params
  const cityId = req.query.id;
  
  if (!cityId) {
    return res.status(400).json({
      success: false,
      message: 'City ID is required'
    });
  }
  
  try {
    switch (req.method) {
      case 'GET':
        const city = await getCity(cityId);
        return res.status(200).json({ 
          success: true, 
          data: city 
        });
        
      case 'PUT':
        const updatedCity = await updateCity(cityId, req.body);
        return res.status(200).json({ 
          success: true, 
          data: updatedCity 
        });
        
      case 'DELETE':
        await deleteCity(cityId);
        return res.status(200).json({ 
          success: true, 
          message: 'City deleted successfully' 
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
 * Get a single city by ID
 */
async function getCity(cityId) {
  try {
    const result = await db.query(`
      SELECT 
        c.id, c.name, c.description, c.image_url, c.created_at, c.updated_at,
        (SELECT COUNT(*) FROM properties p WHERE p.city_id = c.id) as property_count,
        (SELECT COUNT(*) FROM universities u WHERE u.city_id = c.id) as university_count
      FROM cities c
      WHERE c.id = $1
    `, [cityId]);
    
    if (result.rows.length === 0) {
      throw new Error('City not found');
    }
    
    return formatCity(result.rows[0]);
  } catch (error) {
    console.error('Error getting city:', error);
    throw error;
  }
}

/**
 * Update a city
 */
async function updateCity(cityId, cityData) {
  try {
    const { name, description, imageUrl } = cityData;
    
    const result = await db.query(`
      UPDATE cities
      SET name = $1, description = $2, image_url = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [name, description, imageUrl, cityId]);
    
    if (result.rows.length === 0) {
      throw new Error('City not found');
    }
    
    return formatCity(result.rows[0]);
  } catch (error) {
    console.error('Error updating city:', error);
    throw error;
  }
}

/**
 * Delete a city
 */
async function deleteCity(cityId) {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Check if the city exists
    const checkResult = await client.query(
      'SELECT id FROM cities WHERE id = $1',
      [cityId]
    );
    
    if (checkResult.rows.length === 0) {
      throw new Error('City not found');
    }
    
    // Check if there are related properties
    const propertiesResult = await client.query(
      'SELECT COUNT(*) FROM properties WHERE city_id = $1',
      [cityId]
    );
    
    const propertyCount = parseInt(propertiesResult.rows[0].count);
    
    if (propertyCount > 0) {
      throw new Error(`Cannot delete city with ${propertyCount} associated properties`);
    }
    
    // Check if there are related universities
    const universitiesResult = await client.query(
      'SELECT COUNT(*) FROM universities WHERE city_id = $1',
      [cityId]
    );
    
    const universityCount = parseInt(universitiesResult.rows[0].count);
    
    if (universityCount > 0) {
      throw new Error(`Cannot delete city with ${universityCount} associated universities`);
    }
    
    // Delete the city
    await client.query(
      'DELETE FROM cities WHERE id = $1',
      [cityId]
    );
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting city:', error);
    throw error;
  } finally {
    client.release();
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