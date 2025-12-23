import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Helpline {
    id: number;
    title: string;
    description: string;
    phone_number: string;
    icon_name: string;
    display_order: number;
    is_active: boolean;
}

export interface CreateHelplineRequest {
    title: string;
    description?: string;
    phone_number: string;
    display_order?: number;
}

export interface UpdateHelplineRequest {
    title?: string;
    description?: string;
    phone_number?: string;
    display_order?: number;
    is_active?: boolean;
}

// Get auth token from localStorage
const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) throw new Error('No authentication token found');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const helplineService = {
    getHelplines: async () => {
        return axios.get<{ success: boolean; data: Helpline[] }>(`${API_BASE_URL}/helplines`);
    },

    createHelpline: async (data: CreateHelplineRequest) => {
        return axios.post<{ success: boolean; data: Helpline }>(
            `${API_BASE_URL}/helplines`,
            data,
            { headers: getAuthHeaders() }
        );
    },

    updateHelpline: async (id: number, data: UpdateHelplineRequest) => {
        return axios.put<{ success: boolean; data: Helpline }>(
            `${API_BASE_URL}/helplines/${id}`,
            data,
            { headers: getAuthHeaders() }
        );
    },

    deleteHelpline: async (id: number) => {
        return axios.delete<{ success: boolean; message: string }>(
            `${API_BASE_URL}/helplines/${id}`,
            { headers: getAuthHeaders() }
        );
    }
};
