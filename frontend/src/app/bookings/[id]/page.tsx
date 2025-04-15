'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { bookingService } from '../../../services/bookingService';
import { userService } from '../../../services/userService';
import { STRIPE_CONFIG } from '@/config/stripe.config';

interface BookingDetails {
  id: string;
  flightId: string;
  userId: string;
  status: string;
  passengers: number;
  totalAmount: number;
  flight: {
    airline: string;
    flightNumber: string;
    flightName: string;
    departureCity: string;
    arrivalCity: string;
    departureTime: string;
    arrivalTime: string;
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
        const data = await bookingService.getBookingDetails(id);
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
      await bookingService.processPayment(id, {
        amount: booking?.totalAmount,
      });
      // await bookingService.confirmBooking(id);
      // Refresh booking details
      const updatedBooking = await bookingService.getBookingDetails(id);
      setBooking(updatedBooking);
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      setProcessing(true);
      await bookingService.cancelBooking(id);
      router.push('/flights');
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
      console.error('Cancel error:', err);
    } finally {
      setProcessing(false);
    }
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
    <main className="min-h-screen bg-gray-50  py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center  mb-6">
            <h1 className="text-3xl font-bold">Booking Details</h1>
            <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-800">
              {booking.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Flight Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Airline:</span>{' '}
                  {booking?.flight?.airline || 'Loading...'}
                </p>
                <p>
                  <span className="font-medium">Flight Name:</span>{' '}
                  {booking?.flight?.flightName || 'Loading...'}
                </p>
                <p>
                  <span className="font-medium">Flight Number:</span>{' '}
                  {booking?.flight?.flightNumber || 'Loading...'}
                </p>
                <p>
                  <span className="font-medium">From:</span>{' '}
                  {booking?.flight?.departureCity || 'Loading...'}
                </p>
                <p>
                  <span className="font-medium">To:</span>{' '}
                  {booking?.flight?.arrivalCity || 'Loading...'}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Schedule</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Departure:</span>{' '}
                  {booking?.flight?.departureTime || 'Loading...'}
                </p>
                <p>
                  <span className="font-medium">Arrival:</span>{' '}
                  {booking?.flight?.arrivalTime || 'Loading...'}
                </p>
                <p>
                  <span className="font-medium">Passengers:</span>{' '}
                  {booking?.passengers || 0}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ${(booking?.totalAmount || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center">
              {booking.status === 'PENDING' && (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={processing}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Cancel Booking
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : 'Process Payment'}
                  </button>
                </>
              )}
              {booking.status === 'CONFIRMED' && (
                <div className="w-full text-center">
                  <p className="text-green-600 font-medium mb-4">
                    Your booking is confirmed! Have a great flight!
                  </p>
                  <button
                    onClick={() => router.push('/flights')}
                    className="text-blue-600 hover:underline"
                  >
                    Book Another Flight
                  </button>
                </div>
              )}
              {booking.status === 'CANCELLED' && (
                <div className="w-full text-center">
                  <p className="text-gray-600 mb-4">This booking was cancelled.</p>
                  <button
                    onClick={() => router.push('/flights')}
                    className="text-blue-600 hover:underline"
                  >
                    Book Another Flight
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 