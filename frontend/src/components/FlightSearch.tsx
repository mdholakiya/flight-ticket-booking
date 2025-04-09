import React, { useState } from 'react';
import { FlightSearchParams } from '../types/flight';

interface FlightSearchProps {
  onSearch: (params: FlightSearchParams) => void;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    departureCity: '',
    arrivalCity: '',
    departureDate: '',
    passengers: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              From
            </label>
            <input
              type="text"
              value={searchParams.departureCity}
              onChange={(e) =>
                setSearchParams({ ...searchParams, departureCity: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Departure City"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              To
            </label>
            <input
              type="text"
              value={searchParams.arrivalCity}
              onChange={(e) =>
                setSearchParams({ ...searchParams, arrivalCity: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Arrival City"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={searchParams.departureDate}
              onChange={(e) =>
                setSearchParams({ ...searchParams, departureDate: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Passengers
            </label>
            <input
              type="number"
              min="1"
              value={searchParams.passengers}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  passengers: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search Flights
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlightSearch; 