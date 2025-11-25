import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AdminLayout } from '../../src/components/layouts/AdminLayout'
import { UserManagement } from '../../src/components/admin/UserManagement'

export default function Admin() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated as admin
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          if (user.role !== 'admin') {
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

  return (
    <AdminLayout activeTab="user-management">
      <UserManagement 
        activeTab="user-management" 
        setActiveTab={() => {}} 
        onExitAdmin={() => router.push('/app')}
        onLogout={() => {
          if (typeof window !== 'undefined') {
            sessionStorage.clear()
          }
          router.push('/')
        }} 
      />
    </AdminLayout>
  )
}
