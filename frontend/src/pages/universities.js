import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MagnifyingGlassIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

// Updated university data with high-quality images of actual university buildings
const allUniversities = [
  { 
    name: 'University of Manchester',
    slug: 'university-of-manchester',
    city: 'Manchester',
    city_slug: 'manchester',
    property_count: 76,
    image: 'https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?q=80&w=2071&auto=format&fit=crop',
    description: 'Find accommodation near this prestigious Russell Group university, established in 1824.'
  },
  { 
    name: 'University of Leeds',
    slug: 'university-of-leeds',
    city: 'Leeds',
    city_slug: 'leeds',
    property_count: 65,
    image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=2074&auto=format&fit=crop',
    description: 'Discover student housing options close to the University of Leeds campus and city center.'
  },
  { 
    name: 'University of Birmingham',
    slug: 'university-of-birmingham',
    city: 'Birmingham',
    city_slug: 'birmingham',
    property_count: 72,
    image: 'https://images.unsplash.com/photo-1592562737230-613408285209?q=80&w=2071&auto=format&fit=crop',
    description: 'Explore student homes near the scenic campus of the University of Birmingham.'
  },
  { 
    name: 'University of Nottingham',
    slug: 'university-of-nottingham',
    city: 'Nottingham',
    city_slug: 'nottingham',
    property_count: 43,
    image: 'https://images.unsplash.com/photo-1549036085-34b8c4d03677?q=80&w=2070&auto=format&fit=crop',
    description: 'Find your ideal student accommodation near the University of Nottingham\'s beautiful campuses.'
  },
  { 
    name: 'University of Sheffield',
    slug: 'university-of-sheffield',
    city: 'Sheffield',
    city_slug: 'sheffield',
    property_count: 54,
    image: 'https://images.unsplash.com/photo-1594969155368-f19404c7f94f?q=80&w=2069&auto=format&fit=crop',
    description: 'Browse properties close to both the University of Sheffield and city amenities.'
  },
  { 
    name: 'University of Liverpool',
    slug: 'university-of-liverpool',
    city: 'Liverpool',
    city_slug: 'liverpool',
    property_count: 38,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071&auto=format&fit=crop',
    description: 'Check out student housing options near this historic university in the heart of Liverpool.'
  },
  { 
    name: 'University of Bristol',
    slug: 'university-of-bristol',
    city: 'Bristol',
    city_slug: 'bristol',
    property_count: 33,
    image: 'https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'Discover student accommodation in the vibrant city of Bristol, close to university facilities.'
  },
  { 
    name: 'University College London',
    slug: 'university-college-london',
    city: 'London',
    city_slug: 'london',
    property_count: 87,
    image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?q=80&w=2074&auto=format&fit=crop',
    description: 'Find centrally located accommodation near UCL in the heart of London.'
  },
  { 
    name: 'King\'s College London',
    slug: 'kings-college-london',
    city: 'London',
    city_slug: 'london',
    property_count: 52,
    image: 'https://images.unsplash.com/photo-1450609283058-0ec52fa7eac4?q=80&w=2070&auto=format&fit=crop',
    description: 'Explore student housing options near this prestigious London university.'
  },
  { 
    name: 'Imperial College London',
    slug: 'imperial-college-london',
    city: 'London',
    city_slug: 'london',
    property_count: 48,
    image: 'https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?q=80&w=2070&auto=format&fit=crop',
    description: 'Find accommodation suited for students at this world-leading science university.'
  },
  { 
    name: 'University of Edinburgh',
    slug: 'university-of-edinburgh',
    city: 'Edinburgh',
    city_slug: 'edinburgh',
    property_count: 32,
    image: 'https://images.unsplash.com/photo-1567531501843-4ee0adb2cf3a?q=80&w=2071&auto=format&fit=crop',
    description: 'Browse student properties in Scotland\'s historic capital city.'
  },
  { 
    name: 'University of Glasgow',
    slug: 'university-of-glasgow',
    city: 'Glasgow',
    city_slug: 'glasgow',
    property_count: 29,
    image: 'https://images.unsplash.com/photo-1584473457793-e4238452d2b6?q=80&w=2070&auto=format&fit=crop',
    description: 'Discover student housing options near this historic university in Glasgow.'
  },
  { 
    name: 'Manchester Metropolitan University',
    slug: 'manchester-metropolitan-university',
    city: 'Manchester',
    city_slug: 'manchester',
    property_count: 55,
    image: 'https://images.unsplash.com/photo-1598128558393-70ff21433be0?q=80&w=2089&auto=format&fit=crop',
    description: 'Find accommodation close to Manchester Metropolitan University campus and facilities.'
  },
  { 
    name: 'Leeds Beckett University',
    slug: 'leeds-beckett-university',
    city: 'Leeds',
    city_slug: 'leeds',
    property_count: 49,
    image: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070&auto=format&fit=crop',
    description: 'Browse properties convenient for Leeds Beckett University students.'
  },
  { 
    name: 'Birmingham City University',
    slug: 'birmingham-city-university',
    city: 'Birmingham',
    city_slug: 'birmingham',
    property_count: 43,
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop',
    description: 'Explore student housing options close to Birmingham City University campuses.'
  },
  { 
    name: 'Nottingham Trent University',
    slug: 'nottingham-trent-university',
    city: 'Nottingham',
    city_slug: 'nottingham',
    property_count: 38,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop',
    description: 'Find the perfect student accommodation near Nottingham Trent University.'
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
      
      {/* Banner with improved gradient and layout */}
      <div className="bg-gradient-to-r from-primary to-primary-600 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Student Accommodation by University</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Find all-inclusive student housing near your university. All bills included with no hidden fees.
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for your university..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full py-4 pl-12 pr-4 rounded-xl shadow-lg border-2 border-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none text-neutral-dark"
            />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-16 px-4">
        {searchQuery ? (
          <>
            <h2 className="text-2xl font-bold text-neutral-dark mb-8 text-center">Search Results for "{searchQuery}"</h2>
            {filteredUniversities.length > 0 ? (
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredUniversities.map((uni) => (
                  <UniversityCard key={uni.slug} university={uni} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-2xl mx-auto">
                <div className="rounded-full bg-neutral-light p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <AcademicCapIcon className="h-10 w-10 text-neutral" />
                </div>
                <h3 className="text-xl font-bold mb-3">No Universities Found</h3>
                <p className="text-neutral mb-6">
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
          // Display universities grouped by city with improved spacing
          Object.entries(groupedByCity).map(([city, universities]) => (
            <div key={city} className="mb-16">
              <div className="flex items-center justify-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark text-center relative px-4">
                  <span className="relative z-10">Universities in {city}</span>
                  <span className="absolute inset-x-0 bottom-0 h-3 bg-primary/10 -z-1"></span>
                </h2>
              </div>
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {universities.map((uni) => (
                  <UniversityCard key={uni.slug} university={uni} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Enhanced CTA Section with gradient background */}
      <div className="bg-gradient-to-r from-neutral-light to-neutral-100 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 text-center">
            <div className="rounded-full bg-primary/10 p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <AcademicCapIcon className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-4">Can't Find Your University?</h2>
            <p className="text-neutral mb-8 max-w-2xl mx-auto">
              If you don't see your university listed, don't worry! We're constantly adding new properties and locations. Contact us and we'll help you find accommodation near your campus.
            </p>
            <Link 
              href="/contact" 
              className="button-primary inline-block px-8 py-3 text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// Enhanced University Card Component with improved image display and layout
function UniversityCard({ university }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48">
        <Image
          src={university.image}
          alt={`Student accommodation near ${university.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-4 text-white">
          <h3 className="text-xl font-bold mb-1">{university.name}</h3>
          <p className="text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {university.city}
          </p>
        </div>
      </div>
      
      <div className="p-5">
        <p className="text-neutral mb-3 line-clamp-2 h-12">
          {university.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
            {university.property_count} properties
          </div>
          <span className="text-sm text-neutral-dark">All bills included</span>
        </div>
        
        <Link 
          href={`/properties?university=${university.slug}`} 
          className="button-primary w-full text-center py-3"
        >
          View Properties
        </Link>
      </div>
    </div>
  );
} 