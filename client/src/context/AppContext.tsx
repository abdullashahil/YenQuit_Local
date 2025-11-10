import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'

export type UserType = 'admin' | 'standard' | null
export type OnboardingPathway = '5As' | '5Rs' | null

export interface OnboardingData {
  name: string
  age: string
  gender: string
  email: string
  contactNumber: string
  place: string
  setting: string
  tobaccoType: string
  smokerType: string
}

export interface FiveAData {
  ask: any
  advise: any
  assess: any
  assist: any
  arrange: any
}

export interface FiveRData {
  relevance: any
  risks: any
  rewards: any
  roadblocks: any
  repetition: any
}

interface AppContextType {
  userType: UserType
  setUserType: (type: UserType) => void
  onboardingPathway: OnboardingPathway
  setOnboardingPathway: (pathway: OnboardingPathway) => void
  onboardingData: OnboardingData | null
  setOnboardingData: (data: OnboardingData | null) => void
  fiveAData: FiveAData
  setFiveAData: (data: FiveAData) => void
  fiveRData: FiveRData
  setFiveRData: (data: FiveRData) => void
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType>(null)
  const [onboardingPathway, setOnboardingPathway] = useState<OnboardingPathway>(null)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [fiveAData, setFiveAData] = useState<FiveAData>({
    ask: null,
    advise: null,
    assess: null,
    assist: null,
    arrange: null
  })
  const [fiveRData, setFiveRData] = useState<FiveRData>({
    relevance: null,
    risks: null,
    rewards: null,
    roadblocks: null,
    repetition: null
  })
  const [isInitialized, setIsInitialized] = useState(false)

  // Load data from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = sessionStorage.getItem('userType') as UserType
      const storedPathway = sessionStorage.getItem('onboardingPathway') as OnboardingPathway
      const storedOnboardingData = sessionStorage.getItem('onboardingData')
      const storedFiveAData = sessionStorage.getItem('fiveAData')
      const storedFiveRData = sessionStorage.getItem('fiveRData')

      if (storedUserType) setUserType(storedUserType)
      if (storedPathway) setOnboardingPathway(storedPathway)
      if (storedOnboardingData) {
        try {
          setOnboardingData(JSON.parse(storedOnboardingData))
        } catch (e) {
          console.error('Error parsing onboarding data:', e)
        }
      }
      if (storedFiveAData) {
        try {
          setFiveAData(JSON.parse(storedFiveAData))
        } catch (e) {
          console.error('Error parsing 5A data:', e)
        }
      }
      if (storedFiveRData) {
        try {
          setFiveRData(JSON.parse(storedFiveRData))
        } catch (e) {
          console.error('Error parsing 5R data:', e)
        }
      }

      setIsInitialized(true)
    }
  }, [])

  // Save data to sessionStorage whenever it changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      if (userType) {
        sessionStorage.setItem('userType', userType)
      } else {
        sessionStorage.removeItem('userType')
      }
    }
  }, [userType, isInitialized])

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      if (onboardingPathway) {
        sessionStorage.setItem('onboardingPathway', onboardingPathway)
      } else {
        sessionStorage.removeItem('onboardingPathway')
      }
    }
  }, [onboardingPathway, isInitialized])

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      if (onboardingData) {
        sessionStorage.setItem('onboardingData', JSON.stringify(onboardingData))
      } else {
        sessionStorage.removeItem('onboardingData')
      }
    }
  }, [onboardingData, isInitialized])

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      sessionStorage.setItem('fiveAData', JSON.stringify(fiveAData))
    }
  }, [fiveAData, isInitialized])

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      sessionStorage.setItem('fiveRData', JSON.stringify(fiveRData))
    }
  }, [fiveRData, isInitialized])

  const logout = () => {
    setUserType(null)
    setOnboardingPathway(null)
    setOnboardingData(null)
    setFiveAData({
      ask: null,
      advise: null,
      assess: null,
      assist: null,
      arrange: null
    })
    setFiveRData({
      relevance: null,
      risks: null,
      rewards: null,
      roadblocks: null,
      repetition: null
    })
    
    if (typeof window !== 'undefined') {
      sessionStorage.clear()
    }
    
    router.push('/')
  }

  return (
    <AppContext.Provider
      value={{
        userType,
        setUserType,
        onboardingPathway,
        setOnboardingPathway,
        onboardingData,
        setOnboardingData,
        fiveAData,
        setFiveAData,
        fiveRData,
        setFiveRData,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
