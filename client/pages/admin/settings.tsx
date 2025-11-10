import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AdminLayout } from '../../src/components/layouts/AdminLayout'
import { SystemSettings } from '../../src/components/admin/SystemSettings'

export default function AdminSettings() {
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
    <AdminLayout activeTab="system-settings">
      <SystemSettings 
        activeTab="system-settings" 
        setActiveTab={() => {}} 
        onExitAdmin={() => router.push('/app')}
      />
    </AdminLayout>
  )
}
