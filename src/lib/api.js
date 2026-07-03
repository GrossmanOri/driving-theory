import { fetchAuthSession } from 'aws-amplify/auth';
import { API_BASE } from '../config';

async function authHeader() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  return token ? { Authorization: token } : {};
}

/** Public: fetch the whole question bank and map it to our Question type. */
export async function fetchQuestions() {
  const res = await fetch(`${API_BASE}/questions`);
  if (!res.ok) throw new Error(`questions ${res.status}`);
  const data = await res.json();
  return data.questions.map((q) => ({
    id: q.questionId,
    topicId: q.category,
    text: q.text,
    imageUrl: q.imageUrl,
    options: q.options,
    explanation: q.explanation || '',
  }));
}

/** Authenticated: load this user's saved progress items. */
export async function fetchProgress() {
  const res = await fetch(`${API_BASE}/progress`, { headers: await authHeader() });
  if (!res.ok) throw new Error(`progress ${res.status}`);
  const data = await res.json();
  return data.items;
}

/** Authenticated: get (or generate) a simple Hebrew explanation for a question. */
export async function fetchExplanation(questionId) {
  const res = await fetch(`${API_BASE}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify({ questionId }),
  });
  if (!res.ok) throw new Error(`explain ${res.status}`);
  const data = await res.json();
  return data.explanation;
}

/** Authenticated: upsert progress items. */
export async function saveProgress(items) {
  if (items.length === 0) return;
  const res = await fetch(`${API_BASE}/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error(`save ${res.status}`);
}
