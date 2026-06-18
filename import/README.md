# Import script — data.gov.il → S3 + DynamoDB

Runs **once** to populate your AWS resources with the official theory bank.
Fetches all questions from the data.gov.il CKAN API, mirrors each sign image into
your S3 bucket, and writes structured items into the `TheoryQuestions` table.

## What it does
1. Pages through the `tqhe` datastore (~1,800 questions).
2. Parses each record: question text, 4 answers, the correct one, category, image.
3. Downloads each sign image from gov.il → uploads to `s3://<bucket>/signs/...`.
4. Rewrites `imageUrl` to point at your bucket.
5. Batch-writes everything into DynamoDB.

Re-running is safe (idempotent): images are skipped if already present, and items
overwrite themselves by `questionId`.

## Run it

You need AWS credentials with access to the bucket + table. Two easy options:

### Option A — AWS CloudShell (no keys to manage, recommended)
1. Open **CloudShell** (the `>_` icon, top-right of the AWS Console). It already
   has your account credentials.
2. Upload this `import/` folder (CloudShell → Actions → Upload file) or `git clone`
   your repo.
3. Run:
   ```bash
   cd import
   npm install
   AWS_REGION=eu-central-1 BUCKET=theory-signs-ori QUESTIONS_TABLE=TheoryQuestions npm run import
   ```

### Option B — Your laptop
1. Configure the AWS CLI once with the `theory-importer` access key:
   ```bash
   aws configure   # paste Access Key ID + Secret, region eu-central-1
   ```
2. Run:
   ```bash
   cd import
   npm install
   AWS_REGION=eu-central-1 BUCKET=theory-signs-ori QUESTIONS_TABLE=TheoryQuestions npm run import
   ```

## Verify
- DynamoDB → `TheoryQuestions` → **Explore items**: ~1,800 rows.
- S3 → `theory-signs-ori` → `signs/`: the mirrored sign images.
