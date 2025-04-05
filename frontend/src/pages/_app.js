import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import { LanguageProvider } from '../i18n/config';
import { useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  // Handle global error tracking
  useEffect(() => {
    const handleError = (error, errorInfo) => {
      // Log to your error tracking service here
      console.error('Global error:', error, errorInfo);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#36B37E',
              },
            },
            error: {
              style: {
                background: '#FF5630',
              },
            },
          }}
        />
        {getLayout(<Component {...pageProps} />)}
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default MyApp; 