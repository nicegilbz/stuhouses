import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, MapPinIcon, HomeIcon, ShowerIcon, BoltIcon, FireIcon, WifiIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

/**
 * PropertyCard component for displaying property listings
 * 
 * @param {Object} property - The property data
 * @param {boolean} isFavorited - Whether the property is in user's shortlist
 * @param {Function} onToggleFavorite - Function to toggle favorite status
 */
const PropertyCard = ({ property, isFavorited = false, onToggleFavorite }) => {
  const formatPrice = (price) => {
    return `£${price} pppw`;
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(property.id);
    }
  };

  return (
    <div className="card group hover:shadow-card-hover transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Property Image */}
        <div className="relative h-48 w-full overflow-hidden">
          {property.primary_image ? (
            <Image
              src={property.primary_image}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-grey-200 flex items-center justify-center">
              <HomeIcon className="h-16 w-16 text-grey-400" />
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-grey-100 transition-colours"
          onClick={handleFavoriteClick}
          aria-label={isFavorited ? "Remove from shortlist" : "Add to shortlist"}
        >
          {isFavorited ? (
            <HeartIconSolid className="h-5 w-5 text-secondary-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-neutral" />
          )}
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-0 left-0 bg-primary-500 text-white px-4 py-2 font-bold">
          {formatPrice(property.price_per_week)}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <Link href={`/properties/${property.slug}`} className="block">
          <h3 className="text-xl font-bold text-neutral-dark mb-2 group-hover:text-primary transition-colours">
            {property.title}
          </h3>
          
          <div className="flex items-center text-neutral mb-3">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.address_line_1}, {property.postcode}</span>
          </div>
          
          <div className="flex flex-wrap gap-y-2 mb-4">
            <div className="flex items-center mr-4">
              <HomeIcon className="h-5 w-5 text-neutral mr-1" />
              <span className="text-sm font-medium">{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
            </div>
            <div className="flex items-center mr-4">
              <ShowerIcon className="h-5 w-5 text-neutral mr-1" />
              <span className="text-sm font-medium">{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
            </div>
          </div>
          
          {/* Utilities Included */}
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
        </Link>

        {/* Agent Info & View Button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-grey-200">
          <div className="text-sm text-neutral">
            <span className="block">Listed by</span>
            <span className="font-medium text-neutral-dark">{property.agent_name}</span>
          </div>
          <Link 
            href={`/properties/${property.slug}`} 
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
  );
};

export default PropertyCard; 