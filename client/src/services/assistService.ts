const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
};

// Helper function to make API requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Types
export interface CopingStrategy {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationTemplate {
  id: number;
  key: string;
  title: string;
  default_time: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserNotification {
  id: number;
  template_id: number;
  enabled: boolean;
  time: string | null;
  created_at: string;
  updated_at: string;
  template: {
    id: number;
    key: string;
    title: string;
    default_time: string | null;
  };
}

export interface AssistPlan {
  id: number;
  quit_date: string | null;
  triggers: string | null;
  created_at: string;
  updated_at: string;
  strategies: Array<{
    strategy_id: number;
    strategy_name: string;
    strategy_description: string | null;
  }>;
}

export interface CreateAssistPlanRequest {
  quitDate?: string;
  triggers?: string;
  selectedStrategyIds: number[];
}

export interface UpsertNotificationsRequest {
  notifications: Array<{
    template_id: number;
    enabled: boolean;
    time?: string;
  }>;
}

// Coping Strategies
export const getCopingStrategies = async (isActiveOnly = true): Promise<CopingStrategy[]> => {
  const response = await apiRequest(`/assist/strategies${isActiveOnly ? '?active=true' : '?active=false'}`);
  return response.data;
};

// Notification Templates
export const getNotificationTemplates = async (isActiveOnly = true): Promise<NotificationTemplate[]> => {
  const response = await apiRequest(`/assist/notification-templates${isActiveOnly ? '?active=true' : '?active=false'}`);
  return response.data;
};

// User Assist Plan
export const getUserAssistPlan = async (): Promise<AssistPlan | null> => {
  const response = await apiRequest('/assist/users/me/assist');
  return response.data;
};

export const createOrUpdateUserAssistPlan = async (data: CreateAssistPlanRequest): Promise<AssistPlan> => {
  const response = await apiRequest('/assist/users/me/assist', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const completeAssistPlan = async () => {
  const response = await apiRequest('/assist/users/me/assist/complete', {
    method: 'POST',
  });
  return response.data;
};

// User Notifications
export const getUserNotifications = async (): Promise<UserNotification[]> => {
  const response = await apiRequest('/assist/users/me/notifications');
  return response.data;
};

export const upsertUserNotifications = async (data: UpsertNotificationsRequest): Promise<UserNotification[]> => {
  const response = await apiRequest('/assist/users/me/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
};

// Admin Functions
export const createCopingStrategy = async (data: { name: string; description?: string }): Promise<CopingStrategy> => {
  const response = await apiRequest('/assist/admin/assist/strategies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const updateCopingStrategy = async (id: number, data: { name?: string; description?: string; is_active?: boolean }): Promise<CopingStrategy> => {
  const response = await apiRequest(`/assist/admin/assist/strategies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const softDeleteCopingStrategy = async (id: number) => {
  const response = await apiRequest(`/assist/admin/assist/strategies/${id}`, {
    method: 'DELETE',
  });
  return response.data;
};

// Hard delete a coping strategy (permanent deletion)
export const hardDeleteCopingStrategy = async (id: number) => {
  const response = await apiRequest(`/assist/admin/assist/strategies/${id}?hard=true`, {
    method: 'DELETE',
  });
  return response.data;
};

export const createNotificationTemplate = async (data: { key: string; title: string; default_time?: string }): Promise<NotificationTemplate> => {
  const response = await apiRequest('/assist/admin/assist/notification-templates', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const updateNotificationTemplate = async (id: number, data: { key?: string; title?: string; default_time?: string; is_active?: boolean }): Promise<NotificationTemplate> => {
  const response = await apiRequest(`/assist/admin/assist/notification-templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const softDeleteNotificationTemplate = async (id: number) => {
  const response = await apiRequest(`/assist/admin/assist/notification-templates/${id}`, {
    method: 'DELETE',
  });
  return response.data;
};

export const getAssistHistory = async (page = 1, limit = 50) => {
  const response = await apiRequest(`/assist/admin/assist/history?page=${page}&limit=${limit}`);
  return response;
};
