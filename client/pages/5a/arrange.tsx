import { useRouter } from 'next/router'
import { useAppContext } from '../../src/context/AppContext'
import { FiveA_Arrange } from '../../src/components/features/flow-5a/Arrange'

export default function Arrange() {
  const router = useRouter()
  const { fiveAData, setFiveAData } = useAppContext()

  const handleComplete = () => {
    // Optionally persist any arrange data in context beforehand
    ;(async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        if (token) {
          await fetch(`${API_URL}/api/onboarding/progress`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ step: 5 })
          })
        }
      } catch (e) {
        // ignore
      }
      router.push('/app')
    })()
  }

  return <FiveA_Arrange onComplete={handleComplete} quitDate={fiveAData.assist?.quitDate} />
}
