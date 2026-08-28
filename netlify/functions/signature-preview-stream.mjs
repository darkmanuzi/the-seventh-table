import { createHash, timingSafeEqual } from 'node:crypto';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const env = (name) => process.env[name] || globalThis.Netlify?.env?.get?.(name) || '';

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, private',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
};

const response = (status, body) => new Response(JSON.stringify(body), { status, headers });

const accessTokenHash = 'e96edf2754c59ea63d3f82202975e49d30d2b0138b2c7ce4d9c978aff9f89639';

const previewKeys = new Set([
  'signatures/filipe-silva/arrival-sunset/01 - First Glass at Sunset.wav',
  'signatures/filipe-silva/dinner/15 – Midnight at the Long Table.wav',
  'signatures/filipe-silva/dessert-after-dinner/09 – The Villa Finds Its Rhythm.wav',
]);

function hasValidAccessToken(token) {
  if (typeof token !== 'string' || token.length < 24 || token.length > 128) return false;
  const actual = Buffer.from(createHash('sha256').update(token).digest('hex'));
  const expected = Buffer.from(accessTokenHash);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function r2Client() {
  const endpoint = env('R2_ENDPOINT');
  const accessKeyId = env('R2_ACCESS_KEY_ID');
  const secretAccessKey = env('R2_SECRET_ACCESS_KEY');
  if (!endpoint || !accessKeyId || !secretAccessKey || !env('R2_BUCKET_NAME')) {
    throw new Error('R2 configuration is incomplete');
  }
  return new S3Client({
    region: 'auto',
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export default async function handler(request) {
  if (request.method !== 'POST') return response(405, { error: 'Method not allowed' });

  let body;
  try {
    body = await request.json();
  } catch {
    return response(400, { error: 'Invalid request' });
  }

  if (!hasValidAccessToken(body.accessToken)) return response(403, { error: 'Invitation required' });

  const key = typeof body.key === 'string' ? body.key.trim() : '';
  if (!previewKeys.has(key)) return response(403, { error: 'Track not permitted' });

  try {
    const command = new GetObjectCommand({
      Bucket: env('R2_BUCKET_NAME'),
      Key: key,
      ResponseContentDisposition: 'inline',
    });
    const url = await getSignedUrl(r2Client(), command, { expiresIn: 120 });
    return response(200, { url, expiresIn: 120 });
  } catch (error) {
    console.error('[signature-preview-stream] signing failed', { name: error?.name, message: error?.message });
    return response(500, { error: 'Stream temporarily unavailable' });
  }
}
