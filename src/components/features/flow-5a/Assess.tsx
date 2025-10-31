import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Slider } from '../../ui/slider';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { HesitationLink } from '../flow-shared/HesitationLink';
import { FiveA_AssessProps } from '../../../types/fiveAFlow';

const fagerstromQuestions = [
  {
    id: 'q1',
    question: 'Do you currently smoke cigarettes?',
    options: ['Yes', 'No'],
  },
  {
    id: 'q2',
    question: 'How soon after you wake up do you smoke your first cigarette?',
    options: ['Within 5 minutes', '6-30 minutes', '31-60 minutes', 'After 60 minutes'],
  },
  {
    id: 'q3',
    question: 'Do you find it difficult to refrain from smoking in places where it is forbidden (e.g., church, library, cinema)?',
    options: ['Yes', 'No'],
  },
  {
    id: 'q4',
    question: 'Which cigarette would you hate to give up the most?',
    options: ['The first one in the morning', 'Any other'],
  },
  {
    id: 'q5',
    question: 'How many cigarettes per day do you smoke?',
    options: ['10 or less', '11-20', '21-30', '31 or more'],
  },
  {
    id: 'q6',
    question: 'Do you smoke more frequently during the first hours after waking than during the rest of the day?',
    options: ['Yes', 'No'],
  },
  {
    id: 'q7',
    question: 'Do you smoke when you are so ill that you are in bed most of the day?',
    options: ['Yes', 'No'],
  },
];

export function FiveA_Assess({ onNext }: FiveA_AssessProps) {
  const [readiness, setReadiness] = useState<number[]>([5]);
  const [quitTimeline, setQuitTimeline] = useState('');
  const [fagerstromAnswers, setFagerstromAnswers] = useState<Record<string, string>>({});

  const handleFagerstromAnswer = (questionId: string, value: string) => {
    setFagerstromAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isFagerstromComplete = Object.keys(fagerstromAnswers).length === fagerstromQuestions.length;

  const handleNext = () => {
    onNext({
      readinessScore: readiness[0],
      quitTimeline,
      fagerstromAnswers,
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['ASK', 'ADVISE', 'ASSESS', 'ASSIST', 'ARRANGE']}
          currentStep={2}
        />

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-10 border border-gray-100">
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#1C3B5E] mb-2">
            Step 3: ASSESS
          </h1>
          <p className="text-sm md:text-base text-[#333333] mb-6 md:mb-8">
            Let's determine your readiness and dependency level.
          </p>

          {/* Readiness Slider */}
          <div className="mb-12">
            <Label className="text-[#333333] block mb-4">
              How ready are you to quit tobacco?
            </Label>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex justify-between mb-4 text-sm text-[#333333]">
                <span>1 - Low Readiness</span>
                <span className="text-[#20B2AA]">Current: {readiness[0]}</span>
                <span>10 - High Readiness</span>
              </div>
              <Slider
                value={readiness}
                onValueChange={setReadiness}
                min={1}
                max={10}
                step={1}
                className="[&_[role=slider]]:bg-[#20B2AA] [&_[role=slider]]:border-[#20B2AA]"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <span key={num}>{num}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Quit Timeline */}
          <div className="mb-12">
            <Label className="text-sm md:text-base block mb-4">
              When do you plan to quit?
            </Label>
            <RadioGroup
              value={quitTimeline}
              onValueChange={setQuitTimeline}
              className="space-y-3"
            >
              {[
                { id: '1 month', label: 'Within next month' },
                { id: '2 month', label: 'Within next 2 months' },
                { id: 'notsure', label: 'Not sure yet' },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center bg-gray-50 p-4 rounded-xl">
                  <RadioGroupItem value={id} id={id} />
                  <Label htmlFor={id} className="ml-3 cursor-pointer flex-1">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Fagerström Questionnaire */}
          <div className="mt-12">
            <h2 className="text-xl md:text-2xl font-semibold text-[#1C3B5E] mb-4">
              Fagerström Questionnaire
            </h2>
            <p className="text-sm text-[#333333] mb-8 opacity-80">
              This short questionnaire helps assess your level of nicotine dependence.
            </p>

            <div className="space-y-4">
              {fagerstromQuestions.map((q, index) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm"
                >
                  <Label
                    className="block mb-5"
                    style={{ color: '#1C3B5E', fontSize: '1.05rem' }}
                  >
                    {index + 1}. {q.question}
                  </Label>
                  <RadioGroup
                    value={fagerstromAnswers[q.id] || ''}
                    onValueChange={(value) => handleFagerstromAnswer(q.id, value)}
                    className="space-y-3"
                  >
                    {q.options.map((option) => (
                      <div
                        key={option}
                        className="flex items-center p-4 rounded-xl transition-all duration-200"
                        style={{
                          backgroundColor:
                            fagerstromAnswers[q.id] === option
                              ? 'rgba(32, 178, 170, 0.08)'
                              : 'transparent',
                          border: `2px solid ${
                            fagerstromAnswers[q.id] === option ? '#20B2AA' : 'transparent'
                          }`,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleFagerstromAnswer(q.id, option)}
                      >
                        <RadioGroupItem
                          value={option}
                          id={`${q.id}-${option}`}
                          className="w-5 h-5"
                          style={{ borderColor: '#20B2AA', color: '#20B2AA' }}
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
          </div>

          <HesitationLink />

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleNext}
              disabled={!quitTimeline || !isFagerstromComplete}
              className="px-12 py-6 text-lg rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 disabled:opacity-50 text-white shadow-lg"
            >
              Assess Me
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
