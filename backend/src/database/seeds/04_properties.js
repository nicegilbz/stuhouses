/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('property_features').del();
  await knex('property_images').del();
  await knex('property_availability').del();
  await knex('properties').del();
  
  // Reset sequences
  await knex.raw('ALTER SEQUENCE properties_id_seq RESTART WITH 1');
  await knex.raw('ALTER SEQUENCE property_images_id_seq RESTART WITH 1');
  await knex.raw('ALTER SEQUENCE property_features_id_seq RESTART WITH 1');
  await knex.raw('ALTER SEQUENCE property_availability_id_seq RESTART WITH 1');
  
  // Get city IDs
  const cities = await knex('cities').select('id', 'slug');
  const cityMap = {};
  for (const city of cities) {
    cityMap[city.slug] = city.id;
  }
  
  // Get feature IDs
  const features = await knex('features').select('id', 'name');
  const featureMap = {};
  for (const feature of features) {
    featureMap[feature.name] = feature.id;
  }
  
  // Insert properties with explicit IDs
  await knex('properties').insert([
    {
      id: 1,
      title: 'Modern 4-Bed Student House in Headingley',
      slug: 'modern-4-bed-student-house-headingley',
      description: 'Spacious and modern 4-bedroom student house in the heart of Headingley, perfect for students at Leeds University.',
      city_id: cityMap['leeds'],
      address_line_1: '42 Headingley Lane',
      address_line_2: 'Headingley',
      postcode: 'LS6 1BN',
      latitude: 53.8178,
      longitude: -1.5780,
      bedrooms: 4,
      bathrooms: 2,
      price_per_person_per_week: 95.00,
      bills_included: true,
      available_from: '2025-09-01',
      property_type: 'house',
      is_featured: true
    },
    {
      id: 2,
      title: 'Luxury 5-Bed Student House in Fallowfield',
      slug: 'luxury-5-bed-student-house-fallowfield',
      description: 'High-end 5-bedroom student house in popular Fallowfield area with all modern amenities.',
      city_id: cityMap['manchester'],
      address_line_1: '28 Wilmslow Road',
      address_line_2: 'Fallowfield',
      postcode: 'M14 6AD',
      latitude: 53.4395,
      longitude: -2.2193,
      bedrooms: 5,
      bathrooms: 3,
      price_per_person_per_week: 110.00,
      bills_included: true,
      available_from: '2025-09-01',
      property_type: 'house',
      is_featured: true
    },
    {
      id: 3,
      title: 'Large 6-Bed House in Selly Oak',
      slug: 'large-6-bed-house-selly-oak',
      description: 'Spacious 6-bedroom house in Selly Oak, perfect for University of Birmingham students.',
      city_id: cityMap['birmingham'],
      address_line_1: '156 Bristol Road',
      address_line_2: 'Selly Oak',
      postcode: 'B29 6BJ',
      latitude: 52.4454,
      longitude: -1.9308,
      bedrooms: 6,
      bathrooms: 2,
      price_per_person_per_week: 90.00,
      bills_included: false,
      available_from: '2025-09-01',
      property_type: 'house',
      is_featured: true
    }
  ]);
  
  // Insert property images with explicit property IDs
  await knex('property_images').insert([
    // Leeds property images
    {
      property_id: 1,
      url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      is_primary: true,
      description: 'Primary property image',
      display_order: 1
    },
    {
      property_id: 1,
      url: 'https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg',
      is_primary: false,
      description: 'Bedroom image',
      display_order: 2
    },
    {
      property_id: 1,
      url: 'https://images.pexels.com/photos/3016430/pexels-photo-3016430.jpeg',
      is_primary: false,
      description: 'Kitchen image',
      display_order: 3
    },
    
    // Manchester property images
    {
      property_id: 2,
      url: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
      is_primary: true,
      description: 'Primary property image',
      display_order: 1
    },
    {
      property_id: 2,
      url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
      is_primary: false,
      description: 'Living room image',
      display_order: 2
    },
    {
      property_id: 2,
      url: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg',
      is_primary: false,
      description: 'Bathroom image',
      display_order: 3
    },
    
    // Birmingham property images
    {
      property_id: 3,
      url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      is_primary: true,
      description: 'Primary property image',
      display_order: 1
    },
    {
      property_id: 3,
      url: 'https://images.pexels.com/photos/3773575/pexels-photo-3773575.png',
      is_primary: false,
      description: 'Bedroom image',
      display_order: 2
    },
    {
      property_id: 3,
      url: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg',
      is_primary: false,
      description: 'Kitchen image',
      display_order: 3
    }
  ]);
  
  // Insert property features with explicit property IDs
  await knex('property_features').insert([
    // Leeds property features
    { property_id: 1, feature_id: featureMap['WiFi'] },
    { property_id: 1, feature_id: featureMap['Furnished'] },
    { property_id: 1, feature_id: featureMap['Double Bed'] },
    { property_id: 1, feature_id: featureMap['Washing Machine'] },
    { property_id: 1, feature_id: featureMap['Garden'] },
    
    // Manchester property features
    { property_id: 2, feature_id: featureMap['WiFi'] },
    { property_id: 2, feature_id: featureMap['Furnished'] },
    { property_id: 2, feature_id: featureMap['Double Bed'] },
    { property_id: 2, feature_id: featureMap['Washing Machine'] },
    { property_id: 2, feature_id: featureMap['Dishwasher'] },
    { property_id: 2, feature_id: featureMap['TV'] },
    
    // Birmingham property features
    { property_id: 3, feature_id: featureMap['WiFi'] },
    { property_id: 3, feature_id: featureMap['Furnished'] },
    { property_id: 3, feature_id: featureMap['Double Bed'] },
    { property_id: 3, feature_id: featureMap['Study Desk'] },
    { property_id: 3, feature_id: featureMap['Garden'] },
    { property_id: 3, feature_id: featureMap['Parking'] }
  ]);
  
  // Insert property availability
  await knex('property_availability').insert([
    {
      property_id: 1,
      start_date: '2025-09-01',
      end_date: '2026-09-01',
      status: 'available'
    },
    {
      property_id: 2,
      start_date: '2025-09-01',
      end_date: '2026-09-01',
      status: 'available'
    },
    {
      property_id: 3,
      start_date: '2025-09-01',
      end_date: '2026-09-01',
      status: 'available'
    }
  ]);
}; 