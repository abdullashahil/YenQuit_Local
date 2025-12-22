import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { HesitationLink } from '../flow-shared/HesitationLink';
import { BackToHomeButton } from '../../shared/BackToHomeButton';
import { FiveA_AskProps } from '../../../types/fiveAFlow';
import { userService } from '../../../services/userService';

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
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});
  const [userOnboardingStep, setUserOnboardingStep] = useState<number | null>(null);

  // Fetch user profile to get onboarding_step
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getProfile();
        setUserOnboardingStep(response.data.onboarding_step || 0);

      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserOnboardingStep(0);
      }
    };

    fetchUserProfile();
  }, []);

  // Pre-fill answers from savedAnswers on mount
  useEffect(() => {
    if (savedAnswers.length > 0) {
      const prefilled: Record<string, string> = {};
      const prefilledSelected: Record<string, string> = {};
      const prefilledOtherTexts: Record<string, string> = {};

      savedAnswers.forEach(sa => {
        const key = `q${sa.question_id}`;
        prefilled[key] = sa.answer_text;

        // Check if the answer corresponds to an "Others" option
        const question = questions.find(q => q.id === sa.question_id);
        if (question && question.options.includes("Others")) {
          // If the answer text doesn't match any option exactly, it must be from "Others"
          const isOtherAnswer = !question.options.includes(sa.answer_text);
          if (isOtherAnswer) {
            prefilledSelected[key] = "Others";
            prefilledOtherTexts[key] = sa.answer_text;
          } else {
            prefilledSelected[key] = sa.answer_text;
          }
        } else {
          prefilledSelected[key] = sa.answer_text;
        }
      });

      setAnswers(prefilled);
      setSelectedOptions(prefilledSelected);
      setOtherTexts(prefilledOtherTexts);
    }
  }, [savedAnswers, questions]);

  const handleAnswer = (questionId: string, value: string) => {
    if (submitted) return; // read-only if already submitted
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleOptionChange = (questionId: string, option: string) => {
    if (submitted) return;

    setSelectedOptions(prev => ({ ...prev, [questionId]: option }));

    if (option === "Others") {
      // When "Others" is selected, set answer to current other text or empty string
      setAnswers(prev => ({ ...prev, [questionId]: otherTexts[questionId] || "" }));
    } else {
      // For non-"Others" options, set answer directly to the option
      setAnswers(prev => ({ ...prev, [questionId]: option }));
    }
  };

  const handleOtherTextChange = (questionId: string, value: string) => {
    if (submitted) return;

    setOtherTexts(prev => ({ ...prev, [questionId]: value }));

    // If "Others" is currently selected, update the answer with the new text
    if (selectedOptions[questionId] === "Others") {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const isComplete = questions.length > 0 && questions.every(q => {
    const key = `q${q.id}`;
    return answers[key]?.trim() !== "";
  });

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['ASK', 'ADVISE', 'ASSESS', 'ASSIST', 'ARRANGE']}
          currentStep={0}
        />

        {userOnboardingStep !== null && userOnboardingStep >= 3 && (
          <div className="absolute top-10 left-10">
            <BackToHomeButton />
          </div>
        )}

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
                  value={selectedOptions[`q${q.id}`] || ''}
                  onValueChange={(value) => handleOptionChange(`q${q.id}`, value)}
                  className="space-y-3"
                  disabled={submitted}
                >
                  {q.options.map((option) => (
                    <div key={option}>
                      <div
                        className="flex items-center p-2 rounded-xl transition-all duration-200"
                        style={{
                          backgroundColor: selectedOptions[`q${q.id}`] === option ? 'rgba(32, 178, 170, 0.08)' : 'transparent',
                          border: `2px solid ${selectedOptions[`q${q.id}`] === option ? '#20B2AA' : 'transparent'}`,
                          cursor: submitted ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => !submitted && handleOptionChange(`q${q.id}`, option)}
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

                      {option === "Others" && selectedOptions[`q${q.id}`] === "Others" && (
                        <div className="mt-3 ml-4">
                          <input
                            type="text"
                            value={otherTexts[`q${q.id}`] || ''}
                            onChange={(e) => handleOtherTextChange(`q${q.id}`, e.target.value)}
                            placeholder="Please specify..."
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20B2AA] focus:border-transparent"
                            disabled={submitted}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>

          <HesitationLink />

          <div className="mt-4 flex justify-end">
            {submitted ? (
              <Button
                onClick={() => window.location.href = '/5a/advise'}
                className="px-8 py-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
                style={{
                  backgroundColor: '#20B2AA',
                  color: '#FFFFFF'
                }}
              >
                Continue to Next Step
              </Button>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
