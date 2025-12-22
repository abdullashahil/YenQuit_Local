import { useRouter } from 'next/router'
import { useAppContext } from '../../src/context/AppContext'
import { FiveR_Rewards } from '../../src/components/features/flow-5r/Rewards'

export default function Rewards() {
  const router = useRouter()
  const { fiveRData, setFiveRData } = useAppContext()

  const handleNext = (data: any) => {
    setFiveRData({ ...fiveRData, rewards: data })
    router.push('/5r/roadblocks')
  }

  const handleBack = () => {
    router.push('/5r/risks')
  }

  return <FiveR_Rewards onNext={handleNext} />
}
