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
      case "communities":
        router.push("/admin/communities")
        break
      case "system-settings":
        router.push("/admin/settings")
        break
      case "reports":
        router.push("/admin/report")
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
    if (path.includes("/communities")) return "communities"
    if (path.includes("/settings")) return "system-settings"
    if (path.includes("/report")) return "reports"
    return "admin-dashboard"
  })()

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F5" }}>
      <AdminSidebar
        activeTab={currentTab}
        setActiveTab={setActiveTab}
        onExitAdmin={handleExitAdmin}
        onLogout={handleLogout}
      />
      {/* Responsive margin: no margin on mobile, ml-64 on desktop */}
      <div className="md:ml-64 pt-16 md:pt-0 px-4 md:px-8">
        {children}
      </div>
    </div>
  )
}
