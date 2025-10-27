import { useRouter } from 'next/router'
import { LandingPage } from '../src/components/features/landing/LandingPage'

export default function Home() {
  const router = useRouter()

  return (
    <LandingPage
      onNavigateToLogin={() => router.push('/login')}
      onNavigateToSignup={() => router.push('/login')}
    />
  )
}
