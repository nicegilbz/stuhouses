import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// This file exists to handle /auth/login routes
// It simply redirects to the main auth page with login mode active
const LoginPage = () => {
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    // Redirect to main auth page but preserve the redirect query parameter if it exists
    const redirectPath = redirect ? `/auth?redirect=${encodeURIComponent(redirect)}` : '/auth';
    router.replace(redirectPath);
  }, [router, redirect]);

  return (
    <>
      <Head>
        <title>Login | StuHouses</title>
        <meta name="description" content="Log in to your StuHouses account" />
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-dark">Redirecting to login page...</p>
        </div>
      </div>
    </>
  );
};

export default LoginPage; 