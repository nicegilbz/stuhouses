import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon, FunnelIcon, HomeIcon, BoltIcon, WifiIcon, FireIcon, TvIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIconSolid } from '@heroicons/react/24/solid';
import axios from 'axios';

// Mock data for cities (in a real app, this would come from an API)
const popularCities = [
  { name: 'London', slug: 'london', property_count: 156 },
  { name: 'Manchester', slug: 'manchester', property_count: 98 },
  { name: 'Birmingham', slug: 'birmingham', property_count: 87 },
  { name: 'Leeds', slug: 'leeds', property_count: 76 },
  { name: 'Sheffield', slug: 'sheffield', property_count: 65 },
  { name: 'Nottingham', slug: 'nottingham', property_count: 54 },
];

// Mock properties data (in a real app, this would come from an API)
import { allProperties } from '../../data/mockProperties';

export default function Properties() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
    billsIncluded: true,
    sort: 'price-asc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get query parameters from URL
    const { 
      city, 
      bedrooms, 
      minPrice, 
      maxPrice, 
      billsIncluded, 
      sort = 'price-asc',
      q = ''
    } = router.query;
    
    // Update filters state with URL params
    setFilters({
      city: city || '',
      bedrooms: bedrooms || '',
      minPrice: minPrice || '',
      maxPrice: maxPrice || '',
      billsIncluded: billsIncluded !== 'false',
      sort: sort || 'price-asc'
    });
    
    setSearchQuery(q || '');
    
    // Fetch properties (simulated here with mock data)
    setLoading(true);
    
    // In a real app, you would make an API call with the filters
    // const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/properties`;
    // axios.get(apiUrl, { params: { city, bedrooms, minPrice, maxPrice, billsIncluded, sort } })
    
    // For now, let's just filter the mock data
    setTimeout(() => {
      let filteredProperties = [...allProperties];
      
      // Apply city filter
      if (city) {
        filteredProperties = filteredProperties.filter(
          property => property.city.toLowerCase() === city.toLowerCase()
        );
      }
      
      // Apply bedrooms filter
      if (bedrooms) {
        filteredProperties = filteredProperties.filter(
          property => property.bedrooms === parseInt(bedrooms)
        );
      }
      
      // Apply price filters
      if (minPrice) {
        filteredProperties = filteredProperties.filter(
          property => property.price_per_person_per_week >= parseInt(minPrice)
        );
      }
      
      if (maxPrice) {
        filteredProperties = filteredProperties.filter(
          property => property.price_per_person_per_week <= parseInt(maxPrice)
        );
      }
      
      // Apply search query
      if (q) {
        const searchLower = q.toLowerCase();
        filteredProperties = filteredProperties.filter(
          property => 
            property.title.toLowerCase().includes(searchLower) ||
            property.address_line_1.toLowerCase().includes(searchLower) ||
            property.city.toLowerCase().includes(searchLower) ||
            property.area.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply sorting
      if (sort) {
        switch(sort) {
          case 'price-asc':
            filteredProperties.sort((a, b) => a.price_per_person_per_week - b.price_per_person_per_week);
            break;
          case 'price-desc':
            filteredProperties.sort((a, b) => b.price_per_person_per_week - a.price_per_person_per_week);
            break;
          case 'bedrooms-asc':
            filteredProperties.sort((a, b) => a.bedrooms - b.bedrooms);
            break;
          case 'bedrooms-desc':
            filteredProperties.sort((a, b) => b.bedrooms - a.bedrooms);
            break;
          default:
            filteredProperties.sort((a, b) => a.price_per_person_per_week - b.price_per_person_per_week);
        }
      }
      
      setProperties(filteredProperties);
      setLoading(false);
    }, 500);
    
  }, [router.query]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((favId) => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const applyFilters = () => {
    // Update the URL with the current filters
    router.push({
      pathname: '/properties',
      query: {
        ...(filters.city && { city: filters.city }),
        ...(filters.bedrooms && { bedrooms: filters.bedrooms }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.billsIncluded === false && { billsIncluded: 'false' }),
        ...(filters.sort && { sort: filters.sort }),
        ...(searchQuery && { q: searchQuery }),
      },
    });
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      bedrooms: '',
      minPrice: '',
      maxPrice: '',
      billsIncluded: true,
      sort: 'price-asc'
    });
    setSearchQuery('');
    
    router.push({
      pathname: '/properties',
    });
  };

  const formatPrice = (price) => {
    return `£${price} pppw`;
  };

  return (
    <>
      <Head>
        <title>Student Accommodation | StuHouses</title>
        <meta name="description" content="Find student accommodation with all bills included. Browse our listings across the UK's top university cities." />
      </Head>

      {/* Hero Banner */}
      <div className="relative bg-primary py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Find Student Accommodation
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Browse our listings with all bills included across the UK
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Search by city, area or postcode..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full py-3 px-4 pr-12 rounded-lg text-neutral-dark"
              />
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary"
                onClick={applyFilters}
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Popular Cities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-dark mb-6">Popular Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCities.map((city) => (
              <Link
                key={city.slug}
                href={`/properties?city=${city.slug}`}
                className="block bg-white shadow-md rounded-lg p-4 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-neutral-dark mb-1">{city.name}</h3>
                <p className="text-neutral text-sm">{city.property_count} properties</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Filter Properties</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-primary font-medium"
            >
              <FunnelIcon className="h-5 w-5 mr-1" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label htmlFor="city" className="block text-neutral-dark font-medium mb-1">
                    City
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="select w-full"
                  >
                    <option value="">Any City</option>
                    {popularCities.map((city) => (
                      <option key={city.slug} value={city.slug}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="bedrooms" className="block text-neutral-dark font-medium mb-1">
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    className="select w-full"
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

                <div>
                  <label htmlFor="minPrice" className="block text-neutral-dark font-medium mb-1">
                    Min Price (pppw)
                  </label>
                  <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="input w-full"
                    placeholder="£"
                  />
                </div>

                <div>
                  <label htmlFor="maxPrice" className="block text-neutral-dark font-medium mb-1">
                    Max Price (pppw)
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="input w-full"
                    placeholder="£"
                  />
                </div>

                <div className="flex items-center pt-8">
                  <input
                    id="billsIncluded"
                    name="billsIncluded"
                    type="checkbox"
                    checked={filters.billsIncluded}
                    onChange={handleFilterChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-grey-300 rounded"
                  />
                  <label htmlFor="billsIncluded" className="ml-2 block text-sm text-neutral">
                    Bills Included Only
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-4 space-x-4">
                <button
                  onClick={resetFilters}
                  className="button-outline"
                >
                  Reset Filters
                </button>
                <button
                  onClick={applyFilters}
                  className="button-primary"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <p className="text-neutral-dark">
            <span className="font-bold">{properties.length}</span> properties found
            {filters.city && ` in ${filters.city.charAt(0).toUpperCase() + filters.city.slice(1)}`}
          </p>
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-neutral-dark">
              Sort by:
            </label>
            <select
              id="sort"
              name="sort"
              className="select bg-white py-2 px-3"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="bedrooms-asc">Bedrooms (Low to High)</option>
              <option value="bedrooms-desc">Bedrooms (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Property Listings */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-200">
                <div className="relative">
                  <div className="relative h-48">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-105 transition-transform"
                    aria-label={favourites.includes(property.id) ? 'Remove from favourites' : 'Add to favourites'}
                  >
                    {favourites.includes(property.id) ? (
                      <HeartIconSolid className="h-5 w-5 text-secondary" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-neutral" />
                    )}
                  </button>
                  <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 text-sm font-medium">
                    {formatPrice(property.price_per_person_per_week)}
                  </div>
                </div>

                <div className="p-4">
                  <Link href={`/properties/${property.city.toLowerCase()}/${property.slug}`}>
                    <h3 className="text-xl font-bold text-neutral-dark mb-2 hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center text-neutral mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{property.address_line_1}, {property.area}, {property.postcode}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-y-2 mb-4">
                    <div className="flex items-center mr-4">
                      <HomeIcon className="h-5 w-5 text-neutral mr-1" />
                      <span className="text-sm font-medium">{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                    </div>
                  </div>
                  
                  {property.bills_included && (
                    <div className="border-t border-grey-200 pt-3 mt-3">
                      <p className="text-sm font-medium text-neutral-dark mb-2">Bills Included:</p>
                      <div className="flex flex-wrap gap-2">
                        {property.has_electricity && (
                          <div className="inline-flex items-center px-2 py-1 bg-neutral-light rounded-full text-xs text-neutral-dark">
                            <BoltIcon className="h-3 w-3 mr-1" />
                            Electricity
                          </div>
                        )}
                        {property.has_gas && (
                          <div className="inline-flex items-center px-2 py-1 bg-neutral-light rounded-full text-xs text-neutral-dark">
                            <FireIcon className="h-3 w-3 mr-1" />
                            Gas
                          </div>
                        )}
                        {property.has_broadband && (
                          <div className="inline-flex items-center px-2 py-1 bg-neutral-light rounded-full text-xs text-neutral-dark">
                            <WifiIcon className="h-3 w-3 mr-1" />
                            Broadband
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-grey-200">
                    <div className="text-sm text-neutral">
                      <span className="block">Available from</span>
                      <span className="font-medium text-neutral-dark">
                        {new Date(property.available_from).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <Link 
                      href={`/properties/${property.city.toLowerCase()}/${property.slug}`} 
                      className="inline-flex items-center text-primary font-medium hover:text-primary-700 transition-colors"
                    >
                      View Property
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
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
            <h3 className="text-xl font-bold mb-2">No Properties Found</h3>
            <p className="text-neutral mb-4">
              We couldn't find any properties matching your criteria. Try adjusting your filters or cheque back later.
            </p>
            <button 
              onClick={resetFilters} 
              className="button-primary"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Map Banner */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Find Properties on the Map</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Use our interactive map to discover student accommodation in your preferred location.
          </p>
          <Link href="/properties/map" className="button-white">
            View Map
          </Link>
        </div>
      </div>
    </>
  );
} 