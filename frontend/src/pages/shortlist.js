import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { HeartIcon, TrashIcon, HomeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// Import mock property data
import { allProperties } from '../data/mockProperties';

export default function Shortlist() {
  const router = useRouter();
  const [shortlistedProperties, setShortlistedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // In a real app, we'd fetch the shortlisted properties from an API
    // For demo purposes, we'll use localStorage and mock data
    const fetchShortlist = async () => {
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Cheque if user is logged in
        const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(userLoggedIn);
        
        // Get saved property IDs from localStorage
        const savedIds = JSON.parse(localStorage.getItem('shortlistedProperties') || '[]');
        
        // Match IDs with property data
        const properties = allProperties.filter(property => savedIds.includes(property.id));
        
        setShortlistedProperties(properties);
      } catch (error) {
        console.error('Error fetching shortlist:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShortlist();
  }, []);

  const removeFromShortlist = (id) => {
    // Remove from local state
    setShortlistedProperties(prev => prev.filter(property => property.id !== id));
    
    // Remove from localStorage
    const savedIds = JSON.parse(localStorage.getItem('shortlistedProperties') || '[]');
    const updatedIds = savedIds.filter(savedId => savedId !== id);
    localStorage.setItem('shortlistedProperties', JSON.stringify(updatedIds));
  };

  const addToShortlist = (id) => {
    // In a real app, this would also make an API call
    const property = allProperties.find(p => p.id === id);
    
    if (property) {
      // Add to local state if not already there
      if (!shortlistedProperties.some(p => p.id === id)) {
        setShortlistedProperties(prev => [...prev, property]);
      }
      
      // Add to localStorage
      const savedIds = JSON.parse(localStorage.getItem('shortlistedProperties') || '[]');
      if (!savedIds.includes(id)) {
        savedIds.push(id);
        localStorage.setItem('shortlistedProperties', JSON.stringify(savedIds));
      }
    }
  };

  const clearShortlist = () => {
    setShortlistedProperties([]);
    localStorage.setItem('shortlistedProperties', JSON.stringify([]));
  };

  // Function to simulate login for demo purposes
  const simulateLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    
    // Add some demo properties to shortlist
    const demoIds = [1, 5, 7];
    localStorage.setItem('shortlistedProperties', JSON.stringify(demoIds));
    
    // Refresh properties
    const properties = allProperties.filter(property => demoIds.includes(property.id));
    setShortlistedProperties(properties);
  };

  const formatPrice = (price) => {
    return `£${price} pppw`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Shortlist | StuHouses</title>
        <meta name="description" content="View and manage your shortlisted student accommodations." />
      </Head>

      <div className="bg-neutral-light py-6 md:py-12">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-2 px-4">My Shortlist</h1>
          <p className="text-neutral mb-6 px-4">Save and compare your favorite properties</p>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        {!isLoggedIn ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <HeartIcon className="h-16 w-16 mx-auto text-neutral-light mb-4" />
            <h2 className="text-2xl font-bold mb-4">Login to View Your Shortlist</h2>
            <p className="text-neutral mb-6 max-w-md mx-auto">
              Log in to your account to view and manage your shortlisted properties. Shortlisting helps you keep track of your favorite accommodations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth?redirect=/shortlist" className="button-primary">
                Log In
              </Link>
              <button onClick={simulateLogin} className="button-outline">
                Simulate Login (Demo Only)
              </button>
            </div>
          </div>
        ) : shortlistedProperties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <HeartIcon className="h-16 w-16 mx-auto text-neutral-light mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your Shortlist is Empty</h2>
            <p className="text-neutral mb-6 max-w-md mx-auto">
              You haven't added any properties to your shortlist yet. Browse our properties and click the heart icon to add them to your shortlist.
            </p>
            <Link href="/properties" className="button-primary">
              Browse Properties
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-neutral-dark">
                <span className="font-bold">{shortlistedProperties.length}</span> properties in your shortlist
              </p>
              <button
                onClick={clearShortlist}
                className="text-neutral-dark hover:text-red-500 flex items-center"
              >
                <TrashIcon className="h-5 w-5 mr-1" />
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shortlistedProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
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
                      onClick={() => removeFromShortlist(property.id)}
                      className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colours"
                      aria-label="Remove from shortlist"
                    >
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    </button>
                    <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 text-sm font-medium">
                      {formatPrice(property.price_per_person_per_week)}
                    </div>
                  </div>

                  <div className="p-4">
                    <Link href={`/properties/${property.city.toLowerCase()}/${property.slug}`}>
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
                    
                    <div className="flex justify-between items-center pt-3 border-t border-grey-200">
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
                        className="button-primary-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold mb-4">Compare Properties</h2>
              <p className="text-neutral mb-6">
                Use the comparison table below to help you make a decision.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-grey-200">
                  <thead className="bg-neutral-light">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                        Property
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                        Bedrooms
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                        Area
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                        Available From
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                        Bills Included
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-grey-200">
                    {shortlistedProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-neutral-light/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <Image
                                src={property.image}
                                alt={property.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-dark">{property.title}</div>
                              <div className="text-xs text-neutral">{property.address_line_1}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                          {property.bedrooms}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                          {formatPrice(property.price_per_person_per_week)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                          {property.area}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                          {new Date(property.available_from).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                          {property.bills_included ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/properties/${property.city.toLowerCase()}/${property.slug}`}
                            className="text-primary hover:text-primary-700"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-xl font-bold mb-4">Looking For More Options?</h3>
              <Link href="/properties" className="button-primary">
                Browse More Properties
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
} 