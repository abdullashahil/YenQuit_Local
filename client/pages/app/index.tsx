import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AppLayout } from '../../src/components/layouts/AppLayout'
import { QuitTrackerCard } from '../../src/components/features/dashboard/QuitTrackerCard'
import { ProgressCalendar } from '../../src/components/features/dashboard/ProgressCalendar'
import { AdaptiveAdviceModule } from '../../src/components/features/dashboard/AdaptiveAdviceModule'
import { StatsSnapshot } from '../../src/components/features/dashboard/StatsSnapshot'
import { MotivationalContent } from '../../src/components/features/dashboard/MotivationalContent'

export default function Dashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState<string>('User')

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const userType = sessionStorage.getItem('userType')
      if (!userType) {
        router.push('/login')
        return
      }

      // Get user name from onboarding data
      const onboardingData = sessionStorage.getItem('onboardingData')
      if (onboardingData) {
        try {
          const data = JSON.parse(onboardingData)
          setUserName(data.name || 'User')
        } catch (e) {
          console.error('Error parsing onboarding data:', e)
        }
      }
    }
  }, [router])

  return (
    <AppLayout activeTab="dashboard">
      <div className="p-4 md:p-6 lg:p-8 min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-1 md:mb-2 text-[#1C3B5E]">
              Welcome back, {userName}
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
              <MotivationalContent />
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
