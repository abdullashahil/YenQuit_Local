import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../ui/button';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { Heart, Users, DollarSign, Sparkles, UserCircle, Check } from 'lucide-react';
import { fiverService, RelevanceOption } from '../../../services/fiverService';

interface FiveR_RelevanceProps {
  onNext: (data: any) => void;
  userId?: string; // Optional userId for existing users (UUID as string)
}

export function FiveR_Relevance({ onNext, userId }: FiveR_RelevanceProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);
  const [relevanceOptions, setRelevanceOptions] = useState<RelevanceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      // Show toast before redirect
      setShowToast(true);
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }
  }, [router]);

  // Icon mapping
  const iconMap = {
    'heart': Heart,
    'users': Users,
    'dollar-sign': DollarSign,
    'sparkles': Sparkles,
    'user-circle': UserCircle
  };

  // Fetch relevance options on component mount
  useEffect(() => {
    const fetchRelevanceOptions = async () => {
      try {
        // Get userId from localStorage if not provided as prop
        const currentUserId = userId || (() => {
          const user = localStorage.getItem('user');
          return user ? JSON.parse(user).id : null;
        })();
        
        const options = await fiverService.getRelevanceOptions();
        setRelevanceOptions(options);
        
        // If userId is provided, load existing selections
        if (currentUserId) {
          const existingSelections = await fiverService.getUserRelevanceSelections(currentUserId);
          setSelected(existingSelections.map(option => option.id));
        }
      } catch (error) {
        console.error('Error loading relevance options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelevanceOptions();
  }, [userId]);

  const handleToggle = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (selected.length === 0) return;
    
    setSaving(true);
    try {
      // Get userId from localStorage if not provided as prop
      const currentUserId = userId || (() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user).id : null;
      })();
      
      // Save selections to database if userId is provided
      if (currentUserId) {
        await fiverService.saveUserRelevanceSelections({
          userId: currentUserId,
          selectedOptions: selected
        });
      }
      
      onNext({ relevance: selected });
    } catch (error) {
      console.error('Error saving selections:', error);
      // Still proceed to next step even if save fails
      onNext({ relevance: selected });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['RELEVANCE', 'RISKS', 'REWARDS', 'ROADBLOCKS', 'REPETITION']}
          currentStep={0}
        />

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-10 border border-gray-100">
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#1C3B5E] mb-2">Step 1: RELEVANCE</h1>
          <p className="text-sm md:text-base text-[#333333] mb-6 md:mb-8">
            Why might quitting matter most to you? Select all that apply.
          </p>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-[#333333]">Loading options...</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {relevanceOptions.map((option) => {
                const Icon = iconMap[option.icon_name as keyof typeof iconMap] || Heart;
                const isSelected = selected.includes(option.id);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleToggle(option.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-[#20B2AA] bg-[#20B2AA]/10'
                        : 'border-gray-200 hover:border-[#20B2AA]/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-[#20B2AA] rounded-full flex items-center justify-center">
                        <Check className="text-white" size={16} />
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      isSelected ? 'bg-[#20B2AA]' : 'bg-gray-100'
                    }`}>
                      <Icon className={isSelected ? 'text-white' : 'text-[#333333]'} size={24} />
                    </div>
                    <h3 className="text-[#1C3B5E] mb-1">{option.label}</h3>
                    <p className="text-sm text-[#333333]">{option.description}</p>
                  </button>
                );
              })}
            </div>
          )}


          <div className="mt-8 flex justify-between gap-4">
            <Button
              onClick={() => window.location.href = '/5a/ask'}
              className="flex-1 px-6 py-6 rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white"
            >
              I'm Ready to Quit
            </Button>
            <Button
              onClick={handleNext}
              disabled={selected.length === 0 || saving}
              variant="outline"
              className="flex-1 px-6 py-6 rounded-2xl border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA]/10 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Next: See Your Risks'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="rounded-xl bg-[#1C3B5E] text-white px-4 py-3 shadow-lg max-w-sm">
            <div className="font-medium">Please login first</div>
            <div className="text-sm opacity-80">Redirecting to login page...</div>
          </div>
        </div>
      )}
    </div>
  );
}
