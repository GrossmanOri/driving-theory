// theory-explain — generates a simple Hebrew explanation for a question using
// Google Gemini (free tier, with vision when a sign image is available), and
// caches it on the question's `explanation` field in DynamoDB so each is only
// ever generated once.
//
// No npm dependencies (uses the AWS SDK preinstalled in the Lambda runtime +
// global fetch), so this file can be pasted directly into the Lambda console.
//
// Env vars:
//   GOOGLE_API_KEY   - free key from https://aistudio.google.com/app/apikey
//   QUESTIONS_TABLE  - TheoryQuestions
//   GEMINI_MODEL     - optional, defaults to gemini-2.0-flash

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const QUESTIONS = process.env.QUESTIONS_TABLE || 'TheoryQuestions';
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const API_KEY = process.env.GOOGLE_API_KEY;

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify(body),
});

const SYSTEM = `אתה מורה לתיאוריה בישראל, סבלני וחם. תפקידך להסביר שאלות למישהו שמתקשה בלמידה (למשל ADHD או דיסלקציה).
כללים:
- הסבר בעברית פשוטה מאוד, בגובה העיניים, 2-3 משפטים קצרים בלבד.
- הסבר *למה* התשובה הנכונה נכונה — לא רק לחזור עליה.
- אם יש תמונת תמרור, תאר בקצרה מה רואים בה ומה המשמעות.
- טון מעודד ולא שיפוטי. בלי ז'רגון משפטי.
- אל תשתמש בלשון מגדרית (לא "אתה" ולא "את") — נסח בלשון ניטרלית או רבים.
- החזר רק את ההסבר עצמו, בלי הקדמות.`;

// Fetch the sign image and return { mimeType, data(base64) } for Gemini vision.
async function fetchImagePart(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      },
    });
    if (!res.ok) return null;
    const mimeType = res.headers.get('content-type') || 'image/jpeg';
    const buf = Buffer.from(await res.arrayBuffer());
    return { inline_data: { mime_type: mimeType, data: buf.toString('base64') } };
  } catch {
    return null;
  }
}

async function generate(q) {
  const optionsText = q.options
    .map((o) => `- ${o.text}${o.correct ? '  ✅ (הנכונה)' : ''}`)
    .join('\n');
  const promptText = `שאלה: ${q.text}\n\nתשובות:\n${optionsText}\n\nכתוב הסבר קצר ופשוט למה התשובה המסומנת היא הנכונה.`;

  const parts = [{ text: promptText }];
  if (q.imageUrl) {
    const img = await fetchImagePart(q.imageUrl);
    if (img) parts.unshift(img);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 300 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`gemini ${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
}

export const handler = async (event) => {
  try {
    if (!API_KEY) return json(500, { error: 'GOOGLE_API_KEY not set' });

    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
    if (!userId) return json(401, { error: 'unauthorized' });

    const { questionId } = JSON.parse(event.body || '{}');
    if (!questionId) return json(400, { error: 'questionId required' });

    const { Item: q } = await ddb.send(new GetCommand({ TableName: QUESTIONS, Key: { questionId } }));
    if (!q) return json(404, { error: 'question not found' });

    // Return the cached explanation if we already generated one.
    if (q.explanation && q.explanation.length > 0) {
      return json(200, { explanation: q.explanation, cached: true });
    }

    const explanation = await generate(q);
    if (!explanation) return json(502, { error: 'no explanation generated' });

    await ddb.send(
      new UpdateCommand({
        TableName: QUESTIONS,
        Key: { questionId },
        UpdateExpression: 'SET explanation = :e',
        ExpressionAttributeValues: { ':e': explanation },
      }),
    );

    return json(200, { explanation, cached: false });
  } catch (err) {
    console.error(err);
    return json(500, { error: err.message });
  }
};
