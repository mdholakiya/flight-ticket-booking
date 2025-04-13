'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import UpdateProfile from '@/components/UpdateProfile';
import ResetPassword from '@/components/ResetPassword';
import { userService } from '@/services/userService';
import { UserCircleIcon, EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const router = useRouter();
  const { user, token, refreshUser, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log("token",token);
  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        setIsLoading(true);
        
        if (!isAuthenticated || !token) {
          toast.error('Please login to access your profile');
          router.replace('/login');
          return;
        }

        // First try to refresh user data
        await refreshUser();

        // Then fetch profile data
        const response = await userService.getProfile();
        if (response) {
          setUserData(response);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem('token');
          toast.error('Session expired. Please login again');
          router.replace('/login');
        } else {
          toast.error('Failed to load profile data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [router, refreshUser, isAuthenticated, token]);

  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);
      await refreshUser();
      // Fetch updated profile data
      const response = await userService.getProfile();
      if (response) {
        setUserData(response);
      }
      setShowUpdateProfile(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error refreshing user data:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-950 via-sky-900 to-sky-800">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-700 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-700 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                <div className="h-2 bg-slate-700 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-950 via-sky-900 to-sky-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mt-10">
        <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-4">
                <UserCircleIcon className="h-20 w-20 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{userData.name}</h2>
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <EnvelopeIcon className="h-5 w-5" />
                <span>{userData.email}</span>
              </div>

              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => setShowUpdateProfile(true)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Update Profile
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUpdateProfile && (
        <UpdateProfile
          onClose={() => setShowUpdateProfile(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
      {showResetPassword && (
        <ResetPassword
          onClose={() => setShowResetPassword(false)}
        />
      )}
    </div>
  );
};

export default Profile;
