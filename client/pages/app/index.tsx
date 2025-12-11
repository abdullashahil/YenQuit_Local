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
        // Check if user is authenticated - look for accessToken in localStorage
        if (typeof window !== 'undefined') {
          const accessToken = localStorage.getItem('accessToken')
          if (!accessToken) {
            console.log('No access token found, redirecting to login')
            router.push('/login')
            return
          }
          console.log('Access token found, user is authenticated')
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
          console.log('API call failed, using fallback:', apiError)
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
        console.error('Error in loadUserProfile:', err)
        setUserName('User')
      }
    }

    loadUserProfile()
  }, [router])

  return (
    <AppLayout activeTab="dashboard">
      <div className="p-4 md:p-6 lg:p-8 min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-6 md:mb-8 flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold mb-1 md:mb-2 text-[#1C3B5E]">
                Welcome, {userName}
              </h1>
              <p className="text-gray-600">
                Here's your progress overview for today
              </p>
            </div>
            <button
              onClick={() => router.push('/fagerstrom-test')}
              className="px-4 py-2 md:px-6 md:py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 flex-shrink-0"
              style={{
                backgroundColor: '#20B2AA',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Retake Test</span>
              <span className="sm:hidden">Test</span>
            </button>
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
