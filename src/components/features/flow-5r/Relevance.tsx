import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { Heart, Users, DollarSign, Sparkles, UserCircle, Check } from 'lucide-react';

interface FiveR_RelevanceProps {
  onNext: (data: any) => void;
}

const relevanceOptions = [
  { id: 'health', label: 'Health', icon: Heart, description: 'Improve physical and oral health' },
  { id: 'family', label: 'Family', icon: Users, description: 'Be there for loved ones' },
  { id: 'money', label: 'Money', icon: DollarSign, description: 'Save significant expenses' },
  { id: 'appearance', label: 'Appearance', icon: Sparkles, description: 'Better teeth, skin, and overall look' },
  { id: 'social', label: 'Social Image', icon: UserCircle, description: 'Improve social perception' }
];

export function FiveR_Relevance({ onNext }: FiveR_RelevanceProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [savingsAmount] = useState(36500); // Mock calculation

  const handleToggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
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

          <div className="grid grid-cols-2 gap-4 mb-8">
            {relevanceOptions.map((option) => {
              const Icon = option.icon;
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

          {/* Savings Display */}
          <div className="bg-gradient-to-r from-[#20B2AA] to-[#20B2AA]/80 rounded-2xl p-8 text-white text-center mb-8">
            <h2 className="mb-2">Potential Savings</h2>
            <div className="text-4xl mb-2">₹{savingsAmount.toLocaleString()}</div>
            <p className="opacity-90">
              Estimated amount you could save per year by quitting
            </p>
            <p className="text-sm mt-3 opacity-75">
              Based on average consumption patterns
            </p>
          </div>

          <div className="mt-8 flex justify-between gap-4">
            <Button
              onClick={() => window.location.href = '/5a/ask'}
              className="flex-1 px-6 py-6 rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white"
            >
              I'm Ready to Quit
            </Button>
            <Button
              onClick={() => onNext({ relevance: selected, potentialSavings: savingsAmount })}
              disabled={selected.length === 0}
              variant="outline"
              className="flex-1 px-6 py-6 rounded-2xl border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA]/10 disabled:opacity-50"
            >
              Next: See Your Risks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
