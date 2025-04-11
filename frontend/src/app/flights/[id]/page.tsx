'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_CONFIG } from '@/config/api.config';
import {
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  CreditCardIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  duration?: string;
}

interface PassengerInfo {
  name: string;
  email: string;
  phone: string;
  type: 'adult' | 'child';
}

export default function FlightBookingPage() {
  const params = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    { name: '', email: '', phone: '', type: 'adult' }
  ]);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  useEffect(() => {
    if (params?.id) {
      fetchFlightDetails();
    }
  }, [params?.id]);

  const fetchFlightDetails = async () => {
    if (!params?.id) {
      setError('Flight ID not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${API_CONFIG.ENDPOINTS.FLIGHT_DETAILS(params.id as string)}`
      );
      if (!response.ok) throw new Error('Failed to fetch flight details');
      const data = await response.json();
      setFlight(data.data);
    } catch (error) {
      setError('Failed to load flight details. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPassenger = () => {
    if (passengers.length < flight?.availableSeats!) {
      setPassengers([...passengers, { name: '', email: '', phone: '', type: 'adult' }]);
    }
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const handlePaymentChange = (field: keyof typeof paymentDetails, value: string) => {
    setPaymentDetails({ ...paymentDetails, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_CONFIG.ENDPOINTS.BOOKINGS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightId: flight?.id,
          passengers,
          paymentDetails
        }),
      });

      if (!response.ok) throw new Error('Failed to create booking');

      const data = await response.json();
      setBookingStep('confirmation');
      // Redirect to booking confirmation page after a delay
      setTimeout(() => {
        router.push(`/bookings/${data.bookingId}`);
      }, 3000);
    } catch (error) {
      setError('Failed to create booking. Please try again.');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
            {error || 'Flight not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flight Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {flight.airline} - Flight {flight.flightNumber}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{new Date(flight.departureTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>
                  {new Date(flight.departureTime).toLocaleTimeString()} -{' '}
                  {new Date(flight.arrivalTime).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                <span>${flight.price.toLocaleString()} per person</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-gray-700">
                <span className="font-medium">From:</span> {flight.departureCity}
              </div>
              <div className="text-gray-700">
                <span className="font-medium">To:</span> {flight.arrivalCity}
              </div>
              <div className="text-gray-700">
                <span className="font-medium">Available Seats:</span>{' '}
                {flight.availableSeats}
              </div>
            </div>
          </div>
        </div>

        {bookingStep === 'details' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Passenger Details
            </h3>
            {passengers.map((passenger, index) => (
              <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-0">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Passenger {index + 1}
                  </h4>
                  {passengers.length > 1 && (
                    <button
                      onClick={() => handleRemovePassenger(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={passenger.email}
                      onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={passenger.phone}
                      onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={passenger.type}
                      onChange={(e) => handlePassengerChange(index, 'type', e.target.value as 'adult' | 'child')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="adult">Adult</option>
                      <option value="child">Child</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            
            {passengers.length < flight.availableSeats && (
              <button
                onClick={handleAddPassenger}
                className="flex items-center text-blue-600 hover:text-blue-700 mt-4"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Add Another Passenger
              </button>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setBookingStep('payment')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {bookingStep === 'payment' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Payment Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.expiryDate}
                    onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.cvv}
                    onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  value={paymentDetails.nameOnCard}
                  onChange={(e) => handlePaymentChange('nameOnCard', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Total Amount
                </h4>
                <p className="text-2xl font-bold text-blue-600">
                  ${(flight.price * passengers.length).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {passengers.length} passenger{passengers.length > 1 ? 's' : ''} ×{' '}
                  ${flight.price.toLocaleString()}
                </p>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setBookingStep('details')}
                  className="px-6 py-2 text-gray-700 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {bookingStep === 'confirmation' && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-gray-600">
              Your booking has been confirmed. You will be redirected to your booking details shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 