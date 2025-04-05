/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('cities').del();
  
  // Insert seed entries
  await knex('cities').insert([
    {
      name: 'Leeds',
      slug: 'leeds',
      description: 'Leeds is a vibrant city in West Yorkshire with a large student population.',
      image_url: 'https://images.pexels.com/photos/6004743/pexels-photo-6004743.jpeg',
      property_count: 2043
    },
    {
      name: 'Manchester',
      slug: 'manchester',
      description: 'Manchester is one of the most popular student cities.',
      image_url: 'https://images.pexels.com/photos/18595114/pexels-photo-18595114/free-photo-of-view-of-city-center-of-manchester-england.jpeg',
      property_count: 1856
    },
    {
      name: 'Birmingham',
      slug: 'birmingham',
      description: 'Birmingham is the UK\'s second largest city and hosts five universities with a diverse and lively student community.',
      image_url: 'https://images.pexels.com/photos/14250753/pexels-photo-14250753.jpeg',
      property_count: 1522,
    },
    {
      name: 'Liverpool',
      slug: 'liverpool',
      description: 'Liverpool offers students a rich cultural heritage, affordable living, and a legendary music scene.',
      image_url: 'https://images.pexels.com/photos/17080448/pexels-photo-17080448/free-photo-of-the-albert-dock-in-liverpool-uk.jpeg',
      property_count: 1345,
    },
    {
      name: 'Nottingham',
      slug: 'nottingham',
      description: 'Nottingham is home to two major universities and offers a perfect blend of history, culture, and modern amenities for students.',
      image_url: 'https://images.pexels.com/photos/18450858/pexels-photo-18450858/free-photo-of-church-in-nottingham.jpeg',
      property_count: 1298,
    },
    {
      name: 'Sheffield',
      slug: 'sheffield',
      description: 'Sheffield is known for its friendly atmosphere, affordability, and proximity to the stunning Peak District National Park.',
      image_url: 'https://images.pexels.com/photos/14421063/pexels-photo-14421063.jpeg',
      property_count: 1187,
    },
    {
      name: 'Bristol',
      slug: 'bristol',
      description: 'Bristol is a creative hub with a thriving arts scene, independent shops, and a strong sense of community.',
      image_url: 'https://images.pexels.com/photos/7282828/pexels-photo-7282828.jpeg',
      property_count: 1076,
    },
    {
      name: 'London',
      slug: 'london',
      description: 'London offers unparalleled opportunities for students with its world-class universities, cultural diversity, and career prospects.',
      image_url: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
      property_count: 3452,
    },
    {
      name: 'Newcastle',
      slug: 'newcastle',
      description: 'Newcastle boasts a legendary nightlife, friendly locals, and affordable living for its large student population.',
      image_url: 'https://images.pexels.com/photos/13516347/pexels-photo-13516347.jpeg',
      property_count: 967,
    },
    {
      name: 'Edinburgh',
      slug: 'edinburgh',
      description: 'Edinburgh combines historic charm with a modern outlook, offering students a unique living experience in Scotland\'s capital.',
      image_url: 'https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg',
      property_count: 1243,
    },
  ]);
}; 