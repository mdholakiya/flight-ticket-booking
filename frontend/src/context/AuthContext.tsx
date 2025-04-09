'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';

interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
      if (token) {
        setToken(token); // Set token in state
        const response = await apiService.getProfile();
        setUser(response.user);
      }
    } catch (error) {
      localStorage.removeItem(API_CONFIG.TOKEN_KEY);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      localStorage.setItem(API_CONFIG.TOKEN_KEY, response.token);
      setToken(response.token); // Save token in state
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(API_CONFIG.TOKEN_KEY);
      setUser(null);
      setToken(null);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiService.register(name, email, password);
      localStorage.setItem(API_CONFIG.TOKEN_KEY, response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}