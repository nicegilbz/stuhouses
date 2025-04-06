/**
 * Migration for payment system tables
 */
exports.up = function(knex) {
  return knex.schema
    // Payments table to track all payment transactions
    .createTable('payments', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.integer('property_id').unsigned().notNullable();
      table.string('payment_type').notNullable(); // 'deposit', 'rent', etc.
      table.decimal('amount', 10, 2).notNullable();
      table.string('currency', 3).notNullable().defaultTo('gbp');
      table.string('stripe_payment_intent_id').notNullable();
      table.string('status').notNullable().defaultTo('pending'); // 'pending', 'completed', 'failed', 'refunded', 'partially_refunded'
      table.timestamp('completed_at');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Foreign keys
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.foreign('property_id').references('id').inTable('properties').onDelete('CASCADE');
    })
    
    // Bookings table to track property bookings
    .createTable('bookings', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.integer('property_id').unsigned().notNullable();
      table.date('start_date').notNullable();
      table.date('end_date').notNullable();
      table.integer('number_of_tenants').unsigned().notNullable();
      table.string('status').notNullable().defaultTo('pending_payment'); // 'pending_payment', 'deposit_paid', 'confirmed', 'cancelled', 'completed'
      table.decimal('deposit_amount', 10, 2).notNullable();
      table.decimal('rent_amount', 10, 2).notNullable();
      table.string('payment_frequency').notNullable().defaultTo('monthly'); // 'monthly', 'quarterly', 'annually'
      table.text('special_requests');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Foreign keys
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.foreign('property_id').references('id').inTable('properties').onDelete('CASCADE');
      
      // Unique constraint to prevent duplicate bookings
      table.unique(['user_id', 'property_id', 'start_date']);
    })
    
    // Rent payments table to track recurring rent payments
    .createTable('rent_payments', (table) => {
      table.increments('id').primary();
      table.integer('property_id').unsigned().notNullable();
      table.integer('user_id').unsigned().notNullable();
      table.integer('payment_id').unsigned();
      table.decimal('amount', 10, 2).notNullable();
      table.date('payment_date').notNullable();
      table.string('status').notNullable().defaultTo('paid'); // 'paid', 'overdue', 'pending'
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      // Foreign keys
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.foreign('property_id').references('id').inTable('properties').onDelete('CASCADE');
      table.foreign('payment_id').references('id').inTable('payments').onDelete('SET NULL');
    })
    
    // Refunds table to track refunded payments
    .createTable('refunds', (table) => {
      table.increments('id').primary();
      table.integer('payment_id').unsigned().notNullable();
      table.integer('created_by').unsigned().notNullable(); // Admin user who processed the refund
      table.decimal('amount', 10, 2).notNullable();
      table.text('reason');
      table.string('stripe_refund_id').notNullable();
      table.string('status').notNullable(); // 'pending', 'succeeded', 'failed'
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      // Foreign keys
      table.foreign('payment_id').references('id').inTable('payments').onDelete('CASCADE');
      table.foreign('created_by').references('id').inTable('users').onDelete('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('refunds')
    .dropTableIfExists('rent_payments')
    .dropTableIfExists('bookings')
    .dropTableIfExists('payments');
}; 