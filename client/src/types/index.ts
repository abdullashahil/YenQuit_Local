// Global TypeScript type definitions

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

export interface AppState {
  userType: UserType
  onboardingPathway: OnboardingPathway
  onboardingData: OnboardingData | null
  fiveAData: FiveAData
  fiveRData: FiveRData
}
