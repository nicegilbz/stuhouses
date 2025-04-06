import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { HomeIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/solid';

// Featured cities with property counts
const featuredCities = [
  { name: 'Leeds', count: 2043, image: 'https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=500&h=300&auto=format&fit=crop' },
  { name: 'Manchester', count: 1856, image: 'https://images.unsplash.com/photo-1563995103864-d87d3c1fdd39?q=80&w=500&h=300&auto=format&fit=crop' },
  { name: 'Birmingham', count: 1522, image: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=500&h=300&auto=format&fit=crop' },
  { name: 'Liverpool', count: 1345, image: 'https://images.unsplash.com/photo-1534196511436-921a4e99f297?q=80&w=500&h=300&auto=format&fit=crop' },
];

export default function Home() {
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would redirect to the search results page with query parameters
    window.location.href = `/properties?location=${encodeURIComponent(location)}&bedrooms=${bedrooms}`;
  };

  return (
    <>
      <Head>
        <title>StuHouses | Student Accommodation with Bills Included</title>
        <meta name="description" content="Find student accommodation with all bills included. Search by city or university to find your perfect student home." />
      </Head>

      {/* Hero Section with Search */}
      <section className="relative bg-primary-700 text-white py-24">
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop"
            alt="Students"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="bg-black bg-opacity-30 backdrop-blur-sm inline-block px-8 py-6 rounded-lg mb-4 shadow-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white tracking-tight">
                Find Student Accommodation with Bills Included
              </h1>
              <p className="text-xl md:text-2xl text-white">
                One simple package for your perfect student home.
              </p>
            </div>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-6 border-t-4 border-secondary">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="location" className="block text-neutral-dark font-medium mb-1">
                    City or University
                  </label>
                  <input
                    type="text"
                    id="location"
                    placeholder="e.g. Leeds or University of Leeds"
                    className="input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="bedrooms" className="block text-neutral-dark font-medium mb-1">
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    className="select"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6+</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="button-secondary w-full text-lg py-3 font-medium">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Find Your Student Home
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Cities Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Searched Cities</h2>
            <p className="text-lg text-neutral max-w-2xl mx-auto">
              Browse our most popular cities for student accommodation with bills included.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCities.map((city) => (
              <Link 
                href={`/properties/${city.name.toLowerCase()}`}
                key={city.name}
                className="group block"
              >
                <div className="relative rounded-xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow duration-200">
                  <div className="relative h-48">
                    <Image
                      src={city.image}
                      alt={`${city.name} student accommodation`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 w-full p-4 text-white">
                    <h3 className="text-xl font-bold text-white">{city.name}</h3>
                    <p>{city.count.toLocaleString()} properties</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How StuHouses Works</h2>
            <p className="text-lg text-neutral max-w-2xl mx-auto">
              Our simple process makes finding and securing student accommodation easy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center p-6">
              <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Search for Your Perfect Home</h3>
              <p className="text-neutral">
                Browse and compare hundreds of student properties in your chosen city or university.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-6">
              <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Your Bills-Included Tenancy</h3>
              <p className="text-neutral">
                Sign your tenancy with all utilities included in one simple package.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-6">
              <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enjoy Hassle-Free Living</h3>
              <p className="text-neutral">
                Move in with everything set up and managed for a stress-free student experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Utilities Package Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">All-Inclusive Utilities Package</h2>
              <p className="text-xl mb-8">
                Every StuHouses property comes with a comprehensive utilities package, so you can focus on your studies and social life.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-secondary-300 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg">Gas</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-secondary-300 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg">Electricity</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-secondary-300 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg">Broadband</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-secondary-300 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg">Water</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-secondary-300 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg">TV Licence</span>
                </li>
              </ul>
            </div>
            
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop"
                alt="Student accommodation living room"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 