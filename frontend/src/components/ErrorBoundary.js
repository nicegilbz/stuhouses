import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You could send this to a logging service
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-5 text-center">
          <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-red-600">Something went wrong</h1>
            <p className="mb-6 text-gray-600">
              An unexpected error has occurred. Our team has been notified.
            </p>
            <div className="mb-4">
              <button
                onClick={() => window.location.reload()}
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Reload Page
              </button>
            </div>
            <a
              href="/"
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Return to Home Page
            </a>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 cursor-pointer rounded border border-gray-200 bg-gray-50 p-4 text-left">
                <summary className="font-medium text-red-600">Error Details (Development Only)</summary>
                <pre className="mt-2 overflow-auto text-xs text-gray-800">
                  <code>{this.state.error && this.state.error.toString()}</code>
                </pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 overflow-auto text-xs text-gray-800">
                    <code>{this.state.errorInfo.componentStack}</code>
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 