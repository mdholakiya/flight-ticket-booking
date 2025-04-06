import React from 'react';
import Header from '../../components/layout/Header';
import FlightSearch from '../../components/features/FlightSearch';
import { SearchParams } from '../../types/flight';

const HomePage: React.FC = () => {
  const handleSearch = (searchParams: SearchParams) => {
    // TODO: Implement flight search logic
    console.log('Searching flights with params:', searchParams);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Find Your Perfect Flight
          </h1>
          <FlightSearch onSearch={handleSearch} />
        </div>
      </main>
    </div>
  );
};

export default HomePage; 