import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { 
  HomeIcon, 
  UserGroupIcon, 
  BoltIcon, 
  WifiIcon, 
  FireIcon, 
  TvIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Import the mock property data from the city page 
// (In a real app, this would come from an API)
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
    description: 'A spacious 4 bedroom student house in the popular Headingley area of Leeds. The property features a modern kitchen, large living area, and a garden. All bills are included in the rent, making budgeting easier for students.',
    additional_images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?q=80&w=1470&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1470&auto=format&fit=crop',
    ],
    features: [
      'Double beds in all rooms',
      'High-speed broadband',
      'Modern kitchen with appliances',
      'Washing machine',
      'Garden with outdoor seating',
      'Close to university',
      'Near local amenities',
      'Secure entry system',
    ]
  },
  // ... other properties
];

// Data for Manchester
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
    description: 'A modern 4 bedroom student house in the popular Fallowfield area of Manchester. All bills are included in the rent. The property is close to both the University of Manchester and Manchester Metropolitan University.',
    additional_images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?q=80&w=1470&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1470&auto=format&fit=crop',
    ],
    features: [
      'Double beds in all rooms',
      'High-speed broadband',
      'Modern kitchen with appliances',
      'Washing machine',
      'Close to university',
      'Near local amenities',
      'Secure entry system',
    ]
  },
];

// Data for Birmingham
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
    description: 'A well-maintained 4 bedroom student house in the popular Selly Oak area of Birmingham. The property is just a short walk from the University of Birmingham campus and local shops and restaurants.',
    additional_images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?q=80&w=1470&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1470&auto=format&fit=crop',
    ],
    features: [
      'Double beds in all rooms',
      'High-speed broadband',
      'Modern kitchen with appliances',
      'Washing machine',
      'Close to university',
      'Near local amenities',
    ]
  },
];

// Combine all properties
const allProperties = [...mockProperties, ...manchesterProperties, ...birminghamProperties];

export default function PropertyDetails() {
  const router = useRouter();
  const { city, slug } = router.query;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showEnquireModal, setShowEnquireModal] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // This simulates loading the property from an API
    if (city && slug) {
      setLoading(true);
      
      // In a real app, this would be an API call
      setTimeout(() => {
        const foundProperty = allProperties.find(
          (p) => p.city.toLowerCase() === city.toLowerCase() && p.slug === slug
        );
        
        setProperty(foundProperty || null);
        setLoading(false);
      }, 500);
    }
  }, [city, slug]);

  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!enquiryForm.name.trim()) errors.name = 'Name is required';
    if (!enquiryForm.email.trim()) errors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryForm.email)) errors.email = 'Valid email is required';
    if (!enquiryForm.mobile.trim()) errors.mobile = 'Mobile number is required';
    
    return errors;
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // In a real app, this would send the enquiry to an API
    console.log('Enquiry submitted:', enquiryForm);
    
    // Display success message or redirect
    alert('Your enquiry has been sent. We will contact you soon!');
    setShowEnquireModal(false);
  };

  const formatPrice = (price) => {
    return `£${price} pppw`;
  };

  if (router.isFallback || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <p className="mb-6 text-neutral">We couldn't find this property.</p>
        <Link href={`/properties/${city}`} className="button-primary">
          View All Properties in {city}
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${property.title} | ${property.address_line_1}, ${property.city} | StuHouses`}</title>
        <meta name="description" content={`${property.bedrooms} bedroom student accommodation at ${property.address_line_1}, ${property.city}. ${property.bills_included ? 'All bills included.' : ''}`} />
      </Head>

      {/* Back Button */}
      <div className="bg-neutral-light py-4">
        <div className="container mx-auto px-4">
          <Link href={`/properties/${city}`} className="inline-flex items-center text-neutral-dark hover:text-primary transition-colours">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to {city} Properties
          </Link>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Title and Address */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-neutral-dark mb-2">{property.title}</h1>
              <p className="text-neutral text-lg">
                {property.address_line_1}, {property.area}, {property.city}, {property.postcode}
              </p>
            </div>
            
            {/* Property Gallery */}
            <div className="mb-8">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <Image
                  src={activeImage === 0 ? property.image : property.additional_images[activeImage - 1]}
                  alt={property.title}
                  fill
                  priority
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              {/* Thumbnail Navigation */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                <button
                  onClick={() => setActiveImage(0)}
                  className={`relative h-20 rounded-md overflow-hidden ${activeImage === 0 ? 'ring-2 ring-primary' : ''}`}
                >
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </button>
                
                {property.additional_images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index + 1)}
                    className={`relative h-20 rounded-md overflow-hidden ${activeImage === index + 1 ? 'ring-2 ring-primary' : ''}`}
                  >
                    <Image
                      src={img}
                      alt={`${property.title} - Image ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Key Information */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Key Information</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4">
                <div className="flex flex-col">
                  <span className="text-neutral text-sm">Price</span>
                  <span className="font-bold text-lg">{formatPrice(property.price_per_person_per_week)}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-neutral text-sm">Bedrooms</span>
                  <span className="font-bold text-lg">{property.bedrooms}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-neutral text-sm">Bathrooms</span>
                  <span className="font-bold text-lg">{property.bathrooms}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-neutral text-sm">Available From</span>
                  <span className="font-bold">
                    {new Date(property.available_from).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-neutral text-sm">Property Type</span>
                  <span className="font-bold">House</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-neutral text-sm">Bills</span>
                  <span className="font-bold text-primary">All Included</span>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-neutral-dark whitespace-pre-line">
                {property.description}
              </p>
            </div>
            
            {/* Bills Included */}
            {property.bills_included && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Bills Included</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.has_electricity && (
                    <div className="flex items-center">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <BoltIcon className="h-6 w-6 text-primary" />
                      </div>
                      <span>Electricity</span>
                    </div>
                  )}
                  
                  {property.has_gas && (
                    <div className="flex items-center">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <FireIcon className="h-6 w-6 text-primary" />
                      </div>
                      <span>Gas</span>
                    </div>
                  )}
                  
                  {property.has_water && (
                    <div className="flex items-center">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                      <span>Water</span>
                    </div>
                  )}
                  
                  {property.has_broadband && (
                    <div className="flex items-center">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <WifiIcon className="h-6 w-6 text-primary" />
                      </div>
                      <span>Broadband</span>
                    </div>
                  )}
                  
                  {property.has_tv_license && (
                    <div className="flex items-center">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <TvIcon className="h-6 w-6 text-primary" />
                      </div>
                      <span>TV License</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Features */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                {property.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            {/* Price Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-neutral text-sm">Price per person per week</p>
                  <p className="text-2xl font-bold">{formatPrice(property.price_per_person_per_week)}</p>
                </div>
                {property.bills_included && (
                  <div className="bg-primary-50 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    Bills Included
                  </div>
                )}
              </div>
              
              <div className="border-t border-grey-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral">Deposit</span>
                  <span className="font-medium">£{property.price_per_person_per_week * 4}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral">Available From</span>
                  <span className="font-medium">
                    {new Date(property.available_from).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setShowEnquireModal(true)}
                className="button-primary w-full"
              >
                Enquire Now
              </button>
            </div>
            
            {/* Agent Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold mb-2">Listed by</h3>
              <p className="text-lg font-medium mb-4">{property.agent_name}</p>
              
              <div className="flex space-x-4">
                <button className="flex-1 button-outline text-sm py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </button>
                <button className="flex-1 button-outline text-sm py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquireModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start p-4 border-b">
              <div>
                <h2 className="text-xl font-bold">Enquire now</h2>
              </div>
              <button
                onClick={() => setShowEnquireModal(false)}
                className="p-1 rounded-full hover:bg-neutral-light"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Property Summary */}
            <div className="p-4 border-b flex">
              <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 mr-4">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <div className="bg-primary-50 text-primary text-xs px-2 py-0.5 rounded-full mr-2">
                    Bills Included
                  </div>
                  <div className="bg-neutral-light text-neutral-dark text-xs px-2 py-0.5 rounded-full">
                    {property.bathrooms} bathrooms
                  </div>
                </div>
                
                <h3 className="font-bold">{property.title}</h3>
                <p className="text-sm text-neutral flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.area}, {property.city}
                </p>
                <p className="font-bold mt-1">£{property.price_per_person_per_week} per person per week</p>
                <p className="text-xs text-neutral">
                  Available from {new Date(property.available_from).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            
            {/* Enquiry Form */}
            <form onSubmit={handleEnquirySubmit} className="p-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-neutral-dark font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={enquiryForm.name}
                  onChange={handleEnquiryChange}
                  className={`input ${formErrors.name ? 'input-error' : ''}`}
                  placeholder="Your full name"
                />
                {formErrors.name && (
                  <p className="text-secondary-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-neutral-dark font-medium mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={enquiryForm.email}
                  onChange={handleEnquiryChange}
                  className={`input ${formErrors.email ? 'input-error' : ''}`}
                  placeholder="your.email@example.com"
                />
                {formErrors.email && (
                  <p className="text-secondary-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="mobile" className="block text-neutral-dark font-medium mb-1">
                  Mobile number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={enquiryForm.mobile}
                  onChange={handleEnquiryChange}
                  className={`input ${formErrors.mobile ? 'input-error' : ''}`}
                  placeholder="Your phone number"
                />
                {formErrors.mobile && (
                  <p className="text-secondary-500 text-sm mt-1">{formErrors.mobile}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-neutral-dark font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={enquiryForm.message}
                  onChange={handleEnquiryChange}
                  className="input"
                  placeholder="I'm interested in viewing this property. Please contact me with more information."
                ></textarea>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEnquireModal(false)}
                  className="px-6 py-2 border border-grey-300 rounded-lg text-neutral-dark hover:bg-neutral-light transition-colours"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-secondary"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}