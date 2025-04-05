import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Mock data for universities (in a real app, this would come from an API)
const allUniversities = [
  { 
    name: 'University of Manchester',
    slug: 'university-of-manchester',
    city: 'Manchester',
    city_slug: 'manchester',
    property_count: 76,
    image: 'https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?q=80&w=2071&auto=format&fit=crop',
  },
  { 
    name: 'University of Leeds',
    slug: 'university-of-leeds',
    city: 'Leeds',
    city_slug: 'leeds',
    property_count: 65,
    image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=2074&auto=format&fit=crop',
  },
  { 
    name: 'University of Birmingham',
    slug: 'university-of-birmingham',
    city: 'Birmingham',
    city_slug: 'birmingham',
    property_count: 72,
    image: 'https://images.unsplash.com/photo-1592562737230-613408285209?q=80&w=2071&auto=format&fit=crop',
  },
  { 
    name: 'University of Nottingham',
    slug: 'university-of-nottingham',
    city: 'Nottingham',
    city_slug: 'nottingham',
    property_count: 43,
    image: 'https://images.unsplash.com/photo-1549036085-34b8c4d03677?q=80&w=2070&auto=format&fit=crop',
  },
  { 
    name: 'University of Sheffield',
    slug: 'university-of-sheffield',
    city: 'Sheffield',
    city_slug: 'sheffield',
    property_count: 54,
    image: 'https://images.unsplash.com/photo-1594969155368-f19404c7f94f?q=80&w=2069&auto=format&fit=crop',
  },
  { 
    name: 'University of Liverpool',
    slug: 'university-of-liverpool',
    city: 'Liverpool',
    city_slug: 'liverpool',
    property_count: 38,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071&auto=format&fit=crop',
  },
  { 
    name: 'University of Bristol',
    slug: 'university-of-bristol',
    city: 'Bristol',
    city_slug: 'bristol',
    property_count: 33,
    image: 'https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?q=80&w=2070&auto=format&fit=crop',
  },
  { 
    name: 'University College London',
    slug: 'university-college-london',
    city: 'London',
    city_slug: 'london',
    property_count: 87,
    image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?q=80&w=2074&auto=format&fit=crop',
  },
  { 
    name: 'King\'s College London',
    slug: 'kings-college-london',
    city: 'London',
    city_slug: 'london',
    property_count: 52,
    image: 'https://images.unsplash.com/photo-1450609283058-0ec52fa7eac4?q=80&w=2070&auto=format&fit=crop',
  },
  { 
    name: 'Imperial College London',
    slug: 'imperial-college-london',
    city: 'London',
    city_slug: 'london',
    property_count: 48,
    image: 'https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?q=80&w=2070&auto=format&fit=crop',
  },
  { 
    name: 'University of Edinburgh',
    slug: 'university-of-edinburgh',
    city: 'Edinburgh',
    city_slug: 'edinburgh',
    property_count: 32,
    image: 'https://images.unsplash.com/photo-1567531501843-4ee0adb2cf3a?q=80&w=2071&auto=format&fit=crop',
  },
  { 
    name: 'University of Glasgow',
    slug: 'university-of-glasgow',
    city: 'Glasgow',
    city_slug: 'glasgow',
    property_count: 29,
    image: 'https://images.unsplash.com/photo-1584473457793-e4238452d2b6?q=80&w=2070&auto=format&fit=crop',
  },
  { 
    name: 'Manchester Metropolitan University',
    slug: 'manchester-metropolitan-university',
    city: 'Manchester',
    city_slug: 'manchester',
    property_count: 55,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071&auto=format&fit=crop',
  },
  { 
    name: 'Leeds Beckett University',
    slug: 'leeds-beckett-university',
    city: 'Leeds',
    city_slug: 'leeds',
    property_count: 49,
    image: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070&auto=format&fit=crop',
  },
  { 
    name: 'Birmingham City University',
    slug: 'birmingham-city-university',
    city: 'Birmingham',
    city_slug: 'birmingham',
    property_count: 43,
    image: 'https://images.unsplash.com/photo-1594969155368-f19404c7f94f?q=80&w=2069&auto=format&fit=crop',
  },
  { 
    name: 'Nottingham Trent University',
    slug: 'nottingham-trent-university',
    city: 'Nottingham',
    city_slug: 'nottingham',
    property_count: 38,
    image: 'https://images.unsplash.com/photo-1549036085-34b8c4d03677?q=80&w=2070&auto=format&fit=crop',
  },
];

// Group universities by city
const groupedByCity = allUniversities.reduce((acc, uni) => {
  if (!acc[uni.city]) {
    acc[uni.city] = [];
  }
  acc[uni.city].push(uni);
  return acc;
}, {});

export default function Universities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState(allUniversities);
  
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredUniversities(allUniversities);
    } else {
      const filtered = allUniversities.filter(
        uni => uni.name.toLowerCase().includes(query) || uni.city.toLowerCase().includes(query)
      );
      setFilteredUniversities(filtered);
    }
  };
  
  return (
    <>
      <Head>
        <title>Student Accommodation by University | StuHouses</title>
        <meta name="description" content="Find student accommodation near universities across the UK with all bills included." />
      </Head>
      
      {/* Banner */}
      <div className="bg-primary py-12 md:py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Student Accommodation by University</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Find all-inclusive student housing near your university
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search for your university..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full py-3 px-4 pr-12 rounded-lg text-neutral-dark"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-12 px-4">
        {searchQuery ? (
          <>
            <h2 className="text-2xl font-bold text-neutral-dark mb-6">Search Results</h2>
            {filteredUniversities.length > 0 ? (
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredUniversities.map((uni) => (
                  <UniversityCard key={uni.slug} university={uni} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <svg 
                  className="h-16 w-16 mx-auto text-neutral-light mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h3 className="text-xl font-bold mb-2">No Universities Found</h3>
                <p className="text-neutral mb-4">
                  We couldn't find any universities matching "{searchQuery}". Please try a different search term.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilteredUniversities(allUniversities);
                  }} 
                  className="button-primary"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        ) : (
          // Display universities grouped by city when not searching
          Object.entries(groupedByCity).map(([city, universities]) => (
            <div key={city} className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-dark mb-6">Universities in {city}</h2>
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {universities.map((uni) => (
                  <UniversityCard key={uni.slug} university={uni} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* CTA Section */}
      <div className="bg-neutral-light py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-6">Can't Find Your University?</h2>
          <p className="text-neutral mb-8 max-w-2xl mx-auto">
            If you don't see your university listed, don't worry! We're constantly adding new properties and locations. Contact us and we'll help you find accommodation near your campus.
          </p>
          <Link 
            href="/contact" 
            className="button-primary"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}

// University Card Component
function UniversityCard({ university }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-40">
        <Image
          src={university.image}
          alt={`Student accommodation near ${university.name}`}
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{university.name}</h3>
          <p className="text-sm">{university.city}</p>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-neutral mb-3">
          {university.property_count} properties available near this university.
        </p>
        <Link 
          href={`/properties?university=${university.slug}`} 
          className="button-primary w-full text-center"
        >
          View Properties
        </Link>
      </div>
    </div>
  );
} 