/**
 * Migration: Create Activity Logs Table
 * Stores all activity and audit logs across the application
 */
exports.up = function(knex) {
  return knex.schema.createTable('activity_logs', function(table) {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.string('action').notNullable(); // create, update, delete, login, etc.
    table.string('resource_type').notNullable(); // property, city, user, etc.
    table.integer('resource_id'); // ID of the resource being acted upon
    table.jsonb('details'); // Additional details about the action
    table.string('ip_address');
    table.string('user_agent');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Add indexes for performance
    table.index('user_id');
    table.index('resource_type');
    table.index('resource_id');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('activity_logs');
}; 