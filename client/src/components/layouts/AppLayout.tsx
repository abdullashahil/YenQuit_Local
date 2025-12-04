import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  children: ReactNode
  activeTab?: string
}

export function AppLayout({ children, activeTab }: AppLayoutProps) {
  const router = useRouter()

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear()
    }
    router.push('/')
  }

  const setActiveTab = (tab: string) => {
    switch (tab) {
      case "dashboard":
        router.push("/app")
        break
      case "learning":
        router.push("/app/learning")
        break
      case "community":
        router.push("/app/community")
        break
      case "profile":
        router.push("/app/profile")
        break
      case "admin":
        router.push("/admin")
        break
      default:
        break
    }
  }

  // Determine active tab from route if not provided
  const currentTab = activeTab || (() => {
    const path = router.pathname
    if (path.startsWith("/app/learning")) return "learning"
    if (path.startsWith("/app/community")) return "community"
    if (path.startsWith("/app/profile")) return "profile"
    if (path.startsWith("/app")) return "dashboard"
    return ""
  })()

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <Sidebar 
        activeTab={currentTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />
      {/* Responsive margin: no margin on mobile, ml-64 on desktop */}
      <div className="md:ml-64 pt-16 md:pt-0 px-2 md:px-4">
        {children}
      </div>
    </div>
  )
}
