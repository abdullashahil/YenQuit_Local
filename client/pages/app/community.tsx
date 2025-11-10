import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AppLayout } from '../../src/components/layouts/AppLayout'
import { CommunityHub } from '../../src/components/features/community/CommunityHub'

export default function Community() {
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
    <AppLayout activeTab="community">
      <CommunityHub />
    </AppLayout>
  )
}
