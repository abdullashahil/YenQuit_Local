import { useRouter } from 'next/router'
import { LoginSignUp } from '../src/components/features/auth/LoginSignUp'
import { useEffect } from 'react'

export default function Login() {
  const router = useRouter()

  const handleLogin = (type: 'admin' | 'standard') => {
    // Store user type in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userType', type)
    }
    
    if (type === 'admin') {
      router.push('/admin')
    } else {
      router.push('/app')
    }
  }

  const handleSignUp = () => {
    router.push('/onboarding')
  }

  return (
    <LoginSignUp
      onLogin={handleLogin}
      onSignUp={handleSignUp}
      onBackToLanding={() => router.push('/')}
    />
  )
}
