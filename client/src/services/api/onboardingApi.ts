import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface OnboardingData {
  name: string;
  age: string;
  gender: string;
  isStudent: string;
  yearOfStudy?: string;
  streamOfStudy?: string;
  email: string;
  contactNumber: string;
  place: string;
  setting: string;
  tobaccoType: string;
  smokerType?: string;
  systemicHealthIssue: string;
  password: string; // Add password field for registration
}

export const submitOnboarding = async (data: OnboardingData) => {
  try {
    // Prepare profile data for the backend
    const profileData = {
      email: data.email,
      password: data.password,
      profile: {
        full_name: data.name,
        age: parseInt(data.age, 10),
        gender: data.gender,
        phone: data.contactNumber,
        metadata: {
          isStudent: data.isStudent === 'yes',
          yearOfStudy: data.yearOfStudy || null,
          streamOfStudy: data.streamOfStudy || null,
          place: data.place,
          setting: data.setting,
          tobaccoType: data.tobaccoType,
          smokerType: data.smokerType || null,
          systemicHealthIssue: data.systemicHealthIssue
        }
      }
    };

    // Register the user with their profile
    const response = await axios.post(`${API_BASE_URL}/auth/register`, profileData);
    
    // Save tokens to local storage or context
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error submitting onboarding:', error);
    throw error.response?.data || { error: 'An error occurred during onboarding' };
  }
};
