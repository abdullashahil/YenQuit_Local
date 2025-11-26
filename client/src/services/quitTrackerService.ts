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

interface ProgressOptions {
  startDate?: string;
  endDate?: string;
  goalDays?: number;
}

interface LogData {
  log_date: string;
  smoked: boolean;
  cigarettes_count?: number;
  cravings_level?: number;
  mood?: number;
  notes?: string;
}

interface LogsOptions {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface ProgressResponse {
  quitDate: string | null;
  daysSmokeFree: number;
  totalGoal: number;
  progressPercentage: number;
  lastEntry: string | null;
  successRate: number;
  logs: any[];
}

interface LogResponse {
  id: string;
  user_id: string;
  log_date: string;
  smoked: boolean;
  cigarettes_count: number | null;
  cravings_level: number | null;
  mood: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface LogsResponse {
  logs: LogResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const quitTrackerService = {
  // Get user's quit tracker progress
  async getProgress(options: ProgressOptions = {}): Promise<ProgressResponse> {
    try {
      const params = new URLSearchParams();
      
      if (options.startDate) params.append('startDate', options.startDate);
      if (options.endDate) params.append('endDate', options.endDate);
      if (options.goalDays) params.append('goalDays', options.goalDays.toString());
      
      const response = await axios.get(
        `${API_BASE_URL}/quit-tracker/progress?${params.toString()}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch progress data');
    }
  },

  // Create or update daily log
  async createOrUpdateLog(logData: LogData): Promise<LogResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/quit-tracker/log`,
        logData,
        { headers: getAuthHeaders() }
      );
      
      return response.data.data;
    } catch (error) {
      handleApiError(error, 'Failed to save log');
    }
  },

  // Update a specific log by ID
  async updateLog(id: string, logData: Partial<LogData>): Promise<LogResponse> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/quit-tracker/log/${id}`,
        logData,
        { headers: getAuthHeaders() }
      );
      
      return response.data.data;
    } catch (error) {
      handleApiError(error, 'Failed to update log');
    }
  },

  // Delete a log by ID
  async deleteLog(id: string): Promise<LogResponse> {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/quit-tracker/log/${id}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data.data;
    } catch (error) {
      handleApiError(error, 'Failed to delete log');
    }
  },

  // Get logs with pagination
  async getLogs(options: LogsOptions = {}): Promise<LogsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (options.startDate) params.append('startDate', options.startDate);
      if (options.endDate) params.append('endDate', options.endDate);
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      
      const response = await axios.get(
        `${API_BASE_URL}/quit-tracker/logs?${params.toString()}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch logs');
    }
  },

  // Get a specific log by ID
  async getLogById(id: string): Promise<LogResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/quit-tracker/logs/${id}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch log');
    }
  },

  // Update quit date
  async updateQuitDate(quitDate: string | null): Promise<{ quit_date: string | null }> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/quit-tracker/quit-date`,
        { quit_date: quitDate },
        { headers: getAuthHeaders() }
      );
      
      return response.data.data;
    } catch (error) {
      handleApiError(error, 'Failed to update quit date');
    }
  }
};

export default quitTrackerService;
