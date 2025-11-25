import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AdminLayout } from '../../src/components/layouts/AdminLayout'
import { SystemSettings } from '../../src/components/admin/SystemSettings'

export default function AdminSettings() {
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
    <AdminLayout activeTab="system-settings">
      <SystemSettings 
        activeTab="system-settings" 
        setActiveTab={() => {}} 
        onExitAdmin={() => router.push('/app')}
      />
    </AdminLayout>
  )
}
