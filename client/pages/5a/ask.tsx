import { FiveA_Ask } from '../../src/components/features/flow-5a/Ask';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

export default function AskPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestionsAndAnswers = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) {
          setError('Unauthorized');
          return;
        }
        // Fetch questions
        const qRes = await fetch(`${API_URL}/fivea/questions/ask`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!qRes.ok) throw new Error('Failed to fetch questions');
        const qData = await qRes.json();
        setQuestions(qData.questions || []);
        // Fetch existing answers
        const aRes = await fetch(`${API_URL}/fivea/answers/ask`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (aRes.ok) {
          const aData = await aRes.json();
          setSavedAnswers(aData.answers || []);
          setSubmitted(aData.answers && aData.answers.length > 0);
        }
      } catch (e: any) {
        setError(e.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionsAndAnswers();
  }, []);

  const handleNext = async (answers: Record<string, string>) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        const payload: Record<string, string> = {};
        questions.forEach(q => {
          payload[q.id] = answers[`q${q.id}`] || '';
        });
        const res = await fetch(`${API_URL}/fivea/ask/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ answers: payload }),
        });
        if (!res.ok) throw new Error('Failed to submit answers');
        setSubmitted(true);
      }
    } catch (e) {
      // ignore and still navigate
    }
    router.push('/5a/advise');
  };

  if (loading) return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Skeleton for questions */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-xl bg-gray-50 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  if (error) return <div style={{ padding: 32, color: 'red' }}>Error: {error}</div>;

  return <FiveA_Ask onNext={handleNext} questions={questions} savedAnswers={savedAnswers} submitted={submitted} />;
}
