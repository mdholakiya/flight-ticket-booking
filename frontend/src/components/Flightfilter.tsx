import React, { useState } from 'react';
import { FlightSearchParams, Flight } from '../types/flight';
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { flightService } from '@/services/flightService';

interface FlightFilterProps {
  onSearch: (params: FlightSearchParams) => void;
  searchParams: {
    departureAirport: string;
    arrivalAirport: string;
    departureDate: string;
    arrivalDate?: string;
    passengers: number;
    travelClass: string;
    isRoundTrip: boolean;
  };
}

const FlightFilter: React.FC<FlightFilterProps> = ({ onSearch, searchParams }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterFlights = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!searchParams.departureAirport || !searchParams.arrivalAirport || !searchParams.departureDate) {
        setError('Please fill in all required fields');
        return;
      }

      // Create search params
      const params: FlightSearchParams = {
        departureAirport: searchParams.departureAirport,
        arrivalAirport: searchParams.arrivalAirport,
        departureTime: searchParams.departureDate,
        passengers: searchParams.passengers,
        travelClass: searchParams.travelClass,
        ...(searchParams.isRoundTrip && { returnDate: searchParams.arrivalDate })
      };

      // Pass the search parameters to parent component
      onSearch(params);

    } catch (error) {
      console.error('Error filtering flights:', error);
      setError('Failed to filter flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Flight Search</h3>
      <div className="space-y-4">
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <button
          onClick={handleFilterFlights}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </div>
    </div>
  );
};

export default FlightFilter; 