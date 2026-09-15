const API_BASE = import.meta.env.VITE_API_URL || '';

export async function fetchQuiz(topic) {
  const res = await fetch(`${API_BASE}/api/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to load quiz');
  }
  return (await res.json()).questions;
}
