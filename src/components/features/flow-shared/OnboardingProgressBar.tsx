import React from 'react';

interface OnboardingProgressBarProps {
  steps: string[];
  currentStep: number;
}

export function OnboardingProgressBar({ steps, currentStep }: OnboardingProgressBarProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-[#20B2AA] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              <div
                className={`mt-2 text-sm text-center transition-all duration-300 ${
                  index === currentStep
                    ? 'text-[#20B2AA]'
                    : index < currentStep
                    ? 'text-[#1C3B5E]'
                    : 'text-gray-400'
                }`}
              >
                {step}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 -mt-10">
                <div
                  className={`h-full transition-all duration-300 ${
                    index < currentStep ? 'bg-[#20B2AA]' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
