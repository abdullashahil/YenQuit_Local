import axios from 'axios';
import { handleApiError } from '../utils/authErrorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Role Management Service
export const roleManagementService = {
  // Get all admins
  async getAdmins() {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/admins`, {
        headers: getAuthHeaders()
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching admins:', error);
      handleApiError(error, 'Failed to fetch admins');
    }
  },

  // Promote user to admin
  async promoteUser(userId: number) {
    try {
      const response = await axios.patch(`${API_BASE_URL}/users/user/${userId}/promote`, 
        {},
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error promoting user:', error);
      handleApiError(error, 'Failed to promote user');
    }
  },

  // Demote admin to user
  async demoteAdmin(adminId: string) {
    try {
      const response = await axios.patch(`${API_BASE_URL}/users/admin/${adminId}/demote`, 
        {},
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error demoting admin:', error);
      handleApiError(error, 'Failed to demote admin');
    }
  },

  // Get non-admin users for promotion
  async getNonAdminUsers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/non-admin-users`, {
        headers: getAuthHeaders()
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching non-admin users:', error);
      handleApiError(error, 'Failed to fetch users');
    }
  }
};

export default roleManagementService;
