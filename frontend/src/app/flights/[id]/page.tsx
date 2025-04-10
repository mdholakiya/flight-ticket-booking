'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { flightService } from '../../../services/flightService';
import { bookingService } from '../../../services/bookingService';
import { Flight } from '../../../types/flight';

export default function FlightDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passengers, setPassengers] = useState(1);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (!params?.id) {
        setError('Flight ID not found');
        setLoading(false);
        return;
      }

      try {
        const data = await flightService.getFlightDetails(params.id as string);
        setFlight(data);
      } catch (err) {
        setError('Failed to load flight details.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [params?.id]);

  const handleBooking = async () => {
    if (!params?.id) return;
    
    try {
      const booking = await bookingService.createBooking(params.id as string, {
        passengers,
      });
      router.push(`/bookings/${booking.id}`);
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error('Booking error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Flight not found'}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Flight Details</h1>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Flight Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Airline:</span> {flight.airline}
                </p>
                <p>
                  <span className="font-medium">Flight Number:</span>{' '}
                  {flight.flightNumber}
                </p>
                <p>
                  <span className="font-medium">From:</span>{' '}
                  {flight.departureCity}
                </p>
                <p>
                  <span className="font-medium">To:</span> {flight.arrivalCity}
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Schedule</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Departure:</span>{' '}
                  {flight.departureTime}
                </p>
                <p>
                  <span className="font-medium">Arrival:</span>{' '}
                  {flight.arrivalTime}
                </p>
                <p>
                  <span className="font-medium">Available Seats:</span>{' '}
                  {flight.availableSeats}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ${flight.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Book Flight</h2>
            <div className="flex items-center space-x-4 mb-6">
              <label className="font-medium">Number of Passengers:</label>
              <input
                type="number"
                min="1"
                max={flight.availableSeats}
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold">
                Total: ${(flight.price * passengers).toFixed(2)}
              </p>
              <button
                onClick={handleBooking}
                disabled={passengers > flight.availableSeats}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 