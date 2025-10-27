import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface FiveA_AssistProps {
  onNext: (data: any) => void;
}

const copingStrategies = [
  'Deep breathing exercises',
  'Chewing gum or mints',
  'Call a friend or family member',
  'Physical activity (walk, jog, exercise)',
  'Drink water',
  'Use nicotine replacement therapy',
  'Practice mindfulness or meditation',
  'Keep hands busy (stress ball, fidget)',
  'Avoid triggers (coffee, alcohol)',
  'Positive self-talk'
];

export function FiveA_Assist({ onNext }: FiveA_AssistProps) {
  const [quitDate, setQuitDate] = useState<Date>();
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [triggers, setTriggers] = useState('');

  const handleStrategyToggle = (strategy: string) => {
    setSelectedStrategies(prev =>
      prev.includes(strategy)
        ? prev.filter(s => s !== strategy)
        : [...prev, strategy]
    );
  };

  const handleNext = () => {
    onNext({
      quitDate,
      copingStrategies: selectedStrategies,
      triggers
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['ASK', 'ADVISE', 'ASSESS', 'ASSIST', 'ARRANGE']}
          currentStep={3}
        />

        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 brand-card">
          <h1 className="brand-heading mb-2">Step 4: ASSIST</h1>
          <p className="brand-text mb-8">
            Let's create your personalized quit plan
          </p>

          {/* Quit Date Picker */}
          <div className="mb-8">
            <Label className="brand-text block mb-3">
              Set Your Official Quit Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left rounded-xl h-12 border brand-border"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {quitDate ? format(quitDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={quitDate}
                  onSelect={setQuitDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Coping Strategies */}
          <div className="mb-8">
            <Label className="brand-text block mb-3">
              Select Your Preferred Coping Strategies
            </Label>
            <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-2 gap-3">
              {copingStrategies.map((strategy) => (
                <div key={strategy} className="flex items-center space-x-2">
                  <Checkbox
                    id={strategy}
                    checked={selectedStrategies.includes(strategy)}
                    onCheckedChange={() => handleStrategyToggle(strategy)}
                    className="data-[state=checked]:bg-[#20B2AA] data-[state=checked]:border-[#20B2AA]"
                  />
                  <Label htmlFor={strategy} className="cursor-pointer text-sm brand-text">
                    {strategy}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Identify Triggers */}
          <div className="mb-8">
            <Label className="brand-text block mb-3">
              Identify Your Triggers
            </Label>
            <Textarea
              value={triggers}
              onChange={(e) => setTriggers(e.target.value)}
              placeholder="What situations, emotions, or activities trigger your tobacco use? (e.g., stress at work, after meals, social gatherings)"
              className="min-h-32 rounded-xl border brand-border"
            />
          </div>

          {/* Support Connection */}
          <div className="mb-8 bg-[#20B2AA]/10 rounded-2xl p-6 border-l-4 border-[#20B2AA]">
            <h3 className="brand-heading mb-2">Need Professional Support?</h3>
            <p className="brand-text mb-4 text-sm">
              Connect with a trained counselor who can provide personalized guidance and support throughout your journey.
            </p>
            <Button
              variant="outline"
              className="rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 brand-btn-outline-accent hover:opacity-90"
            >
              Connect with a Counselor
            </Button>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!quitDate || selectedStrategies.length === 0}
              className="px-8 py-6 rounded-2xl brand-btn disabled:opacity-50"
            >
              Next: Schedule Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
