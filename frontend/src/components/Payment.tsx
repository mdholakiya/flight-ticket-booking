import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentProps {
  amount: number;
  flightDetails: {
    flightNumber: string;
    departure: string;
    arrival: string;
    price: number;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const Payment: React.FC<PaymentProps> = ({ amount, flightDetails, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Create a payment session through your backend
      const response = await axios.post('/api/create-checkout-session', {
        amount,
        flightDetails,
      });

      const { sessionId } = response.data;

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        toast.error(result.error.message || 'Payment failed');
      }
    } catch (error) {
      toast.error('Payment processing failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-4">
          Flight Booking Payment
        </div>
        
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Flight Details</h2>
          <p className="text-gray-600">Flight Number: {flightDetails.flightNumber}</p>
          <p className="text-gray-600">From: {flightDetails.departure}</p>
          <p className="text-gray-600">To: {flightDetails.arrival}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Ticket Price:</span>
            <span className="text-gray-800 font-semibold">
              ${flightDetails.price.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Amount:</span>
            <span className="text-indigo-600">${amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold
              ${isProcessing ? 'opacity-75 cursor-not-allowed' : 'hover:bg-indigo-700'}
              transition duration-150 ease-in-out`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Proceed to Payment'
            )}
          </button>
          
          <button
            onClick={onCancel}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold
              hover:bg-gray-50 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Secure payment powered by Stripe</p>
          <div className="flex justify-center mt-2 space-x-2">
            <img src="/visa.svg" alt="Visa" className="h-6" />
            <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
            <img src="/amex.svg" alt="American Express" className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 