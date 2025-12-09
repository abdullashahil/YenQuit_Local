import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface RelevanceOption {
  id: number;
  option_key: string;
  label: string;
  description: string;
  icon_name: string;
}

export interface UserRelevanceSelection {
  userId: string; // UUID as string
  selectedOptions: number[];
}

export interface User5RProgress {
  current_step: string;
  is_completed: boolean;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
}

class FiverService {
  // Get all relevance options
  async getRelevanceOptions(): Promise<RelevanceOption[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/fiver/relevance-options`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching relevance options:', error);
      throw error;
    }
  }

  // Save user relevance selections
  async saveUserRelevanceSelections(selections: UserRelevanceSelection): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/api/fiver/relevance-selections`, selections);
    } catch (error) {
      console.error('Error saving relevance selections:', error);
      throw error;
    }
  }

  // Get user relevance selections
  async getUserRelevanceSelections(userId: string): Promise<RelevanceOption[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/fiver/relevance-selections/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user relevance selections:', error);
      throw error;
    }
  }

  // Get user 5R progress
  async getUser5RProgress(userId: string): Promise<User5RProgress | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/fiver/progress/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user 5R progress:', error);
      throw error;
    }
  }
}

export const fiverService = new FiverService();
