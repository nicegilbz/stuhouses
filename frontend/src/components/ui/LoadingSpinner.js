import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  // Size mappings
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  // Color mappings
  const colorMap = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    white: 'border-white',
    gray: 'border-gray-300',
  };
  
  const sizeClass = sizeMap[size] || sizeMap.md;
  const colorClass = colorMap[color] || colorMap.primary;
  
  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-t-transparent ${sizeClass} ${colorClass} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner; 