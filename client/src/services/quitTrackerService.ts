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
  joinDate?: string | null;
  trackerStartDate?: string | Date;
  daysSmokeFree: number;
  totalGoal: number;
  progressPercentage: number;
  lastEntry: string | null;
  successRate: number;
  logs: any[];
  needsQuestionnaire?: boolean;
  hasCompletedPreSelfEfficacy?: boolean;
  hasCompletedPostSelfEfficacy?: boolean;
  isQuitDatePassed?: boolean;
  assistPlanData?: any;
  is30DaysCompleted?: boolean;
  hasCompletedFeedback?: boolean;
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

      const url = `${API_BASE_URL}/quit-tracker/progress${params.toString() ? '?' + params.toString() : ''}`;

      const response = await axios.get(
        url,
        { headers: getAuthHeaders() }
      );

      const progressData = response.data.data;

      return progressData;
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
  },

  // Get questionnaire questions
  async getQuestionnaire(): Promise<{ data: any[] }> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/quit-tracker/questionnaire`,
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch questionnaire');
    }
  },

  // Get user's questionnaire responses
  async getQuestionnaireResponses(): Promise<{ data: any[] }> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/quit-tracker/questionnaire/responses`,
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch questionnaire responses');
    }
  },

  // Save questionnaire responses
  async saveQuestionnaireResponses(responses: { questionId: number; value: string }[]): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/quit-tracker/questionnaire/responses`,
        { responses },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      handleApiError(error, 'Failed to save questionnaire responses');
    }
  },

  // Save post self-efficacy responses
  async savePostSelfEfficacyResponses(responses: { questionId: number; value: string }[]): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/quit-tracker/post-self-efficacy/responses`,
        { responses },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      handleApiError(error, 'Failed to save post self-efficacy responses');
    }
  },

  // Get user settings
  async getSettings(): Promise<{ data: any }> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/quit-tracker/settings`,
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch settings');
    }
  },

  // Update user settings
  async updateSettings(settings: {
    goalDays?: number;
    reminderTime?: string;
    isTrackingEnabled?: boolean;
  }): Promise<{ data: any }> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/quit-tracker/settings`,
        settings,
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update settings');
    }
  },

  // Get specific user's quit tracker progress for admin
  async getAdminUserProgress(userId: string): Promise<ProgressResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/quit-tracker/admin/user/${userId}/progress`,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      handleApiError(error, `Failed to fetch progress data for user ${userId}`);
    }
  },

  // Get all logs for modal view
  async getAllLogs(options: { page?: number; limit?: number } = {}): Promise<LogsResponse> {
    try {
      const params = new URLSearchParams();

      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());

      const response = await axios.get(
        `${API_BASE_URL}/quit-tracker/all-logs?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      return response.data.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch all logs');
    }
  },

  // Get feedback questions
  async getFeedbackQuestions(): Promise<{ data: any[] }> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/quit-tracker/feedback/questions`,
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch feedback questions');
    }
  },

  // Save user feedback
  async saveUserFeedback(responses: { questionId: number; value: string }[]): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/quit-tracker/feedback`,
        { responses },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      handleApiError(error, 'Failed to save feedback');
    }
  }
};

export default quitTrackerService;
