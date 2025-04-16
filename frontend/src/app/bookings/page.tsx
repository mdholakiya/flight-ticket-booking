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
import Link from 'next/link';

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

  const loadBookings = async () => {
    try {
      setLoading(true);
      const userData = await userService.getCurrentUser();
      
      if (!userData?.id) {
        router.push('/login');
        return;
      }
      
      const userBookings = await bookingService.getUserBookings(userData.id);
      // Filter to show only confirmed and cancelled bookings
      const filteredBookings = Array.isArray(userBookings) ? 
        userBookings.filter(booking => 
          booking.userId === userData.id && 
          booking.status.toUpperCase() === 'CONFIRMED'
        ) : [];

      setBookings(filteredBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('Failed to load bookings');
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment_status');
      const bookingId = sessionStorage.getItem('pendingBookingId');

      if (paymentStatus === 'succeeded' && bookingId) {
        try {
          setLoading(true);
          // Use the correct API endpoint for confirmation
          await fetch(`/bookings/bookings/${bookingId}/confirm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          setSuccessMessage('🎉 Payment successful! Your flight booking is confirmed. You can view all your booking details below.');
          
          // Clear the pending booking ID
          sessionStorage.removeItem('pendingBookingId');
          
          // Reload bookings with retry mechanism
          await loadBookings();
          
          // Clear URL parameters
          window.history.replaceState({}, '', '/bookings');
          
          // Scroll to the new booking after a short delay
          setTimeout(() => {
            const bookingElement = document.getElementById(`booking-${bookingId}`);
            if (bookingElement) {
              bookingElement.scrollIntoView({ behavior: 'smooth' });
              bookingElement.classList.add('highlight-booking');
            }
          }, 500);
        } catch (error) {
          console.error('Error confirming booking:', error);
          setError('Error confirming booking. Please contact support.');
        } finally {
          setLoading(false);
        }
      } else {
        // If no payment success parameters, just load bookings normally
        await loadBookings();
      }
    };

    handlePaymentSuccess();
  }, []);

  const handleCancelBooking = async (Id: string) => {
    try {
      if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        return;
      }

      setProcessingId(Id);
      // Update booking status to cancelled
      await fetch(`/bookings/bookings/${Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'cancelled'
        })
      });
      
    
      
      

      
      // Update the status in state without refreshing
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === Id 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No bookings found.</p>
            <Link href="/flights" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
              Book a flight
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                  {/* Flight Info */}
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-gray-900">
                      {booking.flightDetails?.flightNumber || booking.flightName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Flight {booking.flightDetails?.flightNumber || booking.flightName}
                    </div>
                    <div className={`text-sm ${
                      booking.status.toUpperCase() === 'CONFIRMED' ? 'text-green-600' : 
                      booking.status.toUpperCase() === 'CANCELLED' ? 'text-red-600' : 
                      'text-blue-600'
                    } font-medium`}>
                      {booking.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Departure */}
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">From</div>
                    <div className="font-medium">{booking.flightDetails?.departure || 'N/A'}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(booking.flightDetails?.departureTime || '').toLocaleString()}
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">To</div>
                    <div className="font-medium">{booking.flightDetails?.arrival || 'N/A'}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(booking.flightDetails?.arrivalTime || '').toLocaleString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Total Amount</div>
                      <div className="font-semibold text-gray-900">
                        ${booking.totalPrice}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.numberOfSeats} passenger(s)
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-2">
                     
                      {booking.status.toUpperCase() === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={processingId === booking.id}
                          className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 