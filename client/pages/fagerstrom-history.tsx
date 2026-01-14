import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface FagerstromSession {
    id: string;
    score: number;
    created_at: string;
    updated_at: string;
}

export default function FagerstromHistoryPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState<FagerstromSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

                if (!token) {
                    throw new Error('Unauthorized');
                }

                const response = await fetch(`${API_URL}/fagerstrom/sessions/history`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch history');
                }

                const data = await response.json();
                setSessions(data.sessions);
            } catch (e: any) {
                setError(e.message || 'Failed to load history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getScoreInterpretation = (score: number) => {
        if (score <= 2) return { level: 'Very Low', color: '#10B981' };
        if (score <= 4) return { level: 'Low', color: '#3B82F6' };
        if (score <= 6) return { level: 'Medium', color: '#F59E0B' };
        if (score <= 7) return { level: 'High', color: '#EF4444' };
        return { level: 'Very High', color: '#DC2626' };
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20B2AA] mx-auto mb-4"></div>
                            <p style={{ color: '#666666' }}>Loading your test history...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <p style={{ color: '#EF4444' }} className="mb-4">Error: {error}</p>
                            <button
                                onClick={() => router.push('/app')}
                                className="px-6 py-3 rounded-xl"
                                style={{ backgroundColor: '#20B2AA', color: '#FFFFFF' }}
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/app')}
                        className="flex items-center gap-2 text-sm md:text-base transition-colors duration-200 mb-4"
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

                    <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2" style={{ color: '#1C3B5E' }}>
                        Test History
                    </h1>
                    <p className="text-sm md:text-base" style={{ color: '#666666' }}>
                        Track your progress over time with your Fagerström test results
                    </p>
                </div>

                {/* Sessions List */}
                {sessions.length === 0 ? (
                    <div
                        className="rounded-2xl p-8 text-center"
                        style={{
                            backgroundColor: '#F8FBFB',
                            border: '2px dashed #E0E0E0'
                        }}
                    >
                        <p style={{ color: '#666666' }} className="mb-4">
                            No test history found. Take your first test to see results here.
                        </p>
                        <button
                            onClick={() => router.push('/fagerstrom-test')}
                            className="px-6 py-3 rounded-xl"
                            style={{ backgroundColor: '#20B2AA', color: '#FFFFFF' }}
                        >
                            Take Test Now
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.map((session, index) => {
                            const interpretation = getScoreInterpretation(session.score);
                            const isLatest = index === 0;

                            return (
                                <div
                                    key={session.id}
                                    className="rounded-2xl p-6 transition-all duration-200 hover:shadow-lg"
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        border: isLatest ? '2px solid #20B2AA' : '2px solid #E0E0E0',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                                    }}
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="text-sm" style={{ color: '#666666' }}>
                                                    {formatDate(session.created_at)}
                                                </p>
                                                {isLatest && (
                                                    <span
                                                        className="px-3 py-1 rounded-full text-xs font-medium"
                                                        style={{
                                                            backgroundColor: 'rgba(32, 178, 170, 0.1)',
                                                            color: '#20B2AA'
                                                        }}
                                                    >
                                                        Latest
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="text-xs mb-1" style={{ color: '#999999' }}>Score</p>
                                                    <p
                                                        className="text-3xl font-bold"
                                                        style={{ color: interpretation.color }}
                                                    >
                                                        {session.score}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs mb-1" style={{ color: '#999999' }}>Level</p>
                                                    <div
                                                        className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                                                        style={{
                                                            backgroundColor: `${interpretation.color}20`,
                                                            color: interpretation.color
                                                        }}
                                                    >
                                                        {interpretation.level}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress indicator if not the first test */}
                                        {index < sessions.length - 1 && (
                                            <div className="text-right">
                                                <p className="text-xs mb-1" style={{ color: '#999999' }}>Change</p>
                                                {session.score < sessions[index + 1].score ? (
                                                    <div className="flex items-center gap-1" style={{ color: '#EF4444' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="font-medium">
                                                            {sessions[index + 1].score - session.score}
                                                        </span>
                                                    </div>
                                                ) : session.score > sessions[index + 1].score ? (
                                                    <div className="flex items-center gap-1" style={{ color: '#10B981' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="font-medium">
                                                            +{session.score - sessions[index + 1].score}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#999999' }}>No change</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Take New Test Button */}
                {sessions.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push('/fagerstrom-test')}
                            className="px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                            style={{ backgroundColor: '#20B2AA', color: '#FFFFFF', fontWeight: '500' }}
                        >
                            Take Test Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
