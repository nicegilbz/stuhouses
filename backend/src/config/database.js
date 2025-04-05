const knex = require('knex');
const knexConfig = require('../../knexfile');
const env = process.env.NODE_ENV || 'development';

// Create a database instance
const db = knex(knexConfig[env]);

module.exports = { db }; 