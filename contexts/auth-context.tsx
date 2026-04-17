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
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<any>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = ApiClient.getStoredToken();
      if (token) {
        try {
          // Initial optimistic set from token
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({
            id: payload.userId || 'unknown-id',
            email: payload.email || 'user',
            name: payload.name || 'User',
            role: payload.role || 'USER',
          });

          // Fetch full profile to get real name
          const profileResponse = await ApiClient.getProfile();
          if (profileResponse.success && profileResponse.data) {
            setUser({
              id: profileResponse.data.id || payload.userId,
              email: profileResponse.data.email || payload.email,
              name: profileResponse.data.name || payload.name || 'User',
              role: profileResponse.data.role || payload.role || 'USER',
            });
          }
        } catch (e) {
          console.error('Failed to initialize auth:', e);
        }
      }
      setIsLoading(false);
    };

    initAuth();
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
            name: payload.name || email.split('@')[0], 
            role: payload.role || 'USER'
          };
        } catch (e) {
          userObj = { id: 'unknown-id', email, name: email.split('@')[0], role: 'USER' };
        }
      }

      // Final check: if we still don't have a real name, fetch profile
      if (userObj && (!userObj.name || userObj.name === 'User' || userObj.name === email.split('@')[0])) {
        const profileResponse = await ApiClient.getProfile();
        if (profileResponse.success && profileResponse.data) {
          userObj = {
            ...userObj,
            ...profileResponse.data
          };
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

  const forgotPassword = async (email: string) => {
    setError(null);
    try {
      const response = await ApiClient.forgotPassword(email);
      if (!response.success) {
        throw new Error(response.error || 'Failed to request password reset');
      }
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Forgot password request failed';
      setError(message);
      throw err;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setError(null);
    try {
      const response = await ApiClient.resetPassword(token, password);
      if (!response.success) {
        throw new Error(response.error || 'Failed to reset password');
      }
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      throw err;
    }
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
        forgotPassword,
        resetPassword,
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
