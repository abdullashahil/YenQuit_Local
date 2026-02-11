import { ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Sidebar } from './Sidebar'
import { NotificationPermissionModal } from '../ui/NotificationPermissionModal'
import { startNotificationScheduler, stopNotificationScheduler } from '../../utils/notificationScheduler'

interface AppLayoutProps {
  children: ReactNode
  activeTab?: string
}

export function AppLayout({ children, activeTab }: AppLayoutProps) {
  const router = useRouter()
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('accessToken')

    if (isAuthenticated) {
      // Show notification permission modal if needed
      const shouldShowModal =
        'Notification' in window &&
        Notification.permission === 'default' &&
        localStorage.getItem('notificationPermissionDismissed') !== 'true'

      if (shouldShowModal) {
        setShowNotificationModal(true)
      }

      // Start notification scheduler if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        startNotificationScheduler()
      }
    }

    // Cleanup on unmount
    return () => {
      stopNotificationScheduler()
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      // Clear all authentication data
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      sessionStorage.clear()
    }

    // Stop notification scheduler
    stopNotificationScheduler()

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

  const handleModalClose = () => {
    setShowNotificationModal(false)

    // If permission was granted, start the scheduler
    if ('Notification' in window && Notification.permission === 'granted') {
      startNotificationScheduler()
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

      {/* Notification Permission Modal */}
      {showNotificationModal && (
        <NotificationPermissionModal onClose={handleModalClose} />
      )}
    </div>
  )
}
