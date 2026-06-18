# AWS Setup — Step 1: Schema + Console Resources

Region for everything: **eu-central-1 (Frankfurt)** — closest to Israel. Use the
same region for every resource or they won't see each other easily.

## DynamoDB schema

### Table A — `TheoryQuestions` (the gov.il question bank)
- **Partition key:** `questionId` (String) — e.g. `Q1759`
- No sort key.
- **GSI:** `category-index` → partition key `category` (String). Lets you fetch a
  topic's questions without scanning the whole table.

Item shape:
```json
{
  "questionId": "Q1759",
  "number": 1759,
  "category": "תמרורים",
  "text": "מה פירוש התמרור?",
  "imageUrl": "https://<bucket>.s3.eu-central-1.amazonaws.com/signs/TQ_PIC_3483.jpg",
  "options": [
    { "id": "a", "text": "...", "correct": false },
    { "id": "b", "text": "...", "correct": true },
    { "id": "c", "text": "...", "correct": false },
    { "id": "d", "text": "...", "correct": false }
  ],
  "explanation": ""
}
```
~1,802 small items → reading them all is one cheap `Scan` (a few hundred KB),
which the app can cache. Per-topic reads use the GSI.

### Table B — `UserData` (single-table design for per-user state)
- **Partition key:** `userId` (String) — the Cognito `sub`
- **Sort key:** `sk` (String) — discriminates item types under one user:
  - `PROFILE` → `{ points, totalStars, settings, updatedAt }`
  - `Q#<questionId>` → `{ box, nextDue, mistake, mastered }` (Leitner state)
  - `LESSON#<topicId>:<index>` → `{ stars }`

One `Query` on `userId` returns the user's entire state (profile + all question
boxes + lesson stars). Single-item writes update one question/lesson at a time.

## Manual AWS Console steps

### 1. S3 bucket (sign images)
1. S3 → Create bucket → name e.g. `theory-signs-<your-initials>` (globally unique),
   region eu-central-1.
2. Uncheck **Block all public access** (acknowledge the warning — these are public
   sign images). Create.
3. Bucket → Permissions → Bucket policy → paste (replace BUCKET):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicReadSigns",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::BUCKET/*"
     }]
   }
   ```
4. Permissions → CORS → add:
   ```json
   [{ "AllowedOrigins": ["*"], "AllowedMethods": ["GET"], "AllowedHeaders": ["*"] }]
   ```
   (Later: front it with CloudFront for HTTPS caching — optional for now.)

### 2. DynamoDB tables
1. DynamoDB → Create table → name `TheoryQuestions`, partition key `questionId`
   (String). Capacity: **On-demand**. Create.
2. Open table → Indexes → Create index → partition key `category` (String),
   name `category-index`, on-demand.
3. Create table → name `UserData`, partition key `userId` (String), sort key `sk`
   (String). On-demand.

### 3. Cognito User Pool (auth)
1. Cognito → Create user pool.
2. Sign-in options: **Email**. (Amplify will use email as the username.)
3. Password policy / MFA: keep defaults, MFA **Optional** (or off for now).
4. Self-service sign-up: **Enabled**. Email via **Cognito** (default) for now.
5. App client: **Public client** (SPA) — **no client secret**.
   - Auth flows: enable `ALLOW_USER_SRP_AUTH` and `ALLOW_REFRESH_TOKEN_AUTH`.
6. After creation, copy and keep:
   - **User Pool ID** (e.g. `eu-central-1_xxxx`)
   - **App client ID**
   - **Region**

   These feed the Amplify config in the frontend (next steps).

### 4. IAM user for the import script (local run)
1. IAM → Users → Create user `theory-importer` (no console access).
2. Attach policies (scoped down later): `AmazonDynamoDBFullAccess`,
   `AmazonS3FullAccess` — or a custom policy limited to the two tables + bucket.
3. Create an **access key** (CLI use case). Save the key id + secret for the
   import script's `.env` (never commit it).

## What's next (not this step)
- One-time Node.js import script: fetch 1,802 Qs from data.gov.il, download images
  → S3, rewrite imageUrl → S3, write items → `TheoryQuestions`.
- Lambda functions + API Gateway for reading questions and reading/writing progress.
- Wire the React app to Cognito + API Gateway via the Amplify SDK.
