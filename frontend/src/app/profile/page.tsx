'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const Profile = () => {
  const router = useRouter();
  const { user, token } = useAuth();
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        router.push('/login');
      }
    };

    if (!token) {
      router.push('/');
    } else {
      fetchUserProfile();
    }
  }, [router, token]);

  return (
    <div className="min-h-screen">
      
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
           Sky Journey
          </Link>
        </div>
      </nav>

      {/* Profile Section */}
      <div className="flex items-center bg-blue-100  justify-center py-10">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-3xl shadow-3xl">
          <h2 className="text-3xl font-extrabold text-center text-gray-900">User Profile</h2>
          {userData ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                <strong>Name:</strong> {userData.name}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Email:</strong> {userData.email}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
