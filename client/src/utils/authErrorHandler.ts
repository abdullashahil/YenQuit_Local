// Handle authentication errors and redirect to login
export const handleAuthError = (error: any) => {
  console.error('Auth error handler triggered:', error);
  
  // Check for authentication errors
  if (error.response?.status === 401 || error.response?.status === 403) {
    console.log('Authentication error detected, redirecting to login');
    
    // Clear stored auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Redirect to login using window.location (works outside React components)
      window.location.href = '/login';
    }
    
    return true; // Indicates that auth error was handled
  }
  
  return false; // Not an auth error
};

// Enhanced axios error handler for API calls
export const handleApiError = (error: any, customMessage?: string) => {
  // First check if it's an auth error
  const isAuthError = handleAuthError(error);
  if (isAuthError) {
    return; // Don't throw additional errors for auth issues
  }
  
  // Handle other API errors
  const errorMessage = error.response?.data?.message || 
                      customMessage || 
                      error.message || 
                      'An unexpected error occurred';
  
  console.error('API Error:', errorMessage);
  throw new Error(errorMessage);
};
