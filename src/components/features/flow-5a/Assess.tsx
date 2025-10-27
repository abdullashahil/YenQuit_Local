import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Slider } from '../../ui/slider';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';

interface FiveA_AssessProps {
  onNext: (data: any) => void;
}

export function FiveA_Assess({ onNext }: FiveA_AssessProps) {
  const [readiness, setReadiness] = useState<number[]>([5]);
  const [quitTimeline, setQuitTimeline] = useState('');

  const handleNext = () => {
    onNext({
      readinessScore: readiness[0],
      quitTimeline
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['ASK', 'ADVISE', 'ASSESS', 'ASSIST', 'ARRANGE']}
          currentStep={2}
        />

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-10 border border-gray-100">
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#1C3B5E] mb-2">Step 3: ASSESS</h1>
          <p className="text-sm md:text-base text-[#333333] mb-6 md:mb-8">
            Let's determine your readiness to quit tobacco
          </p>

          {/* Readiness Slider */}
          <div className="mb-12">
            <Label className="text-[#333333] block mb-4">
              How ready are you to quit tobacco?
            </Label>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex justify-between mb-4 text-sm text-[#333333]">
                <span>1 - Low Readiness</span>
                <span className="text-[#20B2AA]">Current: {readiness[0]}</span>
                <span>10 - High Readiness</span>
              </div>
              <Slider
                value={readiness}
                onValueChange={setReadiness}
                min={1}
                max={10}
                step={1}
                className="[&_[role=slider]]:bg-[#20B2AA] [&_[role=slider]]:border-[#20B2AA]"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <span key={num}>{num}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Quit Timeline */}
          <div className="mb-8">
            <Label className="text-sm md:text-base mb-6 md:mb-8 lg:mb-10">
              When do you plan to quit?
            </Label>
            <RadioGroup
              value={quitTimeline}
              onValueChange={setQuitTimeline}
              className="rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10"
            >
              <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-xl">
                <RadioGroupItem value="7days" id="7days" />
                <Label htmlFor="7days" className="cursor-pointer flex-1">
                  Within next 7 days
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-xl">
                <RadioGroupItem value="month" id="month" />
                <Label htmlFor="month" className="cursor-pointer flex-1">
                  Within next month
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-xl">
                <RadioGroupItem value="notsure" id="notsure" />
                <Label htmlFor="notsure" className="cursor-pointer flex-1">
                  Not sure yet
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Hesitation Link */}
          <div className="text-center mb-8">
            <p className="text-[#333333] text-sm">
              Feeling hesitant?{' '}
              <a href="#" className="text-[#20B2AA] underline">
                Click here to see the 5 R's motivation plan
              </a>
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!quitTimeline}
              className="text-2xl md:text-3xl lg:text-4xl mb-2 px-8 py-6 rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 disabled:opacity-50"
            >
              Next: Build Your Quit Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
