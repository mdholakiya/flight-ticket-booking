import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

// Create axios instance with interceptor to handle auth token
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

class UserService {
  async getProfile(): Promise<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.get(API_CONFIG.ENDPOINTS.PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.getProfile();
      return response;
    } catch (error) {
      return null;
    }
  }

  async checkUserExists(email: string): Promise<boolean> {
    try {
      const response = await api.post(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.LOGIN, { email });
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, {
        email,
        password,
      });
      
      // Validate response data
      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      
      // Store the JWT token
      localStorage.setItem('token', response.data.token);
      
      return {
        user: response.data.user,
        token: response.data.token
      };
    } catch (error: any) {
      // Clear any existing token on error
      localStorage.removeItem('token');
      throw error;
    }
  }

  async register(userData: { name: string; email: string; password: string; phone?: string }): Promise<User> {
    const response = await api.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, userData);
    return response.data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    await api.post(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.LOGOUT);
  }
}

export const userService = new UserService();