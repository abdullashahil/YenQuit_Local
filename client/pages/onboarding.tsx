import { useRouter } from 'next/router'
import { InitialOnboarding, OnboardingData } from '../src/components/features/onboarding/InitialOnboarding'

export default function Onboarding() {
  const router = useRouter()

  const handleOnboardingComplete = async (data: OnboardingData, pathway: '5As' | '5Rs') => {
    // Persist onboarding data locally (optional)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('onboardingData', JSON.stringify(data))
      sessionStorage.setItem('onboardingPathway', pathway)
      sessionStorage.setItem('userType', 'standard')
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const signupEmail = (typeof window !== 'undefined' && sessionStorage.getItem('signupEmail')) || data.email
    const signupPassword = typeof window !== 'undefined' ? sessionStorage.getItem('signupPassword') : null
    const signupFullName = (typeof window !== 'undefined' && sessionStorage.getItem('signupFullName')) || data.name

    if (!signupEmail || !signupPassword) {
      alert('Missing signup credentials. Please start from the Sign Up page again.')
      router.push('/login')
      return
    }

    // Build profile payload mapping onboarding to server schema
    const profile = {
      full_name: signupFullName || data.name || '',
      phone: data.contactNumber || null,
      age: data.age ? parseInt(data.age as any, 10) : null,
      gender: data.gender || null,
      tobacco_type: data.tobaccoType || null,
      metadata: {
        isStudent: data.isStudent,
        yearOfStudy: data.yearOfStudy,
        streamOfStudy: data.streamOfStudy,
        place: data.place,
        setting: data.setting,
        smokerType: data.smokerType,
        systemicHealthIssue: data.systemicHealthIssue,
        providedEmail: data.email
      }
    }

    // Try to register the user with profile
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          role: 'user',
          profile
        })
      })
      if (!res.ok) {
        const dataErr = await res.json().catch(() => ({}))
        // If already exists, proceed to login; else show error
        if (res.status !== 409) throw new Error(dataErr?.error || 'Registration failed')
      }
    } catch (err: any) {
      alert(err?.message || 'Registration failed')
      return
    }

    // Login to obtain tokens and user info
    try {
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, password: signupPassword })
      })
      const loginData = await loginRes.json()
      if (!loginRes.ok) throw new Error(loginData?.error || 'Login failed')
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', loginData.accessToken)
        localStorage.setItem('refreshToken', loginData.refreshToken)
        localStorage.setItem('user', JSON.stringify(loginData.user))
      }
    } catch (err: any) {
      alert(err?.message || 'Login failed')
      return
    }

    // Navigate to the selected pathway
    if (pathway === '5As') {
      router.push('/5a/ask')
    } else {
      router.push('/5r/relevance')
    }
  }

  return <InitialOnboarding onComplete={handleOnboardingComplete} />
}
