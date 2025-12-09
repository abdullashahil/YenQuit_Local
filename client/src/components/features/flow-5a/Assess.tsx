import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Slider } from '../../ui/slider';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { HesitationLink } from '../flow-shared/HesitationLink';
import { FiveA_AssessProps } from '../../../types/fiveAFlow';
import { getFagerstromQuestions, FagerstromQuestion } from '../../../services/fagerstromService';

interface AssessQuestion {
  id: number;
  step: string;
  question_text: string;
  options: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

async function fetchAssessQuestions(): Promise<AssessQuestion[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_URL}/fivea/questions/assess`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load assess questions');
  const data = await res.json();
  return data.questions;
}

async function fetchAssessAnswers(): Promise<Record<string, string>> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_URL}/api/fivea/answers/assess`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return {};
  const data = await res.json();
  const answers: Record<string, string> = {};
  data.answers.forEach((answer: any) => {
    answers[`assess_${answer.question_id}`] = answer.answer_text;
  });
  return answers;
}

async function fetchFagerstromAnswers(): Promise<Record<string, string>> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_URL}/api/fagerstrom/answers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return {};
  const data = await res.json();
  const answers: Record<string, string> = {};
  data.answers.forEach((answer: any) => {
    answers[`q${answer.question_id}`] = answer.answer_text;
  });
  return answers;
}

export function FiveA_Assess({ onNext }: FiveA_AssessProps) {
  const [readiness, setReadiness] = useState<number[]>([5]);
  const [quitTimeline, setQuitTimeline] = useState('');
  const [fagerstromQuestions, setFagerstromQuestions] = useState<FagerstromQuestion[]>([]);
  const [fagerstromAnswers, setFagerstromAnswers] = useState<Record<string, string>>({});
  const [assessQuestions, setAssessQuestions] = useState<AssessQuestion[]>([]);
  const [assessAnswers, setAssessAnswers] = useState<Record<string, number | string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fagerstromData, assessData, savedAssessAnswers, savedFagerstromAnswers] = await Promise.all([
          getFagerstromQuestions(1, 100, true),
          fetchAssessQuestions(),
          fetchAssessAnswers(),
          fetchFagerstromAnswers(),
        ]);
        
        setFagerstromQuestions(fagerstromData.questions);
        setAssessQuestions(assessData);
        
        const hasSubmitted = Object.keys(savedAssessAnswers).length > 0;
        setSubmitted(hasSubmitted);
        
        const initialAssess: Record<string, number | string> = {};
        assessData.forEach(q => {
          const key = `assess_${q.id}`;
          if (savedAssessAnswers[key]) {
            const savedValue = savedAssessAnswers[key];
            if (q.options === null || q.options.length === 0) {
              initialAssess[key] = parseInt(savedValue) || 5;
            } else {
              initialAssess[key] = savedValue;
            }
          } else {
            if (q.options === null || q.options.length === 0) {
              initialAssess[key] = 5;
            }
          }
        });
        setAssessAnswers(initialAssess);
        
        const mappedFagerstromAnswers: Record<string, string> = {};
        fagerstromData.questions.forEach(question => {
          const savedAnswerKey = Object.keys(savedFagerstromAnswers).find(key => 
            key === `q${question.id}`
          );
          if (savedAnswerKey) {
            mappedFagerstromAnswers[`q${question.id}`] = savedFagerstromAnswers[savedAnswerKey];
          }
        });
        setFagerstromAnswers(mappedFagerstromAnswers);
      } catch (e: any) {
        setError(e.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFagerstromAnswer = (questionId: string, value: string) => {
    if (submitted) return;
    setFagerstromAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleAssessAnswer = (questionId: string, value: number | string) => {
    if (submitted) return;
    setAssessAnswers(prev => ({ ...prev, [`assess_${questionId}`]: value }));
  };

  const isFagerstromComplete = fagerstromQuestions.length > 0 && fagerstromQuestions.every(q => fagerstromAnswers[`q${q.id}`]);
  const isAssessComplete = assessQuestions.every(q => {
    const key = `assess_${q.id}`;
    const val = assessAnswers[key];
    if (q.options === null || q.options.length === 0) {
      return typeof val === 'number' && val >= 1 && val <= 10;
    } else {
      return typeof val === 'string' && val !== '';
    }
  });

  const handleNext = async () => {
    if (submitted) {
      onNext({
        readinessScore: assessQuestions.find(q => q.options === null || q.options.length === 0) ? assessAnswers[`assess_${assessQuestions.find(q => q.options === null || q.options.length === 0)!.id}`] as number : readiness[0],
        quitTimeline,
        fagerstromAnswers,
      });
      return;
    }
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        const fagerstromPayload = Object.entries(fagerstromAnswers).map(([key, value]) => ({
          question_id: parseInt(key.replace('q', '')),
          answer_text: value,
        }));
        await fetch(`${API_URL}/api/fagerstrom/answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ answers: fagerstromPayload }),
        });
        
        const assessPayload = assessQuestions.map(q => ({
          question_id: q.id,
          answer: assessAnswers[`assess_${q.id}`]?.toString() || '',
        }));
        await fetch(`${API_URL}/fivea/answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ answers: assessPayload }),
        });
        // Update onboarding step to 3 (assist)
        await fetch(`${API_URL}/onboarding/progress`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ step: 3 }),
        });
        setSubmitted(true);
      }
    } catch (e) {
      // ignore and still navigate
    }
    onNext({
      readinessScore: assessQuestions.find(q => q.options === null || q.options.length === 0) ? assessAnswers[`assess_${assessQuestions.find(q => q.options === null || q.options.length === 0)!.id}`] as number : readiness[0],
      quitTimeline,
      fagerstromAnswers,
    });
  };

  if (loading) return <div style={{ padding: 32 }}>Loading assessment questions…</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>Error: {error}</div>;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['ASK', 'ADVISE', 'ASSESS', 'ASSIST', 'ARRANGE']}
          currentStep={2}
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
            Step 3: Assess – Your Nicotine Dependence
          </h1>
          <p
            className="text-sm md:text-base mb-6 md:mb-8 lg:mb-10"
            style={{ color: '#333333', opacity: 0.7 }}
          >
            Evaluate your nicotine dependence and readiness to quit
          </p>

          {/* Dynamic Assess Questions (slider or radio) */}
          <div className="space-y-4 md:space-y-5">
            {assessQuestions.map((q, index) => (
              <div
                key={q.id}
                className="rounded-2xl p-6"
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

                {/* Slider if options is null/empty */}
                {(q.options === null || q.options.length === 0) ? (
                  <div>
                    <div
                      className="relative mb-4"
                      style={{
                        padding: '4px 0',
                        backgroundColor: '#F8FBFB',
                        borderRadius: '12px',
                        border: '1px solid #E0E0E0'
                      }}
                    >
                      <Slider
                        value={[assessAnswers[`assess_${q.id}`] as number || 5]}
                        onValueChange={(val) => handleAssessAnswer(q.id.toString(), val[0])}
                        min={1}
                        max={10}
                        step={1}
                        disabled={submitted}
                        className="w-full"
                        style={{
                          '--slider-track-height': '6px',
                          '--slider-track-bg': '#E8F4F3',
                          '--slider-range-bg': '#20B2AA',
                          '--slider-thumb-size': '20px',
                          '--slider-thumb-bg': '#20B2AA',
                          '--slider-thumb-border': '#1C3B5E',
                          '--slider-thumb-box-shadow': '0 2px 4px rgba(0,0,0,0.1)',
                        } as React.CSSProperties}
                      />
                    </div>
                    <div
                      className="flex justify-between text-sm"
                      style={{ color: '#666666' }}
                    >
                      <span>1</span>
                      <span
                        className="font-bold px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: '#20B2AA' }}
                      >
                        {assessAnswers[`assess_${q.id}`] || 5}
                      </span>
                      <span>10</span>
                    </div>
                  </div>
                ) : (
                  // Radio options if options array provided
                  <RadioGroup
                    value={String(assessAnswers[`assess_${q.id}`] || '')}
                    onValueChange={(value) => handleAssessAnswer(q.id.toString(), value)}
                    className="space-y-3"
                  >
                    {q.options.map((option) => (
                      <div
                        key={option}
                        className="flex items-center p-4 rounded-xl transition-all duration-200"
                        style={{
                          backgroundColor: typeof assessAnswers[`assess_${q.id}`] === 'string' && assessAnswers[`assess_${q.id}`] === option ? 'rgba(32, 178, 170, 0.08)' : 'transparent',
                          border: `2px solid ${typeof assessAnswers[`assess_${q.id}`] === 'string' && assessAnswers[`assess_${q.id}`] === option ? '#20B2AA' : 'transparent'}`,
                          cursor: submitted ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => !submitted && handleAssessAnswer(q.id.toString(), option)}
                      >
                        <RadioGroupItem
                          value={option}
                          id={`assess-${q.id}-${option}`}
                          className="w-5 h-5"
                          style={{
                            borderColor: '#20B2AA',
                            color: '#20B2AA'
                          }}
                          disabled={submitted}
                        />
                        <Label
                          htmlFor={`assess-${q.id}-${option}`}
                          className="ml-4 cursor-pointer flex-1"
                          style={{ color: '#333333', cursor: submitted ? 'not-allowed' : 'pointer' }}
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            ))}
          </div>

          {/* Fagerström Test Questions */}
          <div className="space-y-4 md:space-y-5 mt-6">
            <h2 className="text-xl md:text-2xl font-semibold text-[#1C3B5E] mb-4"> Fagerström Questionnaire </h2> <p className="text-sm text-[#333333] mb-8 opacity-80"> This short questionnaire helps assess your level of nicotine dependence. </p>
            {fagerstromQuestions.map((q, index) => (
              <div
                key={q.id}
                className="p-4 md:p-6 rounded-2xl border border-[#E0E0E0] bg-white transition-all duration-200"
                style={{
                  opacity: submitted ? 0.7 : 1,
                  pointerEvents: submitted ? 'none' : 'auto'
                }}
              >
                <Label
                  className="text-base md:text-lg font-medium text-[#333333] mb-4 block"
                  style={{
                    fontSize: '1.05rem',
                    lineHeight: '1.5'
                  }}
                >
                  {index + 1}. {q.question_text}
                </Label>
                <RadioGroup
                  value={fagerstromAnswers[`q${q.id}`] || ''}
                  onValueChange={(value) => handleFagerstromAnswer(`q${q.id}`, value)}
                  className="space-y-3"
                  disabled={submitted}
                >
                  {q.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center p-4 rounded-xl transition-all duration-200"
                      style={{
                        backgroundColor: fagerstromAnswers[`q${q.id}`] === option ? 'rgba(32, 178, 170, 0.08)' : 'transparent',
                        border: `2px solid ${fagerstromAnswers[`q${q.id}`] === option ? '#20B2AA' : 'transparent'}`,
                        cursor: submitted ? 'not-allowed' : 'pointer'
                      }}
                      onClick={() => !submitted && handleFagerstromAnswer(`q${q.id}`, option)}
                    >
                      <RadioGroupItem
                        value={option}
                        id={`fagerstrom-${q.id}-${option}`}
                        className="w-5 h-5"
                        style={{
                          borderColor: '#20B2AA',
                          color: '#20B2AA'
                        }}
                        disabled={submitted}
                      />
                      <Label
                        htmlFor={`fagerstrom-${q.id}-${option}`}
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
              onClick={handleNext}
              disabled={!isFagerstromComplete || !isAssessComplete || submitted}
              className="px-8 py-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isAssessComplete && !submitted ? '#20B2AA' : '#cccccc',
                color: '#FFFFFF'
              }}
            >
              Next: Get Personalized Assistance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
