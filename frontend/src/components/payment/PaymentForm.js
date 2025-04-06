import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/authContext';
import LoadingSpinner from '../ui/LoadingSpinner';

// Load Stripe outside of component to avoid recreating the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, propertyId, propertyTitle, paymentType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    // Create a payment intent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/create-payment-intent`,
          {
            amount,
            propertyId,
            paymentType
          },
          {
            headers: {
              Authorisation: `Bearer ${token}`
            }
          }
        );
        
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setError('Failed to initialize payment. Please try again later.');
      }
    };

    if (amount && propertyId && paymentType) {
      createPaymentIntent();
    }
  }, [amount, propertyId, paymentType, token]);

  const handleChange = async (event) => {
    // Listen for changes in the CardElement and display any errors
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Confirm payment with Stripe
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: ev.target.name.value
        }
      }
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);

      // Redirect based on payment type
      setTimeout(() => {
        if (paymentType === 'deposit') {
          router.push(`/account/bookings?success=true&property=${propertyId}`);
        } else {
          router.push('/account/payments?success=true');
        }
      }, 2000);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="max-w-md mx-auto mt-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
        <p className="text-grey-600 mb-4">Property: {propertyTitle}</p>
        <p className="text-grey-600 mb-4">Amount: £{amount.toFixed(2)}</p>
        <p className="text-grey-600 mb-4">Payment Type: {paymentType === 'deposit' ? 'Security Deposit' : 'Rent Payment'}</p>
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block text-grey-700 mb-2">
          Name on Card
        </label>
        <input
          id="name"
          type="text"
          required
          className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="card-element" className="block text-grey-700 mb-2">
          Credit or Debit Card
        </label>
        <div className="p-3 border border-grey-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  colour: '#32325d',
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSmoothing: 'antialiased',
                  fontSize: '16px',
                  '::placeholder': {
                    colour: '#aab7c4'
                  }
                },
                invalid: {
                  colour: '#fa755a',
                  iconColour: '#fa755a'
                }
              }
            }}
            onChange={handleChange}
          />
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      <button
        type="submit"
        disabled={processing || disabled || succeeded || !stripe}
        className={`w-full py-2 px-4 text-white font-medium rounded-md ${
          processing || disabled || succeeded || !stripe
            ? 'bg-grey-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <LoadingSpinner size="sm" />
            <span className="ml-2">Processing...</span>
          </span>
        ) : succeeded ? (
          'Payment Successful!'
        ) : (
          `Pay £${amount.toFixed(2)}`
        )}
      </button>

      {succeeded && (
        <div className="mt-4 text-center text-green-600">
          <p>Payment successful! Redirecting you...</p>
        </div>
      )}
    </form>
  );
};

const PaymentForm = ({ amount, propertyId, propertyTitle, paymentType }) => {
  return (
    <div className="py-8">
      <Elements stripe={stripePromise}>
        <CheckoutForm
          amount={amount}
          propertyId={propertyId}
          propertyTitle={propertyTitle}
          paymentType={paymentType}
        />
      </Elements>
    </div>
  );
};

export default PaymentForm; 