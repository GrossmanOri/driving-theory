# Handoff: Driving-theory study app (Hebrew, AWS-deployed)

## Goal
A Hebrew (RTL) driving-theory study web app for the user's teen niece (Mia), built primarily to gain hands-on **AWS cloud experience** for the user's resume. It is live and working; the main remaining feature is on-demand AI explanations via free Google Gemini.

## Current state
- **Done & LIVE:** https://d15k3o15azwrkf.cloudfront.net (open on iPhone → Add to Home Screen → installs as PWA "תיאוריה").
  - Frontend: Vite+React+TS, Tailwind v4, RTL. Repo: github.com/GrossmanOri/driving-theory (local: `~/driving-theory`, all pushed to `main`, clean tree).
  - Auth (Cognito email/password), real 1,802 gov.il questions from DynamoDB via API Gateway+Lambda, cloud-synced progress, dark mode (system+manual), gender-aware Hebrew grammar, personalized greetings (name+gender onboarding).
  - Study modes: Quick Practice (5 random), Lessons, Smart Review (Leitner spaced-rep — `/review`), Mistake bank, Weak-spot Focus, Sign Flashcards, 60s Blitz, Daily Challenge, Full Exam (30Q/40min/26-pass with readiness %).
  - Fun: synthesized sound+haptics (mute in Settings), level-up celebration popup, journey car-on-road on Home, surprise bonus points, gentle hint after 2 misses.
- **CORS fixed** on API Gateway (was a live bug — `/progress` preflight returned 404, progress wasn't saving). Now origin `*`, headers `authorization,content-type`, methods GET/POST/OPTIONS. Verified 204 + correct headers.
- **In progress / NEXT:** deploy the AI explanations using **free Google Gemini** (see How to resume). All frontend + a Lambda are already written and committed, gated behind `EXPLAIN_ENABLED` (currently `false` in `src/config.js`).

## Decisions made (and why)
- **All-AWS stack** (S3+CloudFront / API Gateway / Lambda / DynamoDB / Cognito) — user explicitly wants AWS resume experience; rejected Supabase/Firebase/Vercel.
- **Explanations via Gemini, not Anthropic** — user wants free + real vision on the sign images. Anthropic Lambda was written first (`backend/explain/index.mjs`) but user chose the free Gemini route to avoid a paid key. Must rewrite that Lambda to call Gemini.
- **Explanations are auth-gated and cached** on the DynamoDB question's `explanation` field — generate once per question, then instant/free forever. Protects API cost.
- **Sign images stored as gov.il URLs** (not mirrored to S3) — gov.il blocks AWS IPs, so the CloudShell import couldn't download them; browsers (and Gemini's servers) load gov.il fine. Mirroring to S3 is a deferred robustness task.
- **CloudFront over public S3** — bucket stays private, served via OAC. WAF skipped (paid, unneeded at this scale).
- **Custom domain deferred** — cosmetic; she uses the home-screen icon, never sees the URL. Can attach to existing distribution anytime.
- **EXPLAIN_ENABLED flag** — keeps the "explain" button hidden until the backend exists, so demos don't error.

## Key files & pointers
- `src/config.js` — `API_BASE`, Cognito IDs, `EXPLAIN_ENABLED` (flip to `true` after deploy), `COGNITO_DOMAIN`/`GOOGLE_ENABLED` (for deferred Google sign-in).
- `backend/explain/index.mjs` + `package.json` + `README.md` — the explanation Lambda, **currently written for Anthropic — must be rewritten for Gemini**. Has `@anthropic-ai/sdk` dep; Gemini can use plain `fetch` (no deps → inline-pasteable, no zip).
- `src/lib/api.js` → `fetchExplanation(questionId)` — frontend caller, POSTs to `/explain`. Already wired into `QuestionCard` via `onExplain`, passed from `Learn.jsx`/`Mistakes.jsx` gated on `EXPLAIN_ENABLED`.
- `backend/lambda/index.mjs` — the working `theory-api` Lambda (questions + progress).
- Memory file `~/.claude/projects/-Users-origrossman/memory/driving-theory-deploy.md` — all AWS resource IDs + redeploy commands.

## AWS resources (all eu-central-1 / Frankfurt unless noted)
- S3 site bucket: `theory-app-web-ori` (private)
- CloudFront distribution id: `E3U251UNW6ZOD` → `d15k3o15azwrkf.cloudfront.net`
- API Gateway HTTP API id: `ds3xpsvhx3` → `https://ds3xpsvhx3.execute-api.eu-central-1.amazonaws.com`
- Lambda: `theory-api`. DynamoDB: `TheoryQuestions` (PK questionId, GSI category-index), `UserData` (PK userId, SK sk)
- Cognito pool `eu-central-1_FMibhSlR6`, app client `3utcfgvp9macp5tgelj42dmsbv`

## How to resume — deploy Gemini explanations (~20 min)
1. User gets a **free Google AI Studio API key**: aistudio.google.com → Get API key.
2. **Rewrite `backend/explain/index.mjs`** to call Gemini instead of Anthropic: use `fetch` to `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=...` (or current free vision model). Send the question text + 4 options (mark correct) + the sign image (fetch the gov.il `imageUrl`, base64, as an `inline_data` part) + a Hebrew system instruction (simple, encouraging, ADHD/dyslexia-friendly, **gender-neutral**, 2-3 short sentences, explain WHY). Keep the GetItem→cache-on-`explanation`→UpdateItem logic. Drop the `@anthropic-ai/sdk` dep so it's inline-pasteable. Key in env var `GOOGLE_API_KEY`, `QUESTIONS_TABLE=TheoryQuestions`.
3. **Create Lambda `theory-explain`** (Node 22) in console, paste code inline, set env vars, timeout 30s, attach `AmazonDynamoDBFullAccess`. Test with `{"requestContext":{"authorizer":{"jwt":{"claims":{"sub":"x"}}}},"body":"{\"questionId\":\"Q...\"}"}` (pick a real questionId, ideally one WITH an image to test vision).
4. **API Gateway** `ds3xpsvhx3`: add route **POST `/explain`** → attach integration to `theory-explain` Lambda. (CORS already on.) Attach the **cognito** JWT authorizer to it.
5. Flip `EXPLAIN_ENABLED = true` in `src/config.js`, commit/push.
6. **Redeploy frontend** (CloudShell): `cd driving-theory && git pull && npm run build && aws s3 sync dist/ s3://theory-app-web-ori --delete && aws cloudfront create-invalidation --distribution-id E3U251UNW6ZOD --paths "/*"`.
7. Verify the "💡 הסבירו לי בקלות" button appears after answering and returns a Hebrew explanation; check vision works on an image question.

## Optional backlog (all deferred, in rough priority)
- SES email so Cognito codes stop hitting spam (best with a domain).
- Tighten "mastered" — require surviving a review cycle, not one lucky guess (makes progress % honest). Lives in `src/hooks/useProgress.js` `recordAnswer`.
- Mirror sign images to S3 (run a small download script from the user's Mac where gov.il returns 200, since AWS IPs are blocked) for robust vision.
- Google sign-in (Cognito Hosted UI domain + Google OAuth creds; set `COGNITO_DOMAIN` in config).
- Custom domain (cosmetic).
- More fun: true winding journey path, animated mascot, achievement popups.

## Do NOT
- Don't switch off AWS (no Supabase/Firebase/Vercel for the core).
- Don't use a paid Anthropic key for explanations — user chose free Gemini.
- Don't mirror gov.il images from inside AWS (CloudShell/Lambda) — gov.il blocks AWS IPs (returns 403). Do it from the user's Mac or store gov.il URLs directly.
- Don't forget the CloudFront invalidation on redeploy — index.html is cached, users get stale builds without it.
- Don't make explanations un-gated/un-cached — protects API cost.
- Don't re-debug CORS — it's fixed and verified.
