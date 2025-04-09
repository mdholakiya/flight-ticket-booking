import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(API_CONFIG.TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.REGISTER, { name, email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post(API_CONFIG.ENDPOINTS.LOGOUT);
    return response.data;
  },

  // User
  getProfile: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.PROFILE);
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
  },

  // Flights
  searchFlights: async (params: any) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.SEARCH_FLIGHTS, { params });
    return response.data;
  },

  getFlightDetails: async (id: string) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.FLIGHT_DETAILS(id));
    return response.data;
  },

  // Bookings
  createBooking: async (data: any) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.BOOKINGS, data);
    return response.data;
  },

  getUserBookings: async (userId: string) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.USER_BOOKINGS(userId));
    return response.data;
  },

  getBookingDetails: async (id: string) => {
    const response = await api.get(API_CONFIG.ENDPOINTS.BOOKING_DETAILS(id));
    return response.data;
  },

  cancelBooking: async (id: string) => {
    const response = await api.delete(API_CONFIG.ENDPOINTS.CANCEL_BOOKING(id));
    return response.data;
  },

  processPayment: async (id: string, paymentData: any) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.PROCESS_PAYMENT(id), paymentData);
    return response.data;
  },

  confirmBooking: async (id: string) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.CONFIRM_BOOKING(id));
    return response.data;
  },
};

export default api; 