import { useRouter } from 'next/router'
import { useAppContext } from '../../src/context/AppContext'
import { FiveA_Ask } from '../../src/components/features/flow-5a/Ask'

export default function Ask() {
  const router = useRouter()
  const { fiveAData, setFiveAData } = useAppContext()

  const handleNext = (data: any) => {
    setFiveAData({ ...fiveAData, ask: data })
    router.push('/5a/advise')
  }

  return <FiveA_Ask onNext={handleNext} />
}
