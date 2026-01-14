import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { generatePDF, getInterpretation, getTherapyGuidelines, TestType } from '../src/utils/fagerstromInterpreter';
import { userService } from '../src/services/userService';
import { Download, AlertTriangle } from 'lucide-react';

interface FagerstromResultsProps {
    score: number;
    sessionId: string;
}

export default function FagerstromResultsPage() {
    const router = useRouter();
    const { score } = router.query;
    const [userName, setUserName] = useState('User');
    const [tobaccoType, setTobaccoType] = useState<TestType>('smoked');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userService.getProfile();
                setUserName(response.data.full_name || 'User');
                const type = response.data.tobacco_type || response.data.tobaccoType || 'I use smoked tobacco';
                if (type.toLowerCase().includes('smokeless')) {
                    setTobaccoType('smokeless');
                } else {
                    setTobaccoType('smoked');
                }
            } catch (error) {
                console.error('Failed to load user profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const scoreNum = parseInt(score as string) || 0;
    const interpretation = getInterpretation(scoreNum, tobaccoType);
    const therapy = getTherapyGuidelines(scoreNum, tobaccoType);

    // Determine color based on score (matching common traffic light logic)
    const getColor = (s: number) => {
        if (s <= 2) return '#10B981'; // Green
        if (s <= 4) return '#3B82F6'; // Blue
        if (s <= 6) return '#F59E0B'; // Orange
        return '#EF4444'; // Red
    };

    const color = getColor(scoreNum);

    const handleDownload = async () => {
        try {
            await generatePDF(userName, scoreNum, tobaccoType, { warnings: therapy.warnings });
        } catch (e) {
            console.error(e);
        }
    };

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
                            style={{ backgroundColor: `${color}20` }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke={color}
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <h1
                        className="text-2xl md:text-3xl lg:text-4xl mb-4"
                        style={{ color: '#1C3B5E' }}
                    >
                        Assessment Complete
                    </h1>

                    <p
                        className="text-base md:text-lg mb-8"
                        style={{ color: '#666666' }}
                    >
                        Here is your updated dependence profile.
                    </p>

                    {/* Score Display */}
                    <div
                        className="rounded-2xl p-6 mb-8"
                        style={{
                            backgroundColor: '#F8FBFB',
                            border: '2px solid #E0E0E0'
                        }}
                    >
                        <p className="text-sm mb-2" style={{ color: '#666666' }}>Fagerström Score</p>
                        <div
                            className="text-5xl md:text-6xl font-bold mb-2"
                            style={{ color: color }}
                        >
                            {scoreNum}
                        </div>
                        <p className="text-xs text-gray-500 mb-4">out of 10</p>

                        <div
                            className="inline-block px-6 py-2 rounded-full text-sm font-medium mb-4"
                            style={{
                                backgroundColor: `${color}20`,
                                color: color
                            }}
                        >
                            {interpretation}
                        </div>

                        <div className="text-left mt-6 bg-white p-4 rounded-xl border border-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-2">Therapy Recommendation:</h3>
                            <p className="text-sm text-gray-600">{therapy.plan}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <button
                            onClick={() => router.push('/app')}
                            className="px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            Back to Home
                        </button>

                        <button
                            onClick={() => router.push('/fagerstrom-history')}
                            className="px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg bg-white text-teal-600 border-2 border-teal-500 hover:bg-teal-50"
                        >
                            View History
                        </button>

                        <button
                            onClick={handleDownload}
                            className="px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            style={{
                                backgroundColor: '#20B2AA',
                                color: '#FFFFFF',
                                fontWeight: '500'
                            }}
                        >
                            <Download size={18} />
                            Download Report
                        </button>
                    </div>

                    <div className="flex items-start gap-2 justify-center text-xs text-amber-600 max-w-md mx-auto bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <p>Note: The report won&apos;t be saved automatically. Please download and save it for your medical records.</p>
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
                            <strong style={{ color: '#1C3B5E' }}>Clinical Note:</strong> This assessment is a screening tool. Please consult with your healthcare provider before starting any nicotine replacement therapy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
