import db from '../../../utils/dbService';

export default async function handler(req, res) {
  // Enable CORS for production
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // This endpoint should only be accessible in development mode or with admin credentials
  if (process.env.NODE_ENV === 'production') {
    // In production, require authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Further checks could be implemented here
    // For now, just allow if authorization header is present
  }
  
  try {
    // Initialize database tables
    await initDatabase();
    
    // Seed with initial data
    await seedDatabase();
    
    return res.status(200).json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize database',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
}

/**
 * Initialize database schema
 */
async function initDatabase() {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Create users table with upserted admin user
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create cities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create universities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS universities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        website VARCHAR(255),
        city_id INTEGER REFERENCES cities(id),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create properties table
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        property_type VARCHAR(50) NOT NULL,
        bedrooms INTEGER NOT NULL,
        bathrooms INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        address TEXT NOT NULL,
        city_id INTEGER REFERENCES cities(id),
        nearest_university_id INTEGER REFERENCES universities(id),
        available_from DATE,
        status VARCHAR(50) DEFAULT 'available',
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create property images table
    await client.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        url VARCHAR(255) NOT NULL,
        alt VARCHAR(255),
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create blog posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        author VARCHAR(255),
        image_url VARCHAR(255),
        published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        category VARCHAR(100),
        source_url VARCHAR(255),
        is_external BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create activities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(50) NOT NULL,
        resource_type VARCHAR(50) NOT NULL,
        resource_id INTEGER,
        resource_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        property_id INTEGER REFERENCES properties(id),
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query('COMMIT');
    console.log('Database schema created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating database schema:', error);
    throw new Error(`Database schema creation failed: ${error.message}`);
  } finally {
    client.release();
  }
}

/**
 * Seed database with initial data
 */
async function seedDatabase() {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Create admin user (using upsert pattern to avoid duplicates)
    await client.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) 
      DO UPDATE SET
        name = $1,
        password = $3,
        role = $4,
        updated_at = NOW()
    `, [
      'Admin User',
      'admin@stuhouses.com',
      // In a real app, you would hash this password
      'admin123',
      'admin'
    ]);
    
    // Seed cities (using upsert pattern)
    const cities = [
      { name: 'London', description: 'The capital city of England and the United Kingdom', image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad' },
      { name: 'Manchester', description: 'A major city in the northwest of England', image_url: 'https://images.unsplash.com/photo-1565006106640-65d00958db94' },
      { name: 'Birmingham', description: 'The second-largest city in England', image_url: 'https://images.unsplash.com/photo-1587351021759-3e566b3e3f82' },
      { name: 'Edinburgh', description: 'The capital city of Scotland', image_url: 'https://images.unsplash.com/photo-1577427723001-100eaaaff8a5' },
      { name: 'Glasgow', description: 'The most populous city in Scotland', image_url: 'https://images.unsplash.com/photo-1602271002003-f58aa300b810' }
    ];
    
    for (const city of cities) {
      await client.query(`
        INSERT INTO cities (name, description, image_url)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) 
        DO UPDATE SET
          description = $2,
          image_url = $3,
          updated_at = NOW()
      `, [city.name, city.description, city.image_url]);
    }
    
    // Seed blog posts from external source
    const externalPosts = [
      {
        title: "Understanding the National University Cuts",
        excerpt: "What do the national education cuts mean for students and higher education in the future?",
        content: "As a student, there is no way to avoid the news of upcoming university cuts and what this might mean for education. This comprehensive guide helps you understand what's happening and how it might affect your studies.",
        author: "AFS Team",
        image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
        published_date: new Date("2025-03-20"),
        category: "Education",
        source_url: "https://www.accommodationforstudents.com/student-blog/understanding-the-national-university-cuts",
        is_external: true
      },
      {
        title: "The Spring-Summer Semester at University",
        excerpt: "Congratulations you've done it! You have completed your first semester and navigated new environments, people, and routines.",
        content: "Spring-Summer Semester: Congratulations you've done it! You have completed your first semester and navigated new environments, people, and routines. But the journey continues with the spring-summer semester bringing new opportunities and challenges.",
        author: "AFS Team",
        image_url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b",
        published_date: new Date("2025-03-12"),
        category: "University Life",
        source_url: "https://www.accommodationforstudents.com/student-blog/the-spring-summer-semester-at-university",
        is_external: true
      },
      {
        title: "How to engage with landlords",
        excerpt: "You've done all your research and found a great student property! But knowing what to do next can be stressful.",
        content: "You've done all your research and found a great student property! But knowing what to do next can be stressful, and figuring out the right questions to ask can be challenging. This guide helps you navigate landlord communications effectively.",
        author: "AFS Team",
        image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
        published_date: new Date("2025-02-24"),
        category: "Housing",
        source_url: "https://www.accommodationforstudents.com/student-blog/how-to-engage-with-landlords",
        is_external: true
      }
    ];
    
    // Check if blog_posts table exists
    const tableCheckResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'blog_posts'
      )
    `);
    
    if (tableCheckResult.rows[0].exists) {
      for (const post of externalPosts) {
        await client.query(`
          INSERT INTO blog_posts (
            title, content, excerpt, author, image_url, 
            published_date, category, source_url, is_external
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (title, source_url) 
          DO NOTHING
        `, [
          post.title,
          post.content,
          post.excerpt,
          post.author,
          post.image_url,
          post.published_date,
          post.category,
          post.source_url,
          post.is_external
        ]);
      }
    }
    
    await client.query('COMMIT');
    console.log('Database seeded successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw new Error(`Database seeding failed: ${error.message}`);
  } finally {
    client.release();
  }
} 