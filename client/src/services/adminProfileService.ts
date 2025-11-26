import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateAdminProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Get admin profile
export const getAdminProfile = async (): Promise<ApiResponse<AdminProfile>> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/admin/profile`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch admin profile');
  }
};

// Update admin profile
export const updateAdminProfile = async (profileData: UpdateAdminProfileData): Promise<ApiResponse<AdminProfile>> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/admin/profile`,
      profileData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    throw new Error(error.response?.data?.message || 'Failed to update admin profile');
  }
};

// Change admin password
export const changeAdminPassword = async (passwordData: ChangePasswordData): Promise<ApiResponse<null>> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/admin/change-password`,
      passwordData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};
