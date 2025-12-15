import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { BackToHomeButton } from '../../shared/BackToHomeButton';
import { Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import { FiveA_ArrangeProps } from '../../../types/fiveAFlow';
import { userService } from '../../../services/userService';

export function FiveA_Arrange({ onComplete, quitDate }: FiveA_ArrangeProps) {
  const [userOnboardingStep, setUserOnboardingStep] = useState<number | null>(null);

  // Fetch user profile to get onboarding_step
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getProfile();
        setUserOnboardingStep(response.data.onboarding_step || 0);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserOnboardingStep(0);
      }
    };

    fetchUserProfile();
  }, []);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['ASK', 'ADVISE', 'ASSESS', 'ASSIST', 'ARRANGE']}
          currentStep={4}
        />

        {userOnboardingStep !== null && userOnboardingStep >= 3 && (
          <div className="absolute top-10 left-10">
            <BackToHomeButton />
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-[#1C3B5E] text-2xl font-bold mb-2">Step 5: CONNECT</h1>
          <p className="text-[#333333] mb-8">
            Get immediate support from our helplines
          </p>

          {/* Yenepoya Helpline */}
          <div className="mb-6 bg-gradient-to-r from-[#20B2AA]/5 to-[#20B2AA]/10 rounded-2xl p-6 border border-[#20B2AA]/30">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
              <div className="w-16 h-16 md:w-12 md:h-12 bg-[#20B2AA] rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="text-white" size={24} />
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-[#1C3B5E] text-lg font-semibold mb-2">Yenepoya Helpline</h3>
                <p className="text-[#333333] text-sm mb-4">
                  Speak directly with our trained counselors for personalized support and guidance on your quit journey.
                </p>
                <div className="flex justify-center md:justify-start">
                  <Button
                    onClick={() => handleCall('+911234567890')}
                    className="rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white px-6 py-5"
                  >
                    <Phone className="mr-2 h-4 w-4" /> Call Now: +91 12345 67890
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* National Helpline */}
          <div className="mb-8 bg-gradient-to-r from-[#1C3B5E]/5 to-[#1C3B5E]/10 rounded-2xl p-6 border border-[#1C3B5E]/30">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
              <div className="w-16 h-16 md:w-12 md:h-12 bg-[#1C3B5E] rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="text-white" size={24} />
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-[#1C3B5E] text-lg font-semibold mb-2">National Tobacco Cessation Helpline</h3>
                <p className="text-[#333333] text-sm mb-4">
                  Available 24/7 for confidential support and advice from national tobacco cessation experts.
                </p>
                <div className="flex justify-center md:justify-start">
                  <Button
                    onClick={() => handleCall('1800-11-2356')}
                    variant="outline"
                    className="rounded-2xl border-[#1C3B5E] text-[#1C3B5E] hover:bg-[#1C3B5E]/10 px-6 py-5"
                  >
                    <Phone className="mr-2 h-4 w-4" /> Call Now: 1800-11-2356
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Why Connecting is Important</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p className="mb-2">
                    <strong>Professional Guidance:</strong> Our counselors are trained to help you navigate the challenges of quitting and provide personalized strategies.
                  </p>
                  <p className="mb-2">
                    <strong>Immediate Support:</strong> Cravings and withdrawal symptoms can be tough to handle alone. We're here to help you through the difficult moments.
                  </p>
                  <p>
                    <strong>Higher Success Rate:</strong> Studies show that individuals who seek professional support are up to 4 times more likely to quit successfully.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => onComplete()}
              className="px-8 py-6 rounded-2xl bg-[#1C3B5E] hover:bg-[#1C3B5E]/90 text-white"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
