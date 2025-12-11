import { LandingPage } from '../src/components/features/landing/LandingPage';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Check if user is logged in
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        if (token) {
          // User is logged in, check their role
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

          try {
            const response = await fetch(`${API_URL}/users/profile`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              const userRole = data.user?.role || 'user';

              // Redirect based on role
              if (userRole === 'admin' || userRole === 'super_admin') {
                router.replace('/admin');
              } else {
                router.replace('/app');
              }
              return;
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // If profile fetch fails, clear invalid token
            localStorage.removeItem('accessToken');
          }
        }

        // No valid token, show landing page
        setIsChecking(false);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-gray-50 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return <LandingPage />;
}
