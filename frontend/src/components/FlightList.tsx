import React from 'react';
import Flight from '../types/flight';
import { useRouter } from 'next/router';

interface FlightListProps {
  flights: Flight[];
}

const FlightList: React.FC<FlightListProps> = ({ flights }) => {
  const router = useRouter();

  const handleSelectFlight = (flightId: string) => {
    router.push(`/flights/${flightId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {flights.map((flight) => (
        <div
          key={flight.id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleSelectFlight(flight.id)}
        >
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {flight.airline} - {flight.flightNumber}
              </h3>
              <div className="flex items-center space-x-8">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{flight.departureCity}</p>
                  <p className="text-sm text-gray-600">{flight.departureTime}</p>
                </div>
                <div className="flex-1 border-t border-gray-300 mx-4"></div>
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium">{flight.arrivalCity}</p>
                  <p className="text-sm text-gray-600">{flight.arrivalTime}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                ${flight.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {flight.availableSeats} seats left
              </p>
            </div>
          </div>
        </div>
      ))}
      {flights.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No flights found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default FlightList; 