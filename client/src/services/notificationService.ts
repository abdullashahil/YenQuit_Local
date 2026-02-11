const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface NotificationPreference {
    id: number;
    key: string;
    time: string | null;
    title: string;
    enabled: boolean;
    template_id: number;
    default_time: string;
    created_at: string;
    updated_at: string;
}

export interface NotificationPreferencesResponse {
    notifications: NotificationPreference[];
}

/**
 * Fetch user's notification preferences from fivea_history
 */
export async function getUserNotificationPreferences(): Promise<NotificationPreferencesResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!token) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/assist/users/me/notification-preferences`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch notification preferences');
    }

    return response.json();
}
