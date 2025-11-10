import { useRouter } from 'next/router'
import { useAppContext } from '../../src/context/AppContext'
import { FiveR_Roadblocks } from '../../src/components/features/flow-5r/Roadblocks'

export default function Roadblocks() {
  const router = useRouter()
  const { fiveRData, setFiveRData } = useAppContext()

  const handleNext = (data: any) => {
    setFiveRData({ ...fiveRData, roadblocks: data })
    router.push('/5r/repetition')
  }

  const handleBack = () => {
    router.push('/5r/rewards')
  }

  return <FiveR_Roadblocks onNext={handleNext} onBack={handleBack} />
}
