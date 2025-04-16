'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { bookingService } from '../../../services/bookingService';
import { userService } from '../../../services/userService';
import { STRIPE_CONFIG } from '@/config/stripe.config';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface BookingDetails {
  id: string;
  flightId: string;
  userId: string;
  status: string;
  passengers: number;
  totalAmount: number;
  bookingDate: string;
  flight: {
    airline: string;
    flightNumber: string;
    flightName: string;
    departureCity: string;
    arrivalCity: string;
    departureTime: string;
    arrivalTime: string;
    departureDate: string;
    arrivalDate: string;
  };
}

export default function BookingDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Use the correct API endpoint for fetching booking details
        const response = await fetch(`/bookings/bookings/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError('Failed to load booking details.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const handlePayment = async () => {
    try {
      setProcessing(true);
      const response = await bookingService.processPayment(id, {
        amount: booking?.totalAmount,
        bookingId: id
      });

      if (response?.sessionUrl) {
        // Store booking ID in sessionStorage for post-payment confirmation
        sessionStorage.setItem('pendingBookingId', id);
        // Redirect to Stripe checkout
        window.location.href = response.sessionUrl;
      } else {
        setError('Failed to initialize payment. Please try again.');
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }
    
    try {
      setProcessing(true);
      // Update booking status to cancelled and send email notification
      await fetch(`/bookings/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'cancelled',
          sendEmail: true,
          emailData: {
            bookingId: booking?.id,
            flightNumber: booking?.flight?.flightNumber,
            airline: booking?.flight?.airline,
            departureCity: booking?.flight?.departureCity,
            arrivalCity: booking?.flight?.arrivalCity,
            departureTime: booking?.flight?.departureTime,
            totalAmount: booking?.totalAmount
          }
        })
      });
      
      // Update the booking status in state without refreshing
      if (booking) {
        setBooking({
          ...booking,
          status: 'cancelled'
        });
      }
      
      toast.success('Booking cancelled successfully. A confirmation email has been sent.');
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
      console.error('Cancel error:', err);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const confirmPendingBooking = async () => {
      const pendingId = sessionStorage.getItem('pendingBookingId');
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment_status');

      if (pendingId && paymentStatus === 'succeeded') {
        try {
          // Use the correct API endpoint for confirmation
          await fetch(`/bookings/bookings/${pendingId}/confirm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          // Clear the pending booking ID
          sessionStorage.removeItem('pendingBookingId');
          
          // Refresh booking details
          const updatedBooking = await bookingService.getBookingDetails(id);
          setBooking(updatedBooking);
        } catch (error) {
          console.error('Error confirming booking:', error);
          setError('Failed to confirm booking. Please contact support.');
        }
      }
    };

    confirmPendingBooking();
  }, [id]);

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
          {/* <button
            onClick={() => router.push('/flights')}
            className="text-blue-600 hover:underline"
          >
            Back to Flights
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Booking Details</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Booked on: {formatDateTime(booking.bookingDate)}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.status.toUpperCase() === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                booking.status.toUpperCase() === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {booking.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Flight Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Airline</div>
                  <div className="font-medium">{booking.flight.airline}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Flight Number</div>
                  <div className="font-medium">{booking.flight.flightNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">From</div>
                  <div className="font-medium">{booking.flight.departureCity}</div>
                  <div className="text-sm text-gray-500">
                    {formatDateTime(booking.flight.departureTime)}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">To</div>
                  <div className="font-medium">{booking.flight.arrivalCity}</div>
                  <div className="text-sm text-gray-500">
                    {formatDateTime(booking.flight.arrivalTime)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Amount</div>
                  <div className="font-medium">${booking.totalAmount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Passengers</div>
                  <div className="font-medium">{booking.passengers}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <Link
                href="/bookings"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Back to Bookings
              </Link>
              {booking.status.toUpperCase() === 'CONFIRMED' && (
                <button
                  onClick={handleCancel}
                  disabled={processing}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {processing ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 