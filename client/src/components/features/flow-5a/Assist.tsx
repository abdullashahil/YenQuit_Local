import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { CalendarIcon, CheckCircle2, Users, Loader2, X } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from '../../ui/switch';
import { Input } from '../../ui/input';
import { HesitationLink } from '../flow-shared/HesitationLink';
import { FiveA_AssistProps } from '../../../types/fiveAFlow';
import {
  getCopingStrategies,
  getNotificationTemplates,
  getUserAssistPlan,
  createOrUpdateUserAssistPlan,
  completeAssistPlan,
  getUserNotifications,
  upsertUserNotifications,
  CopingStrategy,
  NotificationTemplate,
  AssistPlan,
  UserNotification
} from '../../../services/assistService';


export function FiveA_Assist({ onNext, onComplete }: FiveA_AssistProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quitDate, setQuitDate] = useState<Date | undefined>(undefined);
  const [selectedStrategies, setSelectedStrategies] = useState<number[]>([]);
  const [triggers, setTriggers] = useState('');
  const [copingStrategies, setCopingStrategies] = useState<CopingStrategy[]>([]);
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>([]);
  const [userNotifications, setUserNotifications] = useState<UserNotification[]>([]);
  const [notifications, setNotifications] = useState<Record<string, { enabled: boolean; time: string }>>({});

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load coping strategies and notification templates
        const [strategiesData, templatesData, currentPlan, userNotifs] = await Promise.all([
          getCopingStrategies(),
          getNotificationTemplates(),
          getUserAssistPlan(),
          getUserNotifications()
        ]);
        
        setCopingStrategies(strategiesData);
        setNotificationTemplates(templatesData);
        setUserNotifications(userNotifs);
        
        // Check if user has already completed the assist step
        if (currentPlan && currentPlan.quit_date) {
          setIsCompleted(true);
        }
        
        // Initialize notifications state from templates and user preferences
        const notifState: Record<string, { enabled: boolean; time: string }> = {};
        templatesData.forEach(template => {
          const userNotif = userNotifs.find(n => n.template_id === template.id);
          const defaultTime = template.default_time || '09:00';
          notifState[template.key] = {
            enabled: userNotif ? userNotif.enabled : true,
            time: userNotif?.time || defaultTime
          };
        });
        setNotifications(notifState);
        
        // Load current plan data if exists
        if (currentPlan) {
          if (currentPlan.quit_date) {
            setQuitDate(new Date(currentPlan.quit_date));
          }
          if (currentPlan.triggers) {
            setTriggers(currentPlan.triggers);
          }
          if (currentPlan.strategies) {
            setSelectedStrategies(currentPlan.strategies.map(s => s.strategy_id));
          }
        }
      } catch (error) {
        console.error('Error loading assist data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Handle redirect countdown
  useEffect(() => {
    if (showSuccessModal && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      
      if (redirectCountdown === 1) {
        router.push('/5a/arrange');
      }
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, redirectCountdown, router]);

  const handleToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled }
    }));
  };

  const handleTimeChange = (key: string, time: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: { ...prev[key], time }
    }));
  };

  const handleStrategyToggle = (strategyId: number) => {
    setSelectedStrategies(prev =>
      prev.includes(strategyId)
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  const handleNext = async () => {
    try {
      setSaving(true);
      
      // Save assist plan
      await createOrUpdateUserAssistPlan({
        quitDate: quitDate ? quitDate.toISOString().split('T')[0] : undefined,
        triggers: triggers || undefined,
        selectedStrategyIds: selectedStrategies
      });
      
      // Save notifications
      const notificationData = Object.entries(notifications).map(([key, config]) => {
        const template = notificationTemplates.find(t => t.key === key);
        let timeValue = null;
        
        if (config.enabled && config.time && config.time.trim()) {
          // Validate time format (HH:MM)
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (timeRegex.test(config.time.trim())) {
            timeValue = config.time.trim();
          } else {
            console.warn(`Invalid time format for ${key}: ${config.time}`);
          }
        }
        
        return {
          template_id: template?.id || 0,
          enabled: config.enabled,
          time: timeValue
        };
      }).filter(n => n.template_id > 0);
      
      console.log('Sending notification data:', notificationData);
      
      if (notificationData.length > 0) {
        await upsertUserNotifications({ notifications: notificationData });
      }
      
      // Mark as completed
      setIsCompleted(true);
      
      // Update onboarding progress
      onNext({
        quitDate,
        copingStrategies: selectedStrategies,
        triggers,
        notifications
      });
      
      // Show success modal instead of immediate navigation
      setShowSuccessModal(true);
      setRedirectCountdown(5);
    } catch (error) {
      console.error('Error saving assist plan:', error);
      alert('Failed to save your plan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    try {
      setSaving(true);
      await completeAssistPlan();
      onComplete();
    } catch (error) {
      console.error('Error completing assist plan:', error);
      alert('Failed to complete plan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#20B2AA]" />
          <p className="brand-text">Loading your personalized plan...</p>
        </div>
      </div>
    );
  }

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

          {isCompleted && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-amber-800 text-center">
                <strong>Plan Completed</strong> - Your assist plan has been saved .
              </p>
            </div>
          )}

          {/* Quit Date Picker */}
          <div className="mb-8">
            <Label className="brand-text block mb-3">
              Set Your Official Quit Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left rounded-xl h-14 border brand-border ${isCompleted ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={isCompleted}
                >
                  <CalendarIcon className="mr-3 h-5 w-5" />
                  {quitDate ? format(quitDate, 'PPP') : <span className="text-gray-500">Select a date (minimum 30 days from today)</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4 bg-white shadow-xl border border-gray-200" align="start">
                <Calendar
                  mode="single"
                  selected={quitDate}
                  onSelect={setQuitDate}
                  disabled={isCompleted}
                  className="rounded-lg border-0"
                  style={{
                    width: '280px'
                  }}
                  initialFocus
                  defaultMonth={new Date(new Date().setDate(new Date().getDate() + 30))}
                  fromDate={new Date(new Date().setDate(new Date().getDate() + 30))}
                  toDate={new Date(new Date().setFullYear(new Date().getFullYear() + 2))}
                  modifiers={{
                    disabled: [
                      { before: new Date(new Date().setDate(new Date().getDate() + 30)) },
                      { after: new Date(new Date().setFullYear(new Date().getFullYear() + 2)) }
                    ]
                  }}
                  modifiersStyles={{
                    disabled: {
                      color: '#d1d5db',
                      backgroundColor: '#f9fafb',
                      cursor: 'not-allowed',
                      opacity: 0.5
                    },
                    selected: {
                      backgroundColor: '#20B2AA',
                      color: 'white',
                      fontWeight: 'bold'
                    },
                    today: {
                      backgroundColor: '#f0fdf4',
                      border: '2px solid #20B2AA'
                    }
                  }}
                  classNames={{
                    months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                    month: 'space-y-4',
                    caption: 'flex justify-between items-center pt-1 relative',
                    caption_label: 'text-sm font-medium text-gray-900',
                    nav: 'space-x-1 flex items-center',
                    nav_button: 'h-7 w-7 bg-transparent hover:bg-gray-100 rounded-md flex items-center justify-center',
                    nav_button_previous: '',
                    nav_button_next: '',
                    table: 'w-full border-collapse space-y-1',
                    head_row: 'flex',
                    head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
                    row: 'flex w-full mt-2',
                    cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                    day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors',
                    day_range_end: 'day-range-end',
                    day_selected: 'bg-[#20B2AA] text-white hover:bg-[#20B2AA] hover:text-white focus:bg-[#20B2AA] focus:text-white',
                    day_today: 'bg-[#f0fdf4] text-[#20B2AA] font-bold border-2 border-[#20B2AA]',
                    day_outside: 'day-outside text-gray-400 opacity-50 aria-selected:bg-accent/50 aria-selected:text-gray-400 aria-selected:opacity-30',
                    day_disabled: 'text-gray-400 opacity-50',
                    day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                    day_hidden: 'invisible'
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Coping Strategies */}
          <div className="mb-8">
            <Label className="brand-text block mb-3">
              Select Your Preferred Coping Strategies
            </Label>
            <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {copingStrategies.map((strategy) => (
                <div key={strategy.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`strategy-${strategy.id}`}
                    checked={selectedStrategies.includes(strategy.id)}
                    onCheckedChange={() => handleStrategyToggle(strategy.id)}
                    className={`data-[state=checked]:bg-[#20B2AA] data-[state=checked]:border-[#20B2AA] mt-1 ${isCompleted ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={isCompleted}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`strategy-${strategy.id}`} className="cursor-pointer text-sm brand-text font-medium">
                      {strategy.name}
                    </Label>
                    {strategy.description && (
                      <p className="text-xs text-gray-600 mt-1">{strategy.description}</p>
                    )}
                  </div>
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
            className={`min-h-32 rounded-xl border brand-border ${isCompleted ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={isCompleted}
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
            onClick={handleComplete}
            disabled={saving}
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Connect with a Counselor
          </Button>
        </div>

        {/* Dynamic Notification Scheduler */}
        <div className="mb-8">
          <h2 className="text-[#1C3B5E] mb-4">Set Up Your Reminders</h2>
          
          <div className="space-y-4">
            {notificationTemplates.map((template) => (
              <div key={template.id} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <Label className="text-[#1C3B5E] font-medium">{template.title}</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      {template.key === 'daily_motivation' && 'Start your day with encouragement'}
                      {template.key === 'progress_checkin' && 'Reflect on your day and log progress'}
                      {template.key === 'weekly_tip' && 'Expert advice delivered weekly'}
                    </p>
                  </div>
                  <Switch
                    checked={notifications[template.key]?.enabled || false}
                    onCheckedChange={() => handleToggle(template.key)}
                    className={`h-6 w-11 data-[state=checked]:bg-[#20B2AA] data-[state=unchecked]:bg-gray-300 transition-colors duration-200 ${isCompleted ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={isCompleted}
                  />
                </div>
                <div className={`mt-4 pl-1 overflow-hidden transition-all duration-300 ease-in-out ${notifications[template.key]?.enabled ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-32">
                        <Label className="text-sm font-medium text-gray-700">Time</Label>
                        <Input
                          type="time"
                          value={notifications[template.key]?.time || template.default_time || '09:00'}
                          onChange={(e) => handleTimeChange(template.key, e.target.value)}
                          className={`mt-1 rounded-lg h-10 w-full border-gray-300 focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] ${isCompleted ? 'opacity-60 cursor-not-allowed' : ''}`}
                          disabled={isCompleted}
                        />
                      </div>
                      <div className="text-sm text-gray-500 mt-5">
                        {template.key === 'daily_motivation' && 'Every morning'}
                        {template.key === 'progress_checkin' && 'Every evening'}
                        {template.key === 'weekly_tip' && 'Every Monday'}
                      </div>
                    </div>
                  </div>
                </div>
                ))}
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

          <HesitationLink />

          {!isCompleted && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleNext}
                disabled={saving}
                className="px-8 py-6 rounded-2xl bg-[#1C3B5E] hover:bg-[#1C3B5E]/90 text-white"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {saving ? 'Saving...' : 'Continue to Arrange'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => router.push('/5a/arrange')}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#20B2AA] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-white" size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Complete!</h2>
              
              <p className="text-lg text-gray-700 mb-4">
                You are tobacco-free starting{' '}
                <strong>{quitDate ? format(quitDate, 'MMMM d yyyy') : 'your chosen date'}</strong>
              </p>
              
              <p className="text-gray-600 mb-6">
                Your journey to a healthier life begins now. We're here to support you every step of the way.
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Redirecting to next step in...</p>
                <div className="text-3xl font-bold text-[#20B2AA]">{redirectCountdown}</div>
                <p className="text-xs text-gray-500 mt-1">seconds</p>
              </div>
              
              <Button
                onClick={() => router.push('/5a/arrange')}
                className="w-full px-6 py-3 rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white"
              >
                Continue Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
