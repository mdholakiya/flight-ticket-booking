"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { toast } from 'react-hot-toast';

interface SendOtpProps {
  email: string;
  onOtpSent: () => void;
  onVerifyOtp: (otp: string) => void;
}

const SendOtp: React.FC<SendOtpProps> = ({ email, onOtpSent, onVerifyOtp }) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendOtp = async () => {
    try {
      setIsSending(true);
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REQUEST_OTP}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(API_CONFIG.TOKEN_KEY)}`,
          },
        }
      );

      if (response.data) {
        console.log('OTP sent successfully:', response.data);
        toast.success('OTP has been sent to your email');
        setIsOtpSent(true);
        onOtpSent();
      }
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsVerifying(true);
      onVerifyOtp(otp);
    } catch (error: any) {
      console.error('Failed to verify OTP:', error);
      const errorMessage = error.response?.data?.message || 'Invalid OTP';
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (isOtpSent) {
      toast.error('Please wait before requesting a new OTP');
      return;
    }
    handleSendOtp();
  };

  return (
    <div className="space-y-6 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Email Verification</h3>
        <p className="text-sm text-gray-300">We'll send a verification code to your email</p>
      </div>

      {!isOtpSent ? (
        <button
          onClick={handleSendOtp}
          disabled={isSending}
          className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 
                   hover:bg-blue-500 rounded-lg border border-transparent
                   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                   disabled:bg-blue-800 disabled:cursor-not-allowed
                   transform transition-all duration-200 hover:scale-[1.02]
                   shadow-lg hover:shadow-blue-500/25"
        >
          {isSending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            'Send OTP'
          )}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full px-4 py-3 text-lg tracking-widest text-center
                       bg-white/10 border border-white/20 rounded-lg
                       text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                       transition-all duration-200"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex space-x-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < otp.length ? 'bg-blue-400' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleVerifyOtp}
              disabled={isVerifying || otp.length !== 6}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 
                       hover:bg-blue-500 rounded-lg border border-transparent
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                       disabled:bg-blue-800 disabled:cursor-not-allowed
                       transform transition-all duration-200 hover:scale-[1.02]
                       shadow-lg hover:shadow-blue-500/25"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>
            <button
              onClick={handleResendOtp}
              className="px-4 py-3 text-sm font-medium text-blue-400 hover:text-blue-300
                       border border-blue-400/30 rounded-lg bg-blue-400/10
                       focus:outline-none focus:ring-2 focus:ring-blue-400/30
                       transform transition-all duration-200 hover:scale-[1.02]
                       shadow-lg hover:shadow-blue-400/10"
            >
              Resend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendOtp;
