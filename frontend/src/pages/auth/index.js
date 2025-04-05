import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Auth() {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!loginData.email) newErrors.loginEmail = 'Email is required';
    if (!loginData.password) newErrors.loginPassword = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Here you would typically make an API call to authenticate the user
    console.log('Login submitted:', loginData);
    
    // For demo purposes, simulate successful login and redirect
    router.push('/');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!registerData.firstName) newErrors.firstName = 'First name is required';
    if (!registerData.lastName) newErrors.lastName = 'Last name is required';
    if (!registerData.email) newErrors.email = 'Email is required';
    if (!registerData.password) newErrors.password = 'Password is required';
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Here you would typically make an API call to register the user
    console.log('Registration submitted:', registerData);
    
    // For demo purposes, simulate successful registration and redirect
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Login or Register | StuHouses</title>
        <meta name="description" content="Login or create a new account to access your StuHouses student accommodation profile." />
      </Head>
      
      <div className="bg-neutral-light py-16">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'login'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral hover:text-primary'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'register'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral hover:text-primary'
                }`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>
            
            {/* Login Form */}
            {activeTab === 'login' && (
              <div className="p-8">
                <h1 className="text-2xl font-bold text-neutral-dark mb-6">Welcome Back</h1>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-neutral-dark font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className={`input ${errors.loginEmail ? 'input-error' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    {errors.loginEmail && (
                      <p className="text-secondary-500 text-sm mt-1">{errors.loginEmail}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-neutral-dark font-medium mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className={`input ${errors.loginPassword ? 'input-error' : ''}`}
                      placeholder="••••••••"
                    />
                    {errors.loginPassword && (
                      <p className="text-secondary-500 text-sm mt-1">{errors.loginPassword}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral">
                        Remember me
                      </label>
                    </div>
                    
                    <div className="text-sm">
                      <Link href="/auth/forgot-password" className="text-primary hover:text-primary-700">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                  
                  <button type="submit" className="button-primary w-full">
                    Sign In
                  </button>
                </form>
              </div>
            )}
            
            {/* Register Form */}
            {activeTab === 'register' && (
              <div className="p-8">
                <h1 className="text-2xl font-bold text-neutral-dark mb-6">Create An Account</h1>
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-neutral-dark font-medium mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={registerData.firstName}
                        onChange={handleRegisterChange}
                        className={`input ${errors.firstName ? 'input-error' : ''}`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-secondary-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-neutral-dark font-medium mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={registerData.lastName}
                        onChange={handleRegisterChange}
                        className={`input ${errors.lastName ? 'input-error' : ''}`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-secondary-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="register-email" className="block text-neutral-dark font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="register-email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className={`input ${errors.email ? 'input-error' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-secondary-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="register-password" className="block text-neutral-dark font-medium mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="register-password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className={`input ${errors.password ? 'input-error' : ''}`}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="text-secondary-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-neutral-dark font-medium mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <p className="text-secondary-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-neutral">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary hover:text-primary-700">
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy-policy" className="text-primary hover:text-primary-700">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  
                  <button type="submit" className="button-primary w-full">
                    Create Account
                  </button>
                </form>
              </div>
            )}
            
            <div className="px-8 py-4 bg-neutral-light text-center">
              <p className="text-sm text-neutral">
                {activeTab === 'login'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <button
                  onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                  className="text-primary hover:text-primary-700 font-medium"
                >
                  {activeTab === 'login' ? 'Sign up now' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 