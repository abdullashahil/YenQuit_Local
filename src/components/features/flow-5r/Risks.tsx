import { Button } from '../../ui/button';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { AlertTriangle, Heart, Skull, Baby, Users, TrendingDown } from 'lucide-react';

interface FiveR_RisksProps {
  onNext: (data: any) => void;
}

const healthRisks = [
  {
    icon: Heart,
    title: 'Heart Disease & Stroke',
    description: 'Tobacco use increases your risk of heart disease by 2-4 times and doubles your risk of stroke.',
    severity: 'high'
  },
  {
    icon: Skull,
    title: 'Cancer',
    description: 'Smoking causes about 90% of lung cancer deaths and increases risk for 15+ types of cancer.',
    severity: 'high'
  },
  {
    icon: TrendingDown,
    title: 'Respiratory Problems',
    description: 'COPD, emphysema, and chronic bronchitis are directly linked to tobacco use.',
    severity: 'high'
  },
  {
    icon: Baby,
    title: 'Pregnancy Complications',
    description: 'Tobacco use during pregnancy increases risks of premature birth, low birth weight, and birth defects.',
    severity: 'medium'
  },
  {
    icon: Users,
    title: 'Secondhand Smoke Effects',
    description: 'Your tobacco use puts family and friends at risk for respiratory infections and cancer.',
    severity: 'medium'
  },
  {
    icon: AlertTriangle,
    title: 'Weakened Immune System',
    description: 'Tobacco compromises your immune system, making you more susceptible to infections.',
    severity: 'medium'
  }
];

export function FiveR_Risks({ onNext }: FiveR_RisksProps) {
  const handleNext = () => {
    onNext({ acknowledgedRisks: healthRisks.map(r => r.title) });
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['RELEVANCE', 'RISKS', 'REWARDS', 'ROADBLOCKS', 'REPETITION']}
          currentStep={1}
        />

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-10 border border-gray-100">
          <h1 className="text-[#1C3B5E] mb-2">Step 2: RISKS</h1>
          <p className="text-[#333333] mb-8">
            Understanding the health risks of tobacco use can strengthen your motivation to quit. 
            Review these scientifically-backed risks that affect you and those around you.
          </p>

          {/* Warning Banner */}
          <div 
            className="mb-8 p-6 rounded-2xl border-2"
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              borderColor: 'rgba(239, 68, 68, 0.2)'
            }}
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-[#1C3B5E] mb-2">Health Impact</h3>
                <p className="text-[#333333] text-sm">
                  Every cigarette you smoke damages your body. However, your body begins to heal 
                  within <strong>20 minutes</strong> of your last cigarette, and significant health 
                  improvements occur within weeks to months of quitting.
                </p>
              </div>
            </div>
          </div>

          {/* Health Risks Grid */}
          <div className="mb-8">
            <h2 className="text-[#1C3B5E] mb-6">Health Risks Associated with Tobacco Use</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthRisks.map((risk) => {
                const Icon = risk.icon;
                
                return (
                  <div
                    key={risk.title}
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
              Continue to Rewards
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
