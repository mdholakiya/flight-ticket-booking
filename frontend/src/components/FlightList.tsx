import React from 'react';
import { CalendarIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Flight } from '@/types/flight';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FlightListProps {
  flights: Flight[];
  loading: boolean;
  onFlightSelect?: (flightId: string) => void;
}

const FlightList: React.FC<FlightListProps> = ({ flights, loading, onFlightSelect }) => {
  const router = useRouter();

  const handleFlightSelect = (flightId: string) => {
    if (onFlightSelect) {
      onFlightSelect(flightId);
    } else {
      router.push(`/flights/${flightId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No flights found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <div
          key={flight.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Airline Info */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">{flight.airline}</span>
              <span className="text-sm text-gray-500">Flight {flight.flightNumber}</span>
            </div>

            {/* Flight Times */}
            <div className="col-span-2">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-lg font-semibold">{flight.departureAirport}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(flight.departureTime).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="border-t-2 border-gray-300"></div>
                  <div className="text-center text-sm text-gray-500">
                    {flight.duration || 'Duration'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{flight.arrivalAirport}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(flight.arrivalTime).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Price and Book Button */}
            <div className="flex flex-col justify-center items-end">
              <div className="text-2xl font-bold text-blue-600">${flight.price}</div>
              <button
                onClick={() => handleFlightSelect(flight.id)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Select Flight
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlightList; 
