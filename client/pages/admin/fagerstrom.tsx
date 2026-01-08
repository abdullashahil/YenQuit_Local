import React, { useState, useEffect } from 'react';
import { getFagerstromQuestions, createFagerstromQuestion, updateFagerstromQuestion, softDeleteFagerstromQuestion, FagerstromQuestion } from '../../src/services/fagerstromService';

export default function FagerstromAdminPage() {
  const [questions, setQuestions] = useState<FagerstromQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<FagerstromQuestion | null>(null);
  const [form, setForm] = useState({ question_text: '', options: [''] });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  async function fetchQuestions() {
    try {
      const data = await getFagerstromQuestions(page, 50, false); // include inactive
      setQuestions(data.questions);
      setTotalPages(data.pagination.pages);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question_text.trim() || form.options.some(o => !o.trim())) {
      setError('Question text and all options are required');
      return;
    }
    try {
      if (editing) {
        await updateFagerstromQuestion(editing.id, form);
      } else {
        await createFagerstromQuestion(form);
      }
      setForm({ question_text: '', options: [''] });
      setEditing(null);
      fetchQuestions();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Soft-delete this question?')) return;
    try {
      await softDeleteFagerstromQuestion(id);
      fetchQuestions();
    } catch (e: any) {
      setError(e.message);
    }
  }

  function startEdit(q: FagerstromQuestion) {
    setEditing(q);
    const normalizedOptions = q.options.map((opt: any) =>
      typeof opt === 'string' ? opt : opt.text
    );
    setForm({ question_text: q.question_text, options: normalizedOptions });
  }

  function addOption() {
    setForm(prev => ({ ...prev, options: [...prev.options, ''] }));
  }

  function updateOption(idx: number, value: string) {
    setForm(prev => ({ ...prev, options: prev.options.map((o, i) => (i === idx ? value : o)) }));
  }

  function removeOption(idx: number) {
    setForm(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));
  }

  if (loading) return <div style={{ padding: 32 }}>Loading…</div>;

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>Fagerström Questions Admin</h1>

      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: 24, borderRadius: 8, marginBottom: 32 }}>
        <h2>{editing ? 'Edit Question' : 'Create Question'}</h2>
        <div style={{ marginBottom: 16 }}>
          <label>Question Text</label>
          <textarea
            value={form.question_text}
            onChange={e => setForm(prev => ({ ...prev, question_text: e.target.value }))}
            rows={3}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Options</label>
          {form.options.map((opt, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                value={opt}
                onChange={e => updateOption(idx, e.target.value)}
                placeholder="Option text"
                style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                required
              />
              {form.options.length > 1 && (
                <button type="button" onClick={() => removeOption(idx)} style={{ padding: '8 12', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4 }}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption} style={{ padding: '8 12', background: '#20B2AA', color: 'white', border: 'none', borderRadius: 4 }}>Add Option</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={{ padding: '10 20', background: '#20B2AA', color: 'white', border: 'none', borderRadius: 4 }}>{editing ? 'Update' : 'Create'}</button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({ question_text: '', options: [''] }); }} style={{ padding: '10 20', background: '#ccc', border: 'none', borderRadius: 4 }}>Cancel</button>
          )}
        </div>
      </form>

      {/* List */}
      <div>
        <h2>Questions ({questions.length})</h2>
        {questions.map(q => (
          <div key={q.id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 12, background: q.is_active ? '#fff' : '#f5f5f5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold' }}>{q.question_text}</p>
                <ul style={{ margin: '8 0', paddingLeft: 20 }}>
                  {q.options.map((opt, i) => {
                    const text = typeof opt === 'string' ? opt : opt.text;
                    const score = typeof opt === 'object' && opt.score !== undefined ? ` (${opt.score})` : '';
                    return <li key={i}>{text}{score}</li>
                  })}
                </ul>
                <small style={{ color: q.is_active ? 'green' : 'red' }}>{q.is_active ? 'Active' : 'Inactive'}</small>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => startEdit(q)} style={{ padding: '6 12', background: '#3498db', color: 'white', border: 'none', borderRadius: 4 }}>Edit</button>
                <button onClick={() => handleDelete(q.id)} style={{ padding: '6 12', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4 }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {totalPages > 1 && (
          <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '8 12', background: '#20B2AA', color: 'white', border: 'none', borderRadius: 4 }}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '8 12', background: '#20B2AA', color: 'white', border: 'none', borderRadius: 4 }}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
