const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface PersonalRoadblockQuestion {
  id: number;
  question_text: string;
  placeholder: string;
  question_type: 'challenge' | 'strategy';
  display_order: number;
}

export interface UserPersonalRoadblock {
  id: number;
  question_id: number;
  response: string;
  question_text: string;
  question_type: 'challenge' | 'strategy';
}

export interface PersonalRoadblocksContent {
  questions: PersonalRoadblockQuestion[];
}

export interface UserPersonalRoadblocksContent {
  responses: UserPersonalRoadblock[];
}

// Get personal roadblock questions for the Roadblocks page
export async function getPersonalRoadblockQuestions(): Promise<PersonalRoadblocksContent> {
  const res = await fetch(`${API_URL}/personal-roadblocks/questions`);
  if (!res.ok) {
    throw new Error('Failed to fetch personal roadblock questions');
  }
  return res.json();
}

// Get user's personal roadblock responses (requires authentication)
export async function getUserPersonalRoadblocks(): Promise<UserPersonalRoadblocksContent> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/personal-roadblocks/responses`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user personal roadblocks');
  }
  return res.json();
}

// Save user's personal roadblock response (requires authentication)
export async function saveUserPersonalRoadblock(questionId: number, response: string): Promise<UserPersonalRoadblock> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/personal-roadblocks/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ questionId, response }),
  });

  if (!res.ok) {
    throw new Error('Failed to save personal roadblock response');
  }
  return res.json();
}

// Delete user's personal roadblock response (requires authentication)
export async function deleteUserPersonalRoadblock(questionId: number): Promise<{ message: string; deletedResponse: UserPersonalRoadblock }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/personal-roadblocks/responses/${questionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete personal roadblock response');
  }
  return res.json();
}

// Admin functions (require authentication)
export async function createPersonalRoadblockQuestion(questionData: Partial<PersonalRoadblockQuestion>): Promise<PersonalRoadblockQuestion> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/personal-roadblocks/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(questionData),
  });

  if (!res.ok) {
    throw new Error('Failed to create personal roadblock question');
  }
  return res.json();
}

export async function updatePersonalRoadblockQuestion(id: number, questionData: Partial<PersonalRoadblockQuestion>): Promise<PersonalRoadblockQuestion> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/personal-roadblocks/questions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(questionData),
  });

  if (!res.ok) {
    throw new Error('Failed to update personal roadblock question');
  }
  return res.json();
}

export async function deletePersonalRoadblockQuestion(id: number): Promise<{ message: string; question: PersonalRoadblockQuestion }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${API_URL}/personal-roadblocks/questions/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete personal roadblock question');
  }
  return res.json();
}
