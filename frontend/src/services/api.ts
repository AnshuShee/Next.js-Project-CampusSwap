import axios from 'axios';
import { FilterOptions, Listing, Enquiry, User } from '@/types/marketplace';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('campusswap_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authService = {
  getDemoUsers: () => api.get<{ success: boolean; users: User[] }>('/auth/demo-users'),
  demoLogin: (userId: string) =>
    api.post<{ success: boolean; token: string; user: User }>(`/auth/demo-login/${userId}`),
  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; token: string; user: User }>('/auth/login', data),
  register: (data: Partial<User> & { password: string }) =>
    api.post<{ success: boolean; token: string; user: User }>('/auth/register', data),
  getProfile: (id: string) =>
    api.get<{ success: boolean; profile: User; activeListings: Listing[]; soldListings: Listing[] }>(
      `/auth/profile/${id}`
    ),
  toggleFavorite: (listingId: string) =>
    api.post<{ success: boolean; isFavorite: boolean; savedListings: string[] }>(`/auth/favorites/${listingId}`),
  getFavorites: () => api.get<{ success: boolean; favorites: Listing[] }>('/auth/favorites'),
};

export const listingService = {
  getListings: (filters: Partial<FilterOptions>) =>
    api.get<{ success: boolean; count: number; listings: Listing[] }>('/listings', { params: filters }),
  getListingById: (id: string) =>
    api.get<{ success: boolean; listing: Listing; similarListings: Listing[] }>(`/listings/${id}`),
  createListing: (data: Partial<Listing>) => api.post<{ success: boolean; listing: Listing }>('/listings', data),
  updateListing: (id: string, data: Partial<Listing>) =>
    api.put<{ success: boolean; listing: Listing }>(`/listings/${id}`, data),
  updateStatus: (id: string, status: string) =>
    api.patch<{ success: boolean; listing: Listing }>(`/listings/${id}/status`, { status }),
  deleteListing: (id: string) => api.delete<{ success: boolean; message: string }>(`/listings/${id}`),
  getMyListings: () => api.get<{ success: boolean; count: number; listings: Listing[] }>('/listings/seller/me'),
};

export const enquiryService = {
  createEnquiry: (data: { listingId: string; message: string; offerPrice?: number | null }) =>
    api.post<{ success: boolean; enquiry: Enquiry }>('/enquiries', data),
  getReceivedEnquiries: () =>
    api.get<{ success: boolean; count: number; enquiries: Enquiry[] }>('/enquiries/received'),
  getSentEnquiries: () => api.get<{ success: boolean; count: number; enquiries: Enquiry[] }>('/enquiries/sent'),
  respondToEnquiry: (id: string, data: { status: 'Accepted' | 'Rejected'; sellerReplyNote?: string }) =>
    api.patch<{ success: boolean; enquiry: Enquiry; message: string }>(`/enquiries/${id}/respond`, data),
  markRead: () => api.patch<{ success: boolean; message: string }>('/enquiries/mark-read'),
};

export default api;
