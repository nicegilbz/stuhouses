import { Pool } from 'pg';

// Create a new Pool for database connections
const pool = new Pool({
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

/**
 * Execute a query with parameters
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (text, params) => {
  try {
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

export default {
  query,
  getClient,
  pool
}; 