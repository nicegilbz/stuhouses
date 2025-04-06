import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import { LanguageProvider } from '../i18n/config';
import { useEffect, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Head from 'next/head';
import { fetchCsrfToken } from '../utils/api';
import { AuthProvider } from '../utils/authContext';
import { useRouter } from 'next/router';
import authService from '../utils/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  
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
  }, []);
  
  // Route guard for admin routes
  useEffect(() => {
    const checkAdminAuth = async () => {
      // Check if we're on an admin route
      if (router.pathname.startsWith('/admin') && router.pathname !== '/admin/login') {
        const user = await authService.getCurrentUser();
        
        // If not authenticated or not an admin, redirect to admin login
        if (!user || user.role !== 'admin') {
          router.replace('/admin/login');
          return;
        }
      }
      
      setIsReady(true);
    };
    
    if (router.isReady) {
      checkAdminAuth();
    }
  }, [router.isReady, router.pathname, router]);

  // Don't render anything until auth check is complete
  if (router.pathname.startsWith('/admin') && !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <ErrorBoundary>
        <AuthProvider>
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
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp; 