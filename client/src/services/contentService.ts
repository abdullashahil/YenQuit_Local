import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type PublicContentType = 'video' | 'podcast' | 'image';

export interface PublicContentItem {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  content?: string | null;
  media_url?: string | null;
  tags?: string[] | null;
  status: string;
  publish_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const contentService = {
  async getPublicContent(params?: { type?: PublicContentType; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const url = `${API_BASE_URL}/content/public${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await axios.get(url);
    return res.data; // { success, message, data, pagination? }
  },

  async getPublicContentById(id: string) {
    const res = await axios.get(`${API_BASE_URL}/content/public/${id}`);
    return res.data; // { success, message, data }
  }
};

export default contentService;
