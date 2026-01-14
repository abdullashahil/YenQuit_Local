import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Slider } from '../../ui/slider';
import { OnboardingProgressBar } from '../flow-shared/OnboardingProgressBar';
import { HesitationLink } from '../flow-shared/HesitationLink';
import { BackToHomeButton } from '../../shared/BackToHomeButton';
import { FiveA_AssessProps } from '../../../types/fiveAFlow';
import { getFagerstromQuestions, FagerstromQuestion } from '../../../services/fagerstromService';
import { userService } from '../../../services/userService';
import { generatePDF, getInterpretation, getTherapyGuidelines, TestType } from '../../../utils/fagerstromInterpreter';
import { CheckCircle, AlertCircle, Info, Activity, Shield } from 'lucide-react';

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
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_URL}/fivea/answers/assess`, {
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
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_URL}/fagerstrom/answers`, {
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
  const [userOnboardingStep, setUserOnboardingStep] = useState<number | null>(null);

  // New State for Interpretation
  const [tobaccoType, setTobaccoType] = useState<TestType>('smoked');
  const [userName, setUserName] = useState<string>('User');
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [interpretationData, setInterpretationData] = useState<{ score: number, level: string, plan: string, warnings: string[] } | null>(null);

  // Fetch user profile to get onboarding_step and tobacco type
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getProfile();
        setUserOnboardingStep(response.data.onboarding_step || 0);
        setUserName(response.data.full_name || 'User');

        // Determine tobacco type
        // Assuming the profile data might store this, or fallback to default
        // The API response structure for 'tobacco_type' needs verification, checking common keys
        const type = response.data.tobacco_type || response.data.tobaccoType || 'I use smoked tobacco';
        if (type.toLowerCase().includes('smokeless')) {
          setTobaccoType('smokeless');
        } else {
          setTobaccoType('smoked');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserOnboardingStep(0);
      }
    };

    fetchUserProfile();
  }, []);

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

        const hasSubmitted = Object.keys(savedAssessAnswers).length > 0 || Object.keys(savedFagerstromAnswers).length > 0;
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

        setFagerstromAnswers(savedFagerstromAnswers);
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

  const handleAssessAnswer = (questionId: number, value: number | string) => {
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
      // If already submitted, just move on (or re-show interpretation if we had logic for it)
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

        // 1. Submit Fagerstrom Answers
        const fagerRes = await fetch(`${API_URL}/fagerstrom/answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ answers: fagerstromPayload }),
        });

        let calculatedScore = 0;
        if (fagerRes.ok) {
          const data = await fagerRes.json();
          calculatedScore = data.score || 0;
        }

        // 2. Submit Assess Answers
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

        // 3. Update Progress
        await fetch(`${API_URL}/onboarding/progress`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ step: 3 }),
        });

        setSubmitted(true);

        // 4. Prepare Interpretation
        const level = getInterpretation(calculatedScore, tobaccoType);
        const therapy = getTherapyGuidelines(calculatedScore, tobaccoType);

        setInterpretationData({
          score: calculatedScore,
          level: level,
          plan: therapy.plan,
          warnings: therapy.warnings
        });
        setShowInterpretation(true);
        // Do NOT call onNext() yet. Wait for user to review and download.
        return;
      }
    } catch (e) {
      // If error, just proceed? Or show error?
      // Proceeding for robustness
    }

    // Fallback if token missing or error
    onNext({
      readinessScore: assessQuestions.find(q => q.options === null || q.options.length === 0) ? assessAnswers[`assess_${assessQuestions.find(q => q.options === null || q.options.length === 0)!.id}`] as number : readiness[0],
      quitTimeline,
      fagerstromAnswers,
    });
  };

  const handleInterpretationContinue = async () => {
    // Auto-save PDF
    if (interpretationData) {
      // Construct detailed object for PDF or generic
      try {
        await generatePDF(userName, interpretationData.score, tobaccoType, { warnings: interpretationData.warnings });
      } catch (e) {
        console.error("PDF Gen Error", e);
      }
    }

    // Resume Navigation
    onNext({
      readinessScore: assessQuestions.find(q => q.options === null || q.options.length === 0) ? assessAnswers[`assess_${assessQuestions.find(q => q.options === null || q.options.length === 0)!.id}`] as number : readiness[0],
      quitTimeline,
      fagerstromAnswers,
    });
  };

  if (loading) return <div style={{ padding: 32 }}>Loading assessment questions…</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>Error: {error}</div>;

  // Render Interpretation Modal
  if (showInterpretation && interpretationData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            {interpretationData.score <= 4 ?
              <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-4"><CheckCircle className="w-10 h-10 text-green-600" /></div> :
              interpretationData.score <= 7 ?
                <div className="mx-auto bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mb-4"><Activity className="w-10 h-10 text-yellow-600" /></div> :
                <div className="mx-auto bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mb-4"><AlertCircle className="w-10 h-10 text-red-600" /></div>
            }
            <h2 className="text-3xl font-bold text-slate-800">Your Dependence Profile</h2>
            <p className="text-slate-500">Based on Fagerström Test Analysis</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
              <span className="text-slate-600 font-medium">Score</span>
              <span className="text-3xl font-black text-slate-800">{interpretationData.score}/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Dependence Level</span>
              <span className={`text-xl font-bold ${interpretationData.score <= 4 ? 'text-green-600' : interpretationData.score <= 7 ? 'text-yellow-600' : 'text-red-600'}`}>
                {interpretationData.level}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600" /> Clinical Recommendation
            </h3>
            <div className="bg-teal-50 p-4 rounded-xl text-teal-900 border border-teal-100 text-sm leading-relaxed">
              {interpretationData.plan}
            </div>
          </div>

          {interpretationData.warnings.length > 0 && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
              <h4 className="font-bold text-red-700 text-sm mb-1 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Safety Alerts</h4>
              {interpretationData.warnings.map(w => <p key={w} className="text-xs text-red-600 mt-1">• {w}</p>)}
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-slate-400 mb-4">Clicking continue will automatically save your detailed report.</p>
            <Button
              onClick={handleInterpretationContinue}
              className="w-full py-6 text-lg rounded-xl shadow-xl shadow-teal-200 transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: '#20B2AA' }}
            >
              Save Report & Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto">
        <OnboardingProgressBar
          steps={['ASK', 'ADVISE', 'ASSESS', 'ASSIST', 'ARRANGE']}
          currentStep={2}
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
                  <div
                    className="relative mb-6 p-6 rounded-2xl shadow-md"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Rate your confidence:</p>
                      <div className="relative flex justify-between mb-2">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <span
                              className="block h-3 w-0.5 mb-1"
                              style={{
                                backgroundColor: i < (assessAnswers[`assess_${q.id}`] as number || 5) ? '#20B2AA' : '#D1D5DB'
                              }}
                            ></span>
                            <span
                              className="text-xs font-medium"
                              style={{
                                color: i < (assessAnswers[`assess_${q.id}`] as number || 5) ? '#20B2AA' : '#6B7280'
                              }}
                            >
                              {i + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Slider
                      value={[assessAnswers[`assess_${q.id}`] as number || 5]}
                      onValueChange={(val) => handleAssessAnswer(q.id, val[0])}
                      min={1}
                      max={10}
                      step={1}
                      disabled={submitted}
                      className="w-full [&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-range]]:bg-teal-500 [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:border-3 [&_[data-slot=slider-thumb]]:border-teal-500"
                      style={{
                        '--slider-track-height': '8px',
                        '--slider-range-bg': '#20B2AA',
                        '--slider-thumb-size': '24px',
                        '--slider-thumb-bg': '#FFFFFF',
                        '--slider-thumb-border': '3px solid #20B2AA',
                        '--slider-thumb-box-shadow': '0 2px 8px rgba(32, 178, 170, 0.3)',
                      } as React.CSSProperties}
                    />
                    <div className="flex justify-between mt-4 text-xs text-gray-600">
                      <span>Not confident</span>
                      <span>Moderately</span>
                      <span>Very confident</span>
                    </div>
                  </div>
                ) : (
                  // Radio options if options array provided
                  <RadioGroup
                    value={String(assessAnswers[`assess_${q.id}`] || '')}
                    onValueChange={(value) => handleAssessAnswer(q.id, value)}
                    className="space-y-1"
                  >
                    {q.options?.map((option, optIndex) => {
                      // Safety check: handle both string and object options
                      const optionText = (typeof option === 'object' && option !== null)
                        ? ((option as any).text || String(option))
                        : String(option ?? '');
                      const optionKey = `assess-${q.id}-${optIndex}`;

                      return (
                        <div
                          key={optionKey}
                          className="flex items-center p-4 rounded-xl transition-all duration-200"
                          style={{
                            backgroundColor: typeof assessAnswers[`assess_${q.id}`] === 'string' && assessAnswers[`assess_${q.id}`] === optionText ? 'rgba(32, 178, 170, 0.08)' : 'transparent',
                            border: `2px solid ${typeof assessAnswers[`assess_${q.id}`] === 'string' && assessAnswers[`assess_${q.id}`] === optionText ? '#20B2AA' : 'transparent'}`,
                            cursor: submitted ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => !submitted && handleAssessAnswer(q.id, optionText)}
                        >
                          <RadioGroupItem
                            value={optionText}
                            id={optionKey}
                            className="w-5 h-5"
                            style={{
                              borderColor: '#20B2AA',
                              color: '#20B2AA'
                            }}
                            disabled={submitted}
                          />
                          <Label
                            htmlFor={optionKey}
                            className="ml-4 cursor-pointer flex-1"
                            style={{ color: '#333333', cursor: submitted ? 'not-allowed' : 'pointer' }}
                          >
                            {optionText}
                          </Label>
                        </div>
                      );
                    })}
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
                  className="space-y-1"
                  disabled={submitted}
                >
                  {q.options?.map((option, optIndex) => {
                    // Safety check: handle both string and object options
                    const optionText = (typeof option === 'object' && option !== null)
                      ? ((option as any).text || String(option))
                      : String(option ?? '');
                    const optionKey = `fagerstrom-${q.id}-${optIndex}`;

                    return (
                      <div
                        key={optionKey}
                        className="flex items-center p-4 rounded-xl transition-all duration-200"
                        style={{
                          backgroundColor: fagerstromAnswers[`q${q.id}`] === optionText ? 'rgba(32, 178, 170, 0.08)' : 'transparent',
                          border: `2px solid ${fagerstromAnswers[`q${q.id}`] === optionText ? '#20B2AA' : 'transparent'}`,
                          cursor: submitted ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => !submitted && handleFagerstromAnswer(`q${q.id}`, optionText)}
                      >
                        <RadioGroupItem
                          value={optionText}
                          id={optionKey}
                          className="w-5 h-5"
                          style={{
                            borderColor: '#20B2AA',
                            color: '#20B2AA'
                          }}
                          disabled={submitted}
                        />
                        <Label
                          htmlFor={optionKey}
                          className="ml-4 cursor-pointer flex-1"
                          style={{ color: '#333333', cursor: submitted ? 'not-allowed' : 'pointer' }}
                        >
                          {optionText}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            ))}
          </div>

          <HesitationLink />

          <div className="mt-4 flex justify-end">
            {submitted ? (
              <Button
                onClick={() => window.location.href = '/5a/assist'}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
