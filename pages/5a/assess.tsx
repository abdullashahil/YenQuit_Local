import { useRouter } from 'next/router'
import { useAppContext } from '../../src/context/AppContext'
import { FiveA_Assess } from '../../src/components/features/flow-5a/Assess'

export default function Assess() {
  const router = useRouter()
  const { fiveAData, setFiveAData } = useAppContext()

  const handleNext = (data: any) => {
    setFiveAData({ ...fiveAData, assess: data })
    router.push('/5a/assist')
  }

  return <FiveA_Assess onNext={handleNext} />
}
