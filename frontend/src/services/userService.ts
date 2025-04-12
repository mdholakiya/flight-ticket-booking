import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class UserService {
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.CURRENT_USER);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async getProfile(): Promise<User> {
    const response = await api.get( API_CONFIG.ENDPOINTS.PROFILE);
    return response.data;
  }

  async checkUserExists(email: string): Promise<boolean> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.CHECK_USER, { email });
      return response.data.exists;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string): Promise<User> {
    const response = await api.post( API_CONFIG.ENDPOINTS.LOGIN, {
      email,
      password
    });
    return response.data;
  }

  async register(userData: { name: string; email: string; password: string; phone?: string }): Promise<User> {
    const response = await api.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post( API_CONFIG.ENDPOINTS.LOGOUT);
  }
}

export const userService = new UserService(); 