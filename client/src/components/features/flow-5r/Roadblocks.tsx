import { useState } from 'react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { AlertCircle, Lightbulb, Brain, Users, Coffee, Home, Check } from 'lucide-react';

interface FiveR_RoadblocksProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const commonRoadblocks = [
  {
    id: 'stress',
    title: 'Stress Management',
    description: 'Smoking is my main way to cope with stress and anxiety.',
    resolution: 'Learn alternative stress management techniques like deep breathing, meditation, or physical activity to replace smoking as a coping mechanism.'
  },
  {
    id: 'social',
    title: 'Social Situations',
    description: 'I often smoke when I\'m with friends who smoke or in social settings.',
    resolution: 'Plan ahead for social situations. Let friends know you\'re trying to quit, and have strategies ready like chewing gum or having non-smoking friends as support.'
  },
  {
    id: 'cravings',
    title: 'Nicotine Cravings',
    description: 'The physical cravings for nicotine are too strong to resist.',
    resolution: 'Consider nicotine replacement therapy (patches, gum) or prescription medications. Cravings typically peak at 2-3 days and decrease over 2-4 weeks.'
  },
  {
    id: 'habit',
    title: 'Habit & Routine',
    description: 'Smoking is part of my daily routine (after meals, with coffee, etc.).',
    resolution: 'Disrupt your smoking routines. Change your morning routine, take a different route to work, or switch to tea instead of coffee to break the association.'
  },
  {
    id: 'withdrawal',
    title: 'Withdrawal Symptoms',
    description: 'I\'m afraid of withdrawal symptoms like irritability and weight gain.',
    resolution: 'Withdrawal is temporary (2-4 weeks). Stay hydrated, exercise, and have healthy snacks ready. The benefits of quitting far outweigh these temporary discomforts.'
  },
  {
    id: 'motivation',
    title: 'Motivation',
    description: 'I struggle to stay motivated to quit for the long term.',
    resolution: 'Create a motivation list, set small milestones, and reward yourself. Track your progress and remember your reasons for quitting.'
  }
];

export function FiveR_Roadblocks({ onNext, onBack }: FiveR_RoadblocksProps) {
  const [selectedRoadblocks, setSelectedRoadblocks] = useState<string[]>([]);
  const [showResolutions, setShowResolutions] = useState(false);
  const [personalRoadblock, setPersonalRoadblock] = useState('');
  const [personalStrategy, setPersonalStrategy] = useState('');

  const toggleRoadblock = (id: string) => {
    setSelectedRoadblocks(prev => 
      prev.includes(id) 
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  const handleNext = () => {
    onNext({ 
      selectedRoadblocks,
      personalRoadblock,
      personalStrategy
    });
  };

  const handleShowResolutions = () => {
    setShowResolutions(true);
  };

  const handleBackToSelection = () => {
    setShowResolutions(false);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['RELEVANCE', 'RISKS', 'REWARDS', 'ROADBLOCKS', 'REPETITION']}
          currentStep={3}
        />

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-10 border border-gray-100">
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
            <h2 className="text-[#1C3B5E] mb-6 text-2xl font-semibold">Identify Your Roadblocks</h2>
            <p className="text-[#333333] mb-8 text-lg">
              Select the challenges you face when trying to quit smoking. 
              {!showResolutions && selectedRoadblocks.length > 0 && (
                <span className="block mt-2 text-[#20B2AA] font-medium">
                  {selectedRoadblocks.length} selected. Ready to see strategies?
                </span>
              )}
            </p>

            {!showResolutions ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {commonRoadblocks.map((roadblock) => {
                    const isSelected = selectedRoadblocks.includes(roadblock.id);
                    return (
                      <div 
                        key={roadblock.id}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-[#20B2AA] bg-[#F0F9F9]' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => toggleRoadblock(roadblock.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-[#20B2AA]' : 'bg-gray-100 border-2 border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <h3 className="text-[#1C3B5E] font-medium">{roadblock.title}</h3>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedRoadblocks.length > 0 && (
                  <div className="flex justify-center mb-8">
                    <Button
                      onClick={handleShowResolutions}
                      className="px-8 py-6 text-lg rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white"
                    >
                      Show Me Strategies for {selectedRoadblocks.length} {selectedRoadblocks.length === 1 ? 'Challenge' : 'Challenges'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div className="space-y-6">
                  {commonRoadblocks
                    .filter(r => selectedRoadblocks.includes(r.id))
                    .map((roadblock) => (
                      <div 
                        key={roadblock.id}
                        className="p-6 rounded-2xl bg-white border-2 border-[#E0F2F1]"
                      >
                        <h3 className="text-[#1C3B5E] text-xl font-semibold mb-3">{roadblock.title}</h3>
                        <p className="text-[#333333] mb-4">{roadblock.description}</p>
                        <div className="p-4 bg-[#F0F9F9] rounded-lg border-l-4 border-[#20B2AA]">
                          <p className="text-[#1C3B5E] font-medium mb-2">Strategy:</p>
                          <p className="text-[#333333]">{roadblock.resolution}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
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
              Continue to Repetition
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
