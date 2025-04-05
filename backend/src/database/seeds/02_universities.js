/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('universities').del();
  
  // Get city IDs
  const leeds = await knex('cities').where({ slug: 'leeds' }).first();
  const manchester = await knex('cities').where({ slug: 'manchester' }).first();
  const birmingham = await knex('cities').where({ slug: 'birmingham' }).first();
  const liverpool = await knex('cities').where({ slug: 'liverpool' }).first();
  const nottingham = await knex('cities').where({ slug: 'nottingham' }).first();
  const sheffield = await knex('cities').where({ slug: 'sheffield' }).first();
  const london = await knex('cities').where({ slug: 'london' }).first();
  
  // Insert seed entries
  await knex('universities').insert([
    {
      name: 'University of Leeds',
      slug: 'university-of-leeds',
      description: 'One of the UK\'s leading research universities, offering a diverse range of courses in a vibrant city.',
      image_url: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg',
      city_id: leeds.id,
    },
    {
      name: 'Leeds Beckett University',
      slug: 'leeds-beckett-university',
      description: 'A modern university with a focus on practical, industry-relevant education across multiple campuses.',
      image_url: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg',
      city_id: leeds.id,
    },
    {
      name: 'University of Manchester',
      slug: 'university-of-manchester',
      description: 'A world-renowned institution with a rich academic heritage and cutting-edge research facilities.',
      image_url: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
      city_id: manchester.id,
    },
    {
      name: 'Manchester Metropolitan University',
      slug: 'manchester-metropolitan-university',
      description: 'A modern university with strong links to business and industry, offering practical, career-focused courses.',
      image_url: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg',
      city_id: manchester.id,
    },
    {
      name: 'University of Birmingham',
      slug: 'university-of-birmingham',
      description: 'A founding member of the Russell Group with a beautiful campus and outstanding research facilities.',
      image_url: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
      city_id: birmingham.id,
    },
    {
      name: 'University of Liverpool',
      slug: 'university-of-liverpool',
      description: 'A research-focused university in the heart of Liverpool with a global reputation for excellence.',
      image_url: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg',
      city_id: liverpool.id,
    },
    {
      name: 'University of Nottingham',
      slug: 'university-of-nottingham',
      description: 'A public research university with a global reputation for academic excellence and innovative teaching.',
      image_url: 'https://images.pexels.com/photos/2305098/pexels-photo-2305098.jpeg',
      city_id: nottingham.id,
    },
    {
      name: 'University of Sheffield',
      slug: 'university-of-sheffield',
      description: 'A leading research university known for its world-class teaching and vibrant student experience.',
      image_url: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg',
      city_id: sheffield.id,
    },
    {
      name: 'University College London',
      slug: 'university-college-london',
      description: 'One of the world\'s top universities, located in the heart of London with a diverse and international student body.',
      image_url: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
      city_id: london.id,
    },
    {
      name: 'Kings College London',
      slug: 'kings-college-london',
      description: 'A prestigious Russell Group university in central London with a distinguished reputation in the humanities and sciences.',
      image_url: 'https://images.pexels.com/photos/159494/book-glasses-read-study-159494.jpeg',
      city_id: london.id,
    },
    {
      name: 'Imperial College London',
      slug: 'imperial-college-london',
      description: 'A world-leading science-focused institution known for its excellence in engineering, medicine, and business.',
      image_url: 'https://images.pexels.com/photos/159752/books-collection-library-159752.jpeg',
      city_id: london.id,
    },
  ]);
}; 