# Security & Infrastructure

## Architecture (all eu-central-1 unless noted)
```
Browser (PWA)
  │  HTTPS
  ▼
CloudFront (E3U251UNW6ZOD)  ──OAC──►  S3 theory-app-web-ori (PRIVATE)
  │
  │  API calls (Bearer JWT)
  ▼
API Gateway HTTP API (ds3xpsvhx3)
  ├─ GET  /questions          (public)            ─► Lambda theory-api
  ├─ GET  /progress           (Cognito JWT auth)  ─► Lambda theory-api
  ├─ POST /progress           (Cognito JWT auth)  ─► Lambda theory-api
  └─ POST /explain            (Cognito JWT auth)  ─► Lambda theory-explain ─► Gemini
                                                         │
Cognito user pool ──validates JWT at the gateway        ▼
DynamoDB: TheoryQuestions, UserData              (least-privilege IAM)
```

## Controls in place
- **Auth**: Cognito JWT authorizer validates token signature at API Gateway *before* the Lambda runs. Forged/expired tokens → 401. Verified.
- **No IDOR**: `userId` is always taken from the verified JWT (`requestContext.authorizer.jwt.claims.sub`) and overwrites any client-supplied value. Each user can only touch their own DynamoDB partition.
- **Secrets**: none in the repo or frontend bundle. `GOOGLE_API_KEY` lives only in the Lambda environment (never shipped to the browser). `.env` is gitignored. Cognito/API IDs in `src/config.ts` are public client identifiers (safe).
- **Input limits**: `POST /progress` caps items per request (200) and `sk` length (128). `POST /explain` accepts only a `questionId`.
- **SSRF defense**: the explain Lambda only fetches images whose host is `gov.il`/`www.gov.il`, with an 8s timeout. (The URL already comes from our own DB.)
- **Error hygiene**: Lambdas log details server-side and return generic `{"error":"internal error"}` to clients.
- **Transport**: HTTPS enforced (CloudFront redirects HTTP→HTTPS). S3 bucket private via OAC.
- **Cost protection**: explanations cached on the question after first generation (max 1,802 ever); Gemini free tier.

## Manual console hardening (do once)
1. **API Gateway throttling** — `theory-api` API → **Throttle** (Stages → `$default` → Default route throttling): Rate `20`, Burst `40`. Protects all routes (esp. /explain) from abuse/cost.
2. **Least-privilege IAM** — for **each** Lambda role (`theory-api`, `theory-explain`):
   - IAM → Roles → the role → **detach** `AmazonDynamoDBFullAccess`.
   - **Add permissions → Create inline policy → JSON** → paste `backend/iam-policy-dynamodb.json` → save as `theory-dynamodb-access`.
3. **Cognito** — password policy + (optional) advanced security / compromised-credential checks are on the user pool; defaults are reasonable for this app.

## Known accepted risks (by design)
- **Open self-signup**: anyone can register an account. Acceptable for a personal study app; throttling bounds abuse.
- **CORS `*`**: fine here — auth is via Bearer token, not cookies; no `Allow-Credentials`.
- **Verification emails to spam**: default Cognito sender. Fix later via SES + a domain.
