'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CalendarIcon, MapPinIcon, UserIcon, ChevronUpIcon, ChevronDownIcon, ArrowPathIcon,
  PhoneIcon, EnvelopeIcon, MapIcon, GlobeAltIcon, ShieldCheckIcon, CreditCardIcon,
  ArrowRightIcon, StarIcon, TicketIcon
} from '@heroicons/react/24/outline';

// Define the Flight interface
interface Flight {
  id: string; // or number, depending on your API
  details: string; // Adjust the type based on your actual data structure
}

export default function Home() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [travelClass, setTravelClass] = useState('Any');
  const [isOneWay, setIsOneWay] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`YOUR_BACKEND_API_URL/flights?departure=${fromLocation}&arrival=${toLocation}&date=${departureDate}`);
      const data = await response.json();
      console.log(data); // Log the fetched data to see its structure
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Pattern */}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
                  <Link href="/register" className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
  
      <main className="w-full pt-15 bg-gradient-to-b from-blue-50 to-blue-100">

        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-4">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Your Journey Begins Here
              </h1>
              {/* <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                Discover the world with our seamless flight booking experience. Wherever you want to go, we'll get you there.
              </p> */}
            </div>
          </div>
        </section>

        {/* Search Form Section */}
        <section className="w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8">
                <form onSubmit={handleSearch} className="space-y-6">
                  {/* Trip Type Toggle */}
                  <div className="flex justify-center space-x-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setIsOneWay(false)}
                      className={`px-4 sm:px-6 py-2 rounded-full transition-colors ${!isOneWay ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Round Trip
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOneWay(true)}
                      className={`px-4 sm:px-6 py-2 rounded-full transition-colors ${isOneWay ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
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
                          onChange={(e) => setFromLocation(e.target.value)}
                        />
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
                          onChange={(e) => setToLocation(e.target.value)}
                        />
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
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105"
                    >
                      Search Flights
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div>
              {flights.length > 0 ? (
                flights.map((flight) => (
                  <div key={flight.id}>
                    {flight.details ? flight.details : 'Flight details not available'}
                  </div>
                ))
              ) : (
                <div>No flights found. Please adjust your search criteria.</div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white fixed bottom-0 left-0 right-0">
        <div className="w-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 py-6">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full bg-gray-900">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
            <div className="max-w-7xl mx-auto">
              <div className="border-t border-gray-800 pt-2 text-center text-gray-400 text-sm">
                <p>&copy; 2024 SkyJourney. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
