import { useRouter } from 'next/router'
import { useAppContext } from '../../src/context/AppContext'
import { FiveA_Assist } from '../../src/components/features/flow-5a/Assist'

export default function AssistPage() {
  const router = useRouter()
  const { fiveAData, setFiveAData } = useAppContext()

  const handleNext = (data: any) => {
    setFiveAData({ ...fiveAData, assist: data })
  }

  const handleComplete = () => {
    (async () => {
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
            body: JSON.stringify({ step: 4 })
          });
        }
      } catch (e) {
        // ignore
      }
      router.push('/5a/arrange')
    })();
  }

  return (
    <FiveA_Assist 
      onNext={handleNext} 
      onComplete={handleComplete} 
    />
  )
}
