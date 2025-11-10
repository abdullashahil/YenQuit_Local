import { FiveA_Assess } from '../../src/components/features/flow-5a/Assess';
import { useRouter } from 'next/router';

export default function AssessPage() {
  const router = useRouter();
  
  const handleNext = (data: any) => {
    // Store data in context or state management
    router.push('/5a/assist');
  };

  return <FiveA_Assess onNext={handleNext} />;
}
