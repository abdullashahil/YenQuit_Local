import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { Input } from '../../ui/input';
import { CheckCircle2, Users } from 'lucide-react';
import { format } from 'date-fns';

interface FiveA_ArrangeProps {
  onComplete: (data: any) => void;
  quitDate?: Date;
}

export function FiveA_Arrange({ onComplete, quitDate }: FiveA_ArrangeProps) {
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

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['ASK', 'ADVISE', 'ASSESS', 'ASSIST', 'ARRANGE']}
          currentStep={4}
        />

        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-[#1C3B5E] mb-2">Step 5: ARRANGE</h1>
          <p className="text-[#333333] mb-8">
            Schedule ongoing support and reminders
          </p>

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
          <div className="mb-8 bg-gradient-to-r from-[#20B2AA]/10 to-[#20B2AA]/5 rounded-2xl p-6 border border-[#20B2AA]/30">
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
          </div>

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

          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => onComplete(notifications)}
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
