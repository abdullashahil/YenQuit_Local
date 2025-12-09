const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface FagerstromQuestion {
  id: number;
  question_text: string;
  options: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedFagerstromResponse {
  questions: FagerstromQuestion[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getFagerstromQuestions(page = 1, limit = 50, activeOnly = true): Promise<PaginatedFagerstromResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_URL}/api/fagerstrom?page=${page}&limit=${limit}&active=${activeOnly}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch questions');
  return res.json();
}

export async function getFagerstromQuestionById(id: number): Promise<FagerstromQuestion> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_URL}/api/fagerstrom/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch question');
  return res.json();
}

export async function createFagerstromQuestion(payload: { question_text: string; options: string[] }): Promise<FagerstromQuestion> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_URL}/api/fagerstrom`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create question');
  return res.json();
}

export async function updateFagerstromQuestion(id: number, payload: Partial<{ question_text: string; options: string[]; is_active: boolean }>): Promise<FagerstromQuestion> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_URL}/api/fagerstrom/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update question');
  return res.json();
}

export async function softDeleteFagerstromQuestion(id: number): Promise<{ message: string; id: number; is_active: boolean }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_URL}/api/fagerstrom/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete question');
  return res.json();
}
