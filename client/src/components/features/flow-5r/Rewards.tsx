import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { Heart, DollarSign, Sparkles, Users, Activity, Smile, CheckCircle2, Clock, Sun, Calendar, TrendingUp, Award, Shield, Star } from 'lucide-react';
import { getRewardsContent, Reward } from '../../../services/rewardsService';

interface FiveR_RewardsProps {
  onNext: (data: any) => void;
}

// Icon mapping for dynamic icons
const iconMap = {
  Heart,
  DollarSign,
  Sparkles,
  Users,
  Activity,
  Smile,
  CheckCircle2,
  Clock,
  Sun,
  Calendar,
  TrendingUp,
  Award,
  Shield,
  Star
};

export function FiveR_Rewards({ onNext }: FiveR_RewardsProps) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getRewardsContent();
        setRewards(data.rewards);
      } catch (err: any) {
        setError(err.message || 'Failed to load rewards content');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNext = () => {
    onNext({ acknowledgedRewards: rewards.map(r => r.title) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B2AA] mx-auto mb-4"></div>
          <p className="text-[#333333]">Loading rewards information...</p>
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
          currentStep={2}
        />

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-10 border border-gray-100">
          <h1 className="text-[#1C3B5E] mb-2">Step 3: REWARDS</h1>
          <p className="text-[#333333] mb-8">
            Focus on the positive changes that await you. These rewards begin immediately and continue 
            to grow over time. Select the rewards that motivate you most.
          </p>

          {/* Motivational Banner */}
          <div 
            className="mb-8 p-6 rounded-2xl"
            style={{ 
              backgroundColor: 'rgba(32, 178, 170, 0.1)',
              border: '2px solid rgba(32, 178, 170, 0.3)'
            }}
          >
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-[#20B2AA] flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-[#1C3B5E] mb-2">Your Future Awaits</h3>
                <p className="text-[#333333] text-sm">
                  Every person who quits experiences these benefits. The timeline may vary, but the 
                  rewards are real and scientifically proven. Your body wants to heal, and it will 
                  reward you for making this choice.
                </p>
              </div>
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="mb-8 space-y-4">
            {rewards.map((reward) => {
              const Icon = iconMap[reward.icon_name as keyof typeof iconMap] || CheckCircle2;
              
              return (
                <div
                  key={reward.id}
                  className="w-full text-left p-6 rounded-2xl border-2 transition-all hover:shadow-md bg-white border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(32, 178, 170, 0.1)' }}
                    >
                      <Icon size={28} style={{ color: '#20B2AA' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#1C3B5E] mb-2">{reward.title}</h3>
                      <p className="text-sm text-[#20B2AA] mb-3">
                        {reward.timeline}
                      </p>
                      <ul className="space-y-2">
                        {reward.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-[#333333] opacity-80 flex items-start gap-2">
                            <span className="text-[#20B2AA] mt-1">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              onClick={() => window.location.href = '/5a/ask'}
              className="flex-1 px-6 py-6 rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white"
            >
              I'm Ready to Quit
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              className="flex-1 px-6 py-6 rounded-2xl border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA]/10"
            >
              Continue to Roadblocks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
