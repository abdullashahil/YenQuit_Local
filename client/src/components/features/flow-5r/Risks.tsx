import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { BackToHomeButton } from '../../shared/BackToHomeButton';
import { AlertTriangle, Heart, Skull, Baby, Users, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { getRisksContent, HealthRisk, WarningBanner } from '../../../services/risksService';
import { userService } from '../../../services/userService';

interface FiveR_RisksProps {
  onNext: (data: any) => void;
}

// Icon mapping for dynamic icons
const iconMap = {
  Heart,
  Skull,
  TrendingDown,
  Activity,
  Baby,
  Users,
  AlertTriangle,
  AlertCircle
};

export function FiveR_Risks({ onNext }: FiveR_RisksProps) {
  const [healthRisks, setHealthRisks] = useState<HealthRisk[]>([]);
  const [warningBanners, setWarningBanners] = useState<WarningBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getRisksContent();
        setHealthRisks(data.healthRisks);
        setWarningBanners(data.warningBanners);
      } catch (err: any) {
        setError(err.message || 'Failed to load risks content');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNext = () => {
    onNext({ acknowledgedRisks: healthRisks.map(r => r.title) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B2AA] mx-auto mb-4"></div>
          <p className="text-[#333333]">Loading health risks information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['RELEVANCE', 'RISKS', 'REWARDS', 'ROADBLOCKS', 'REPETITION']}
          currentStep={1}
        />

        {userOnboardingStep !== null && userOnboardingStep >= 3 && (
          <div className="absolute top-10 left-10">
            <BackToHomeButton />
          </div>
        )}

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-10 border border-gray-100">
          <h1 className="text-[#1C3B5E] mb-2">Step 2: RISKS</h1>
          <p className="text-[#333333] mb-8">
            Understanding the health risks of tobacco use can strengthen your motivation to quit. 
            Review these scientifically-backed risks that affect you and those around you.
          </p>

          {/* Warning Banner */}
          {warningBanners.map((banner) => {
            const Icon = iconMap[banner.icon_name as keyof typeof iconMap] || AlertTriangle;
            
            return (
              <div 
                key={banner.id}
                className="mb-8 p-6 rounded-2xl border-2"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  borderColor: 'rgba(239, 68, 68, 0.2)'
                }}
              >
                <div className="flex items-start gap-4">
                  <Icon className="text-red-500 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-[#1C3B5E] mb-2">{banner.title}</h3>
                    <p className="text-[#333333] text-sm">{banner.description}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Health Risks Grid */}
          <div className="mb-8">
            <h2 className="text-[#1C3B5E] mb-6">Health Risks Associated with Tobacco Use</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthRisks.map((risk) => {
                const Icon = iconMap[risk.icon_name as keyof typeof iconMap] || AlertTriangle;
                
                return (
                  <div
                    key={risk.id}
                    className="text-left p-5 rounded-2xl border-2 transition-all hover:shadow-md bg-white border-gray-200"
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ 
                          backgroundColor: risk.severity === 'high' 
                            ? 'rgba(239, 68, 68, 0.1)' 
                            : 'rgba(251, 146, 60, 0.1)'
                        }}
                      >
                        <Icon 
                          size={24} 
                          style={{ 
                            color: risk.severity === 'high' ? '#EF4444' : '#FB923C' 
                          }} 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[#1C3B5E] mb-2">{risk.title}</h3>
                        <p className="text-sm text-[#333333] opacity-80">
                          {risk.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Positive Message */}
          <div 
            className="mb-8 p-6 rounded-2xl"
            style={{ 
              backgroundColor: 'rgba(32, 178, 170, 0.1)',
              border: '2px solid rgba(32, 178, 170, 0.3)'
            }}
          >
            <h3 className="text-[#1C3B5E] mb-2">The Good News</h3>
            <p className="text-[#333333] text-sm leading-relaxed">
              While these risks are serious, quitting tobacco at any age dramatically reduces your health risks. 
              Your body has an amazing ability to heal, and the benefits of quitting begin immediately and 
              continue to improve over time.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            {userOnboardingStep !== null && userOnboardingStep < 4 && (
              <Button
                onClick={() => window.location.href = '/5a/ask'}
                className="flex-1 px-6 py-6 rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white"
              >
                I'm Ready to Quit
              </Button>
            )}
            <Button
              onClick={handleNext}
              variant="outline"
              className={userOnboardingStep !== null && userOnboardingStep < 4 ? "flex-1 px-6 py-6 rounded-2xl border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA]/10" : "px-6 py-6 rounded-2xl border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA]/10"}
            >
              Next: See Your Rewards
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
