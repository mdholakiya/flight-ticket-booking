import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

class UserService {
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CURRENT_USER}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async checkUserExists(email: string): Promise<boolean> {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHECK_USER}`, { email });
      return response.data.exists;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string): Promise<User> {
    const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
      email,
      password
    });
    return response.data;
  }

  async register(userData: { name: string; email: string; password: string; phone?: string }): Promise<User> {
    const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, userData);
    return response.data;
  }

  async logout(): Promise<void> {
    await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGOUT}`);
  }
}

export const userService = new UserService(); 