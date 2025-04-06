const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  try {
    // Check if users table exists
    const hasTable = await knex.schema.hasTable('users');
    if (!hasTable) {
      console.warn('Users table does not exist, skipping seed');
      return;
    }
    
    // First get column info to determine schema
    const columns = await knex('users').columnInfo();
    console.log('Users table columns:', Object.keys(columns).join(', '));
    
    // Deletes ALL existing entries
    await knex('users').del();
    
    // Create hashed passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    // Basic user templates
    const adminUser = {
      email: 'admin@stuhouses.com',
      password: adminPassword,
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const regularUser = {
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    // Add fields based on schema
    if (columns.first_name && columns.last_name) {
      adminUser.first_name = 'Admin';
      adminUser.last_name = 'User';
      regularUser.first_name = 'Regular';
      regularUser.last_name = 'User';
    } else if (columns.name) {
      adminUser.name = 'Admin User';
      regularUser.name = 'Regular User';
    }
    
    if (columns.is_verified) {
      adminUser.is_verified = true;
      regularUser.is_verified = true;
    }
    
    if (columns.phone) {
      adminUser.phone = '+44 7700 900000';
      regularUser.phone = '+44 7700 900123';
    }
    
    // Insert the users
    await knex('users').insert([adminUser, regularUser]);
    
    // Reset sequence if PostgreSQL
    if (knex.client.config.client === 'postgresql') {
      await knex.raw('SELECT setval(\'users_id_seq\', (SELECT MAX(id) FROM users));');
    }
    
    console.log('User seed completed. Admin login: admin@stuhouses.com / admin123');
  } catch (error) {
    console.error('Error seeding users:', error.message);
  }
}; 