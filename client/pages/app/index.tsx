import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AppLayout } from '../../src/components/layouts/AppLayout'
import { QuitTrackerCard } from '../../src/components/features/dashboard/QuitTrackerCard'
import { ProgressCalendar } from '../../src/components/features/dashboard/ProgressCalendar'
import { AdaptiveAdviceModule } from '../../src/components/features/dashboard/AdaptiveAdviceModule'
import { StatsSnapshot } from '../../src/components/features/dashboard/StatsSnapshot'
import { ResumeContent } from '../../src/components/features/dashboard/ResumeContent'
import userService from '../../src/services/userService'

export default function Dashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState<string>('User')

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Check if user is authenticated
        if (typeof window !== 'undefined') {
          const userType = sessionStorage.getItem('userType')
          if (!userType) {
            router.push('/login')
            return
          }
        }

        // Try to get user name from API first
        try {
          const response = await userService.getProfile()
          
          if (response.success && response.data) {
            const name = response.data.full_name || 'User'
            setUserName(name)
            return
          }
        } catch (apiError) {
          // API failed, continue to fallback
        }

        // Fallback to sessionStorage
        const onboardingData = sessionStorage.getItem('onboardingData')
        if (onboardingData) {
          try {
            const data = JSON.parse(onboardingData)
            const fallbackName = data.name || 'User'
            setUserName(fallbackName)
          } catch (e) {
            setUserName('User')
          }
        } else {
          setUserName('User')
        }
      } catch (err) {
        setUserName('User')
      }
    }

    loadUserProfile()
  }, [router])

  return (
    <AppLayout activeTab="dashboard">
      <div className="p-4 md:p-6 lg:p-8 min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-1 md:mb-2 text-[#1C3B5E]">
              Welcome, {userName}
            </h1>
            <p className="text-gray-600">
              Here's your progress overview for today
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
            {/* Main Content */}
            <div className="w-full lg:w-8/12 space-y-4 md:space-y-6">
              <QuitTrackerCard />
              <StatsSnapshot />
              <ResumeContent />
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-4/12 space-y-4 md:space-y-6">
              <ProgressCalendar />
              <AdaptiveAdviceModule />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
