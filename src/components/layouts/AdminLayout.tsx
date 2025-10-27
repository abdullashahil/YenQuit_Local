import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { AdminSidebar } from '../admin/AdminSidebar'

interface AdminLayoutProps {
  children: ReactNode
  activeTab?: string
}

export function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  const router = useRouter()

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear()
    }
    router.push('/')
  }

  const handleExitAdmin = () => {
    router.push('/app')
  }

  const setActiveTab = (tab: string) => {
    switch (tab) {
      case "user-management":
        router.push("/admin/users")
        break
      case "content-management":
        router.push("/admin/content")
        break
      case "system-settings":
        router.push("/admin/settings")
        break
      case "admin-dashboard":
        router.push("/admin")
        break
      default:
        break
    }
  }

  // Determine active tab from route if not provided
  const currentTab = activeTab || (() => {
    const path = router.pathname
    if (path.includes("/users")) return "user-management"
    if (path.includes("/content")) return "content-management"
    if (path.includes("/settings")) return "system-settings"
    return "user-management"
  })()

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F5" }}>
      <AdminSidebar 
        activeTab={currentTab} 
        setActiveTab={setActiveTab} 
        onExitAdmin={handleExitAdmin}
        onLogout={handleLogout} 
      />
      <div className="ml-64">
        {children}
      </div>
    </div>
  )
}
