import { FiveA_Advise } from '../../src/components/features/flow-5a/Advise';
import { useRouter } from 'next/router';

export default function AdvisePage() {
  const router = useRouter();
  
  const handleNext = () => {
    router.push('/5a/assess');
  };

  // In a real app, you would get this from your state management
  const userData = {
    tobaccoType: 'Cigarettes', // Example data
    usageFrequency: 'Daily',   // Example data
  };

  return <FiveA_Advise onNext={handleNext} userData={userData} />;
}
