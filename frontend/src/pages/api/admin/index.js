import db from '../../../utils/dbService';
import { verifyToken } from '../../../utils/auth';

export default async function handler(req, res) {
  // Enable CORS for production
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if the request is authenticated as admin
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  // Get token from header
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token and check if user is admin
    const decodedToken = verifyToken(token);
    
    if (!decodedToken || decodedToken.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required'
      });
    }
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get dashboard stats
        const stats = await getDashboardStats();
        return res.status(200).json({ 
          success: true, 
          data: stats 
        });
        
      default:
        return res.status(405).json({ 
          success: false, 
          message: 'Method not allowed' 
        });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    
    // Handle token validation errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
}

/**
 * Get dashboard statistics
 */
async function getDashboardStats() {
  try {
    // Wrap all database operations in a try/catch block
    let propertyCount = 0;
    let cityCount = 0;
    let universityCount = 0;
    let userCount = 0;
    let activities = [];
    let revenue = [];

    try {
      // Get property count
      const propertiesResult = await db.query('SELECT COUNT(*) FROM properties');
      propertyCount = parseInt(propertiesResult.rows[0].count) || 0;
    } catch (err) {
      console.error('Error getting property count:', err);
    }
    
    try {
      // Get city count
      const citiesResult = await db.query('SELECT COUNT(*) FROM cities');
      cityCount = parseInt(citiesResult.rows[0].count) || 0;
    } catch (err) {
      console.error('Error getting city count:', err);
    }
    
    try {
      // Get university count
      const universitiesResult = await db.query('SELECT COUNT(*) FROM universities');
      universityCount = parseInt(universitiesResult.rows[0].count) || 0;
    } catch (err) {
      console.error('Error getting university count:', err);
    }
    
    try {
      // Get user count
      const usersResult = await db.query('SELECT COUNT(*) FROM users');
      userCount = parseInt(usersResult.rows[0].count) || 0;
    } catch (err) {
      console.error('Error getting user count:', err);
    }
    
    try {
      // Get recent activity
      const activityResult = await db.query(`
        SELECT a.id, a.action, a.resource_type, a.resource_id, a.created_at, u.name as user_name, u.email as user_email
        FROM activities a
        LEFT JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 10
      `);
      
      // Format activity data
      activities = activityResult.rows.map(row => {
        return {
          id: row.id,
          user: row.user_name || row.user_email || 'System',
          action: row.action,
          resourceType: row.resource_type,
          resourceName: row.resource_name || `ID: ${row.resource_id}`,
          date: row.created_at
        };
      });
    } catch (err) {
      console.error('Error getting activities:', err);
    }
    
    try {
      // Get revenue data
      const revenueResult = await db.query(`
        SELECT 
          date_trunc('month', created_at) as month,
          SUM(amount) as amount
        FROM payments
        WHERE created_at >= NOW() - INTERVAL '1 year'
        GROUP BY date_trunc('month', created_at)
        ORDER BY month
      `);
      
      // Format revenue data
      revenue = revenueResult.rows.map(row => {
        const month = new Date(row.month).toLocaleString('default', { month: 'short' });
        return {
          month,
          amount: parseFloat(row.amount) || 0
        };
      });
    } catch (err) {
      console.error('Error getting revenue data:', err);
    }
    
    // Generate chart data for the stats cards
    const propertyChartData = generateChartData(12, 50, 100);
    const cityChartData = generateChartData(12, 5, 20);
    const universityChartData = generateChartData(12, 3, 15);
    const userChartData = generateChartData(12, 50, 200);
    
    // Return all stats
    return {
      counts: [
        { 
          name: 'Properties', 
          count: propertyCount, 
          change: calculateChange(propertyChartData),
          trend: 'up',
          icon: 'HomeIcon', 
          href: '/admin/properties', 
          color: 'bg-indigo-500',
          chartData: propertyChartData
        },
        { 
          name: 'Cities', 
          count: cityCount, 
          change: calculateChange(cityChartData),
          trend: 'up',
          icon: 'BuildingOfficeIcon', 
          href: '/admin/cities', 
          color: 'bg-green-500',
          chartData: cityChartData 
        },
        { 
          name: 'Universities', 
          count: universityCount, 
          change: calculateChange(universityChartData),
          trend: 'up',
          icon: 'AcademicCapIcon', 
          href: '/admin/universities', 
          color: 'bg-yellow-500',
          chartData: universityChartData 
        },
        { 
          name: 'Users', 
          count: userCount, 
          change: calculateChange(userChartData),
          trend: 'up',
          icon: 'UsersIcon', 
          href: '/admin/users', 
          color: 'bg-pink-500',
          chartData: userChartData 
        }
      ],
      recentActivity: activities,
      revenue: revenue.length > 0 ? revenue : generateRevenueData()
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
}

/**
 * Generate random chart data for stats
 */
function generateChartData(length, min, max) {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

/**
 * Calculate change percentage between last two values
 */
function calculateChange(data) {
  if (data.length < 2) return 0;
  const lastIndex = data.length - 1;
  const currentValue = data[lastIndex];
  const previousValue = data[lastIndex - 1];
  
  if (previousValue === 0) return 0;
  
  const change = Math.round(((currentValue - previousValue) / previousValue) * 100);
  return change;
}

/**
 * Generate fallback revenue data
 */
function generateRevenueData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map(month => ({
    month,
    amount: Math.floor(Math.random() * 15000) + 10000
  }));
} 