'use client';

import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api.config';

import {
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  XCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import {bookingService} from '@/services/bookingService';

interface Booking {
  id: string;
  flightNumber: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  passengers: {
    name: string;
    type: 'adult' | 'child';
  }[];
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings('current');
      setBookings(response.data || []);
    } catch (error) {
      setError('Failed to load bookings. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await bookingService.cancelBooking(bookingId);
      
      if (!response.ok) throw new Error('Failed to cancel booking');
      
      // Refresh bookings list
      fetchBookings();
    } catch (error) {
      setError('Failed to cancel booking. Please try again later.');
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.departureTime);
    const now = new Date();
    return activeTab === 'upcoming' ? bookingDate > now : bookingDate <= now;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">
                No {activeTab} bookings found.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.airline} - Flight {booking.flightNumber}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Booking ID: {booking.id}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700">
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        <span>
                          {new Date(booking.departureTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <ClockIcon className="h-5 w-5 mr-2" />
                        <span>
                          {new Date(booking.departureTime).toLocaleTimeString()} -{' '}
                          {new Date(booking.arrivalTime).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                        <span>${booking.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Passengers:</h4>
                      <ul className="space-y-1">
                        {booking.passengers.map((passenger, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 flex items-center"
                          >
                            {passenger.name}{' '}
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                              {passenger.type}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {booking.status !== 'cancelled' && activeTab === 'upcoming' && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                      >
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 