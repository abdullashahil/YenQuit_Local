// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Common API Endpoints
export const API_ENDPOINTS = {
  YENQUIT_CHAT: '/api/yenquit-chat',
  CHAT_HISTORY: (userId: number) => `/api/yenquit-chat/history/${userId}`,
};
