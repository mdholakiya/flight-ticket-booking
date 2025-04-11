'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Flight } from '@/types/flight';
import { API_CONFIG } from '@/config/api.config';
import { flightService } from '@/services/flightService';
import { bookingService } from '@/services/bookingService';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ChevronRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface SeatSelection {
  seatNumber: string;
  price: number;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [bookingStep, setBookingStep] = useState<'seats' | 'details' | 'payment' | 'confirmation'>('seats');
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  useEffect(() => {
    fetchFlightDetails();
  }, []);

  const fetchFlightDetails = async () => {
    try {
      if (!params?.id) {
        setError('Flight ID not found');
        return;
      }

      setLoading(true);
      const flightData = await flightService.getFlightDetails(params.id as string);
      setFlight(flightData);
    } catch (error) {
      setError('Failed to load flight details. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelection = (seat: SeatSelection) => {
    setSelectedSeats([...selectedSeats, seat]);
  };

  const handleDetailsSubmit = () => {
    if (!passengerDetails.name || !passengerDetails.email || !passengerDetails.phone) {
      setError('Please fill in all passenger details');
      return;
    }
    setBookingStep('payment');
  };

  const handlePaymentSubmit = async () => {
    try {
      if (!flight || !params?.id) return;

      const bookingData = {
        flightId: params.id,
        seats: selectedSeats,
        passengerDetails,
        paymentDetails,
        totalAmount: selectedSeats.reduce((total, seat) => total + seat.price, 0)
      };

      const flightId = Array.isArray(params.id) ? params.id[0] : params.id;
      const response = await bookingService.createBooking(flightId, bookingData);
      setBookingStep('confirmation');
      setTimeout(() => {
        router.push('/bookings');
      }, 3000);
    } catch (error) {
      setError('Failed to process payment. Please try again.');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
            {error || 'Flight not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {['seats', 'details', 'payment', 'confirmation'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  bookingStep === step ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && <div className="h-1 w-16 bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Flight Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {flight.airline} - Flight {flight.flightNumber}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>From: {flight.departureAirport}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>To: {flight.arrivalAirport}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{new Date(flight.departureTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                <span>${flight.price} per seat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on current step */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {bookingStep === 'seats' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Select Your Seats</h3>
              <div className="grid grid-cols-6 gap-2 mb-6">
                {Array.from({ length: 30 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSeatSelection({ seatNumber: `${i + 1}`, price: flight.price })}
                    disabled={selectedSeats.some(seat => seat.seatNumber === `${i + 1}`)}
                    className={`p-2 rounded ${
                      selectedSeats.some(seat => seat.seatNumber === `${i + 1}`)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setBookingStep('details')}
                disabled={selectedSeats.length === 0}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Continue to Passenger Details
              </button>
            </div>
          )}

          {bookingStep === 'details' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Passenger Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={passengerDetails.name}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={passengerDetails.email}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={passengerDetails.phone}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={handleDetailsSubmit}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {bookingStep === 'payment' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                  <input
                    type="text"
                    value={paymentDetails.nameOnCard}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, nameOnCard: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span>Selected Seats:</span>
                    <span>{selectedSeats.map(seat => seat.seatNumber).join(', ')}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Amount:</span>
                    <span>${selectedSeats.reduce((total, seat) => total + seat.price, 0)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePaymentSubmit}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Pay and Confirm Booking
                </button>
              </div>
            </div>
          )}

          {bookingStep === 'confirmation' && (
            <div className="text-center py-8">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600">
                Your booking has been confirmed. You will be redirected to your bookings page shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 