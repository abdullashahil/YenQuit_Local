const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface FiveAQuestion {
  id: number;
  step: 'ask' | 'advise' | 'assess' | 'assist' | 'arrange';
  question_text: string;
  question_type: 'radio' | 'text' | 'textarea' | 'checkbox';
  options?: string[];
  tobacco_category: string;
  content_type?: string;
  content_data?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFiveAQuestionRequest {
  question_text: string;
  question_type: 'radio' | 'text' | 'textarea' | 'checkbox';
  options?: string[];
  step: 'ask' | 'advise' | 'assess' | 'assist' | 'arrange';
  tobacco_category: string;
}

export interface UpdateFiveAQuestionRequest {
  question_text: string;
  question_type: 'radio' | 'text' | 'textarea' | 'checkbox';
  options?: string[];
  tobacco_category?: string;
}

// Get all questions for a specific step (admin)
export async function getFiveAQuestions(step: string, includeInactive: boolean = false): Promise<{ questions: FiveAQuestion[] }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/admin/5a/questions?step=${step}&include_inactive=${includeInactive}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch 5A questions');
  }
  return res.json();
}

// Get a specific question by ID
export async function getFiveAQuestion(id: number): Promise<FiveAQuestion> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/admin/5a/questions/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch 5A question');
  }
  return res.json();
}

// Create a new question
export async function createFiveAQuestion(question: CreateFiveAQuestionRequest): Promise<FiveAQuestion> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/admin/5a/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(question),
  });

  if (!res.ok) {
    throw new Error('Failed to create 5A question');
  }
  return res.json();
}

// Update an existing question
export async function updateFiveAQuestion(id: number, question: UpdateFiveAQuestionRequest): Promise<FiveAQuestion> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/admin/5a/questions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(question),
  });

  if (!res.ok) {
    throw new Error('Failed to update 5A question');
  }
  return res.json();
}

// Soft delete (deactivate) a question
export async function softDeleteFiveAQuestion(id: number): Promise<{ message: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/admin/5a/questions/${id}/deactivate`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to deactivate 5A question');
  }
  return res.json();
}

// Reactivate a question
export async function reactivateFiveAQuestion(id: number): Promise<{ message: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/admin/5a/questions/${id}/activate`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to reactivate 5A question');
  }
  return res.json();
}

// Permanently delete a question
export async function deleteFiveAQuestion(id: number): Promise<{ message: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/admin/5a/questions/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete 5A question');
  }
  return res.json();
}

// Reorder questions (update display_order for multiple questions)
export async function reorderFiveAQuestions(step: string, questionOrders: { id: number; display_order: number }[]): Promise<{ message: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/api/admin/5a/questions/reorder`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ step, questionOrders }),
  });

  if (!res.ok) {
    throw new Error('Failed to reorder 5A questions');
  }
  return res.json();
}
