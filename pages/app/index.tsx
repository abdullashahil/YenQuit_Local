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
      <div className="p-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-2" style={{ color: "#1C3B5E" }}>
              Welcome back, {userName}
            </h1>
            <p style={{ color: "#333333" }}>
              Here's your progress overview for today
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 space-y-6">
              <QuitTrackerCard />
              <StatsSnapshot />
              <MotivationalContent />
              <ProgressCalendar />
            </div>
            <div className="col-span-4">
              <AdaptiveAdviceModule />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
