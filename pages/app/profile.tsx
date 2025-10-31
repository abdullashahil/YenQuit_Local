import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AppLayout } from '../../src/components/layouts/AppLayout'
import { ProfileHub } from '../../src/components/features/profile/ProfileHub'

export default function Profile() {
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
    <AppLayout activeTab="profile">
      <ProfileHub />
    </AppLayout>
  )
}
