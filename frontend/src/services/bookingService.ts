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
  createBooking: async (flightId: string, bookingData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.post(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.BOOKINGS,
       {
      flightId,
      ...bookingData,
    });
    return response.data;
  },

  getUserBookings: async (userId: string) => {
    const response = await api.get(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.USER_BOOKINGS(userId));
    return response.data;
  },

  getBookingDetails: async (id: string) => {
    const response = await api.get(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.BOOKING_DETAILS(id));
    return response.data;
  },

    cancelBooking: async (id: string) => {
      const response = await api.delete(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.CANCEL_BOOKING(id));
    return response.data;
  },

  processPayment: async (bookingId: string, paymentData: any) => {
    const response = await api.post(
      API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.PROCESS_PAYMENT(bookingId),
      paymentData
    );
    return response.data;
  },

  confirmBooking: async (id: string) => {
    const response = await api.post(
      API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.CONFIRM_PAYMENT(id)
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