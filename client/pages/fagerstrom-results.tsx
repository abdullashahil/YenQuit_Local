import React from 'react';
import { useRouter } from 'next/router';

interface FagerstromResultsProps {
    score: number;
    sessionId: string;
}

export default function FagerstromResultsPage() {
    const router = useRouter();
    const { score } = router.query;

    const getScoreInterpretation = (score: number) => {
        if (score <= 2) return { level: 'Very Low', color: '#10B981', description: 'You have very low nicotine dependence.' };
        if (score <= 4) return { level: 'Low', color: '#3B82F6', description: 'You have low nicotine dependence.' };
        if (score <= 6) return { level: 'Medium', color: '#F59E0B', description: 'You have medium nicotine dependence.' };
        if (score <= 7) return { level: 'High', color: '#EF4444', description: 'You have high nicotine dependence.' };
        return { level: 'Very High', color: '#DC2626', description: 'You have very high nicotine dependence.' };
    };

    const scoreNum = parseInt(score as string) || 0;
    const interpretation = getScoreInterpretation(scoreNum);

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center" style={{ backgroundColor: '#F8FBFB' }}>
            <div className="max-w-2xl w-full">
                <div
                    className="rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 text-center"
                    style={{
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 10px 40px rgba(28, 59, 94, 0.12)'
                    }}
                >
                    {/* Success Icon */}
                    <div className="mb-6">
                        <div
                            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(32, 178, 170, 0.1)' }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="#20B2AA"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    <h1
                        className="text-2xl md:text-3xl lg:text-4xl mb-4"
                        style={{ color: '#1C3B5E' }}
                    >
                        Test Completed!
                    </h1>

                    <p
                        className="text-base md:text-lg mb-8"
                        style={{ color: '#666666' }}
                    >
                        Thank you for completing the Fagerström Test for Nicotine Dependence.
                    </p>

                    {/* Score Display */}
                    <div
                        className="rounded-2xl p-6 mb-8"
                        style={{
                            backgroundColor: '#F8FBFB',
                            border: '2px solid #E0E0E0'
                        }}
                    >
                        <p className="text-sm mb-2" style={{ color: '#666666' }}>Your Score</p>
                        <div
                            className="text-5xl md:text-6xl font-bold mb-2"
                            style={{ color: interpretation.color }}
                        >
                            {scoreNum}
                        </div>
                        <p className="text-xs text-gray-500 mb-4">out of 10</p>

                        <div
                            className="inline-block px-6 py-2 rounded-full text-sm font-medium"
                            style={{
                                backgroundColor: `${interpretation.color}20`,
                                color: interpretation.color
                            }}
                        >
                            {interpretation.level} Dependence
                        </div>

                        <p
                            className="mt-4 text-sm md:text-base"
                            style={{ color: '#666666' }}
                        >
                            {interpretation.description}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/app')}
                            className="px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                            style={{
                                backgroundColor: '#20B2AA',
                                color: '#FFFFFF',
                                fontWeight: '500'
                            }}
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={() => router.push('/fagerstrom-history')}
                            className="px-8 py-3 rounded-xl transition-all duration-200"
                            style={{
                                backgroundColor: 'transparent',
                                color: '#20B2AA',
                                border: '2px solid #20B2AA',
                                fontWeight: '500'
                            }}
                        >
                            View History
                        </button>
                    </div>

                    {/* Info */}
                    <div
                        className="mt-8 p-4 rounded-xl text-left"
                        style={{
                            backgroundColor: 'rgba(32, 178, 170, 0.05)',
                            border: '1px solid rgba(32, 178, 170, 0.2)'
                        }}
                    >
                        <p className="text-sm" style={{ color: '#666666' }}>
                            <strong style={{ color: '#1C3B5E' }}>Note:</strong> This score helps us understand your nicotine dependence level and provide personalized support. You can retake this test anytime to track your progress.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
