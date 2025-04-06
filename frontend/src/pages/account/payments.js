import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import AccountSidebar from '../../components/account/AccountSidebar';
import PaymentHistory from '../../components/payment/PaymentHistory';
import { useAuth } from '../../utils/authContext';
import Alert from '../../components/ui/Alert';

const PaymentsPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { success } = router.query;

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=/account/payments');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <Head>
        <title>Payment History | StuHouses</title>
        <meta
          name="description"
          content="View your payment history and transactions for student accommodation bookings"
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
              <AccountSidebar activeItem="payments" />
            </div>
            <div className="w-full md:w-3/4">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Payment History</h1>
                
                {success && (
                  <Alert
                    type="success"
                    message="Your payment was processed successfully!"
                    className="mb-6"
                  />
                )}
                
                <div className="mb-6">
                  <p className="text-grey-600">
                    View all your payment transactions for deposits, rent, and other fees.
                  </p>
                </div>
                
                <PaymentHistory />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default PaymentsPage; 