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

  return (
    <AppLayout activeTab="learning">
      <LearningHub />
    </AppLayout>
  )
}
