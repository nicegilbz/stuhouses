/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
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
  const additionalProperties = [
    // Leeds Faraday Road property (to fix the 404 issue)
    {
      id: 10,
      title: '5-Bed Student House on Faraday Road',
      slug: 'faraday-road',
      description: 'Spacious 5-bedroom student house on Faraday Road, perfect for groups of friends who want to live close to the university.',
      city_id: cityMap['leeds'],
      address_line_1: '42 Faraday Road',
      address_line_2: 'Hyde Park',
      postcode: 'LS6 1BT',
      latitude: 53.8133,
      longitude: -1.5681,
      bedrooms: 5,
      bathrooms: 2,
      price_per_person_per_week: 92.00,
      bills_included: true,
      available_from: '2025-07-01',
      property_type: 'house',
      is_featured: true
    },
    // Additional Leeds property
    {
      id: 11,
      title: 'Student Studio Apartment in City Centre',
      slug: 'student-studio-city-centre-leeds',
      description: 'Modern studio apartment in Leeds city centre with excellent transport links to all universities.',
      city_id: cityMap['leeds'],
      address_line_1: '15 Park Row',
      postcode: 'LS1 5JQ',
      latitude: 53.7982,
      longitude: -1.5486,
      bedrooms: 1,
      bathrooms: 1,
      price_per_person_per_week: 145.00,
      bills_included: true,
      available_from: '2025-06-15',
      property_type: 'apartment',
      is_featured: false
    },
    // Additional Manchester property
    {
      id: 12,
      title: '3-Bed Apartment near Manchester University',
      slug: '3-bed-apartment-manchester-university',
      description: 'Well-maintained 3-bedroom apartment within walking distance of Manchester University.',
      city_id: cityMap['manchester'],
      address_line_1: '24 Oxford Road',
      postcode: 'M13 9PR',
      latitude: 53.4656,
      longitude: -2.2339,
      bedrooms: 3,
      bathrooms: 1,
      price_per_person_per_week: 105.00,
      bills_included: false,
      available_from: '2025-08-01',
      property_type: 'apartment',
      is_featured: false
    }
  ];
  
  // Cheque which properties already exist
  const existingProperties = await knex('properties')
    .whereIn('slug', additionalProperties.map(p => p.slug))
    .select('slug');
  
  const existingSlugs = existingProperties.map(p => p.slug);
  
  // Filter out properties that already exist
  const newProperties = additionalProperties.filter(p => !existingSlugs.includes(p.slug));
  
  if (newProperties.length === 0) {
    console.log('All additional properties already exist in the database.');
    return;
  }
  
  // Insert new properties
  await knex('properties').insert(newProperties);
  
  // Insert property images
  for (const property of newProperties) {
    // Create property images
    await knex('property_images').insert([
      {
        property_id: property.id,
        url: `https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg`,
        is_primary: true,
        description: 'Primary property image',
        display_order: 1
      },
      {
        property_id: property.id,
        url: `https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg`,
        is_primary: false,
        description: 'Bedroom image',
        display_order: 2
      },
      {
        property_id: property.id,
        url: `https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg`,
        is_primary: false,
        description: 'Living room image',
        display_order: 3
      }
    ]);
    
    // Create property features
    const propertyFeatures = [
      { property_id: property.id, feature_id: featureMap['WiFi'] },
      { property_id: property.id, feature_id: featureMap['Furnished'] },
      { property_id: property.id, feature_id: featureMap['Double Bed'] },
      { property_id: property.id, feature_id: featureMap['Washing Machine'] }
    ];
    
    // Add some random additional features
    const additionalFeatures = ['TV', 'Garden', 'Parking', 'Dishwasher', 'Study Desk'].filter(
      name => featureMap[name] && Math.random() > 0.3
    );
    
    additionalFeatures.forEach(name => {
      if (featureMap[name]) {
        propertyFeatures.push({ property_id: property.id, feature_id: featureMap[name] });
      }
    });
    
    await knex('property_features').insert(propertyFeatures);
    
    // Create property availability
    await knex('property_availability').insert({
      property_id: property.id,
      start_date: property.available_from,
      end_date: new Date(new Date(property.available_from).setFullYear(new Date(property.available_from).getFullYear() + 1)).toISOString().split('T')[0],
      status: 'available'
    });
  }
  
  console.log(`Added ${newProperties.length} new properties.`);
}; 