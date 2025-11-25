import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { HesitationLink } from '../flow-shared/HesitationLink';
import { FiveA_AskProps } from '../../../types/fiveAFlow';

interface Question {
  id: number;
  step: string;
  question_text: string;
  options: string[];
}

interface SavedAnswer {
  question_id: number;
  answer_text: string;
}

interface ExtendedFiveAAskProps extends FiveA_AskProps {
  questions?: Question[];
  savedAnswers?: SavedAnswer[];
  submitted?: boolean;
}

export function FiveA_Ask({ onNext, questions = [], savedAnswers = [], submitted = false }: ExtendedFiveAAskProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Pre-fill answers from savedAnswers on mount
  useEffect(() => {
    if (savedAnswers.length > 0) {
      const prefilled: Record<string, string> = {};
      savedAnswers.forEach(sa => {
        prefilled[`q${sa.question_id}`] = sa.answer_text;
      });
      setAnswers(prefilled);
    }
  }, [savedAnswers]);

  const handleAnswer = (questionId: string, value: string) => {
    if (submitted) return; // read-only if already submitted
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isComplete = questions.length > 0 && questions.every(q => answers[`q${q.id}`]);

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
            {submitted ? 'Your answers have been submitted.' : 'Please answer the following questions to help us understand your tobacco use pattern.'}
          </p>

          <div className="space-y-4 md:space-y-5">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="rounded-xl md:rounded-2xl p-4 md:p-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #E0E0E0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  opacity: submitted ? 0.7 : 1,
                  pointerEvents: submitted ? 'none' : 'auto'
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
                  {index + 1}. {q.question_text}
                </Label>
                <RadioGroup
                  value={answers[`q${q.id}`] || ''}
                  onValueChange={(value) => handleAnswer(`q${q.id}`, value)}
                  className="space-y-3"
                  disabled={submitted}
                >
                  {q.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center p-4 rounded-xl transition-all duration-200"
                      style={{
                        backgroundColor: answers[`q${q.id}`] === option ? 'rgba(32, 178, 170, 0.08)' : 'transparent',
                        border: `2px solid ${answers[`q${q.id}`] === option ? '#20B2AA' : 'transparent'}`,
                        cursor: submitted ? 'not-allowed' : 'pointer'
                      }}
                      onClick={() => !submitted && handleAnswer(`q${q.id}`, option)}
                    >
                      <RadioGroupItem
                        value={option}
                        id={`${q.id}-${option}`}
                        className="w-5 h-5"
                        style={{
                          borderColor: '#20B2AA',
                          color: '#20B2AA'
                        }}
                        disabled={submitted}
                      />
                      <Label
                        htmlFor={`${q.id}-${option}`}
                        className="ml-4 cursor-pointer flex-1"
                        style={{ color: '#333333', cursor: submitted ? 'not-allowed' : 'pointer' }}
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
              disabled={!isComplete || submitted}
              className="px-8 py-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isComplete && !submitted ? '#20B2AA' : '#cccccc',
                color: '#FFFFFF'
              }}
            >
              {submitted ? 'Already Submitted' : 'Next: Get Your Personalized Advice'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
