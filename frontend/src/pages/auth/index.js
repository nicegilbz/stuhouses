import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
    .min(8, 'Password must be at least 8 characters')
});

// Register validation schema
const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { redirect } = router.query;

  // Handle login form submission
  const handleLogin = async (values) => {
    try {
      await authServiceWithLoading.login(values.email, values.password, { setLoading });
      toast.success('Login successful');
      
      // Redirect to intended page or home
      router.push(redirect || '/');
    } catch (error) {
      // Toast error is handled by API utility
    }
  };

  // Handle register form submission
  const handleRegister = async (values) => {
    try {
      await authServiceWithLoading.register(values, { setLoading });
      toast.success('Registration successful');
      
      // Redirect to home page after registration
      router.push('/');
    } catch (error) {
      // Toast error is handled by API utility
    }
  };

  // Toggle between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  // Set loading state for buttons
  const setLoading = (loadingState) => {
    setIsLoading(loadingState);
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Login' : 'Register'} | StuHouses</title>
        <meta name="description" content={isLogin ? 'Log in to your StuHouses account' : 'Register for a StuHouses account'} />
      </Head>

      <div className="min-h-screen bg-neutral-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex items-center justify-center text-primary hover:text-primary-600 transition-colours">
            <HomeIcon className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">StuHouses</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-dark">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-neutral">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleAuthMode}
              className="font-medium text-primary hover:text-primary-600 transition-colours"
            >
              {isLogin ? 'Register here' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-neutral-200">
            {isLogin ? (
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            ) : (
              <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Login form component
const LoginForm = ({ onSubmit, isLoading }) => {
  return (
    <Formik
      initialValues={{
        email: '',
        password: ''
      }}
      validationSchema={loginSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form className="space-y-6">
          <FormInput
            name="email"
            type="email"
            label="Email address"
            icon={EnvelopeIcon}
            placeholder="your.email@example.com"
            required
            autoComplete="email"
          />

          <div>
            <FormInput
              name="password"
              type="password"
              label="Password"
              icon={LockClosedIcon}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <div className="mt-2 text-right">
              <Link 
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary-600 transition-colours"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

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
  );
};

// Register form component
const RegisterForm = ({ onSubmit, isLoading }) => {
  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={registerSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput
              name="firstName"
              label="First name"
              placeholder="John"
              required
              autoComplete="given-name"
            />

            <FormInput
              name="lastName"
              label="Last name"
              placeholder="Doe"
              required
              autoComplete="family-name"
            />
          </div>

          <FormInput
            name="email"
            type="email"
            label="Email address"
            icon={EnvelopeIcon}
            placeholder="your.email@example.com"
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
            helpText="Must be at least 8 characters with uppercase, lowercase, and number"
          />

          <FormInput
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="••••••••"
            required
          />

          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Create account
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Auth; 