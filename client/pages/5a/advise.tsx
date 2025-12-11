import { FiveA_Advise } from '../../src/components/features/flow-5a/Advise';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AdvisePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvise = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) {
          setError('Unauthorized');
          setAiLoading(false);
          return;
        }
        const res = await fetch(`${API_URL}/fivea/advise`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load advise content');
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e.message || 'Failed to load advise');
      } finally {
        setAiLoading(false);
      }
    };
    fetchAdvise();
  }, []);

  const handleComplete = async () => {
    if (!data) return;
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        await fetch(`${API_URL}/fivea/advise/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            video: data.video,
            quote: data.quote,
            ai_message: data.ai_message,
          }),
        });
      }
    } catch (e) {
    }
    router.push('/5a/assess');
  };

  if (error) return <div style={{ padding: 32, color: 'red' }}>Error: {error}</div>;

  return <FiveA_Advise onNext={handleComplete} userData={{}} video={data?.video} quote={data?.quote} ai_message={data?.ai_message} loading={aiLoading} />;
}
