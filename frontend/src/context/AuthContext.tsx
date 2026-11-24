'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/marketplace';
import { authService, enquiryService } from '@/services/api';

interface AuthContextType {
  currentUser: User | null;
  demoUsers: User[];
  token: string | null;
  unreadCount: number;
  isLoading: boolean;
  loginAsDemoUser: (userId: string) => Promise<void>;
  logout: () => void;
  toggleFavorite: (listingId: string) => Promise<boolean>;
  refreshNotifications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('campusswap_token');
        const storedUser = localStorage.getItem('campusswap_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setCurrentUser(JSON.parse(storedUser));
        }

        const res = await authService.getDemoUsers();
        if (res.data.success) {
          setDemoUsers(res.data.users);
          if (!storedUser && res.data.users.length > 0) {
            await selectDemoUser(res.data.users[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to initialize demo auth:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (currentUser && token) {
      refreshNotifications();
    }
  }, [currentUser, token]);

  const refreshNotifications = async () => {
    try {
      const res = await enquiryService.getSentEnquiries();
      if (res.data.success) {
        const unread = res.data.enquiries.filter(
          (e) => !e.isReadByBuyer && (e.status === 'Accepted' || e.status === 'Rejected')
        ).length;
        setUnreadCount(unread);
      }
    } catch {
      // Ignore background notification fetch errors
    }
  };

  const selectDemoUser = async (userId: string) => {
    try {
      const res = await authService.demoLogin(userId);
      if (res.data.success) {
        localStorage.setItem('campusswap_token', res.data.token);
        localStorage.setItem('campusswap_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setCurrentUser(res.data.user);
      }
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('campusswap_token');
    localStorage.removeItem('campusswap_user');
    setToken(null);
    setCurrentUser(null);
    setUnreadCount(0);
  };

  const toggleFavorite = async (listingId: string): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await authService.toggleFavorite(listingId);
      if (res.data.success) {
        const updatedFavorites = res.data.savedListings;
        const updatedUser = { ...currentUser, savedListings: updatedFavorites };
        setCurrentUser(updatedUser);
        localStorage.setItem('campusswap_user', JSON.stringify(updatedUser));
        return res.data.isFavorite;
      }
      return false;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        demoUsers,
        token,
        unreadCount,
        isLoading,
        loginAsDemoUser: selectDemoUser,
        logout,
        toggleFavorite,
        refreshNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
