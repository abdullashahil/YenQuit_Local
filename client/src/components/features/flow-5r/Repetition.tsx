import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { BackToHomeButton } from '../../shared/BackToHomeButton';
import { 
  CheckCircle2, 
  Calendar, 
  Heart, 
  TrendingUp, 
  Users, 
  Book, 
  AlertTriangle, 
  Award, 
  Shield 
} from 'lucide-react';
import { userService } from '../../../services/userService';

interface FiveR_RepetitionProps {
  onComplete: () => void;
  onBack: () => void;
}

export function FiveR_Repetition({ onComplete, onBack }: FiveR_RepetitionProps) {
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

  const features = [
    {
      icon: Calendar,
      title: 'Daily Progress Tracking',
      description: 'Log your journey, track smoke-free days, and monitor your health improvements over time with our intuitive tracking system.'
    },
    {
      icon: Book,
      title: 'Personalized Learning',
      description: 'Access a library of educational content, tips, and strategies tailored to your quitting journey.'
    },
    {
      icon: Users,
      title: 'Supportive Community',
      description: 'Connect with others who understand your journey, share experiences, and get encouragement in our supportive community.'
    },
    {
      icon: TrendingUp,
      title: 'Health Insights',
      description: 'See real-time updates on how your body is healing and the benefits you\'re gaining with each smoke-free day.'
    },
    {
      icon: CheckCircle2,
      title: 'Milestone Celebrations',
      description: 'Celebrate your achievements and milestones with personalized rewards and recognition.'
    }
  ];

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['RELEVANCE', 'RISKS', 'REWARDS', 'ROADBLOCKS', 'REPETITION']}
          currentStep={4}
        />

        {userOnboardingStep !== null && userOnboardingStep >= 3 && (
          <div className="absolute top-10 left-10">
            <BackToHomeButton />
          </div>
        )}

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-10 border border-gray-100">
          {/* Completion Message - Moved to top */}
          <div 
            className="mb-8 p-8 rounded-2xl text-center"
            style={{ 
              backgroundColor: 'rgba(32, 178, 170, 0.1)',
              border: '2px solid rgba(32, 178, 170, 0.3)'
            }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#20B2AA' }}
            >
              <CheckCircle2 className="text-white" size={32} />
            </div>
            <h2 className="text-[#1C3B5E] mb-3 text-2xl font-semibold">Motivational Assessment Complete!</h2>
            <p className="text-[#333333] max-w-2xl mx-auto">
              You've taken an important first step. You'll now have access to motivational content, 
              community support, and educational resources. When you're ready to set a quit date, 
              you can transition to the structured 5 A's quitting program at any time.
            </p>
          </div>

          {/* Summary of Journey */}
          <div className="mb-8">
            <h2 className="text-[#1C3B5E] mb-6 text-xl font-medium">Your Motivational Journey Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <a 
                href="/5r/relevance"
                className="p-5 rounded-2xl border-2 block transition-all hover:shadow-md hover:border-[#20B2AA]"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#FAFAFA' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(32, 178, 170, 0.1)' }}
                  >
                    <Heart size={20} style={{ color: '#20B2AA' }} />
                  </div>
                  <h3 className="text-[#1C3B5E]">Relevance</h3>
                </div>
                <p className="text-sm text-[#333333] opacity-80">
                  You've identified your personal reasons for wanting to quit
                </p>
              </a>

              <a 
                href="/5r/risks"
                className="p-5 rounded-2xl border-2 block transition-all hover:shadow-md hover:border-[#20B2AA]"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#FAFAFA' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(32, 178, 170, 0.1)' }}
                  >
                    <AlertTriangle size={20} style={{ color: '#20B2AA' }} />
                  </div>
                  <h3 className="text-[#1C3B5E]">Risks</h3>
                </div>
                <p className="text-sm text-[#333333] opacity-80">
                  You understand the health risks of continuing to smoke
                </p>
              </a>

              <a 
                href="/5r/rewards"
                className="p-5 rounded-2xl border-2 block transition-all hover:shadow-md hover:border-[#20B2AA]"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#FAFAFA' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(32, 178, 170, 0.1)' }}
                  >
                    <Award size={20} style={{ color: '#20B2AA' }} />
                  </div>
                  <h3 className="text-[#1C3B5E]">Rewards</h3>
                </div>
                <p className="text-sm text-[#333333] opacity-80">
                  You've seen the benefits you'll gain by quitting
                </p>
              </a>

              <a 
                href="/5r/roadblocks"
                className="p-5 rounded-2xl border-2 block transition-all hover:shadow-md hover:border-[#20B2AA]"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#FAFAFA' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(32, 178, 170, 0.1)' }}
                  >
                    <Shield size={20} style={{ color: '#20B2AA' }} />
                  </div>
                  <h3 className="text-[#1C3B5E]">Roadblocks</h3>
                </div>
                <p className="text-sm text-[#333333] opacity-80">
                  You have strategies ready to overcome common challenges
                </p>
              </a>
            </div>
          </div>

          {/* App Features */}
          <div className="mb-8">
            <h2 className="text-[#1C3B5E] mb-6 text-xl font-medium">Your Quit Journey Companion</h2>
            <p className="text-[#333333] mb-8 max-w-3xl">
              Our app provides comprehensive support for your quit journey. Here's what you can expect:
            </p>
            
            <div className="space-y-5">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className="p-6 rounded-2xl border-2 transition-all hover:shadow-md bg-white border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(32, 178, 170, 0.1)' }}
                      >
                        <Icon size={24} style={{ color: '#20B2AA' }} />
                      </div>
                      <div>
                        <h3 className="text-[#1C3B5E] text-lg font-medium mb-1">{feature.title}</h3>
                        <p className="text-[#333333] opacity-80">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Single Centered Button */}
          {userOnboardingStep !== null && userOnboardingStep < 4 && (
            <div className="mt-12 flex justify-center">
              <Button
                onClick={() => window.location.href = '/5a/ask'}
                className="px-12 py-6 text-lg rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white"
              >
                I'm Ready to Quit
              </Button>
            </div>
          )}
          
          {userOnboardingStep !== null && userOnboardingStep >= 4 && (
            <div className="mt-12 flex justify-center">
              <Button
                onClick={() => window.location.href = '/app'}
                className="px-12 py-6 text-lg rounded-2xl bg-[#1C3B5E] hover:bg-[#1C3B5E]/90 text-white"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
