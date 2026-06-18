// theory-api — single Lambda behind API Gateway (HTTP API).
// Routes:
//   GET  /questions          -> all questions (public)
//   GET  /progress           -> the logged-in user's progress (Cognito-protected)
//   POST /progress           -> upsert progress items for the logged-in user
//
// The AWS SDK v3 is preinstalled in the Lambda Node.js runtime, so no bundling.

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const QUESTIONS = process.env.QUESTIONS_TABLE || 'TheoryQuestions';
const USERDATA = process.env.USERDATA_TABLE || 'UserData';

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const method = event.requestContext?.http?.method;
  const path = event.requestContext?.http?.path || event.rawPath || '';

  try {
    if (method === 'GET' && path.endsWith('/questions')) {
      return await getQuestions();
    }

    // Everything below requires a logged-in user (Cognito JWT).
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
    if (!userId) return json(401, { error: 'unauthorized' });

    if (method === 'GET' && path.endsWith('/progress')) {
      return await getProgress(userId);
    }
    if (method === 'POST' && path.endsWith('/progress')) {
      return await saveProgress(userId, JSON.parse(event.body || '{}'));
    }

    return json(404, { error: 'not found' });
  } catch (err) {
    console.error(err);
    return json(500, { error: err.message });
  }
};

// --- GET /questions: scan the whole bank (paged past the 1MB limit). ---
async function getQuestions() {
  const items = [];
  let ExclusiveStartKey;
  do {
    const out = await ddb.send(
      new ScanCommand({ TableName: QUESTIONS, ExclusiveStartKey }),
    );
    items.push(...(out.Items || []));
    ExclusiveStartKey = out.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return json(200, { count: items.length, questions: items });
}

// --- GET /progress: all items under this user (profile + per-question + lessons). ---
async function getProgress(userId) {
  const out = await ddb.send(
    new QueryCommand({
      TableName: USERDATA,
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: { ':u': userId },
    }),
  );
  return json(200, { items: out.Items || [] });
}

// --- POST /progress: upsert a list of items, forcing the caller's userId. ---
// Body: { items: [ { sk: "PROFILE", ... }, { sk: "Q#Q123", box, nextDue, ... } ] }
async function saveProgress(userId, body) {
  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) return json(400, { error: 'no items' });

  const valid = items
    .filter((it) => typeof it.sk === 'string' && it.sk.length > 0)
    .map((it) => ({ ...it, userId })); // never trust a client-supplied userId

  if (valid.length === 0) return json(400, { error: 'items need an sk' });

  for (let i = 0; i < valid.length; i += 25) {
    const chunk = valid.slice(i, i + 25);
    await ddb.send(
      new BatchWriteCommand({
        RequestItems: { [USERDATA]: chunk.map((Item) => ({ PutRequest: { Item } })) },
      }),
    );
  }
  return json(200, { saved: valid.length });
}
