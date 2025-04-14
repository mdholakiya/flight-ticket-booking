'use client';

import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api.config';
import { bookingService } from '@/services/bookingService';
import axios from 'axios';
import {
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { Flight } from '@/types/flight';
import { flightService } from '@/services/flightService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface FilterState {
  priceRange: [number, number];
  airlines: string[];
  departureTime: string;
  sortBy: 'price' | 'departure' | null;
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    airlines: [],
    departureTime: 'any',
    sortBy: null
  });
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await flightService.getAllFlights();
      setFlights(response);
    } catch (error) {
      setError('Failed to load flights. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchFlights();
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filteredFlights = flights.filter(flight => {
    if (filters.airlines.length && !filters.airlines.includes(flight.airline)) return false;
    if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) return false;
    return true;
  });

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price':
        return a.price - b.price;
      case 'departure':
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      default:
        return 0;
    }
  });

  const handleBooking = (flightId: string) => {
    const bookingPath = `/flights/${flightId}/booking`;
    
    if (!isAuthenticated) {
      toast.error('Please login to book a flight');
      const loginPath = `/login?returnTo=${encodeURIComponent(bookingPath)}`;
      router.push(loginPath);
      return;
    }
    router.push(bookingPath);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">All Flights</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Add your filter UI components here */}
          </div>
        )}

        {/* Flight List */}
        <div className="grid gap-6">
          {sortedFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-gray-900">{flight.airline}</div>
                  <div className="text-sm text-gray-500">Flight {flight.flightNumber}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{flight.departureAirport}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>{new Date(flight.departureTime).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{flight.arrivalAirport}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>{new Date(flight.arrivalTime).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                      <span className="text-lg font-semibold">${flight.price}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <UserIcon className="h-5 w-5 mr-2" />
                      <span>{flight.availableSeats} seats left</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBooking(flight.id)}
                    className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedFlights.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No flights found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 