import React, { useState, useEffect } from 'react';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { Textarea } from '../../src/components/ui/textarea';
import { Label } from '../../src/components/ui/label';

interface AssessQuestion {
  id: number;
  step: string;
  question_text: string;
  options: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) throw new Error('Unauthorized');
  return { Authorization: `Bearer ${token}` };
}

async function fetchAssessQuestions(): Promise<AssessQuestion[]> {
  const res = await fetch(`${API_URL}/api/fivea/admin/questions`, {
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
  return data.questions.filter((q: AssessQuestion) => q.step === 'assess');
}

async function createAssessQuestion(payload: { step: string; question_text: string; options: string[] | null }) {
  const res = await fetch(`${API_URL}/api/fivea/admin/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders()) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

async function updateAssessQuestion(id: number, payload: Partial<{ question_text: string; options: string[] | null; is_active: boolean }>) {
  const res = await fetch(`${API_URL}/api/fivea/admin/questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders()) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

async function softDeleteAssessQuestion(id: number) {
  const res = await fetch(`${API_URL}/api/fivea/admin/questions/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}

export default function AssessQuestionsAdminPage() {
  const [questions, setQuestions] = useState<AssessQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AssessQuestion | null>(null);
  const [form, setForm] = useState({ question_text: '', options: '' });

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      const data = await fetchAssessQuestions();
      setQuestions(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question_text.trim()) {
      setError('Question text is required');
      return;
    }
    const optionsArray = form.options.trim() ? form.options.split('\n').map(o => o.trim()).filter(Boolean) : null;
    try {
      if (editing) {
        await updateAssessQuestion(editing.id, { question_text: form.question_text, options: optionsArray });
      } else {
        await createAssessQuestion({ step: 'assess', question_text: form.question_text, options: optionsArray });
      }
      setForm({ question_text: '', options: '' });
      setEditing(null);
      fetchQuestions();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Soft-delete this question?')) return;
    try {
      await softDeleteAssessQuestion(id);
      fetchQuestions();
    } catch (e: any) {
      setError(e.message);
    }
  }

  function startEdit(q: AssessQuestion) {
    setEditing(q);
    setForm({ question_text: q.question_text, options: q.options ? q.options.join('\n') : '' });
  }

  if (loading) return <div style={{ padding: 32 }}>Loading…</div>;

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>Assess Questions Admin (Step 3)</h1>

      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: 24, borderRadius: 8, marginBottom: 32 }}>
        <h2>{editing ? 'Edit Question' : 'Create Question'}</h2>
        <div style={{ marginBottom: 16 }}>
          <Label>Question Text</Label>
          <Textarea
            value={form.question_text}
            onChange={e => setForm(prev => ({ ...prev, question_text: e.target.value }))}
            rows={3}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Label>Options (one per line, leave empty for slider)</Label>
          <Textarea
            value={form.options}
            onChange={e => setForm(prev => ({ ...prev, options: e.target.value }))}
            rows={4}
            placeholder="Option 1\nOption 2\nOption 3"
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <small style={{ color: '#666' }}>
            If left empty, this question will render as a slider (1–10). Otherwise, radio buttons.
          </small>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          {editing && (
            <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ question_text: '', options: '' }); }}>Cancel</Button>
          )}
        </div>
      </form>

      {/* List */}
      <div>
        <h2>Assess Questions ({questions.length})</h2>
        {questions.map(q => (
          <div key={q.id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 12, background: q.is_active ? '#fff' : '#f5f5f5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold' }}>{q.question_text}</p>
                {q.options && q.options.length > 0 ? (
                  <ul style={{ margin: '8 0', paddingLeft: 20 }}>
                    {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                  </ul>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>Renders as slider (1–10)</p>
                )}
                <small style={{ color: q.is_active ? 'green' : 'red' }}>{q.is_active ? 'Active' : 'Inactive'}</small>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={() => startEdit(q)} variant="outline">Edit</Button>
                <Button onClick={() => handleDelete(q.id)} variant="destructive">Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
