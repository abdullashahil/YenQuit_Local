import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { HesitationLink } from '../flow-shared/HesitationLink';
import { FiveA_AskProps } from '../../../types/fiveAFlow';

const askQuestions = [
  {
    id: 'q1',
    question: 'What type of tobacco do you use?',
    options: [
      'Cigarettes',
      'Beedi',
      'Cigars',
      'Chewing Tobacco',
      'Hookah',
      'Other'
    ]
  },
  {
    id: 'q2',
    question: 'How often do you use tobacco in a day?',
    options: [
      '1-2 times',
      '3-5 times',
      '6-10 times',
      'More than 10 times'
    ]
  },
  {
    id: 'q3',
    question: 'For how long have you been using tobacco?',
    options: [
      'Less than 6 months',
      '6 months - 1 year',
      '1-5 years',
      'More than 5 years'
    ]
  },
  {
    id: 'q4',
    question: 'How much tobacco do you consume in a day?',
    options: [
      'Less than 5 cigarettes/beedis',
      '5-10 cigarettes/beedis',
      '11-20 cigarettes/beedis',
      'More than 20 cigarettes/beedis'
    ]
  },
  {
    id: 'q5',
    question: 'How much money do you spend on each cigarette or tobacco use?',
    options: [
      'Less than ₹5',
      '₹5-₹10',
      '₹11-₹20',
      'More than ₹20'
    ]
  }
];

export function FiveA_Ask({ onNext }: FiveA_AskProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isComplete = Object.keys(answers).length === askQuestions.length;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['ASK', 'ADVISE', 'ASSESS', 'ASSIST', 'ARRANGE']}
          currentStep={0}
        />

        <div 
          className="rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10"
          style={{ 
            backgroundColor: '#FFFFFF',
            boxShadow: '0 10px 40px rgba(28, 59, 94, 0.12)'
          }}
        >
          <h1 
            className="text-2xl md:text-3xl lg:text-4xl mb-2"
            style={{ color: '#1C3B5E' }}
          >
            Step 1: Ask – Understand Your Tobacco Use
          </h1>
          <p 
            className="text-sm md:text-base mb-6 md:mb-8 lg:mb-10"
            style={{ color: '#333333', opacity: 0.7 }}
          >
            Please answer the following questions to help us understand your tobacco use pattern.
          </p>

          <div className="space-y-4 md:space-y-5">
            {askQuestions.map((q, index) => (
              <div 
                key={q.id} 
                className="rounded-xl md:rounded-2xl p-4 md:p-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #E0E0E0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              >
                <Label 
                  className="block mb-5"
                  style={{ 
                    color: '#1C3B5E',
                    fontSize: '1.05rem',
                    lineHeight: '1.5'
                  }}
                >
                  {index + 1}. {q.question}
                </Label>
                <RadioGroup
                  value={answers[q.id] || ''}
                  onValueChange={(value) => handleAnswer(q.id, value)}
                  className="space-y-3"
                >
                  {q.options.map((option) => (
                    <div 
                      key={option} 
                      className="flex items-center p-4 rounded-xl transition-all duration-200"
                      style={{
                        backgroundColor: answers[q.id] === option ? 'rgba(32, 178, 170, 0.08)' : 'transparent',
                        border: `2px solid ${answers[q.id] === option ? '#20B2AA' : 'transparent'}`,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleAnswer(q.id, option)}
                    >
                      <RadioGroupItem 
                        value={option} 
                        id={`${q.id}-${option}`}
                        className="w-5 h-5"
                        style={{
                          borderColor: '#20B2AA',
                          color: '#20B2AA'
                        }}
                      />
                      <Label 
                        htmlFor={`${q.id}-${option}`} 
                        className="ml-4 cursor-pointer flex-1"
                        style={{ color: '#333333' }}
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>

          <HesitationLink />

          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => onNext(answers)}
              disabled={!isComplete}
              className="px-8 py-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isComplete ? '#20B2AA' : '#cccccc',
                color: '#FFFFFF'
              }}
            >
              Next: Get Your Personalized Advice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
