/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('cities', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('slug').notNullable().unique();
      table.text('description');
      table.string('image_url');
      table.integer('property_count').defaultTo(0);
      table.timestamps(true, true);
    })
    .createTable('universities', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('slug').notNullable().unique();
      table.text('description');
      table.string('image_url');
      table.integer('city_id').unsigned().references('id').inTable('cities');
      table.string('address');
      table.string('postcode');
      table.float('latitude');
      table.float('longitude');
      table.integer('student_count');
      table.string('website_url');
      table.timestamps(true, true);
    })
    .createTable('features', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('icon');
      table.string('category');
      table.timestamps(true, true);
    })
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('first_name');
      table.string('last_name');
      table.string('phone');
      table.enum('role', ['user', 'admin']).defaultTo('user');
      table.boolean('is_verified').defaultTo(false);
      table.string('verification_token');
      table.string('reset_token');
      table.timestamp('reset_token_expires_at');
      table.timestamps(true, true);
    })
    .createTable('properties', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('slug').notNullable().unique();
      table.text('description');
      table.integer('city_id').unsigned().references('id').inTable('cities').onDelete('CASCADE');
      table.string('address_line_1').notNullable();
      table.string('address_line_2');
      table.string('postcode').notNullable();
      table.float('latitude');
      table.float('longitude');
      table.integer('bedrooms').notNullable();
      table.integer('bathrooms').notNullable();
      table.decimal('price_per_person_per_week', 10, 2).notNullable();
      table.boolean('bills_included').defaultTo(false);
      table.date('available_from');
      table.string('property_type');
      table.boolean('is_featured').defaultTo(false);
      table.integer('views_count').defaultTo(0);
      table.timestamps(true, true);
    })
    .createTable('property_images', (table) => {
      table.increments('id').primary();
      table.integer('property_id').unsigned().references('id').inTable('properties').onDelete('CASCADE');
      table.string('url').notNullable();
      table.boolean('is_primary').defaultTo(false);
      table.string('description');
      table.integer('display_order').defaultTo(0);
      table.timestamps(true, true);
    })
    .createTable('property_features', (table) => {
      table.increments('id').primary();
      table.integer('property_id').unsigned().references('id').inTable('properties').onDelete('CASCADE');
      table.integer('feature_id').unsigned().references('id').inTable('features').onDelete('CASCADE');
      table.timestamps(true, true);
    })
    .createTable('property_availability', (table) => {
      table.increments('id').primary();
      table.integer('property_id').unsigned().references('id').inTable('properties').onDelete('CASCADE');
      table.date('start_date').notNullable();
      table.date('end_date').notNullable();
      table.enum('status', ['available', 'reserved', 'booked']).defaultTo('available');
      table.timestamps(true, true);
    })
    .createTable('property_inquiries', (table) => {
      table.increments('id').primary();
      table.integer('property_id').unsigned().references('id').inTable('properties').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('phone');
      table.text('message').notNullable();
      table.date('move_in_date');
      table.boolean('is_read').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('user_shortlist', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('property_id').unsigned().references('id').inTable('properties').onDelete('CASCADE');
      table.timestamps(true, true);
      table.unique(['user_id', 'property_id']);
    })
    .createTable('agents', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('phone');
      table.string('profile_image');
      table.text('bio');
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('user_shortlist')
    .dropTableIfExists('property_inquiries')
    .dropTableIfExists('property_availability')
    .dropTableIfExists('property_features')
    .dropTableIfExists('property_images')
    .dropTableIfExists('properties')
    .dropTableIfExists('users')
    .dropTableIfExists('features')
    .dropTableIfExists('universities')
    .dropTableIfExists('cities')
    .dropTableIfExists('agents');
}; 