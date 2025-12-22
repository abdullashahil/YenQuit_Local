import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface RelevanceOption {
  id: number;
  option_key: string;
  label: string;
  description: string;
  icon_name: string;
}

export interface User5RSelection {
  userId: number;
  step: string;
  selections: any; // Can be number[] for IDs or objects
}

export interface User5RProgress {
  current_step: string;
  is_completed: boolean;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
  selections: Record<string, any>; // The consolidated JSONB data
}

class FiverService {
  // Get all relevance options
  async getRelevanceOptions(): Promise<RelevanceOption[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/fiver/relevance-options`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching relevance options:', error);
      throw error;
    }
  }

  // Save user 5R selections (Relevance, Risks, Rewards, Roadblocks)
  async saveUser5RSelections(data: User5RSelection): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/fiver/selections`, data);
    } catch (error) {
      console.error(`Error saving ${data.step} selections:`, error);
      throw error;
    }
  }

  // Get user 5R selections for a specific step
  async getUser5RSelections(userId: number, step: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/fiver/selections/${userId}/${step}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching ${step} selections:`, error);
      throw error;
    }
  }

  // Get user 5R progress
  async getUser5RProgress(userId: number): Promise<User5RProgress | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/fiver/progress/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user 5R progress:', error);
      throw error;
    }
  }
}

export const fiverService = new FiverService();
