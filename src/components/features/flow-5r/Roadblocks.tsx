import { useState } from 'react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { AlertCircle, Lightbulb, Brain, Users, Coffee, Home } from 'lucide-react';

interface FiveR_RoadblocksProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const commonRoadblocks = [
  {
    icon: Brain,
    title: 'Nicotine Withdrawal',
    description: 'Physical cravings and irritability',
    strategies: [
      'Use nicotine replacement therapy (patches, gum, lozenges)',
      'Practice deep breathing exercises',
      'Stay hydrated and eat healthy snacks',
      'Engage in physical activity'
    ]
  },
  {
    icon: Users,
    title: 'Social Situations',
    description: 'Pressure from friends who smoke',
    strategies: [
      'Avoid smoking areas and triggers initially',
      'Tell friends and family about your quit decision',
      'Practice saying "No, thank you" confidently',
      'Find non-smoking social activities'
    ]
  },
  {
    icon: Coffee,
    title: 'Habitual Triggers',
    description: 'Coffee breaks, after meals, driving',
    strategies: [
      'Change your routine during trigger times',
      'Replace smoking with healthier habits',
      'Use substitutes like sugar-free gum or hard candy',
      'Keep hands busy with a stress ball or fidget tool'
    ]
  },
  {
    icon: AlertCircle,
    title: 'Stress & Emotions',
    description: 'Using tobacco to cope with stress',
    strategies: [
      'Learn relaxation techniques (meditation, yoga)',
      'Exercise regularly to manage stress',
      'Talk to supportive friends or counselor',
      'Journal your feelings and progress'
    ]
  },
  {
    icon: Home,
    title: 'Home Environment',
    description: 'Tobacco products at home',
    strategies: [
      'Remove all tobacco products from your home',
      'Clean and air out your living space',
      'Avoid keeping "emergency" cigarettes',
      'Create a smoke-free home policy'
    ]
  }
];

export function FiveR_Roadblocks({ onNext, onBack }: FiveR_RoadblocksProps) {
  const [selectedRoadblocks, setSelectedRoadblocks] = useState<string[]>([]);
  const [personalRoadblock, setPersonalRoadblock] = useState('');
  const [personalStrategy, setPersonalStrategy] = useState('');

  const toggleRoadblock = (title: string) => {
    setSelectedRoadblocks(prev => 
      prev.includes(title) 
        ? prev.filter(r => r !== title)
        : [...prev, title]
    );
  };

  const handleNext = () => {
    onNext({ 
      selectedRoadblocks,
      personalRoadblock,
      personalStrategy
    });
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['RELEVANCE', 'RISKS', 'REWARDS', 'ROADBLOCKS', 'REPETITION']}
          currentStep={3}
        />

        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-[#1C3B5E] mb-2">Step 4: ROADBLOCKS</h1>
          <p className="text-[#333333] mb-8">
            Identify potential obstacles to quitting and plan strategies to overcome them. 
            Being prepared helps you stay on track when challenges arise.
          </p>

          {/* Info Banner */}
          <div 
            className="mb-8 p-6 rounded-2xl"
            style={{ 
              backgroundColor: 'rgba(251, 146, 60, 0.1)',
              border: '2px solid rgba(251, 146, 60, 0.3)'
            }}
          >
            <div className="flex items-start gap-4">
              <Lightbulb className="flex-shrink-0 mt-1" style={{ color: '#FB923C' }} size={24} />
              <div>
                <h3 className="text-[#1C3B5E] mb-2">Preparation is Key</h3>
                <p className="text-[#333333] text-sm">
                  Everyone faces challenges when quitting. The difference between success and relapse 
                  is having a plan. Select the roadblocks you expect to face and review proven strategies 
                  to overcome them.
                </p>
              </div>
            </div>
          </div>

          {/* Common Roadblocks */}
          <div className="mb-8">
            <h2 className="text-[#1C3B5E] mb-6">Common Roadblocks & Solutions</h2>
            
            <div className="space-y-4">
              {commonRoadblocks.map((roadblock) => {
                const Icon = roadblock.icon;
                const isSelected = selectedRoadblocks.includes(roadblock.title);
                
                return (
                  <button
                    key={roadblock.title}
                    onClick={() => toggleRoadblock(roadblock.title)}
                    className="w-full text-left p-6 rounded-2xl border-2 transition-all hover:shadow-md"
                    style={{
                      backgroundColor: isSelected ? 'rgba(32, 178, 170, 0.05)' : '#FFFFFF',
                      borderColor: isSelected ? '#20B2AA' : '#E0E0E0'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(251, 146, 60, 0.1)' }}
                      >
                        <Icon size={24} style={{ color: '#FB923C' }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-[#1C3B5E]">{roadblock.title}</h3>
                            <p className="text-sm text-[#333333] opacity-70 mt-1">
                              {roadblock.description}
                            </p>
                          </div>
                          {isSelected && (
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: '#20B2AA' }}
                            >
                              <span className="text-white text-sm">✓</span>
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <div className="mt-4 pl-4 border-l-2" style={{ borderColor: '#20B2AA' }}>
                            <p className="text-sm mb-2" style={{ color: '#20B2AA' }}>
                              Recommended Strategies:
                            </p>
                            <ul className="space-y-2">
                              {roadblock.strategies.map((strategy, index) => (
                                <li key={index} className="text-sm text-[#333333] opacity-80 flex items-start gap-2">
                                  <span className="text-[#20B2AA] mt-1">•</span>
                                  <span>{strategy}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <p className="text-sm text-[#333333] opacity-70 mt-4 text-center">
              Click to select roadblocks and view strategies ({selectedRoadblocks.length} selected)
            </p>
          </div>

          {/* Personal Roadblock Section */}
          <div className="mb-8">
            <h2 className="text-[#1C3B5E] mb-6">Your Personal Roadblock (Optional)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: '#333333' }}>
                  Describe a unique challenge you expect to face:
                </label>
                <Textarea
                  value={personalRoadblock}
                  onChange={(e) => setPersonalRoadblock(e.target.value)}
                  placeholder="e.g., My spouse still smokes, I work in a high-stress environment..."
                  className="rounded-xl border-2 min-h-24"
                  style={{ borderColor: '#E0E0E0' }}
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2" style={{ color: '#333333' }}>
                  Your strategy to overcome it:
                </label>
                <Textarea
                  value={personalStrategy}
                  onChange={(e) => setPersonalStrategy(e.target.value)}
                  placeholder="e.g., I'll ask my spouse to smoke outside only, I'll practice stress-relief techniques..."
                  className="rounded-xl border-2 min-h-24"
                  style={{ borderColor: '#E0E0E0' }}
                />
              </div>
            </div>
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
              onClick={handleNext}
              className="px-8 py-6 rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white"
            >
              Continue to Repetition
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
