import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    // Here you would typically make an API call to request a password reset
    console.log('Password reset requested for:', email);
    
    // For demo purposes, simulate success
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Forgot Password | StuHouses</title>
        <meta name="description" content="Reset your StuHouses account password" />
      </Head>
      
      <div className="bg-neutral-light py-16">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
            {!submitted ? (
              <>
                <h1 className="text-2xl font-bold text-neutral-dark mb-2">Forgot Your Password?</h1>
                <p className="mb-6 text-neutral">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-neutral-dark font-medium mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`input ${error ? 'input-error' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    {error && (
                      <p className="text-secondary-500 text-sm mt-1">{error}</p>
                    )}
                  </div>
                  
                  <button type="submit" className="button-primary w-full">
                    Reset Password
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <svg
                  className="h-16 w-16 text-primary mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-neutral-dark mb-2">Check Your Email</h2>
                <p className="mb-6 text-neutral">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Link href="/auth" className="text-primary hover:text-primary-700">
                ← Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 