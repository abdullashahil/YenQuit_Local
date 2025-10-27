import { useRouter } from 'next/router'
import { useAppContext } from '../../src/context/AppContext'
import { FiveR_Relevance } from '../../src/components/features/flow-5r/Relevance'

export default function Relevance() {
  const router = useRouter()
  const { fiveRData, setFiveRData } = useAppContext()

  const handleNext = (data: any) => {
    setFiveRData({ ...fiveRData, relevance: data })
    router.push('/5r/risks')
  }

  return <FiveR_Relevance onNext={handleNext} />
}
