import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import { LanguageProvider } from '../i18n/config';
import { useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Head from 'next/head';
import { fetchCsrfToken } from '../utils/api';
import authService from '../utils/auth';

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

  // Fetch CSRF token on initial load
  useEffect(() => {
    fetchCsrfToken();
    
    // Cheque for current user
    const checkAuth = async () => {
      await authService.getCurrentUser();
    };
    
    checkAuth();
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <ErrorBoundary>
        <LanguageProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#0052CC',
                  secondary: '#4d94ff',
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: '#FF5630',
                  secondary: '#ffa28e',
                },
              },
            }}
          />
          {getLayout(<Component {...pageProps} />)}
        </LanguageProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp; 