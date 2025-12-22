import { useRouter } from 'next/router'
import { useAppContext } from '../../src/context/AppContext'
import { FiveR_Risks } from '../../src/components/features/flow-5r/Risks'

export default function Risks() {
  const router = useRouter()
  const { fiveRData, setFiveRData } = useAppContext()

  const handleNext = (data: any) => {
    setFiveRData({ ...fiveRData, risks: data })
    router.push('/5r/rewards')
  }

  const handleBack = () => {
    router.push('/5r/relevance')
  }

  return <FiveR_Risks onNext={handleNext} />
}
