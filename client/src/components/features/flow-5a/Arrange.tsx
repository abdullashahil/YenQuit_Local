import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { BackToHomeButton } from '../../shared/BackToHomeButton';
import { Phone, AlertTriangle } from 'lucide-react';
import { FiveA_ArrangeProps } from '../../../types/fiveAFlow';
import { userService } from '../../../services/userService';
import { helplineService, Helpline } from '../../../services/helplineService';
import { Skeleton } from '../../ui/skeleton';

export function FiveA_Arrange({ onComplete, quitDate }: FiveA_ArrangeProps) {
  const [userOnboardingStep, setUserOnboardingStep] = useState<number | null>(null);
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user profile to get onboarding_step
        const profileResponse = await userService.getProfile();
        const step = profileResponse.data.onboarding_step || 0;
        setUserOnboardingStep(step);

        // If user hasn't completed ASSIST (Step 4), redirect them back
        if (step < 4) {
          alert('Please complete your personalized quit plan (Step 4: ASSIST) first.');
          window.location.href = '/5a/assist';
          return;
        }

        // Fetch helplines
        const helplineResponse = await helplineService.getHelplines();
        setHelplines(helplineResponse.data.data.filter(h => h.is_active));
      } catch (error) {
        console.error('Error fetching data for Arrange step:', error);
        setUserOnboardingStep(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {loading ? (
              // Loading Skeletons
              [1, 2].map((i) => (
                <div key={i} className="h-48 border border-gray-100 rounded-2xl p-6 bg-gray-50/50">
                  <Skeleton className="w-12 h-12 rounded-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
              ))
            ) : helplines.length > 0 ? (
              helplines.map((helpline) => (
                <div
                  key={helpline.id}
                  className="bg-gradient-to-br from-[#20B2AA]/5 to-[#20B2AA]/10 rounded-2xl p-5 border border-[#20B2AA]/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start h-full"
                >
                  <div className="flex items-center gap-3 mb-4 w-full">
                    <div className="w-10 h-10 bg-[#20B2AA] rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-[#20B2AA]/20">
                      <Phone className="text-white" size={18} />
                    </div>
                    <h3 className="text-[#1C3B5E] text-base font-bold leading-tight">{helpline.title}</h3>
                  </div>

                  <p className="text-[#333333] text-sm mb-5 flex-1 leading-relaxed">
                    {helpline.description}
                  </p>

                  <div className="w-full mt-auto">
                    <Button
                      onClick={() => handleCall(helpline.phone_number)}
                      className="w-full sm:w-auto rounded-xl bg-[#20B2AA] hover:bg-[#1E9E96] text-white px-5 py-2.5 h-auto text-sm font-medium shadow-md shadow-[#20B2AA]/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Phone size={14} />
                      Call: {helpline.phone_number}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No helplines available at the moment.</p>
              </div>
            )}
          </div>

          {/* Important Note */}
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-yellow-800">Why Connecting is Important</h3>
                <div className="mt-3 text-sm text-yellow-700 space-y-3">
                  <p>
                    <strong className="text-yellow-900">Professional Guidance:</strong> Our counselors are trained to help you navigate the challenges of quitting and provide personalized strategies.
                  </p>
                  <p>
                    <strong className="text-yellow-900">Immediate Support:</strong> Cravings and withdrawal symptoms can be tough to handle alone. We're here to help you through the difficult moments.
                  </p>
                  <p>
                    <strong className="text-yellow-900">Higher Success Rate:</strong> Studies show that individuals who seek professional support are up to 4 times more likely to quit successfully.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => {
                if (userOnboardingStep !== null && userOnboardingStep < 4) {
                  alert('Please complete your personalized quit plan (Step 4: ASSIST) first.');
                  window.location.href = '/5a/assist';
                } else {
                  onComplete();
                }
              }}
              className="px-8 py-6 rounded-2xl bg-[#1C3B5E] hover:bg-[#1C3B5E]/90 text-white shadow-xl shadow-[#1C3B5E]/20 transition-all active:scale-95"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
