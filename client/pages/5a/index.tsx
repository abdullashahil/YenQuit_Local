import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '../../src/context/AppContext';
import { FiveA_Ask } from '../../src/components/features/flow-5a/Ask';
import { FiveA_Advise } from '../../src/components/features/flow-5a/Advise';
import { FiveA_Assess } from '../../src/components/features/flow-5a/Assess';
import { FiveA_Assist } from '../../src/components/features/flow-5a/Assist';
import { FiveA_Arrange } from '../../src/components/features/flow-5a/Arrange';
import { FiveAData } from '../../src/types/fiveAFlow';

type Step = 'ask' | 'advise' | 'assess' | 'assist' | 'arrange';

const STEPS: Step[] = ['ask', 'advise', 'assess', 'assist', 'arrange'];

const getStepIndex = (step: Step): number => {
  return STEPS.indexOf(step);
};

const getNextStep = (currentStep: Step): Step | null => {
  const currentIndex = STEPS.indexOf(currentStep);
  return currentIndex < STEPS.length - 1 ? STEPS[currentIndex + 1] : null;
};

const defaultFiveAData: FiveAData = {
  ask: {
    tobaccoType: '',
    usageFrequency: '',
  },
  advise: {},
  assess: {},
  assist: {},
  arrange: {}
};

export default function FiveAFlow() {
  const router = useRouter();
  const { fiveAData = defaultFiveAData, setFiveAData } = useAppContext();
  const [currentStep, setCurrentStep] = useState<Step>('ask');

  // Update current step based on URL query parameter
  useEffect(() => {
    const { step } = router.query;
    if (step && STEPS.includes(step as Step)) {
      setCurrentStep(step as Step);
    }
  }, [router.query]);

  // Handle moving to the next step
  const handleNext = (data: any) => {
    // Update the data in context
    const updatedData: FiveAData = { ...fiveAData, [currentStep]: data };
    setFiveAData(updatedData);
    
    // Move to the next step
    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      // Use absolute path for navigation
      window.location.href = `/5a/${nextStep}`;
    } else {
      // If it's the last step, redirect to dashboard
      window.location.href = '/app';
    }
  };

  // Get the current step index for the progress bar
  const currentStepIndex = getStepIndex(currentStep);

  // Render the current step with appropriate props
  const renderStep = () => {
    switch (currentStep) {
      case 'ask':
        return <FiveA_Ask onNext={handleNext} />;
      case 'advise':
        return <FiveA_Advise 
          onNext={() => handleNext({})}
          userData={fiveAData.ask || {}} 
        />;
      case 'assess':
        return <FiveA_Assess onNext={handleNext} />;
      case 'assist':
        return <FiveA_Assist 
          onNext={handleNext}
          onComplete={() => {
            handleNext({});
            window.location.href = '/app';
          }}
        />;
      case 'arrange':
        return <FiveA_Arrange onComplete={() => {
          window.location.href = '/app';
        }} />;
      default:
        return <FiveA_Ask onNext={handleNext} />;
    }
  };

  // Progress bar component
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {STEPS.map((step, index) => (
          <div 
            key={step}
            onClick={() => {
              if (index <= currentStepIndex) {
                router.push(`/5a?step=${step}`, undefined, { shallow: true });
              }
            }}
            className={`flex flex-col items-center cursor-pointer ${
              index <= currentStepIndex ? 'text-[#20B2AA]' : 'text-gray-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              index <= currentStepIndex 
                ? index === currentStepIndex 
                  ? 'bg-[#20B2AA] text-white' 
                  : 'bg-[#20B2AA] text-white'
                : 'bg-gray-200'
            }`}>
              {index + 1}
            </div>
            <span className="text-xs font-medium capitalize">{step}</span>
            {index < STEPS.length - 1 && (
              <div className={`h-1 w-16 -mt-4 ${
                index < currentStepIndex ? 'bg-[#20B2AA]' : 'bg-gray-200'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProgressBar />
        {renderStep()}
      </div>
    </div>
  );
}
