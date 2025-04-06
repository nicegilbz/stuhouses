import React from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ errorInfo });
    
    // In production, you would log this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }
  
  // Reset the error state when location changes
  componentDidUpdate(prevProps) {
    if (
      this.state.hasError && 
      typeof window !== 'undefined' &&
      prevProps.pathname !== window.location.pathname
    ) {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen bg-neutral-light flex flex-col justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10 text-red-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-neutral-dark mb-2">
              Something went wrong
            </h1>
            
            <p className="text-neutral mb-6">
              We apologize for the inconvenience. Try refreshing the page or navigate to the home page.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary-600 text-white rounded-md px-4 py-2 transition-colors"
              >
                Refresh Page
              </button>
              
              <Link 
                href="/"
                className="flex items-center justify-center bg-neutral-200 hover:bg-neutral-300 text-neutral-dark rounded-md px-4 py-2 transition-colors"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Go to Home Page
              </Link>
            </div>
            
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-8 text-left">
                <details className="bg-neutral-100 p-4 rounded-md">
                  <summary className="font-medium cursor-pointer text-red-600 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <p className="mb-2 font-bold">{this.state.error?.toString()}</p>
                  <pre className="text-sm overflow-auto bg-neutral-200 p-2 rounded">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 