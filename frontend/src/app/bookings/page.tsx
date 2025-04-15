'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { bookingService } from '@/services/bookingService';
import { userService } from '@/services/userService';
import { toast } from 'react-hot-toast';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CurrencyDollarIcon,
  XCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Booking {
  id: string;
  flightId: string;
  flightName: string;
  userId: string;
  passengerName: string;
  passengerEmail: string;
  numberOfSeats: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  classType: 'Economy' | 'Business Class' | 'First Class';
  flightDetails: {
    flightNumber: string;
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userData = await userService.getCurrentUser();
      if (!userData?.id) {
        router.push('/login');
        return;
      }
      const userBookings = await bookingService.getUserBookings(userData.id);
      console.log(userBookings, "this is user bookings", typeof userBookings)
      setBookings(Array.isArray(userBookings) ? userBookings : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Handle payment success and redirect
  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment_status');
      const bookingId = urlParams.get('booking_id');

      if (paymentStatus === 'succeeded' && bookingId) {
        try {
          setLoading(true);
          await bookingService.confirmBooking(bookingId);
          setSuccessMessage('🎉 Payment successful! Your flight booking is confirmed. You can view all your booking details below.');
          await fetchBookings();
          // Scroll to the newly confirmed booking after a short delay
          setTimeout(() => {
            const bookingElement = document.getElementById(`booking-${bookingId}`);
            
            if (bookingElement) {
              bookingElement.scrollIntoView({ behavior: 'smooth' });
              bookingElement.classList.add('highlight-booking');
            }
          }, 500);
          // Clear URL parameters
          window.history.replaceState({}, '', '/bookings');
        } catch (error) {
          console.error('Error confirming booking:', error);
          setError('Error confirming booking. Please contact support.');
        } finally {
          setLoading(false);
        }
      }
    };

    handlePaymentSuccess();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        return;
      }

      setProcessingId(bookingId);
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      await fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Add styles at the top of the file after the imports
  const styles = `
    @keyframes highlightFade {
      0% { background-color: rgba(59, 130, 246, 0.1); }
      100% { background-color: white; }
    }
    .highlight-booking {
      animation: highlightFade 2s ease-out;
    }
  `;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
            {error}
          </div>
        </div>
      </div>
    );
  }
console.log(bookings, "this is bookings", typeof bookings)
  return (
    <div className="min-h-screen bg-gray-50 mt-10 py-8">
      <style>{styles}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 lg:px-8">
        <div className="flex justify-between items-center  mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <button
            onClick={() => router.push('/flights')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Book New Flight
          </button>
        </div>
        
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 rounded-lg p-4 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <div>
              <p className="font-medium">{successMessage}</p>
             
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 flex items-center">
            <XCircleIcon className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {!Array.isArray(bookings) || bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-4">
              <CalendarIcon className="h-12 w-12 mx-auto text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-4">You haven't made any flight bookings yet.</p>
            <button
              onClick={() => router.push('/flights')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Book Your First Flight
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                id={`booking-${booking.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-semibold text-gray-900">
                          Flight {booking.flightDetails.flightNumber}
                        </h2>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => {
                            const isConfirmed = window.confirm(
                              'Are you sure you want to cancel this flight booking?\n\nThis action cannot be undone and you may need to make a new booking if you wish to travel.'
                            );
                            if (isConfirmed) {
                              handleCancelBooking(booking.id);
                            }
                          }}
                          disabled={processingId === booking.id}
                          className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-red-600 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === booking.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent mr-2" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-4 w-4 mr-2" />
                              Cancel Booking
                            </>
                          )}
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-md">
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          <span>Booking Confirmed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-gray-700">
                        <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">From</p>
                          <p className="font-medium">{booking.flightDetails.departure}</p>
                          <p className="text-sm text-gray-500">{booking.flightDetails.departureTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">To</p>
                          <p className="font-medium">{booking.flightDetails.arrival}</p>
                          <p className="text-sm text-gray-500">{booking.flightDetails.arrivalTime}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-gray-700">
                        <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">Passenger</p>
                          <p className="font-medium">{booking.passengerName}</p>
                          <p className="text-sm text-gray-500">{booking.passengerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">Booking Details</p>
                          <p className="font-medium">{booking.classType}</p>
                          <p className="text-sm text-gray-500">{booking.numberOfSeats} Seat(s) • ${booking.totalPrice}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-500">Class:</span>{' '}
                          <span className="font-medium">{booking.classType}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Seats:</span>{' '}
                          <span className="font-medium">{booking.numberOfSeats}</span>
                        </p>
                      </div>
                      {booking.status === 'confirmed' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircleIcon className="h-5 w-5 mr-1" />
                          <span>Flight Confirmed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {booking.status === 'confirmed' && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          const isConfirmed = window.confirm(
                            `Are you sure you want to cancel this flight booking?\n\n` +
                            `Flight: ${booking.flightDetails.flightNumber}\n` +
                            `From: ${booking.flightDetails.departure}\n` +
                            `To: ${booking.flightDetails.arrival}\n` +
                            `Date: ${booking.flightDetails.departureTime}\n\n` +
                            `This action cannot be undone and you may need to make a new booking if you wish to travel.`
                          );
                          if (isConfirmed) {
                            handleCancelBooking(booking.id);
                          }
                        }}
                        className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        Cancel Flight
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 