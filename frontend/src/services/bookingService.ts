import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookingService = {
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const response = await api.get(API_CONFIG.ENDPOINTS.PROFILE);
    return response.data;
  },

  createBooking: async (flightId: string, bookingData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.post(API_CONFIG.ENDPOINTS.CREATE_BOOKING, {
      flightId,
      ...bookingData,
    });
    return response.data;
  },

  getUserBookings: async (userId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.get(API_CONFIG.ENDPOINTS.USER_BOOKINGS);
    return response.data;
  },

  getBookingDetails: async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.get(API_CONFIG.ENDPOINTS.BOOKING_DETAILS(id));
    return response.data;
  },

  cancelBooking: async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    try {
      // First update the booking status
      const response = await api.post(
        API_CONFIG.ENDPOINTS.CANCEL_BOOKING(id),
        
        { status: 'cancelled' }
      );
      
      // Then delete the booking if needed
      await api.delete(API_CONFIG.ENDPOINTS.CANCEL_BOOKING(id));
      
      return response.data;
    } catch (error) {
      console.error('Error in cancelBooking:', error);
      throw error;
    }
  },

  processPayment: async (bookingId: string, paymentData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.post(
      API_CONFIG.ENDPOINTS.PROCESS_PAYMENT(bookingId),
      paymentData
    );
    return response.data;
  },

  confirmBooking: async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.post(
      API_CONFIG.ENDPOINTS.CONFIRM_BOOKING(id),
      { status: 'confirmed' }
    );
    return response.data;
  },

  // createPaymentIntent: async (bookingId: string, amount: number) => {
  //   const response = await api.post(
  //     API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.CREATE_PAYMENT_INTENT(bookingId),
  //     { amount }
  //   );
  //   return response.data;
  // },
}; 