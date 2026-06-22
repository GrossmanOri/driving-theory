// theory-explain — generates a simple Hebrew explanation for a question using
// Claude (with vision when a sign image is available), and caches it in DynamoDB
// so each question is only ever generated once.

import Anthropic from '@anthropic-ai/sdk';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
const QUESTIONS = process.env.QUESTIONS_TABLE || 'TheoryQuestions';

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify(body),
});

const SYSTEM = `אתה מורה לתיאוריה בישראל, סבלני וחם. תפקידך להסביר שאלות למישהו שמתקשה בלמידה (למשל ADHD או דיסלקציה).
כללים:
- הסבר בעברית פשוטה מאוד, בגובה העיניים, 2-3 משפטים קצרים בלבד.
- הסבר למה התשובה הנכונה נכונה — לא רק לחזור עליה.
- אם יש תמונת תמרור, תאר בקצרה מה רואים בה ומה המשמעות.
- טון מעודד ולא שיפוטי. בלי ז'רגון משפטי.
- אל תשתמש בלשון מגדרית (לא "אתה" ולא "את") — נסח בלשון ניטרלית/רבים.`;

async function generate(q) {
  // Build the prompt: question + options + the correct answer.
  const optionsText = q.options.map((o) => `- ${o.text}${o.correct ? '  ✅ (הנכונה)' : ''}`).join('\n');
  const promptText = `שאלה: ${q.text}\n\nתשובות:\n${optionsText}\n\nכתוב הסבר קצר ופשוט למה התשובה המסומנת היא הנכונה.`;

  const content = [];
  // Vision: include the sign image when present (Anthropic fetches the URL).
  if (q.imageUrl) content.push({ type: 'image', source: { type: 'url', url: q.imageUrl } });
  content.push({ type: 'text', text: promptText });

  const call = (withImage) =>
    anthropic.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 400,
      system: SYSTEM,
      messages: [{ role: 'user', content: withImage ? content : [{ type: 'text', text: promptText }] }],
    });

  let res;
  try {
    res = await call(true);
  } catch (err) {
    // If the image couldn't be fetched, fall back to a text-only explanation.
    console.warn('image attempt failed, retrying text-only:', err.message);
    res = await call(false);
  }
  return res.content.find((b) => b.type === 'text')?.text?.trim() || '';
}

export const handler = async (event) => {
  try {
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

    // Cache it back on the question item.
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
