# theory-explain Lambda (Google Gemini)

Generates a short, simple, encouraging Hebrew explanation for a question using
**Google Gemini** (free tier, with vision when the question has a sign image),
and caches it on the question's `explanation` field in DynamoDB so it's only
generated once.

No npm dependencies — uses global `fetch` + the AWS SDK preinstalled in the
Lambda runtime. So `index.mjs` can be **pasted directly** into the Lambda
console (no zip, no CloudShell).

## Route
`POST /explain` (Cognito-protected) — body `{ "questionId": "Q123" }` →
`{ "explanation": "...", "cached": true|false }`.

## Environment variables
- `GOOGLE_API_KEY` — free key from https://aistudio.google.com/app/apikey
- `QUESTIONS_TABLE=TheoryQuestions`
- `GEMINI_MODEL` — optional, defaults to `gemini-2.0-flash`

## IAM
Lambda execution role needs DynamoDB GetItem + UpdateItem on `TheoryQuestions`
(`AmazonDynamoDBFullAccess` works to start). Set timeout to 30s.

## Cost
Free under Gemini's free tier. Each explanation is generated once then cached
forever, so the whole 1,802-question bank costs nothing and is generated lazily
as questions get used. Auth-gated so only logged-in users can trigger it.
