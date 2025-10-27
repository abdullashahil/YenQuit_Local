import { useRouter } from 'next/router'
import { useAppContext } from '../../src/context/AppContext'
import { FiveA_Advise } from '../../src/components/features/flow-5a/Advise'

export default function Advise() {
  const router = useRouter()
  const { onboardingData } = useAppContext()

  const handleNext = () => {
    router.push('/5a/assess')
  }

  return <FiveA_Advise onNext={handleNext} userData={onboardingData} />
}
