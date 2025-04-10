"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface UpdateProfileProps {
  onClose: () => void;
  onUpdate: () => void;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ onClose, onUpdate }) => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REQUEST_OTP}`,
        { email: formData.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOtpSent(true);
      setShowOtpInput(true);
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtpInput) {
      handleSendOtp();
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_PROFILE}`,
        { ...formData, otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      onUpdate();
      toast.success('Profile updated successfully');
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      if (error.response?.data?.code === 'OTP_EXPIRED') {
        toast.error('OTP has expired. Please request a new one.');
        setShowOtpInput(false);
        setOtpSent(false);
      } else if (error.response?.data?.code === 'INVALID_OTP') {
        toast.error('Invalid OTP. Please try again.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-w-md w-full p-8 rounded-2xl shadow-2xl bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Update Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-100">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300
                       text-gray-900 bg-white
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-100">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300
                       text-gray-900 bg-white
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       transition-all duration-200"
              required
            />
          </div>

          {showOtpInput && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-100">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                         text-gray-900 bg-white
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-all duration-200"
                placeholder="Enter the OTP sent to your email"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Didn't receive OTP?{' '}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 
                       border border-gray-300 rounded-lg bg-white
                       hover:bg-gray-50 focus:outline-none focus:ring-2 
                       focus:ring-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (showOtpInput && !otp)}
              className="px-6 py-2.5 text-sm font-medium text-white 
                       bg-primary-600 hover:bg-primary-700 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                       disabled:bg-primary-400 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-sm hover:shadow-md
                       flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24 ">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {showOtpInput ? 'Updating...' : 'Sending OTP...'}
                </>
              ) : (
                showOtpInput ? 'Update Profile' : 'Send OTP'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile; 