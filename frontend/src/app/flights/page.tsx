'use client';

import React, { useState } from 'react';
import FlightSearch from '../../components/FlightSearch';
import FlightList from '../../components/FlightList';
import { flightService } from '../../services/flightService';
import { FlightSearchParams } from '../../types/flight';
import { Flight } from '../../types/flight';

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: FlightSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const results = await flightService.searchFlights(params);
      setFlights(results);
    } catch (err) {
      setError('Failed to search flights. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Search Flights</h1>
        
        <FlightSearch onSearch={handleSearch} />
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Searching for flights...</p>
          </div>
        )}
        
        {error && (
          <div className="max-w-4xl mx-auto mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {!loading && !error && flights.length > 0 && (
          <div className="mt-8">
            <FlightList flights={flights} />
          </div>
        )}
      </div>
    </main>
  );
} 