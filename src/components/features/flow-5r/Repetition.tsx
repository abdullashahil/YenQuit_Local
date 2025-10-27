import { useState } from 'react';
import { Button } from '../../ui/button';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { CheckCircle2, Calendar, Heart, TrendingUp, Users, Book } from 'lucide-react';

interface FiveR_RepetitionProps {
  onComplete: () => void;
  onBack: () => void;
}

export function FiveR_Repetition({ onComplete, onBack }: FiveR_RepetitionProps) {
  const [commitments, setCommitments] = useState<string[]>([]);

  const commitmentOptions = [
    {
      id: 'daily-check',
      title: 'Daily Progress Check-ins',
      description: 'Log your daily progress and track smoke-free days'
    },
    {
      id: 'learning',
      title: 'Weekly Learning Content',
      description: 'Engage with educational videos and articles about quitting'
    },
    {
      id: 'community',
      title: 'Community Participation',
      description: 'Connect with others on the same journey for support'
    },
    {
      id: 'counseling',
      title: 'Professional Counseling',
      description: 'Schedule sessions with quit-smoking counselors'
    },
    {
      id: 'review',
      title: 'Monthly Review Sessions',
      description: 'Revisit your motivations and celebrate milestones'
    }
  ];

  const toggleCommitment = (id: string) => {
    setCommitments(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['RELEVANCE', 'RISKS', 'REWARDS', 'ROADBLOCKS', 'REPETITION']}
          currentStep={4}
        />

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-10 border border-gray-100">
          <h1 className="text-[#1C3B5E] mb-2">Step 5: REPETITION</h1>
          <p className="text-[#333333] mb-8">
            Building motivation takes time and repetition. Let's create a plan to keep you engaged 
            and motivated as you move closer to making your quit decision.
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
              <TrendingUp className="text-[#20B2AA] flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-[#1C3B5E] mb-2">Progress Through Engagement</h3>
                <p className="text-[#333333] text-sm">
                  You're not ready to quit today, and that's okay. By staying engaged with the app 
                  and revisiting these motivational messages, you'll build the confidence and readiness 
                  you need. Many successful quitters needed multiple attempts before they were ready.
                </p>
              </div>
            </div>
          </div>

          {/* Summary of Journey */}
          <div className="mb-8">
            <h2 className="text-[#1C3B5E] mb-6">Your Motivational Journey Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div 
                className="p-5 rounded-2xl border-2"
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
                  You've identified personal reasons to quit that matter to you
                </p>
              </div>

              <div 
                className="p-5 rounded-2xl border-2"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#FAFAFA' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  >
                    <Heart size={20} style={{ color: '#EF4444' }} />
                  </div>
                  <h3 className="text-[#1C3B5E]">Risks</h3>
                </div>
                <p className="text-sm text-[#333333] opacity-80">
                  You understand the health risks of continued tobacco use
                </p>
              </div>

              <div 
                className="p-5 rounded-2xl border-2"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#FAFAFA' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(32, 178, 170, 0.1)' }}
                  >
                    <CheckCircle2 size={20} style={{ color: '#20B2AA' }} />
                  </div>
                  <h3 className="text-[#1C3B5E]">Rewards</h3>
                </div>
                <p className="text-sm text-[#333333] opacity-80">
                  You've discovered the benefits that await when you quit
                </p>
              </div>

              <div 
                className="p-5 rounded-2xl border-2"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#FAFAFA' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(251, 146, 60, 0.1)' }}
                  >
                    <Book size={20} style={{ color: '#FB923C' }} />
                  </div>
                  <h3 className="text-[#1C3B5E]">Roadblocks</h3>
                </div>
                <p className="text-sm text-[#333333] opacity-80">
                  You have strategies ready to overcome common challenges
                </p>
              </div>
            </div>
          </div>

          {/* Commitment Options */}
          <div className="mb-8">
            <h2 className="text-[#1C3B5E] mb-4">Your Ongoing Engagement Plan</h2>
            <p className="text-[#333333] mb-6 opacity-80">
              Select the activities you're willing to commit to. These will help build your motivation 
              and prepare you for success when you're ready to quit.
            </p>
            
            <div className="space-y-3">
              {commitmentOptions.map((option) => {
                const isSelected = commitments.includes(option.id);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleCommitment(option.id)}
                    className="w-full text-left p-5 rounded-2xl border-2 transition-all hover:shadow-md"
                    style={{
                      backgroundColor: isSelected ? 'rgba(32, 178, 170, 0.05)' : '#FFFFFF',
                      borderColor: isSelected ? '#20B2AA' : '#E0E0E0'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-[#1C3B5E] mb-1">{option.title}</h3>
                        <p className="text-sm text-[#333333] opacity-70">
                          {option.description}
                        </p>
                      </div>
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 ml-4"
                        style={{ 
                          backgroundColor: isSelected ? '#20B2AA' : 'transparent',
                          borderColor: isSelected ? '#20B2AA' : '#E0E0E0'
                        }}
                      >
                        {isSelected && <span className="text-white text-sm">✓</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Completion Message */}
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
            <h2 className="text-[#1C3B5E] mb-3">Motivational Assessment Complete!</h2>
            <p className="text-[#333333] max-w-2xl mx-auto">
              You've taken an important first step. You'll now have access to motivational content, 
              community support, and educational resources. When you're ready to set a quit date, 
              you can transition to the structured 5 A's quitting program at any time.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={onBack}
              variant="outline"
              className="px-6 py-6 rounded-2xl border-2"
              style={{ borderColor: '#1C3B5E', color: '#1C3B5E' }}
            >
              Back
            </Button>
            <Button
              onClick={onComplete}
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
