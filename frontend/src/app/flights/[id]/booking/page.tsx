'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Flight } from '@/types/flight';
import { API_CONFIG } from '@/config/api.config';
import { flightService } from '@/services/flightService';
import { bookingService } from '@/services/bookingService';
import { userService } from '@/services/userService';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import Payment from '@/components/Payment';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface SeatSelection {
  seatNumber: string;
  price: number;
  class: 'Economy' | 'Business' | 'First';
}

interface UserData {
  id: string;
  email: string;
  name?: string;
}

const SEAT_CONFIG = {
  First: {
    rows: 2,
    seatsPerRow: 4,
    priceMultiplier: 3,
    color: 'bg-purple-600'
  },
  Business: {
    rows: 3,
    seatsPerRow: 6,
    priceMultiplier: 2,
    color: 'bg-indigo-600'
  },
  Economy: {
    rows: 5,
    seatsPerRow: 6,
    priceMultiplier: 1,
    color: 'bg-blue-600'
  }
};

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [selectedClass, setSelectedClass] = useState<'Economy' | 'Business' | 'First'>('Economy');
  const [bookingStep, setBookingStep] = useState<'seats' | 'details' | 'payment' | 'confirmation'>('seats');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
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
  const [validationErrors, setValidationErrors] = useState<{
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    nameOnCard?: string;
    email?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    fetchFlightDetails();
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const user = await userService.getCurrentUser();
      setIsAuthenticated(!!user);
      if (user) {
        // Pre-fill passenger details if user is authenticated
        setPassengerDetails({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        });
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    }
  };

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
    const isSeatSelected = selectedSeats.some(s => s.seatNumber === seat.seatNumber);
    
    if (isSeatSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.seatNumber !== seat.seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatPrice = (seatClass: 'Economy' | 'Business' | 'First') => {
    if (!flight) return 0;
    return flight.price * SEAT_CONFIG[seatClass].priceMultiplier;
  };

  const renderSeats = (seatClass: 'Economy' | 'Business' | 'First') => {
    const config = SEAT_CONFIG[seatClass];
    const startSeatNumber = 
      seatClass === 'First' ? 1 : 
      seatClass === 'Business' ? SEAT_CONFIG.First.rows * SEAT_CONFIG.First.seatsPerRow + 1 :
      (SEAT_CONFIG.First.rows * SEAT_CONFIG.First.seatsPerRow) + 
      (SEAT_CONFIG.Business.rows * SEAT_CONFIG.Business.seatsPerRow) + 1;

    return (
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-2">{seatClass} Class</h4>
        <p className="text-sm text-gray-600 mb-3">
          Price per seat: ${getSeatPrice(seatClass)}
        </p>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {Array.from({ length: config.rows * config.seatsPerRow }, (_, i) => {
            const seatNumber = (startSeatNumber + i).toString();
            const isSelected = selectedSeats.some(seat => seat.seatNumber === seatNumber);
            
            return (
              <button
                key={seatNumber}
                onClick={() => handleSeatSelection({
                  seatNumber,
                  price: getSeatPrice(seatClass),
                  class: seatClass
                })}
                disabled={!isSelected && selectedClass !== seatClass}
                className={`p-2 rounded ${
                  isSelected
                    ? config.color + ' text-white'
                    : selectedClass === seatClass
                    ? 'bg-gray-100 hover:bg-gray-200'
                    : 'bg-gray-100 opacity-50 cursor-not-allowed'
                }`}
              >
                {seatNumber}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleDetailsSubmit = async () => {
    if (!passengerDetails.name || !passengerDetails.email || !passengerDetails.phone) {
      setError('Please fill in all passenger details');
      return;
    }

    try {
      // Check if user exists and get user data
      let userData: UserData | null = null;
      try {
        const user = await userService.getCurrentUser();
        userData = user;
      } catch (error) {
        console.error('Error checking user:', error);
        setShowAuthModal(true);
        return;
      }

      if (!userData || !userData.id) {
        setShowAuthModal(true);
        return;
      }

      if (!isAuthenticated) {
        setShowAuthModal(true);
        return;
      }

      // Calculate total amount and prepare booking data
      const totalAmount = selectedSeats.reduce((total, seat) => total + seat.price, 0);
      
      // Create booking data object
      const bookingData = {
        userId: userData.id,
        passengerName: passengerDetails.name,
        passengerEmail: passengerDetails.email,
        numberOfSeats: selectedSeats.length,
        totalPrice: totalAmount,
        flightDetails: {
          flightNumber: flight?.flightNumber,
          departure: flight?.departureAirport,
          arrival: flight?.arrivalAirport,
          departureTime: flight?.departureTime,
          arrivalTime: flight?.arrivalTime
        },
        seats: selectedSeats,
        status: 'pending', // Set initial status as pending
        bookingDate: new Date().toISOString()
      };

      // Create booking record using booking service
      const response = await bookingService.createBooking(params?.id as string, bookingData);
      console.log('Booking Response:', response);

      if (response && response.id) {
        // Store booking ID for reference
        localStorage.setItem('currentBookingId', response.id);
        
        // Show success message
        toast.success('Booking created successfully!');
        
        // Proceed to payment step
        setBookingStep('payment');
        router.push('/bookings');
      } else {
        console.error('Invalid booking response:', response);
        throw new Error('Failed to create booking');
      }

    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
      setError('Failed to create booking. Please try again.');
    }
  };

  const handleBookingSuccess = async () => {
    try {
      const bookingId = localStorage.getItem('currentBookingId');
      if (bookingId) {
        // Update booking status to confirmed
        await bookingService.confirmBooking(bookingId);
        
        // Clear booking ID from storage
        localStorage.removeItem('currentBookingId');
      }
      
      setBookingStep('confirmation');
      setTimeout(() => {
        router.push('/bookings');
      }, 3000);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleBookingCancel = async () => {
    try {
      const bookingId = localStorage.getItem('currentBookingId');
      if (bookingId) {
        // Cancel the booking
        await bookingService.cancelBooking(bookingId);
        
        // Clear booking ID from storage
        localStorage.removeItem('currentBookingId');
      }
      
      setBookingStep('details');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  // Add validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const validatePaymentDetails = () => {
    const errors: {
      cardNumber?: string;
      expiryDate?: string;
      cvv?: string;
      nameOnCard?: string;
      email?: string;
      phone?: string;
    } = {};

    // Card Number validation (16 digits)
    if (!paymentDetails.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    // Expiry Date validation (MM/YY format)
    if (!paymentDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }

    // CVV validation (3 or 4 digits)
    if (!paymentDetails.cvv.match(/^\d{3,4}$/)) {
      errors.cvv = 'Please enter a valid CVV (3 or 4 digits)';
    }

    // Name validation
    if (!paymentDetails.nameOnCard.trim()) {
      errors.nameOnCard = 'Name on card is required';
    }

    // Email validation
    if (!validateEmail(passengerDetails.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (10 digits)
    if (!validatePhone(passengerDetails.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentSubmit = async () => {
    if (!isAuthenticated) {
      handleAuthRedirect('login');
      return;
    }

    // Validate all fields before proceeding
    if (!validatePaymentDetails()) {
      return;
    }

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

  const handleAuthRedirect = (type: 'login' | 'register') => {
    if (!params?.id) return;

    // Save booking state to localStorage
    const bookingState = {
      flightId: Array.isArray(params.id) ? params.id[0] : params.id,
      selectedSeats,
      selectedClass,
      passengerDetails
    };
    localStorage.setItem('pendingBooking', JSON.stringify(bookingState));
    
    // Redirect to login page with return URL
    const flightId = Array.isArray(params.id) ? params.id[0] : params.id;
    router.push(`/login`);
   
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
              
              {/* Class Selection */}
              <div className="flex space-x-4 mb-6">
                {(['Economy', 'Business', 'First'] as const).map((travelClass) => (
                  <button
                    key={travelClass}
                    onClick={() => {
                      setSelectedClass(travelClass);
                      setSelectedSeats([]);
                    }}
                    className={`px-4 py-2 rounded-md ${
                      selectedClass === travelClass
                        ? SEAT_CONFIG[travelClass].color + ' text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {travelClass}
                  </button>
                ))}
              </div>

              {/* Seat Grid */}
              <div className="space-y-6">
                {renderSeats('First')}
                {renderSeats('Business')}
                {renderSeats('Economy')}
              </div>

              {/* Selected Seats Summary */}
              {selectedSeats.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h4 className="font-semibold mb-2">Selected Seats:</h4>
                  <div className="space-y-2">
                    {selectedSeats.map(seat => (
                      <div key={seat.seatNumber} className="flex justify-between text-sm">
                        <span>Seat {seat.seatNumber} ({seat.class})</span>
                        <span>${seat.price}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                      <span>Total:</span>
                      <span>${selectedSeats.reduce((total, seat) => total + seat.price, 0)}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setBookingStep('details')}
                disabled={selectedSeats.length === 0}
                className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
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
                  Continue to booking
                </button>
              </div>
            </div>
          )}

          {bookingStep === 'payment' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
              <Payment
                amount={selectedSeats.reduce((total, seat) => total + seat.price, 0)}
                flightDetails={{
                  flightNumber: flight?.flightNumber || '',
                  departure: flight?.departureAirport || '',
                  arrival: flight?.arrivalAirport || '',
                  price: selectedSeats.reduce((total, seat) => total + seat.price, 0)
                }}
                onSuccess={handleBookingSuccess}
                onCancel={handleBookingCancel}
              />
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