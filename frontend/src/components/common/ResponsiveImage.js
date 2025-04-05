import { useState } from 'react';
import Image from 'next/image';
import { handleImageError, getSafeImageUrl } from '../../utils/imageUtils';

/**
 * A responsive image component with proper error handling and fallbacks
 */
const ResponsiveImage = ({
  src,
  alt = '',
  width = 800,
  height = 600,
  className = '',
  category = 'generic',
  priority = false,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const safeSrc = getSafeImageUrl(src, category);
  
  // Handle image load errors
  const onError = (e) => {
    if (!hasError) {
      setHasError(true);
      handleImageError(e, category);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: width / height }}>
      <Image
        src={safeSrc}
        alt={alt}
        width={width}
        height={height}
        onError={onError}
        className={`object-cover ${hasError ? 'fallback-image' : ''}`}
        priority={priority}
        {...props}
      />
    </div>
  );
};

export default ResponsiveImage; 