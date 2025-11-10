import { FiveA_Ask } from '../../src/components/features/flow-5a/Ask';
import { useRouter } from 'next/router';

export default function AskPage() {
  const router = useRouter();
  
  const handleNext = (data: any) => {
    // Store data in context or state management
    router.push('/5a/advise');
  };

  return <FiveA_Ask onNext={handleNext} />;
}
