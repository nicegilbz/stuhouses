/**
 * Initial migration to create base tables for the StuHouses application
 */
exports.up = function(knex) {
  return knex.schema
    // Users table
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('role').defaultTo('user'); // user, agent, admin
      table.string('avatar_url');
      table.text('bio');
      table.string('phone');
      table.string('reset_token');
      table.datetime('reset_token_expires');
      table.boolean('is_verified').defaultTo(false);
      table.string('verification_token');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Index for faster lookups
      table.index('email');
      table.index('role');
    })
    
    // Cities table
    .createTable('cities', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('slug').notNullable().unique();
      table.text('description');
      table.string('image_url');
      table.string('region');
      table.float('latitude', 14, 10);
      table.float('longitude', 14, 10);
      table.boolean('is_featured').defaultTo(false);
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('slug');
      table.index('is_featured');
    })
    
    // Universities table
    .createTable('universities', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('slug').notNullable().unique();
      table.text('description');
      table.string('image_url');
      table.integer('city_id').unsigned().references('id').inTable('cities').onDelete('SET NULL');
      table.string('address');
      table.float('latitude', 14, 10);
      table.float('longitude', 14, 10);
      table.integer('student_count');
      table.string('website_url');
      table.boolean('is_featured').defaultTo(false);
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('slug');
      table.index('city_id');
      table.index('is_featured');
    })
    
    // Property types lookup table
    .createTable('property_types', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.string('slug').notNullable().unique();
      table.text('description');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    
    // Features lookup table
    .createTable('features', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.string('slug').notNullable().unique();
      table.string('icon');
      table.text('description');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    
    // Properties table
    .createTable('properties', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('slug').notNullable().unique();
      table.text('description');
      table.decimal('price', 10, 2).notNullable();
      table.string('price_period').defaultTo('month'); // week, month
      table.boolean('bills_included').defaultTo(false);
      table.integer('bedrooms').notNullable();
      table.integer('bathrooms').notNullable();
      table.string('furnished_status'); // furnished, part-furnished, unfurnished
      table.date('available_from');
      table.string('tenancy_length');
      table.string('key_features');
      table.integer('property_type_id').unsigned().references('id').inTable('property_types').onDelete('SET NULL');
      table.integer('agent_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.integer('city_id').unsigned().references('id').inTable('cities').onDelete('SET NULL');
      table.integer('nearest_university_id').unsigned().references('id').inTable('universities').onDelete('SET NULL');
      table.float('distance_to_university', 8, 2);
      table.string('address').notNullable();
      table.string('postcode').notNullable();
      table.float('latitude', 14, 10);
      table.float('longitude', 14, 10);
      table.string('status').defaultTo('active'); // active, inactive, draft
      table.boolean('is_featured').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('slug');
      table.index('city_id');
      table.index('nearest_university_id');
      table.index('property_type_id');
      table.index('agent_id');
      table.index('status');
      table.index('is_featured');
    })
    
    // Property images table
    .createTable('property_images', function(table) {
      table.increments('id').primary();
      table.integer('property_id').unsigned().references('id').inTable('properties').onDelete('CASCADE');
      table.string('url').notNullable();
      table.string('alt_text');
      table.integer('order').defaultTo(0);
      table.boolean('is_primary').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('property_id');
    })
    
    // Property features junction table
    .createTable('property_features', function(table) {
      table.increments('id').primary();
      table.integer('property_id').unsigned().references('id').inTable('properties').onDelete('CASCADE');
      table.integer('feature_id').unsigned().references('id').inTable('features').onDelete('CASCADE');
      
      // Composite unique key to prevent duplicates
      table.unique(['property_id', 'feature_id']);
      
      table.index('property_id');
      table.index('feature_id');
    })
    
    // User shortlists (favorite properties)
    .createTable('user_shortlists', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('property_id').unsigned().references('id').inTable('properties').onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      // Composite unique key to prevent duplicates
      table.unique(['user_id', 'property_id']);
      
      table.index('user_id');
      table.index('property_id');
    })
    
    // Property viewing requests
    .createTable('viewing_requests', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.integer('property_id').unsigned().references('id').inTable('properties').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('phone');
      table.date('preferred_date').notNullable();
      table.string('preferred_time').notNullable();
      table.text('message');
      table.string('status').defaultTo('pending'); // pending, confirmed, completed, cancelled
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('user_id');
      table.index('property_id');
      table.index('status');
    })
    
    // Blog posts table
    .createTable('blog_posts', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('slug').notNullable().unique();
      table.text('excerpt');
      table.text('content').notNullable();
      table.string('featured_image');
      table.integer('author_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.string('status').defaultTo('published'); // draft, published
      table.boolean('is_featured').defaultTo(false);
      table.timestamp('published_at');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('slug');
      table.index('author_id');
      table.index('status');
      table.index('is_featured');
    })
    
    // Blog categories table
    .createTable('blog_categories', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('slug').notNullable().unique();
      table.text('description');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('slug');
    })
    
    // Blog post-category junction table
    .createTable('blog_post_categories', function(table) {
      table.increments('id').primary();
      table.integer('post_id').unsigned().references('id').inTable('blog_posts').onDelete('CASCADE');
      table.integer('category_id').unsigned().references('id').inTable('blog_categories').onDelete('CASCADE');
      
      // Composite unique key to prevent duplicates
      table.unique(['post_id', 'category_id']);
      
      table.index('post_id');
      table.index('category_id');
    })
    
    // Site settings table
    .createTable('settings', function(table) {
      table.string('key').notNullable().primary();
      table.text('value');
      table.string('type').defaultTo('string'); // string, number, boolean, json
      table.text('description');
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('settings')
    .dropTableIfExists('blog_post_categories')
    .dropTableIfExists('blog_categories')
    .dropTableIfExists('blog_posts')
    .dropTableIfExists('viewing_requests')
    .dropTableIfExists('user_shortlists')
    .dropTableIfExists('property_features')
    .dropTableIfExists('property_images')
    .dropTableIfExists('properties')
    .dropTableIfExists('features')
    .dropTableIfExists('property_types')
    .dropTableIfExists('universities')
    .dropTableIfExists('cities')
    .dropTableIfExists('users');
}; 