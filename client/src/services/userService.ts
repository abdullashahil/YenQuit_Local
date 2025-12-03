import axios from 'axios';
import { handleApiError } from '../utils/authErrorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Handle file uploads (multipart/form-data)
const getAuthHeadersForUpload = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const userService = {
  // Get all users with pagination and filters
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  } = {}) {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.role && params.role !== 'all') searchParams.append('role', params.role);
      if (params.status && params.status !== 'all') searchParams.append('status', params.status);

      const headers = getAuthHeaders();
      console.log('Request headers:', headers);
      console.log('Request URL:', `${API_BASE_URL}/users/admin/users?${searchParams.toString()}`);

      const response = await axios.get(
        `${API_BASE_URL}/users/admin/users?${searchParams.toString()}`,
        { headers }
      );

      return response.data;
    } catch (error: any) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      handleApiError(error, 'Failed to fetch users');
    }
  },

  // Get user by ID
  async getUserById(id: string) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/admin/users/${id}`,
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  // Create new user
  async createUser(userData: {
    email: string;
    password: string;
    role?: string;
    status?: string;
    name?: string;
    bio?: string;
    phone?: string;
    age?: number;
    fagerstrom_score?: number;
    addiction_level?: string;
    join_date?: string;
  }) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/admin/users`,
        userData,
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  // Update user
  async updateUser(id: string, userData: {
    email?: string;
    role?: string;
    status?: string;
    name?: string;
    bio?: string;
    phone?: string;
    age?: number;
    fagerstrom_score?: number;
    addiction_level?: string;
    join_date?: string;
    avatar_url?: string;
  }) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/admin/users/${id}`,
        userData,
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  // Update user avatar
  async updateAvatar(id: string, file: File) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.put(
        `${API_BASE_URL}/users/admin/users/${id}/avatar`,
        formData,
        { 
          headers: {
            ...getAuthHeadersForUpload(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update avatar');
    }
  },

  // Delete user
  async deleteUser(id: string) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/users/admin/users/${id}`,
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  // Get user statistics
  async getUserStats() {
    try {
      const headers = getAuthHeaders();
      console.log('Stats request headers:', headers);
      console.log('Stats request URL:', `${API_BASE_URL}/users/admin/users/stats`);

      const response = await axios.get(
        `${API_BASE_URL}/users/admin/users/stats`,
        { headers }
      );

      return response.data;
    } catch (error: any) {
      console.error('Full stats error:', error);
      console.error('Stats error response:', error.response?.data);
      console.error('Stats error status:', error.response?.status);
      handleApiError(error, 'Failed to fetch user statistics');
    }
  },

  // Profile management methods
  getProfile: async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(
        `${API_BASE_URL}/users/profile`,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  updateProfile: async (profileData) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.put(
        `${API_BASE_URL}/users/profile`,
        profileData,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  uploadAvatar: async (file) => {
    try {
      const headers = getAuthHeadersForUpload();
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(
        `${API_BASE_URL}/users/upload-avatar`,
        formData,
        { 
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      throw new Error(error.response?.data?.message || 'Failed to upload avatar');
    }
  },

  logout: async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.post(
        `${API_BASE_URL}/users/logout`,
        {},
        { headers }
      );
      
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      return response.data;
    } catch (error) {
      // Clear local storage even if server logout fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      sessionStorage.clear();
      throw error;
    }
  },

  // Get user answers
  getUserAnswers: async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(
        `${API_BASE_URL}/fivea/answers`,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user answers');
    }
  },

  // Get user progress data for admin
  getUserProgress: async (userId: string) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(
        `${API_BASE_URL}/quit-tracker/admin/user/${userId}/progress`,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user progress:', error);
      // Return null if endpoint doesn't exist yet, allowing fallback to calculated engagement
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch user progress');
    }
  }
};

export default userService;
