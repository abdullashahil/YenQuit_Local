import { useRouter } from 'next/router'
import { useAppContext } from '../../src/context/AppContext'
import { FiveA_Arrange } from '../../src/components/features/flow-5a/Arrange'

export default function Arrange() {
  const router = useRouter()
  const { fiveAData, setFiveAData } = useAppContext()

  const handleComplete = (data: any) => {
    setFiveAData({ ...fiveAData, arrange: data })
    router.push('/app')
  }

  return <FiveA_Arrange onComplete={handleComplete} quitDate={fiveAData.assist?.quitDate} />
}
