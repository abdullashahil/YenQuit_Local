import { FiveA_Assess } from '../../src/components/features/flow-5a/Assess';
import { useRouter } from 'next/router';

export default function AssessPage() {
  const router = useRouter();
  
  const handleNext = async (data: any) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        await fetch(`${API_URL}/api/onboarding/progress`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ step: 3 })
        });
      }
    } catch (e) {
    }
    router.push('/5a/assist');
  };

  return <FiveA_Assess onNext={handleNext} />;
}
