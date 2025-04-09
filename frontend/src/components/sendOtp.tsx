import React, { useState } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { toast } from 'react-hot-toast';

interface SendOtpProps {
  email: string;
  onOtpSent: () => void;
  onVerifyOtp: (otp: string) => void; // Callback for OTP verification
}

const SendOtp: React.FC<SendOtpProps> = ({ email, onOtpSent, onVerifyOtp }) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REQUEST_OTP}`,
        { email }
      );

      console.log('OTP sent successfully:', response.data);
      toast.success('OTP sent to your email');
      setIsOtpSent(true);
      onOtpSent(); // Notify parent component that OTP has been sent
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REQUEST_OTP}`,
        { email, otp }
      );

      console.log('OTP verified successfully:', response.data);
      toast.success('OTP verified successfully');
      onVerifyOtp(otp); // Notify parent component that OTP has been verified
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      toast.error('Invalid OTP');
    }
  };

  return (
    <div>
      <button onClick={handleSendOtp} className="bg-blue-600 text-white rounded-md px-2 py-1">
        Send OTP
      </button>
      {isOtpSent && (
        <div className="px-4 py-2">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="border rounded-md p-1"
          />
          <button
            onClick={handleVerifyOtp}
            className="ml-2 bg-blue-600 text-white rounded-md px-2 py-1"
          >
            Verify OTP
          </button>
        </div>
      )}
      {isOtpSent && <p>OTP has been sent to your email.</p>}
    </div>
  );
};

export default SendOtp;
