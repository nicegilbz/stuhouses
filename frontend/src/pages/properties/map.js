import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { MagnifyingGlassIcon, FunnelIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Import mock property data
import { allProperties } from '../../data/mockProperties';

// Dynamically import the map component with no SSR
// (In a real app, this would be a React component using react-leaflet, Google Maps, or similar)
const MapWithNoSSR = dynamic(
  () => import('../../components/property/MapView'),
  { ssr: false }
);

export default function PropertyMap() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProperty, setActiveProperty] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
    billsIncluded: true,
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
      q = '' 
    } = router.query;
    
    // Update filters state with URL params
    setFilters({
      city: city || '',
      bedrooms: bedrooms || '',
      minPrice: minPrice || '',
      maxPrice: maxPrice || '',
      billsIncluded: billsIncluded !== 'false',
    });
    
    setSearchQuery(q || '');
    
    // Fetch and filter properties
    setLoading(true);
    
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
      
      // Sort by price (low to high)
      filteredProperties.sort((a, b) => a.price_per_person_per_week - b.price_per_person_per_week);
      
      setProperties(filteredProperties);
      setLoading(false);
    }, 500);
    
  }, [router.query]);

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
      pathname: '/properties/map',
      query: {
        ...(filters.city && { city: filters.city }),
        ...(filters.bedrooms && { bedrooms: filters.bedrooms }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.billsIncluded === false && { billsIncluded: 'false' }),
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
    });
    setSearchQuery('');
    
    router.push({
      pathname: '/properties/map',
    });
  };

  const formatPrice = (price) => {
    return `£${price} pppw`;
  };

  const handlePropertyClick = (property) => {
    setActiveProperty(property);
  };

  const handleMapClick = () => {
    setActiveProperty(null);
  };

  // Choose center point based on filters
  const getMapCenter = () => {
    if (filters.city) {
      const cityProperty = properties.find(p => p.city.toLowerCase() === filters.city.toLowerCase());
      if (cityProperty) {
        return [cityProperty.latitude, cityProperty.longitude];
      }
    }
    
    // Default: center of UK
    return [54.00366, -2.547855];
  };

  return (
    <>
      <Head>
        <title>Property Map | StuHouses</title>
        <meta name="description" content="Browse student accommodation on an interactive map. Find properties near your university or preferred location." />
      </Head>

      <div className="flex flex-col h-[calc(100vh-5rem)]">
        {/* Filters Bar */}
        <div className="bg-white p-4 border-b">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 md:max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by city, area or postcode..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full py-2 px-4 pr-12 rounded-lg border border-grey-300 focus:ring-primary focus:border-primary"
                  />
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary"
                    onClick={applyFilters}
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link 
                  href="/properties"
                  className="button-outline py-2"
                >
                  List View
                </Link>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="button-primary py-2"
                >
                  <FunnelIcon className="h-5 w-5 mr-1" />
                  {showFilters ? 'Hide Filters' : 'Filters'}
                </button>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-neutral-light rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                      <option value="london">London</option>
                      <option value="manchester">Manchester</option>
                      <option value="birmingham">Birmingham</option>
                      <option value="leeds">Leeds</option>
                      <option value="sheffield">Sheffield</option>
                      <option value="nottingham">Nottingham</option>
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
                    <label htmlFor="priceRange" className="block text-neutral-dark font-medium mb-1">
                      Price Range
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        id="minPrice"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="input w-full"
                        placeholder="Min £"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        id="maxPrice"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="input w-full"
                        placeholder="Max £"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <div className="flex items-center h-12">
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
                </div>

                <div className="flex justify-end mt-4 space-x-4">
                  <button
                    onClick={resetFilters}
                    className="button-outline"
                  >
                    Reset
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
        </div>

        {/* Map and Properties */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Map */}
          <div className="w-full md:w-3/4 h-[300px] md:h-full relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-light">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <MapWithNoSSR 
                properties={properties}
                activeProperty={activeProperty}
                onPropertyClick={handlePropertyClick}
                onMapClick={handleMapClick}
                center={getMapCenter()}
                zoom={filters.city ? 12 : 6}
              />
            )}
          </div>
          
          {/* Property Sidebar */}
          <div className="w-full md:w-1/4 bg-white border-l border-grey-200 overflow-y-auto">
            <div className="p-4 border-b border-grey-200">
              <h2 className="font-bold text-lg">
                {properties.length} Properties Found
              </h2>
              <p className="text-sm text-neutral">
                Click on a property to view details
              </p>
            </div>
            
            {properties.length > 0 ? (
              <div className="divide-y divide-grey-200">
                {properties.map((property) => (
                  <div 
                    key={property.id}
                    className={`p-4 hover:bg-neutral-light cursor-pointer transition-colors ${
                      activeProperty?.id === property.id ? 'bg-neutral-light' : ''
                    }`}
                    onClick={() => handlePropertyClick(property)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-neutral-dark">{property.title}</h3>
                      <span className="font-bold text-primary">{formatPrice(property.price_per_person_per_week)}</span>
                    </div>
                    <div className="flex items-center text-neutral text-sm mb-2">
                      <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{property.address_line_1}, {property.area}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                      <Link
                        href={`/properties/${property.city.toLowerCase()}/${property.slug}`}
                        className="text-primary font-medium hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <svg 
                  className="h-12 w-12 mx-auto text-neutral-light mb-4" 
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
                <h3 className="text-lg font-bold mb-2">No Properties Found</h3>
                <p className="text-neutral mb-4">
                  Try adjusting your search filters to find more properties.
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
        </div>
      </div>
    </>
  );
} 