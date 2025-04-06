import React from 'react';
import Link from 'next/link';

/**
 * Button component with loading state, various styles, and link support
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  href,
  className = '',
  fullWidth = false,
  onClick,
  ...props
}) => {
  // Define base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Define variant classes
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-500',
    tertiary: 'bg-tertiary-DEFAULT text-white hover:bg-tertiary-dark focus:ring-tertiary-dark',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'bg-transparent text-primary hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  // Define size classes
  const sizeClasses = {
    sm: 'text-sm py-1.5 px-3 rounded',
    md: 'text-base py-2 px-4 rounded-md',
    lg: 'text-lg py-3 px-6 rounded-md',
  };
  
  // Define state classes
  const stateClasses = {
    disabled: 'opacity-50 cursor-not-allowed',
  };
  
  // Combine classes
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled || isLoading ? stateClasses.disabled : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;
  
  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
  
  // If href is provided, render Link
  if (href) {
    return (
      <Link 
        href={href}
        className={buttonClasses}
        onClick={!disabled && !isLoading ? onClick : undefined}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        {children}
      </Link>
    );
  }
  
  // Otherwise, render button
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </button>
  );
};

export default Button; 