import React, { useState } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { toast } from 'react-hot-toast';

interface SendOtpProps {
  email: string;
  onOtpSent: () => void;
}

const SendOtp: React.FC<SendOtpProps> = ({ email, onOtpSent }) => {
  const [isOtpSent, setIsOtpSent] = useState(false);

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

  return (
    <div>
      <button onClick={handleSendOtp} className="bg-blue-600 text-white rounded-md px-2 py-1">
        Send OTP
      </button>
      {isOtpSent && <p>OTP has been sent to your email.</p>}
    </div>
  );
};

export default SendOtp;
