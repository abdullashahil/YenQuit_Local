import { useRouter } from 'next/router'
import { FiveR_Repetition } from '../../src/components/features/flow-5r/Repetition'

export default function Repetition() {
  const router = useRouter()

  const handleComplete = () => {
    router.push('/app')
  }

  const handleBack = () => {
    router.push('/5r/roadblocks')
  }

  return <FiveR_Repetition onComplete={handleComplete} onBack={handleBack} />
}
