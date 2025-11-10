import { useRouter } from 'next/router'
import { InitialOnboarding, OnboardingData } from '../src/components/features/onboarding/InitialOnboarding'

export default function Onboarding() {
  const router = useRouter()

  const handleOnboardingComplete = (data: OnboardingData, pathway: '5As' | '5Rs') => {
    // Store onboarding data in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('onboardingData', JSON.stringify(data))
      sessionStorage.setItem('onboardingPathway', pathway)
      sessionStorage.setItem('userType', 'standard')
    }
    
    if (pathway === '5As') {
      router.push('/5a/ask')
    } else {
      router.push('/5r/relevance')
    }
  }

  return <InitialOnboarding onComplete={handleOnboardingComplete} />
}
