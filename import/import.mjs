// One-time import: data.gov.il theory bank -> S3 (images) + DynamoDB (questions).
//
// Run once. Idempotent: re-running overwrites the same items/objects.
//
//   AWS_REGION=eu-central-1 \
//   BUCKET=theory-signs-ori \
//   QUESTIONS_TABLE=TheoryQuestions \
//   node import.mjs
//
// Credentials come from the default AWS chain (aws configure, env vars,
// or the CloudShell/instance role). No secrets live in this file.

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION || 'eu-central-1';
const BUCKET = process.env.BUCKET || 'theory-signs-ori';
const TABLE = process.env.QUESTIONS_TABLE || 'TheoryQuestions';
const RESOURCE_ID = '8c0f314f-583d-48b6-9f5f-4483d95f6848'; // tqhe datastore
const API = 'https://data.gov.il/api/3/action/datastore_search';
const PAGE = 500;

const s3 = new S3Client({ region: REGION });
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

// gov.il blocks requests without a browser-like User-Agent (returns 403).
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
};

const uploadedImages = new Set(); // avoid re-uploading shared sign images

// --- Fetch every record from the CKAN datastore, paging through the bank. ---
async function fetchAll() {
  const all = [];
  let offset = 0;
  for (;;) {
    const url = `${API}?resource_id=${RESOURCE_ID}&limit=${PAGE}&offset=${offset}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`gov API ${res.status} at offset ${offset}`);
    const { result } = await res.json();
    all.push(...result.records);
    process.stdout.write(`\rfetched ${all.length}/${result.total}`);
    offset += PAGE;
    if (offset >= result.total) break;
  }
  process.stdout.write('\n');
  return all;
}

// --- Parse one raw record into our Question shape. ---
function parseRecord(r) {
  const numMatch = r.title2.match(/^\s*(\d+)/);
  if (!numMatch) return null;
  const number = parseInt(numMatch[1], 10);
  const text = r.title2.replace(/^\s*\d+\.\s*/, '').trim();

  const desc = r.description4 || '';
  // Require an http(s) URL — some <img> tags in the data are malformed.
  const imgMatch = desc.match(/<img[^>]*src="?(https?:\/\/[^"\s>]+)/i);
  const govImageUrl = imgMatch ? imgMatch[1] : null;

  const liMatches = [...desc.matchAll(/<li>([\s\S]*?)<\/li>/g)];
  const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
  const options = liMatches.map((m, i) => ({
    id: ids[i],
    text: m[1].replace(/<[^>]+>/g, '').trim(),
    correct: /correctAnswer/.test(m[1]),
  }));

  // Keep only well-formed questions: 2+ options and exactly one correct.
  const correctCount = options.filter((o) => o.correct).length;
  if (options.length < 2 || correctCount !== 1) return null;

  return {
    questionId: `Q${number}`,
    number,
    category: r.category || 'אחר',
    text,
    govImageUrl,
    options,
    explanation: '',
  };
}

// --- Copy a gov.il sign image into our bucket; return the S3 URL. ---
async function mirrorImage(govUrl) {
  const filename = govUrl.split('/').pop().split('?')[0];
  const key = `signs/${filename}`;
  const s3Url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

  if (uploadedImages.has(key)) return s3Url;

  // Skip download if it already exists in the bucket.
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    uploadedImages.add(key);
    return s3Url;
  } catch {
    /* not there yet — upload it */
  }

  const res = await fetch(govUrl, { headers: BROWSER_HEADERS });
  if (!res.ok) {
    console.warn(`\n  ! image ${govUrl} -> ${res.status}, skipping`);
    return null;
  }
  const body = Buffer.from(await res.arrayBuffer());
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: res.headers.get('content-type') || 'image/jpeg',
    }),
  );
  uploadedImages.add(key);
  return s3Url;
}

// --- Write items to DynamoDB in batches of 25 (the BatchWrite limit). ---
async function writeBatch(items) {
  for (let i = 0; i < items.length; i += 25) {
    const chunk = items.slice(i, i + 25);
    let unprocessed = {
      [TABLE]: chunk.map((Item) => ({ PutRequest: { Item } })),
    };
    // Retry any unprocessed items (throttling) with simple backoff.
    for (let attempt = 0; attempt < 5 && Object.keys(unprocessed).length; attempt++) {
      const out = await ddb.send(new BatchWriteCommand({ RequestItems: unprocessed }));
      unprocessed = out.UnprocessedItems || {};
      if (Object.keys(unprocessed).length) await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
}

async function main() {
  console.log(`Region=${REGION}  Bucket=${BUCKET}  Table=${TABLE}`);
  const raw = await fetchAll();

  const items = [];
  let withImage = 0;
  let skipped = 0;

  for (let i = 0; i < raw.length; i++) {
    const q = parseRecord(raw[i]);
    if (!q) {
      skipped++;
      continue;
    }
    if (q.govImageUrl) {
      // gov.il blocks AWS IPs, so mirroring to S3 fails from CloudShell/Lambda.
      // USE_GOV_URLS=1 stores the gov.il URL directly (browsers load it fine).
      const url = process.env.USE_GOV_URLS ? q.govImageUrl : await mirrorImage(q.govImageUrl);
      if (url) {
        q.imageUrl = url;
        withImage++;
      }
    }
    delete q.govImageUrl;
    items.push(q);
    process.stdout.write(`\rprocessed ${i + 1}/${raw.length}  (images ${withImage})`);
  }
  process.stdout.write('\n');

  console.log(`Writing ${items.length} questions to DynamoDB (skipped ${skipped} malformed)...`);
  await writeBatch(items);
  console.log(`Done. ${items.length} questions imported, ${withImage} with mirrored images.`);
}

main().catch((e) => {
  console.error('\nImport failed:', e);
  process.exit(1);
});
