import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/authContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatDate } from '../../utils/dateUtils';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/history`,
          {
            headers: {
              Authorisation: `Bearer ${token}`
            }
          }
        );
        
        setPayments(data.data.payments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment history:', error);
        setError('Failed to load payment history. Please try again later.');
        setLoading(false);
      }
    };

    if (token) {
      fetchPaymentHistory();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md my-4">
        <p>{error}</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-blue-50 text-blue-600 p-4 rounded-md my-4">
        <p>You have no payment history yet.</p>
      </div>
    );
  }

  // Helper function to determine status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      case 'partially_refunded':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-grey-100 text-grey-800';
    }
  };

  // Helper function to format payment type
  const formatPaymentType = (type) => {
    switch (type) {
      case 'deposit':
        return 'Security Deposit';
      case 'rent':
        return 'Rent Payment';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-grey-200 rounded-lg">
        <thead className="bg-grey-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
              Property
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-grey-200">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-grey-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-700">
                {formatDate(payment.created_at, 'MMM D, YYYY')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-700">
                {payment.property_title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-700">
                {formatPaymentType(payment.payment_type)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-700">
                £{parseFloat(payment.amount).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                    payment.status
                  )}`}
                >
                  {payment.status.replace('_', ' ').toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory; 