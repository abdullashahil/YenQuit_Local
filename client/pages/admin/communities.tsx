import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AdminLayout } from '../../src/components/layouts/AdminLayout'
import AdminCommunityManagement from '../../src/components/admin/AdminCommunityManagement'

export default function AdminCommunities() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated as admin
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          if (user.role !== 'admin' && user.role !== 'super_admin') {
            router.push('/login')
          }
        } catch {
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }
  }, [router])

  const handleEditCommunity = (community: any) => {
    // TODO: Implement edit functionality
    console.log('Edit community:', community)
  }

  return (
    <AdminLayout activeTab="communities">
      <AdminCommunityManagement onEditCommunity={handleEditCommunity} />
    </AdminLayout>
  )
}
