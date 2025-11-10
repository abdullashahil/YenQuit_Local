import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AdminLayout } from '../../src/components/layouts/AdminLayout'
import { ContentManagement } from '../../src/components/admin/ContentManagement'

export default function AdminContent() {
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
    <AdminLayout activeTab="content-management">
      <ContentManagement 
        activeTab="content-management" 
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
