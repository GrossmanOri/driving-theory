# theory-explain Lambda

Generates a short, simple Hebrew explanation for a question using Claude
(`claude-opus-4-8`, with vision when the question has a sign image), and caches
it on the question's `explanation` field in DynamoDB so it's generated only once.

## Route
`POST /explain` (Cognito-protected) — body `{ "questionId": "Q123" }` →
`{ "explanation": "...", "cached": true|false }`.

## Environment variables
- `ANTHROPIC_API_KEY` — from https://console.anthropic.com (Settings → API Keys)
- `QUESTIONS_TABLE=TheoryQuestions`

## Deploy (CloudShell — it needs the @anthropic-ai/sdk dependency)
```bash
git clone https://github.com/GrossmanOri/driving-theory.git
cd driving-theory/backend/explain
npm install
zip -r function.zip index.mjs node_modules package.json
# then upload function.zip to the theory-explain Lambda (Console → Upload from → .zip)
```

## IAM
Lambda execution role needs DynamoDB GetItem + UpdateItem on `TheoryQuestions`
(`AmazonDynamoDBFullAccess` works to start). Set timeout to 30s.

## Cost
Each *new* explanation is one Claude call (~$0.005–0.01). Cached forever after,
so the whole 1,802-question bank costs a few dollars at most, spread out lazily.
Auth-gated so only logged-in users can trigger generation.
