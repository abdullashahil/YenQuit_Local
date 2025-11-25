import { FiveA_Advise } from '../../src/components/features/flow-5a/Advise';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AdvisePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvise = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) {
          setError('Unauthorized');
          return;
        }
        const res = await fetch(`${API_URL}/api/fivea/advise`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load advise content');
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e.message || 'Failed to load advise');
      } finally {
        setLoading(false);
      }
    };
    fetchAdvise();
  }, []);

  const handleComplete = async () => {
    if (!data) return;
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        await fetch(`${API_URL}/api/fivea/advise/complete`, {
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

  if (loading) return <div style={{ padding: 32 }}>Loading advise…</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>Error: {error}</div>;

  return <FiveA_Advise onNext={handleComplete} userData={{}} video={data?.video} quote={data?.quote} ai_message={data?.ai_message} />;
}
