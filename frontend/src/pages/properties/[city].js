import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon, FunnelIcon, HomeIcon, BoltIcon, WifiIcon, FireIcon, TvIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// Mock properties data (in a real app, this would come from an API)
const mockProperties = [
  {
    id: 1,
    title: '4 Bedroom Student House',
    slug: 'faraday-road',
    address_line_1: '11 Faraday Road',
    city: 'Leeds',
    area: 'Headingley',
    postcode: 'LS6 2ET',
    bedrooms: 4,
    bathrooms: 2,
    price_per_person_per_week: 135,
    bills_included: true,
    has_electricity: true,
    has_gas: true,
    has_water: true,
    has_broadband: true,
    has_tv_license: true,
    available_from: '2025-08-01',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    agent_name: 'Leeds Homes',
  },
  {
    id: 2,
    title: '5 Bedroom Student House',
    slug: 'cardigan-road',
    address_line_1: '23 Cardigan Road',
    city: 'Leeds',
    area: 'Headingley',
    postcode: 'LS6 1LJ',
    bedrooms: 5,
    bathrooms: 2,
    price_per_person_per_week: 125,
    bills_included: true,
    has_electricity: true,
    has_gas: true,
    has_water: true,
    has_broadband: true,
    has_tv_license: false,
    available_from: '2025-07-01',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop',
    agent_name: 'Student Lettings',
  },
  {
    id: 3,
    title: '3 Bedroom Apartment',
    slug: 'city-centre-apartment',
    address_line_1: 'Flat 12, Clarence Dock',
    city: 'Leeds',
    area: 'City Centre',
    postcode: 'LS1 4HJ',
    bedrooms: 3,
    bathrooms: 2,
    price_per_person_per_week: 165,
    bills_included: true,
    has_electricity: true,
    has_gas: true,
    has_water: true,
    has_broadband: true,
    has_tv_license: true,
    available_from: '2025-09-01',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
    agent_name: 'City Living',
  },
  {
    id: 4,
    title: '6 Bedroom Student House',
    slug: 'hyde-park-road',
    address_line_1: '45 Hyde Park Road',
    city: 'Leeds',
    area: 'Hyde Park',
    postcode: 'LS6 1AH',
    bedrooms: 6,
    bathrooms: 3,
    price_per_person_per_week: 110,
    bills_included: true,
    has_electricity: true, 
    has_gas: true,
    has_water: true,
    has_broadband: true,
    has_tv_license: false,
    available_from: '2025-07-15',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop',
    agent_name: 'Leeds Properties',
  },
];

// Mock data for Manchester
const manchesterProperties = [
  {
    id: 5,
    title: '4 Bedroom Student House',
    slug: 'wilmslow-road',
    address_line_1: '32 Wilmslow Road',
    city: 'Manchester',
    area: 'Fallowfield',
    postcode: 'M14 6AB',
    bedrooms: 4,
    bathrooms: 2,
    price_per_person_per_week: 125,
    bills_included: true,
    has_electricity: true,
    has_gas: true,
    has_water: true,
    has_broadband: true,
    has_tv_license: true,
    available_from: '2025-08-15',
    image: 'https://images.unsplash.com/photo-1560185009-5bf9f2849488?q=80&w=2070&auto=format&fit=crop',
    agent_name: 'Manchester Homes',
  },
  {
    id: 6,
    title: '5 Bedroom Student House',
    slug: 'moss-lane-east',
    address_line_1: '56 Moss Lane East',
    city: 'Manchester',
    area: 'Rusholme',
    postcode: 'M14 4PW',
    bedrooms: 5,
    bathrooms: 2,
    price_per_person_per_week: 115,
    bills_included: true,
    has_electricity: true,
    has_gas: true,
    has_water: true,
    has_broadband: true,
    has_tv_license: false,
    available_from: '2025-07-01',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070&auto=format&fit=crop',
    agent_name: 'Student Lets',
  },
];

// Mock data for Birmingham
const birminghamProperties = [
  {
    id: 7,
    title: '4 Bedroom Student House',
    slug: 'bristol-road',
    address_line_1: '112 Bristol Road',
    city: 'Birmingham',
    area: 'Selly Oak',
    postcode: 'B29 6BJ',
    bedrooms: 4,
    bathrooms: 1,
    price_per_person_per_week: 105,
    bills_included: true,
    has_electricity: true,
    has_gas: true,
    has_water: true,
    has_broadband: true,
    has_tv_license: false,
    available_from: '2025-07-15',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop',
    agent_name: 'Birmingham Lets',
  },
  {
    id: 8,
    title: '6 Bedroom Student House',
    slug: 'harborne-park-road',
    address_line_1: '28 Harborne Park Road',
    city: 'Birmingham',
    area: 'Harborne',
    postcode: 'B17 0NG',
    bedrooms: 6,
    bathrooms: 2,
    price_per_person_per_week: 115,
    bills_included: true,
    has_electricity: true,
    has_gas: true,
    has_water: true,
    has_broadband: true,
    has_tv_license: true,
    available_from: '2025-08-01',
    image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=2070&auto=format&fit=crop',
    agent_name: 'Student Properties',
  },
];

// Combine all properties
const allProperties = [...mockProperties, ...manchesterProperties, ...birminghamProperties];

// City data for display
const cityData = {
  leeds: {
    name: 'Leeds',
    description: 'Student accommodation in Leeds, a vibrant city in West Yorkshire with a large student population.',
    image: 'https://images.unsplash.com/photo-1681808231339-f512b8467e4a?q=80&w=2070&auto=format&fit=crop',
    universities: ['University of Leeds', 'Leeds Beckett University', 'Leeds Trinity University'],
  },
  manchester: {
    name: 'Manchester',
    description: 'Student accommodation in Manchester, one of the most popular student cities with a rich cultural heritage.',
    image: 'https://images.unsplash.com/photo-1563995103864-d87d3c1fdd39?q=80&w=2070&auto=format&fit=crop',
    universities: ['University of Manchester', 'Manchester Metropolitan University', 'Royal Northern College of Music'],
  },
  birmingham: {
    name: 'Birmingham',
    description: "Student accommodation in Birmingham, the UK's second largest city hosting five universities with a diverse and lively student community.",
    image: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=2070&auto=format&fit=crop',
    universities: ['University of Birmingham', 'Birmingham City University', 'Aston University'],
  },
};

export default function CityProperties() {
  const router = useRouter();
  const { city } = router.query;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
    billsIncluded: true,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // This simulates loading the properties from an API
    if (city) {
      setLoading(true);
      
      // In a real app, this would be an API call
      setTimeout(() => {
        const cityLower = city.toLowerCase();
        const filteredProperties = allProperties.filter(
          (property) => property.city.toLowerCase() === cityLower
        );
        
        setProperties(filteredProperties);
        setLoading(false);
      }, 500);
    }
  }, [city]);

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

  const applyFilters = () => {
    // In a real app, this would trigger a new API request with the filters
    // For this demo, we'll just filter the existing properties
    console.log('Applying filters:', filters);
  };

  const resetFilters = () => {
    setFilters({
      bedrooms: '',
      minPrice: '',
      maxPrice: '',
      billsIncluded: true,
    });
  };

  const formatPrice = (price) => {
    return `£${price} pppw`;
  };

  const cityInfo = city ? cityData[city.toLowerCase()] : null;

  if (router.isFallback || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cityInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">City Not Found</h1>
        <p className="mb-6 text-neutral">We couldn't find any properties in this city.</p>
        <Link href="/" className="button-primary">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`Student Accommodation in ${cityInfo.name} | StuHouses`}</title>
        <meta name="description" content={cityInfo.description} />
      </Head>

      {/* City Hero Banner */}
      <div className="relative h-64 md:h-80">
        <Image
          src={cityInfo.image}
          alt={`${cityInfo.name} student accommodation`}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Student Accommodation in {cityInfo.name}
            </h1>
            <p className="text-white text-xl">
              Find your perfect student home with all bills included
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Filter Results</h2>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="flex justify-between items-center mb-6">
          <p className="text-neutral-dark">
            <span className="font-bold">{properties.length}</span> properties found in {cityInfo.name}
          </p>
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-neutral-dark">
              Sort by:
            </label>
            <select
              id="sort"
              className="select bg-white py-2 px-3"
              defaultValue="price-asc"
            >
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="bedrooms-asc">Bedrooms (Low to High)</option>
              <option value="bedrooms-desc">Bedrooms (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Property Listings */}
        {properties.length > 0 ? (
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
                  <Link href={`/properties/${city}/${property.slug}`}>
                    <h3 className="text-xl font-bold text-neutral-dark mb-2 hover:text-primary transition-colours">
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
                      href={`/properties/${city}/${property.slug}`} 
                      className="inline-flex items-center text-primary font-medium hover:text-primary-700 transition-colours"
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

      {/* City Information Section */}
      <section className="bg-neutral-light py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Student Living in {cityInfo.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-neutral-dark mb-4">
                {cityInfo.description}
              </p>
              <p className="text-neutral-dark mb-4">
                Our student accommodation in {cityInfo.name} comes with all bills included, so you can focus on your studies and enjoying your time at university. We offer a range of properties to suit all budgets and preferences, from shared houses to modern flats.
              </p>
              <p className="text-neutral-dark">
                All our properties are located in popular student areas with good transport links to the universities and city center. Many are within walking distance of campus, shops, restaurants, and nightlife.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Universities in {cityInfo.name}</h3>
              <ul className="space-y-2">
                {cityInfo.universities.map((university) => (
                  <li key={university} className="flex items-start">
                    <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{university}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 