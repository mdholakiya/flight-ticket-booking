// frontend/src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import SendOtp from './sendOtp';
import UpdateProfile from './UpdateProfile';
import ResetPassword from './ResetPassword';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const router = useRouter();

  // Function to update profile
  const handleUpdateProfile = () => {
    setIsProfileOpen(false);
    setShowUpdateProfile(true);
  };

  // Function to reset password
  const handleResetPassword = () => {
    setIsProfileOpen(false);
    setShowResetPassword(true);
  };

  const handleProfileUpdate = () => {
    toast.success('Profile updated successfully');
    // You might want to refresh the user data here
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">✈</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  AirLink
                </span>
              </div>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/" className="text-white hover:text-blue-100 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-blue-100 px-3 py-2 text-sm font-medium transition-colors duration-200">
                About
              </Link>
              <Link href="/offer" className="text-white hover:text-blue-100 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Offer
              </Link>
              <Link href="/seats" className="text-white hover:text-blue-100 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Seats
              </Link>
              <Link href="/destinations" className="text-white hover:text-blue-100 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Destinations
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-blue-100 p-2"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* User profile button */}
            <div className="hidden md:block">
              {user ? (
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {user.profilePicture ? (
                        <Image
                          className="h-8 w-8 rounded-full ring-2 ring-white"
                          src={user.profilePicture}
                          alt={user.name}
                          width={32}
                          height={32}
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 text-white" />
                      )}
                    </button>
                  </div>
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200">
                      <button
                        onClick={handleUpdateProfile}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Update Profile
                      </button>
                      <button
                        onClick={handleResetPassword}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              Home
            </Link>
            <Link href="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              About
            </Link>
            <Link href="/offer" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              Offer
            </Link>
            <Link href="/seats" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              Seats
            </Link>
            <Link href="/destinations" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              Destinations
            </Link>
          </div>
        </div>
      )}

      {/* Modals */}
      {showUpdateProfile && (
        <UpdateProfile
          onClose={() => setShowUpdateProfile(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
      {showResetPassword && (
        <ResetPassword onClose={() => setShowResetPassword(false)} />
      )}
    </nav>
  );
}