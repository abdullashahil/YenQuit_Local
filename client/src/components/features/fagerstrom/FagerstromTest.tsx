import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { getFagerstromQuestions, FagerstromQuestion } from '../../../services/fagerstromService';

interface FagerstromTestProps {
    onComplete: (score: number, sessionId: string) => void;
    onCancel?: () => void;
    showCancelButton?: boolean;
    title?: string;
    description?: string;
}

export function FagerstromTest({
    onComplete,
    onCancel,
    showCancelButton = false,
    title = "Fagerström Test for Nicotine Dependence",
    description = "This questionnaire helps assess your level of nicotine dependence."
}: FagerstromTestProps) {
    const [fagerstromQuestions, setFagerstromQuestions] = useState<FagerstromQuestion[]>([]);
    const [fagerstromAnswers, setFagerstromAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fagerstromData = await getFagerstromQuestions(1, 100, true);
                setFagerstromQuestions(fagerstromData.questions);
            } catch (e: any) {
                setError(e.message || 'Failed to load questions');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleFagerstromAnswer = (questionId: string, value: string) => {
        setFagerstromAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const isFagerstromComplete = fagerstromQuestions.length > 0 && fagerstromQuestions.every(q => fagerstromAnswers[`q${q.id}`]);

    const handleSubmit = async () => {
        if (!isFagerstromComplete) return;

        setSubmitting(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

            if (!token) {
                throw new Error('Unauthorized');
            }

            const fagerstromPayload = Object.entries(fagerstromAnswers).map(([key, value]) => ({
                question_id: parseInt(key.replace('q', '')),
                answer_text: value,
            }));

            const response = await fetch(`${API_URL}/fagerstrom/answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ answers: fagerstromPayload }),
            });

            if (!response.ok) {
                throw new Error('Failed to save answers');
            }

            const result = await response.json();
            onComplete(result.score, result.sessionId);
        } catch (e: any) {
            setError(e.message || 'Failed to submit answers');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20B2AA] mx-auto mb-4"></div>
                    <p style={{ color: '#666666' }}>Loading test questions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p style={{ color: '#EF4444' }} className="mb-4">Error: {error}</p>
                    {showCancelButton && onCancel && (
                        <Button onClick={onCancel} style={{ backgroundColor: '#666666', color: '#FFFFFF' }}>
                            Go Back
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
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
                    {title}
                </h1>
                <p
                    className="text-sm md:text-base mb-6 md:mb-8 lg:mb-10"
                    style={{ color: '#333333', opacity: 0.7 }}
                >
                    {description}
                </p>

                {/* Fagerström Test Questions */}
                <div className="space-y-4 md:space-y-5">
                    {fagerstromQuestions.map((q, index) => (
                        <div
                            key={q.id}
                            className="p-4 md:p-6 rounded-2xl border border-[#E0E0E0] bg-white transition-all duration-200"
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
                            >
                                {q.options.map((option) => {
                                    const optionText = typeof option === 'string' ? option : option.text;
                                    return (
                                        <div
                                            key={optionText}
                                            className="flex items-center p-4 rounded-xl transition-all duration-200 cursor-pointer"
                                            style={{
                                                backgroundColor: fagerstromAnswers[`q${q.id}`] === optionText ? 'rgba(32, 178, 170, 0.08)' : 'transparent',
                                                border: `2px solid ${fagerstromAnswers[`q${q.id}`] === optionText ? '#20B2AA' : 'transparent'}`,
                                            }}
                                            onClick={() => handleFagerstromAnswer(`q${q.id}`, optionText)}
                                        >
                                            <RadioGroupItem
                                                value={optionText}
                                                id={`fagerstrom-${q.id}-${optionText}`}
                                                className="w-5 h-5"
                                                style={{
                                                    borderColor: '#20B2AA',
                                                    color: '#20B2AA'
                                                }}
                                            />
                                            <Label
                                                htmlFor={`fagerstrom-${q.id}-${optionText}`}
                                                className="ml-4 cursor-pointer flex-1"
                                                style={{ color: '#333333' }}
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

                <div className="mt-8 flex justify-between items-center gap-4">
                    {showCancelButton && onCancel && (
                        <Button
                            onClick={onCancel}
                            className="px-6 py-3 rounded-xl transition-all duration-200"
                            style={{
                                backgroundColor: 'transparent',
                                color: '#666666',
                                border: '2px solid #E0E0E0'
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFagerstromComplete || submitting}
                        className="px-8 py-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                        style={{
                            backgroundColor: isFagerstromComplete && !submitting ? '#20B2AA' : '#cccccc',
                            color: '#FFFFFF'
                        }}
                    >
                        {submitting ? 'Submitting...' : 'Submit Test'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
