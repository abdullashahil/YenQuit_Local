import { useRouter } from 'next/router'
import { useAppContext } from '../../src/context/AppContext'
import { FiveA_Assist } from '../../src/components/features/flow-5a/Assist'

export default function AssistPage() {
  const router = useRouter()
  const { fiveAData, setFiveAData } = useAppContext()

  const handleNext = (data: any) => {
    setFiveAData({ ...fiveAData, assist: data })
  }

  const handleComplete = () => {
    router.push('/5a/arrange')
  }

  return (
    <FiveA_Assist
      onNext={handleNext}
      onComplete={handleComplete}
    />
  )
}
