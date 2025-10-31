import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { CalendarIcon, CheckCircle2, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from '../../ui/switch';
import { Input } from '../../ui/input';
import { HesitationLink } from '../flow-shared/HesitationLink';
import { FiveA_AssistProps } from '../../../types/fiveAFlow';

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
  const router = useRouter();
  const [quitDate, setQuitDate] = useState<Date | undefined>(undefined);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [triggers, setTriggers] = useState('');
  const [notifications, setNotifications] = useState({
    dailyMotivation: { enabled: true, time: '09:00' },
    progressCheckIn: { enabled: true, time: '20:00' },
    weeklyTip: { enabled: true, time: '10:00' }
  });

  const handleToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], enabled: !prev[key as keyof typeof prev].enabled }
    }));
  };

  const handleTimeChange = (key: string, time: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], time }
    }));
  };

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
      triggers,
      notifications
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
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={quitDate}
                  onSelect={setQuitDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="bg-white"
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
              onClick={() => router.push('/5a/arrange')}
            >
              Connect with a Counselor
            </Button>
          </div>

          {/* Notification Scheduler */}
          <div className="mb-8">
            <h2 className="text-[#1C3B5E] mb-4">Set Up Your Reminders</h2>
            
            <div className="space-y-4">
              {/* Daily Motivational Reminder */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Label className="text-[#333333]">Daily Motivational Reminder</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Start your day with encouragement
                    </p>
                  </div>
                  <Switch
                    checked={notifications.dailyMotivation.enabled}
                    onCheckedChange={() => handleToggle('dailyMotivation')}
                    className="data-[state=checked]:bg-[#20B2AA]"
                  />
                </div>
                {notifications.dailyMotivation.enabled && (
                  <div className="mt-3">
                    <Label className="text-sm text-[#333333]">Time</Label>
                    <Input
                      type="time"
                      value={notifications.dailyMotivation.time}
                      onChange={(e) => handleTimeChange('dailyMotivation', e.target.value)}
                      className="mt-2 rounded-lg w-40"
                    />
                  </div>
                )}
              </div>

              {/* Progress Check-In */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Label className="text-[#333333]">Progress Check-In (Evening)</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Reflect on your day and log progress
                    </p>
                  </div>
                  <Switch
                    checked={notifications.progressCheckIn.enabled}
                    onCheckedChange={() => handleToggle('progressCheckIn')}
                    className="data-[state=checked]:bg-[#20B2AA]"
                  />
                </div>
                {notifications.progressCheckIn.enabled && (
                  <div className="mt-3">
                    <Label className="text-sm text-[#333333]">Time</Label>
                    <Input
                      type="time"
                      value={notifications.progressCheckIn.time}
                      onChange={(e) => handleTimeChange('progressCheckIn', e.target.value)}
                      className="mt-2 rounded-lg w-40"
                    />
                  </div>
                )}
              </div>

              {/* Weekly Tip */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Label className="text-[#333333]">Weekly Tip</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Expert advice delivered weekly
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyTip.enabled}
                    onCheckedChange={() => handleToggle('weeklyTip')}
                    className="data-[state=checked]:bg-[#20B2AA]"
                  />
                </div>
                {notifications.weeklyTip.enabled && (
                  <div className="mt-3">
                    <Label className="text-sm text-[#333333]">Time</Label>
                    <Input
                      type="time"
                      value={notifications.weeklyTip.time}
                      onChange={(e) => handleTimeChange('weeklyTip', e.target.value)}
                      className="mt-2 rounded-lg w-40"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Community Link */}
          {/* <div className="mb-8 bg-gradient-to-r from-[#20B2AA]/10 to-[#20B2AA]/5 rounded-2xl p-6 border border-[#20B2AA]/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#20B2AA] rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-[#1C3B5E] mb-2">Join Your Peer Support Group</h3>
                <p className="text-[#333333] text-sm mb-4">
                  Connect with others on the same journey. Share experiences, get support, and celebrate victories together in the Uphold Community.
                </p>
                <Button
                  variant="outline"
                  className="rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA]/10"
                >
                  Explore Community
                </Button>
              </div>
            </div>
          </div> */}

          {/* Success Summary */}
          <div className="mb-8 bg-gradient-to-r from-[#20B2AA] to-[#20B2AA]/80 rounded-2xl p-8 text-white text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-[#20B2AA]" size={32} />
            </div>
            <h2 className="mb-2">Plan Complete!</h2>
            <p className="text-lg">
              You are tobacco-free starting{' '}
              <strong>{quitDate ? format(quitDate, 'MMMM d, yyyy') : 'your chosen date'}</strong>
            </p>
            <p className="mt-2 opacity-90">
              Your journey to a healthier life begins now. We're here to support you every step of the way.
            </p>
          </div>

          <HesitationLink />

          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                handleNext();
                router.push('/app');
              }}
              className="px-8 py-6 rounded-2xl brand-btn"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
