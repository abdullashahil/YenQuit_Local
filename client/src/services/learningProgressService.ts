import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface LearningProgressCountResponse {
  count: number;
  hasCompletedMilestone: boolean;
  milestoneThreshold: number;
}

export interface LearningProgressItem {
  id: string;
  title: string;
  content: string;
  category: string;
  media_url?: string;
  thumbnail_url?: string;
  author?: string;
  duration?: string;
}

export interface LearningProgressResponse {
  items: LearningProgressItem[];
}

class LearningProgressService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  // Get user's learning progress count for milestone tracking
  async getProgressCount(): Promise<LearningProgressCountResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/learning-progress/count`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching learning progress count:', error);
      throw error;
    }
  }

  // Get user's learning progress (last 3 visited items)
  async getProgress(): Promise<LearningProgressResponse> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/learning-progress`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching learning progress:', error);
      throw error;
    }
  }

  // Add content to user's learning progress
  async addToProgress(contentId: string): Promise<{ message: string; contentIds: string[] }> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/learning-progress`,
        { contentId },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error adding content to progress:', error);
      throw error;
    }
  }
}

export default new LearningProgressService();
