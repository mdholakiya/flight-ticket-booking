import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookingService = {
  createBooking: async (flightId: string, bookingData: any) => {
    const response = await api.post(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BOOKINGS, {
      flightId,
      ...bookingData,
    });
    return response.data;
  },

  getUserBookings: async (userId: string) => {
    const response = await api.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.USER_BOOKINGS(userId));
    return response.data;
  },

  getBookingDetails: async (id: string) => {
    const response = await api.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BOOKING_DETAILS(id));
    return response.data;
  },

  cancelBooking: async (id: string) => {
    const response = await api.delete(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CANCEL_BOOKING(id));
    return response.data;
  },

  processPayment: async (id: string, paymentDetails: any) => {
    const response = await api.post(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.PROCESS_PAYMENT(id), paymentDetails);
    return response.data;
  },

  confirmBooking: async (id: string) => {
    const response = await api.post(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CONFIRM_BOOKING(id));
    return response.data;
  },
}; 