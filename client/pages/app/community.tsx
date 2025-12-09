import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AppLayout } from '../../src/components/layouts/AppLayout'
import { CommunityHub } from '../../src/components/features/community/CommunityHub'

export default function Community() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated - look for accessToken in localStorage
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        console.log('No access token found, redirecting to login')
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
