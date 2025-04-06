import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../utils/authContext';
import PaymentForm from '../../components/payment/PaymentForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const BookingSchema = Yup.object().shape({
  startDate: Yup.date()
    .required('Start date is required')
    .min(new Date(), 'Start date cannot be in the past'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  numberOfTenants: Yup.number()
    .required('Number of tenants is required')
    .min(1, 'At least one tenant is required'),
  specialRequests: Yup.string()
});

const BookingPage = () => {
  const router = useRouter();
  const { propertyId } = router.query;
  const { isAuthenticated, loading, token } = useAuth();
  const [property, setProperty] = useState(null);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState('');
  const [step, setStep] = useState(1); // 1: Form, 2: Payment
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push(`/auth/login?redirect=/properties/book?propertyId=${propertyId}`);
    }
  }, [isAuthenticated, loading, propertyId, router]);

  useEffect(() => {
    // Fetch property details
    const fetchProperty = async () => {
      if (!propertyId) return;

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`
        );
        setProperty(data.data);
        setPropertyLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setPropertyError('Failed to load property details.');
        setPropertyLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const handleSubmitBookingForm = async (values, { setSubmitting, setErrors }) => {
    try {
      // Calculate deposit amount (usually 1 month's rent)
      const depositAmount = property.rent;

      // Prepare booking data
      const bookingPayload = {
        propertyId: Number(propertyId),
        startDate: values.startDate,
        endDate: values.endDate,
        numberOfTenants: values.numberOfTenants,
        depositAmount,
        rentAmount: property.rent,
        specialRequests: values.specialRequests || '',
      };

      setBookingData(bookingPayload);
      setStep(2); // Move to payment step
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors({ submit: 'Failed to create booking. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !isAuthenticated || propertyLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (propertyError || !property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            <p>{propertyError || 'Property not found.'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Book {property.title} | StuHouses</title>
        <meta
          name="description"
          content={`Book ${property.title} student accommodation in ${property.city_name}`}
        />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Book Accommodation</h1>
              <div className="mb-6">
                <h2 className="text-xl font-semibold">{property.title}</h2>
                <p className="text-grey-600">{property.address}, {property.city_name}</p>
                <p className="text-blue-600 font-semibold mt-2">£{property.rent} per month</p>
              </div>

              {step === 1 ? (
                <div>
                  <Formik
                    initialValues={{
                      startDate: '',
                      endDate: '',
                      numberOfTenants: 1,
                      specialRequests: '',
                    }}
                    validationSchema={BookingSchema}
                    onSubmit={handleSubmitBookingForm}
                  >
                    {({ isSubmitting, errors }) => (
                      <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="startDate" className="block text-grey-700 mb-2">
                              Start Date
                            </label>
                            <Field
                              id="startDate"
                              name="startDate"
                              type="date"
                              className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage
                              name="startDate"
                              component="div"
                              className="text-red-500 mt-1 text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="endDate" className="block text-grey-700 mb-2">
                              End Date
                            </label>
                            <Field
                              id="endDate"
                              name="endDate"
                              type="date"
                              className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage
                              name="endDate"
                              component="div"
                              className="text-red-500 mt-1 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="numberOfTenants" className="block text-grey-700 mb-2">
                            Number of Tenants
                          </label>
                          <Field
                            id="numberOfTenants"
                            name="numberOfTenants"
                            type="number"
                            min="1"
                            max={property.max_tenants || 10}
                            className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="numberOfTenants"
                            component="div"
                            className="text-red-500 mt-1 text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="specialRequests" className="block text-grey-700 mb-2">
                            Special Requests (Optional)
                          </label>
                          <Field
                            as="textarea"
                            id="specialRequests"
                            name="specialRequests"
                            rows="3"
                            className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="specialRequests"
                            component="div"
                            className="text-red-500 mt-1 text-sm"
                          />
                        </div>

                        {errors.submit && (
                          <div className="bg-red-50 text-red-600 p-3 rounded-md">
                            {errors.submit}
                          </div>
                        )}

                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 text-white font-medium rounded-md ${
                              isSubmitting
                                ? 'bg-grey-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              ) : (
                <div>
                  <div className="mb-6 bg-grey-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-grey-600">Start Date</p>
                        <p className="font-medium">{new Date(bookingData.startDate).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div>
                        <p className="text-grey-600">End Date</p>
                        <p className="font-medium">{new Date(bookingData.endDate).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div>
                        <p className="text-grey-600">Number of Tenants</p>
                        <p className="font-medium">{bookingData.numberOfTenants}</p>
                      </div>
                      <div>
                        <p className="text-grey-600">Security Deposit</p>
                        <p className="font-medium">£{bookingData.depositAmount}</p>
                      </div>
                    </div>
                    {bookingData.specialRequests && (
                      <div className="mt-4">
                        <p className="text-grey-600">Special Requests</p>
                        <p className="font-medium">{bookingData.specialRequests}</p>
                      </div>
                    )}
                  </div>

                  <PaymentForm
                    amount={bookingData.depositAmount}
                    propertyId={Number(propertyId)}
                    propertyTitle={property.title}
                    paymentType="deposit"
                  />

                  <div className="mt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ← Back to booking details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default BookingPage; 