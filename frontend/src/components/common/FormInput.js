import React from 'react';
import { useField } from 'formik';

/**
 * Form input component with error handling and Formik integration
 */
const FormInput = ({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  className = '',
  required = false,
  icon: Icon,
  helpText,
  ...props
}) => {
  // Use Formik's useField hook to get field props, meta, and helpers
  const [field, meta] = useField(name);
  
  // Determine if field has an error
  const hasError = meta.touched && meta.error;
  
  // Define base classes
  const baseInputClass = `
    block w-full px-4 py-2 mt-1 text-base border rounded-md shadow-sm
    focus:outline-none focus:ring-2 focus:border-transparent
    placeholder:text-neutral-400
    transition-colors duration-200
  `;
  
  // Define variant classes based on state
  const inputStateClass = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
    : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-200';
  
  // Define icon container class
  const iconContainerClass = 'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
  
  // Combine classes
  const inputClass = `
    ${baseInputClass}
    ${inputStateClass}
    ${Icon ? 'pl-10' : ''}
    ${className}
  `;
  
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id || name} 
          className="block text-sm font-medium text-neutral-dark mb-1"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className={iconContainerClass}>
            <Icon className="w-5 h-5 text-neutral" />
          </div>
        )}
        
        <input
          id={id || name}
          type={type}
          placeholder={placeholder}
          className={inputClass}
          {...field}
          {...props}
        />
      </div>
      
      {helpText && !hasError && (
        <p className="mt-1 text-sm text-neutral">{helpText}</p>
      )}
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{meta.error}</p>
      )}
    </div>
  );
};

export default FormInput; 