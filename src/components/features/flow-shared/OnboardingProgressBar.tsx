import React from 'react';
import { useRouter } from 'next/router';

interface OnboardingProgressBarProps {
  steps: string[];
  currentStep: number;
  basePath?: string;
}

export function OnboardingProgressBar({ 
  steps, 
  currentStep, 
  basePath = '/5a' 
}: OnboardingProgressBarProps) {
  const router = useRouter();

  const handleStepClick = (stepIndex: number, stepName: string) => {
    const path = `${basePath}/${stepName.toLowerCase()}`;
    window.location.href = path; // Use full page navigation to ensure clean URL
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const stepRoute = step.toLowerCase();
          
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => handleStepClick(index, stepRoute)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrent || isCompleted
                      ? 'bg-[#20B2AA] text-white hover:bg-[#1a9c94]'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  } hover:shadow-md cursor-pointer`}
                  aria-label={`Go to ${step} step`}
                >
                  {index + 1}
                </button>
                <button
                  onClick={() => handleStepClick(index, stepRoute)}
                  className={`mt-2 text-sm text-center transition-all duration-300 ${
                    isCurrent
                      ? 'text-[#20B2AA] font-medium'
                      : 'text-gray-600 hover:text-[#20B2AA]'
                  } cursor-pointer`}
                >
                  {step}
                </button>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`flex-1 h-1 mx-2 ${
                    isCompleted ? 'bg-[#20B2AA]' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
