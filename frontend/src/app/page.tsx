'use client';

import { useState } from 'react';
import Link from 'next/link';
import { API_CONFIG } from '@/config/api.config';
import axios from 'axios';
import {
  CalendarIcon, MapPinIcon, UserIcon, ChevronUpIcon, ChevronDownIcon,
  PhoneIcon, EnvelopeIcon, MapIcon, ArrowRightIcon, UserCircleIcon
} from '@heroicons/react/24/outline';
import FlightList from '@/components/FlightList';
import FlightFilter from '@/components/Flightfilter';
import { Flight, FlightSearchParams } from '@/types/flight';
import { flightService } from '@/services/flightService';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

// Add this interface after the existing imports
interface Airport {
  city: string;
  code: string;
}

export default function Home() {
  const { user, logout } = useAuth();
  // Form states
  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [travelClass, setTravelClass] = useState('Economy');
  const [isOneWay, setIsOneWay] = useState(false);

  // UI states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ flights: Flight[] }>({ flights: [] });
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Add these state variables after other useState declarations
  const [departureAirportSuggestions, setDepartureAirportSuggestions] = useState<Airport[]>([]);
  const [arrivalAirportSuggestions, setArrivalAirportSuggestions] = useState<Airport[]>([]);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showArrivalSuggestions, setShowArrivalSuggestions] = useState(false);

  const handleSearch = async (params: FlightSearchParams) => {
    try {
      setError(null);
      setLoading(true);
      setSearchPerformed(true);
      
      // Call API with search params
      const response = await flightService.filterFlights(params);
      
      // Check if response has the correct structure
      if (response?.data) {
        setData({ flights: response.data });
      } else if (Array.isArray(response)) {
        setData({ flights: response });
      } else {
        setData({ flights: [] });
        setError('No flights found for your search criteria.');
      }
      
      if ((!response?.data?.length && !Array.isArray(response)) || response.length === 0) {
        setError('No flights found for your search criteria. Please try different dates or routes.');
      }
    } catch (error) {
      console.error('Error searching flights:', error);
      setError('Failed to search flights. Please try again.');
      setData({ flights: [] });
    } finally {
      setLoading(false);
    }
  };

  const incrementCount = () => {
    const totalPassengers = adults + children;
    if (totalPassengers < 9) {
      setAdults(adults + 1);
    }
  };

  const decrementCount = () => {
    const totalPassengers = adults + children;
    if (totalPassengers > 1) {
      setAdults(Math.max(1, adults - 1));
    }
  };

  const handleDateChange = (type: 'departure' | 'arrival', date: string) => {
    if (type === 'departure') {
      setDepartureDate(date);
      // Reset arrival date if it's before the new departure date
      if (arrivalDate && new Date(arrivalDate) < new Date(date)) {
        setArrivalDate('');
      }
    } else {
      setArrivalDate(date);
    }
  };

  const fetchFlightDetails = async (flightId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use mock data since API is not available
      // In a real application, you would uncomment this:
      /*
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FLIGHT_DETAILS}/${flightId}`);
      
      if (response.status !== 200) {
        throw new Error('Failed to fetch flight details');
      }
      
      setSelectedFlight(response.data);
      */
      
      // Mock data for testing
      const mockFlight = {
        id: flightId,
        airline: "Emirates",
        flightNumber: "EK123",
        flightName: "Emirates Dubai Express",
        departureAirport: departureAirport || "New York (JFK)",
        arrivalAirport: arrivalAirport || "London (LHR)",
        departureTime: departureDate || "2024-03-20T10:00:00",
        arrivalTime: arrivalDate || "2024-03-20T22:00:00",
        price: 750,
        availableSeats: 42,
        duration: "12h 0m"
      };
      
      setSelectedFlight(mockFlight);
      setShowBookingModal(true);
      
    } catch (error) {
      console.error('Error fetching flight details:', error);
      setError('Failed to fetch flight details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add this function after other function declarations
  const handleAirportSearch = async (value: string, type: 'departure' | 'arrival') => {
    try {
      if (value.length < 2) {
        type === 'departure' ? setDepartureAirportSuggestions([]) : setArrivalAirportSuggestions([]);
        return;
      }

      const response = await flightService.searchAirports(value);
      const suggestions = response.map((airport: any) => ({
        city: airport.city,
        code: airport.code
      }));
      
      if (type === 'departure') {
        setDepartureAirportSuggestions(suggestions);
        setShowDepartureSuggestions(true);
      } else {
        setArrivalAirportSuggestions(suggestions);
        setShowArrivalSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching airport suggestions:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-blue-600">AirLink</div>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
                <Link href="/flights" className="text-gray-700 hover:text-blue-600 transition-colors">Flights</Link>
                {user && (
                  <Link href="/bookings" className="text-gray-700 hover:text-blue-600 transition-colors">My Bookings</Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="profile-button p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                  >
                    {user.profilePicture ? (
                      <Image
                        src={user.profilePicture}
                        alt="Profile"
                        className="h-8 w-8 rounded-full ring-2 ring-primary-100"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-primary-600" />
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="profile-menu absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 transform transition-all">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          My Profile
                        </Link>
                        <Link
                          href="/bookings"
                          className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                          My Bookings
                        </Link>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="group flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                  <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Find Your Perfect Flight
              </h1>
              <p className="text-xl text-blue-100">
                Search, compare, and book flights to anywhere in the world
              </p>
            </div>
          </div>
        </section>

        {/* Search Form Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Trip Type Toggle */}
            <div className="mb-6">
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setIsRoundTrip(true)}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    isRoundTrip ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  onClick={() => setIsRoundTrip(false)}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    !isRoundTrip ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  One Way
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DEPARTURE DATE
                </label>
                <div className="relative">
                  <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={departureDate}
                    onChange={(e) => handleDateChange('departure', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              {isRoundTrip && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RETURN DATE
                  </label>
                  <div className="relative">
                    <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={arrivalDate}
                      onChange={(e) => handleDateChange('arrival', e.target.value)}
                      min={departureDate || new Date().toISOString().split('T')[0]}
                      required={isRoundTrip}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Travel Class Selection */}
            {/* <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TRAVEL CLASS
              </label>
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First">First Class</option>
              </select>
            </div> */}

            {/* From, To, Passengers Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2 col-span-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  From
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={departureAirport}
                    onChange={(e) => {
                      setDepartureAirport(e.target.value);
                      handleAirportSearch(e.target.value, 'departure');
                    }}
                    onFocus={() => setShowDepartureSuggestions(true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Departure City"
                  />
                  {showDepartureSuggestions && departureAirportSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {departureAirportSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                          onClick={() => {
                            setDepartureAirport(suggestion.city);
                            setShowDepartureSuggestions(false);
                          }}
                        >
                          <span>{suggestion.city}</span>
                          <span className="text-gray-500 text-sm">{suggestion.code}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 col-span-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  To
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={arrivalAirport}
                    onChange={(e) => {
                      setArrivalAirport(e.target.value);
                      handleAirportSearch(e.target.value, 'arrival');
                    }}
                    onFocus={() => setShowArrivalSuggestions(true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Arrival City"
                  />
                  {showArrivalSuggestions && arrivalAirportSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {arrivalAirportSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                          onClick={() => {
                            setArrivalAirport(suggestion.city);
                            setShowArrivalSuggestions(false);
                          }}
                        >
                          <span>{suggestion.city}</span>
                          <span className="text-gray-500 text-sm">{suggestion.code}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Passengers Selection with Controls */}
              <div className="space-y-2 col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Passengers
                </label>
                <input
                  type="number"
                  min="1"
                  value={adults + children}
                  onChange={(e) => {
                    const total = parseInt(e.target.value);
                    if (total >= 1) {
                      setAdults(Math.min(total, 9));
                      setChildren(Math.max(0, total - adults));
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
                 

            <FlightFilter 
              onSearch={handleSearch} 
              searchParams={{
                departureAirport,
                arrivalAirport,
                departureDate,
                arrivalDate,
                passengers: adults + children,
                travelClass,
                isRoundTrip
              }}
            />
          </div>
        </section>

        {/* Flight Results Section */}
        {searchPerformed && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <FlightList 
              flights={data?.flights || []} 
              loading={loading} 
              onFlightSelect={fetchFlightDetails}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-4">SkyJourney</h3>
              <p className="text-gray-400">Making travel dreams come true since 2024.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/flights" className="text-gray-400 hover:text-white">Flights</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center text-gray-400">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  support@skyjourney.com
                </li>
                <li className="flex items-center text-gray-400">
                  <MapIcon className="h-4 w-4 mr-2" />
                  123 Aviation Way, NY
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
         
        </div>
      </footer>
    </div>
  );
}
