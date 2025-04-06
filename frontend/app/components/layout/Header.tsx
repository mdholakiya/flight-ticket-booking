import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Flight Booking
          </Link>
          <div className="flex space-x-4">
            <Link href="/flights" className="text-gray-600 hover:text-blue-600">
              Flights
            </Link>
            <Link href="/booking" className="text-gray-600 hover:text-blue-600">
              My Bookings
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-blue-600">
              Profile
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 