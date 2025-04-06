import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { EnvelopeIcon, LockClosedIcon, HomeIcon } from '@heroicons/react/24/outline';
import { authServiceWithLoading } from '../../utils/auth';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

// Login validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const AdminLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // If already authenticated as admin, redirect to admin dashboard
  useEffect(() => {
    const checkAuth = async () => {
      const user = await authServiceWithLoading.getCurrentUser();
      if (user && user.role === 'admin') {
        router.replace('/admin');
      }
    };
    
    checkAuth();
  }, [router]);

  // Handle login form submission
  const handleLogin = async (values) => {
    try {
      console.log("Attempting admin login with:", values.email);
      const result = await authServiceWithLoading.login(values.email, values.password, { setLoading });
      
      // If we don't have result data, show error
      if (!result || !result.data || !result.data.user) {
        toast.error('Login failed. Please check your credentials.');
        return;
      }
      
      // Check if user is an admin
      if (result.data.user.role !== 'admin') {
        console.log("Login rejected: User is not an admin");
        toast.error('You do not have admin privileges');
        await authServiceWithLoading.logout();
        return;
      }
      
      console.log("Admin login successful for:", values.email);
      toast.success('Login successful');
      router.push('/admin');
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  // Set loading state for buttons
  const setLoading = (loadingState) => {
    setIsLoading(loadingState);
  };

  return (
    <>
      <Head>
        <title>Admin Login | StuHouses</title>
        <meta name="description" content="Admin login for StuHouses" />
      </Head>

      <div className="min-h-screen bg-neutral-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex items-center justify-center text-primary hover:text-primary-600 transition-colors">
            <HomeIcon className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">StuHouses</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-dark">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-neutral">
            Please login with your administrator credentials
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-neutral-200">
            <Formik
              initialValues={{
                email: '',
                password: ''
              }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {() => (
                <Form className="space-y-6">
                  <FormInput
                    name="email"
                    type="email"
                    label="Email address"
                    icon={EnvelopeIcon}
                    placeholder="admin@stuhouses.com"
                    required
                    autoComplete="email"
                  />

                  <FormInput
                    name="password"
                    type="password"
                    label="Password"
                    icon={LockClosedIcon}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />

                  <div>
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      isLoading={isLoading}
                    >
                      Sign in
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-dark">
                    Back to site
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <Link href="/" className="text-primary hover:text-primary-600 transition-colors">
                  Return to homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage; 