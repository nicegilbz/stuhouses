/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('features').del();
  
  // Insert seed entries
  await knex('features').insert([
    {
      name: 'WiFi',
      icon: 'wifi',
      category: 'utility'
    },
    {
      name: 'Bills Included',
      icon: 'cash',
      category: 'utility'
    },
    {
      name: 'Double Bed',
      icon: 'bed',
      category: 'furniture'
    },
    {
      name: 'Washing Machine',
      icon: 'washing-machine',
      category: 'appliance'
    },
    {
      name: 'Dishwasher',
      icon: 'dishwasher',
      category: 'appliance'
    },
    {
      name: 'Microwave',
      icon: 'microwave',
      category: 'appliance'
    },
    {
      name: 'TV',
      icon: 'tv',
      category: 'entertainment'
    },
    {
      name: 'Parking',
      icon: 'car',
      category: 'outside'
    },
    {
      name: 'Garden',
      icon: 'tree',
      category: 'outside'
    },
    {
      name: 'Bike Storage',
      icon: 'bicycle',
      category: 'outside'
    },
    {
      name: 'Furnished',
      icon: 'chair',
      category: 'furniture'
    },
    {
      name: 'Study Desk',
      icon: 'desk',
      category: 'furniture'
    },
    {
      name: 'CCTV',
      icon: 'camera',
      category: 'security'
    },
    {
      name: 'En-suite',
      icon: 'bathroom',
      category: 'bathroom'
    },
    {
      name: 'Shared Bathroom',
      icon: 'shower',
      category: 'bathroom'
    }
  ]);
}; 