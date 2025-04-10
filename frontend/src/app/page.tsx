'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarIcon, MapPinIcon, UserIcon, ChevronUpIcon, ChevronDownIcon, ArrowPathIcon,
  PhoneIcon, EnvelopeIcon, MapIcon, GlobeAltIcon, ShieldCheckIcon, CreditCardIcon,
  ArrowRightIcon, StarIcon, TicketIcon
} from '@heroicons/react/24/outline';

// Define interfaces
interface Flight {
  id: string;
  details: string;
}

interface Location {
  id: string;
  city: string;
  airport: string;
  code: string;
}

export default function Home() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<Location[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Location[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [travelClass, setTravelClass] = useState('Any');
  const [isOneWay, setIsOneWay] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);

  // Function to fetch location suggestions
  const fetchLocationSuggestions = async (query: string, type: 'from' | 'to') => {
    if (query.length < 2) {
      type === 'from' ? setFromSuggestions([]) : setToSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations/search?query=${query}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      
      if (type === 'from') {
        setFromSuggestions(data);
        setShowFromSuggestions(true);
      } else {
        setToSuggestions(data);
        setShowToSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: Location, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromLocation(`${location.city} (${location.code})`);
      setShowFromSuggestions(false);
    } else {
      setToLocation(`${location.city} (${location.code})`);
      setShowToSuggestions(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const searchParams = new URLSearchParams({
        fromLocation,
        toLocation,
        departureDate,
        adults: adults.toString(),
        children: children.toString(),
        travelClass,
        isOneWay: isOneWay.toString()
      });

      if (!isOneWay && returnDate) {
        searchParams.append('returnDate', returnDate);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/flights/filter?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }

      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const incrementCount = (type: 'adults' | 'children') => {
    if (type === 'adults' && adults < 9) {
      setAdults(adults + 1);
    } else if (type === 'children' && children < 9) {
      setChildren(children + 1);
    }
  };

  const decrementCount = (type: 'adults' | 'children') => {
    if (type === 'adults' && adults > 1) {
      setAdults(adults - 1);
    } else if (type === 'children' && children > 0) {
      setChildren(children - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SkyJourney
              </div>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
                <Link href="/book-flight" className="text-gray-700 hover:text-blue-600 transition-colors">Book Flight</Link>
                <Link href="/flight-management" className="text-gray-700 hover:text-blue-600 transition-colors">Manage Bookings</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <UserIcon className="h-6 w-6 text-gray-700 hover:text-blue-600 transition-colors" />
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">Login</Link>
                  <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Your Journey Begins Here
              </h1>
            </div>
          </div>
        </section>

        {/* Search Form Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Trip Type Toggle */}
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => setIsOneWay(false)}
                  className={`px-6 py-2 rounded-full transition-colors ${!isOneWay ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  onClick={() => setIsOneWay(true)}
                  className={`px-6 py-2 rounded-full transition-colors ${isOneWay ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  One Way
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">FROM</label>
                  <div className="relative">
                    <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Enter departure city"
                      className="w-full pl-10 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={fromLocation}
                      onChange={(e) => {
                        setFromLocation(e.target.value);
                        fetchLocationSuggestions(e.target.value, 'from');
                      }}
                      onFocus={() => setShowFromSuggestions(true)}
                    />
                    {/* From Suggestions Dropdown */}
                    {showFromSuggestions && fromSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        {fromSuggestions.map((location) => (
                          <div
                            key={location.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleLocationSelect(location, 'from')}
                          >
                            <div className="font-medium">{location.city}</div>
                            <div className="text-sm text-gray-500">{location.airport} ({location.code})</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* To Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">TO</label>
                  <div className="relative">
                    <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Enter destination city"
                      className="w-full pl-10 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={toLocation}
                      onChange={(e) => {
                        setToLocation(e.target.value);
                        fetchLocationSuggestions(e.target.value, 'to');
                      }}
                      onFocus={() => setShowToSuggestions(true)}
                    />
                    {/* To Suggestions Dropdown */}
                    {showToSuggestions && toSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        {toSuggestions.map((location) => (
                          <div
                            key={location.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleLocationSelect(location, 'to')}
                          >
                            <div className="font-medium">{location.city}</div>
                            <div className="text-sm text-gray-500">{location.airport} ({location.code})</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Departure Date */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">DEPARTURE</label>
                  <div className="relative">
                    <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="date"
                      className="w-full pl-10 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Return Date */}
                {!isOneWay && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">RETURN</label>
                    <div className="relative">
                      <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="date"
                        className="w-full pl-10 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Adults */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ADULTS</label>
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        className="w-full pl-10 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={adults}
                        readOnly
                      />
                    </div>
                    <div className="ml-2 flex flex-col">
                      <button
                        type="button"
                        onClick={() => incrementCount('adults')}
                        className="text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <ChevronUpIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => decrementCount('adults')}
                        className="text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Children */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CHILDREN</label>
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        className="w-full pl-10 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={children}
                        readOnly
                      />
                    </div>
                    <div className="ml-2 flex flex-col">
                      <button
                        type="button"
                        onClick={() => incrementCount('children')}
                        className="text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <ChevronUpIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => decrementCount('children')}
                        className="text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Travel Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CLASS</label>
                  <select
                    value={travelClass}
                    onChange={(e) => setTravelClass(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Any">Any Class</option>
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First Class</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                  Search Flights
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                SkyJourney
              </h3>
              <p className="text-gray-400 text-sm mb-2">Making travel dreams come true since 2024.</p>
              <div className="flex space-x-3">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-white">Quick Links</h3>
              <ul className="space-y-1">
                {['Home', 'About Us', 'Flights', 'Destinations', 'Contact'].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm">
                      <ArrowRightIcon className="h-3 w-3 mr-1" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-white">Support</h3>
              <ul className="space-y-1">
                {['Help Center', 'FAQs', 'Terms & Conditions', 'Privacy Policy', 'Refund Policy'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm">
                      <ArrowRightIcon className="h-3 w-3 mr-1" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-white">Contact Us</h3>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-400 text-sm">support@skyjourney.com</span>
                </li>
                <li className="flex items-center">
                  <MapIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-400 text-sm">123 Aviation Way, NY</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-gray-400 text-sm">
              &copy; 2024 SkyJourney. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
