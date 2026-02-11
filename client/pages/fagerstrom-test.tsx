import React from 'react';
import { useRouter } from 'next/router';
import { FagerstromTest } from '../src/components/features/fagerstrom/FagerstromTest';


export default function FagerstromTestPage() {
    const router = useRouter();

    const handleComplete = async (score: number, sessionId: string, maxScore?: number) => {
        // Navigate to results page with score and maxScore
        const maxScoreParam = maxScore !== undefined ? `&maxScore=${maxScore}` : '';
        router.push(`/fagerstrom-results?score=${score}&sessionId=${sessionId}${maxScoreParam}`);
    };

    const handleCancel = () => {
        router.push('/app');
    };

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="mb-6">
                <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 text-sm md:text-base transition-colors duration-200"
                    style={{ color: '#20B2AA' }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Back to Home
                </button>
            </div>

            <FagerstromTest
                onComplete={handleComplete}
                onCancel={handleCancel}
                showCancelButton={true}
                title="Retake Fagerström Test"
                description="Track your progress by retaking the nicotine dependence assessment."
            />
        </div>
    );
}
