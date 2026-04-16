'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = ApiClient.getStoredToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.userId || 'unknown-id',
          email: payload.email || 'user',
          name: payload.name || 'User',
          role: payload.role || 'USER',
        });
      } catch (e) {
        // Fallback user if token parsing fails
        setUser({ id: 'unknown-id', email: 'user', name: 'User', role: 'USER' });
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await ApiClient.login(email, password);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }

      const token = response.data.token || (response.data as any).data?.token;
      ApiClient.setToken(token);
      
      let userObj = response.data.user;
      if (!userObj && token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userObj = {
            id: payload.userId || 'unknown-id',
            email: email,
            name: email.split('@')[0], 
            role: payload.role || 'USER'
          };
        } catch (e) {
          userObj = { id: 'unknown-id', email, name: email.split('@')[0], role: 'USER' };
        }
      }
      setUser(userObj);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await ApiClient.register(email, password, name);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Registration failed');
      }

      // Backend registration might just return a userId, not a token. 
      // If there's no token, we might need to login right after.
      const token = response.data.token || (response.data as any).data?.token;
      if (token) {
        ApiClient.setToken(token);
      }
      
      let userObj = response.data.user;
      if (!userObj) {
        const payloadId = (response.data as any).userId;
        userObj = {
          id: payloadId || 'unknown-id',
          email,
          name,
          role: 'USER'
        };
      }
      setUser(userObj);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    ApiClient.clearToken();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
      }}
    >
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
