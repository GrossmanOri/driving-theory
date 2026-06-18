import { fetchAuthSession } from 'aws-amplify/auth';
import { API_BASE } from '../config';
import type { Question } from '../data/types';

// Raw shape returned by the Lambda (DynamoDB items).
interface ApiQuestion {
  questionId: string;
  number: number;
  category: string;
  text: string;
  imageUrl?: string;
  options: { id: string; text: string; correct: boolean }[];
  explanation?: string;
}

export interface ProgressItem {
  sk: string; // "PROFILE" | "Q#<questionId>" | "LESSON#<key>"
  [k: string]: unknown;
}

async function authHeader(): Promise<Record<string, string>> {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  return token ? { Authorization: token } : {};
}

/** Public: fetch the whole question bank and map it to our Question type. */
export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch(`${API_BASE}/questions`);
  if (!res.ok) throw new Error(`questions ${res.status}`);
  const data: { questions: ApiQuestion[] } = await res.json();
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
export async function fetchProgress(): Promise<ProgressItem[]> {
  const res = await fetch(`${API_BASE}/progress`, { headers: await authHeader() });
  if (!res.ok) throw new Error(`progress ${res.status}`);
  const data: { items: ProgressItem[] } = await res.json();
  return data.items;
}

/** Authenticated: upsert progress items. */
export async function saveProgress(items: ProgressItem[]): Promise<void> {
  if (items.length === 0) return;
  const res = await fetch(`${API_BASE}/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error(`save ${res.status}`);
}
