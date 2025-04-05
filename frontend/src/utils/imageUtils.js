// List of placeholder images by category
const placeholderImages = {
  property: '/images/placeholders/property.jpg',
  city: '/images/placeholders/city.jpg',
  university: '/images/placeholders/university.jpg',
  user: '/images/placeholders/user.jpg',
  blog: '/images/placeholders/blog.jpg',
  generic: '/images/placeholders/generic.jpg',
};

/**
 * Handles image loading errors by replacing with placeholder images
 * @param {Event} event - The error event
 * @param {string} category - Category of image (property, city, etc.)
 */
export const handleImageError = (event, category = 'generic') => {
  if (event?.currentTarget) {
    // Get appropriate fallback image or default to generic
    const fallbackSrc = placeholderImages[category] || placeholderImages.generic;
    event.currentTarget.src = fallbackSrc;
    
    // Add a class to indicate this is a fallback image
    event.currentTarget.classList.add('fallback-image');
    
    // Prevent potential infinite loop if fallback also fails
    event.currentTarget.onerror = null;
  }
};

/**
 * Generate a random placeholder image from Unsplash for development if needed
 * @param {number} width - Width of the image
 * @param {number} height - Height of the image
 * @param {string} category - Category to search for (e.g., 'apartment', 'city')
 * @returns {string} URL of placeholder image
 */
export const getDevPlaceholder = (width = 800, height = 600, category = 'apartment') => {
  // Use different service in development vs production
  if (process.env.NODE_ENV === 'development') {
    // This uses a service that generates random images - good for dev
    return `https://source.unsplash.com/random/${width}x${height}/?${category}`;
  }
  
  // In production, return our local placeholder to avoid external dependencies
  return placeholderImages[category] || placeholderImages.generic;
};

/**
 * Safely construct image URL with fallback to placeholder
 * @param {string|null} url - The original image URL
 * @param {string} category - Category of image for fallback
 * @returns {string} Safe URL that won't break the app
 */
export const getSafeImageUrl = (url, category = 'generic') => {
  if (!url || url.trim() === '') {
    return placeholderImages[category] || placeholderImages.generic;
  }
  
  // Return original URL - error handling will be done via onError
  return url;
};

/**
 * Builds a srcSet for responsive images with fallbacks
 * @param {string} baseUrl - Base URL of the image
 * @param {string} category - Image category
 * @returns {Object} Object with src, srcSet and sizes
 */
export const buildResponsiveImage = (baseUrl, category = 'generic') => {
  const safeUrl = getSafeImageUrl(baseUrl, category);
  
  // If using a known service like Unsplash, we can construct a srcSet
  if (safeUrl.includes('unsplash.com') && !safeUrl.includes('source.unsplash.com')) {
    return {
      src: safeUrl,
      srcSet: `
        ${safeUrl.replace('w=2000', 'w=400')} 400w,
        ${safeUrl.replace('w=2000', 'w=800')} 800w,
        ${safeUrl} 2000w
      `,
      sizes: '(max-width: 640px) 400px, (max-width: 1024px) 800px, 2000px'
    };
  }
  
  // For other images, just return the source
  return { src: safeUrl };
}; 