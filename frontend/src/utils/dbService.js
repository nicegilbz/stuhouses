import { Pool } from 'pg';

// Check if we should use mock data
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

let pool;

// Only create the pool if we're not using mock data
if (!useMockData) {
  try {
    pool = new Pool({
      user: process.env.POSTGRES_USER || 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      database: process.env.POSTGRES_DB || 'stuhouses',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
    });

    // Connection handling for production
    pool.on('connect', () => {
      console.log('Connected to PostgreSQL database');
    });

    pool.on('error', (err) => {
      console.error('PostgreSQL connection error:', err);
      
      // In production, attempt reconnection after a delay
      if (process.env.NODE_ENV === 'production') {
        console.log('Attempting to reconnect to PostgreSQL in 5 seconds...');
        setTimeout(() => {
          pool.connect().catch(err => {
            console.error('Reconnection failed:', err);
          });
        }, 5000);
      }
    });
  } catch (error) {
    console.error('Failed to initialize PostgreSQL pool:', error);
  }
}

/**
 * Execute a query with parameters
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (text, params) => {
  // If we're using mock data, return a mock result
  if (useMockData) {
    console.log('Using mock data for query:', text);
    return mockQuery(text, params);
  }
  
  try {
    if (!pool) {
      throw new Error('Database connection not initialized');
    }
    
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Only log in development to avoid cluttering logs in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Get a client from the pool
 * @returns {Promise} Client connection
 */
const getClient = async () => {
  // If we're using mock data, return a mock client
  if (useMockData) {
    console.log('Using mock client');
    return getMockClient();
  }
  
  if (!pool) {
    throw new Error('Database connection not initialized');
  }
  
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  
  // Override client.query to log queries in development
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };
  
  // Ensure client gets released back to the pool
  client.release = () => {
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  
  return client;
};

/**
 * Mock query function for testing without a database
 */
const mockQuery = (text, params) => {
  console.log('Mock query:', text, params);
  
  // Return empty response by default
  const defaultResponse = {
    rows: [],
    rowCount: 0,
    command: '',
    oid: null,
    fields: []
  };
  
  // Handle different query types
  if (text.includes('COUNT(*) FROM')) {
    // For count queries, return a random count
    return {
      ...defaultResponse,
      rows: [{ count: Math.floor(Math.random() * 50) + 1 }],
      rowCount: 1
    };
  }
  
  if (text.includes('INSERT INTO')) {
    // For insert queries, return success with random ID
    return {
      ...defaultResponse,
      rows: [{ id: Date.now() }],
      rowCount: 1
    };
  }
  
  if (text.includes('SELECT') && text.includes('FROM users')) {
    // For user queries
    return {
      ...defaultResponse,
      rows: [{
        id: 1,
        name: 'Admin User',
        email: 'admin@stuhouses.com',
        role: 'admin'
      }],
      rowCount: 1
    };
  }
  
  // Return default empty response
  return defaultResponse;
};

/**
 * Get a mock client for testing without a database
 */
const getMockClient = () => {
  return {
    query: async (text, params) => mockQuery(text, params),
    release: () => {},
    lastQuery: null
  };
};

export default {
  query,
  getClient,
  pool
}; 