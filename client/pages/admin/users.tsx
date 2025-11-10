import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AdminLayout } from '../../src/components/layouts/AdminLayout'
import { UserManagement } from '../../src/components/admin/UserManagement'

export default function AdminUsers() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userType = sessionStorage.getItem('userType')
      if (userType !== 'admin') {
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
