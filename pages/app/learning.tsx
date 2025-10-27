import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AppLayout } from '../../src/components/layouts/AppLayout'
import { LearningHub } from '../../src/components/features/learning/LearningHub'

export default function Learning() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const userType = sessionStorage.getItem('userType')
      if (!userType) {
        router.push('/login')
      }
    }
  }, [router])

  // LearningHub expects activeTab and setActiveTab props, but we handle routing in AppLayout
  // We'll need to modify LearningHub or create a wrapper
  return (
    <AppLayout activeTab="learning">
      <LearningHub 
        activeTab="learning" 
        setActiveTab={() => {}} 
        onLogout={() => {
          if (typeof window !== 'undefined') {
            sessionStorage.clear()
          }
          router.push('/')
        }} 
      />
    </AppLayout>
  )
}
