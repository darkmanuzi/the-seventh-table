import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const env = (name) => process.env[name] || globalThis.Netlify?.env?.get?.(name) || '';

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, private',
  'x-content-type-options': 'nosniff',
};

const response = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

const accessByRole = Object.freeze({
  'signature-filipe-silva': 'signatures/filipe-silva/',
});

function getUser(context) {
  return context?.clientContext?.user || context?.clientContext?.custom?.netlifyIdentity?.user || null;
}

function getRoles(user) {
  const roles = user?.app_metadata?.roles;
  return Array.isArray(roles) ? roles.filter((role) => typeof role === 'string') : [];
}

function permittedPrefixes(user) {
  return getRoles(user).map((role) => accessByRole[role]).filter(Boolean);
}

function isSafeObjectKey(key, prefixes) {
  if (!key || key.length > 512 || key.startsWith('/') || key.includes('\\') || key.includes('\0')) return false;
  const segments = key.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) return false;
  return prefixes.some((prefix) => key.startsWith(prefix)) && /\.(mp3|m4a|aac|wav)$/i.test(key);
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

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return response(405, { error: 'Method not allowed' });
  }

  const user = getUser(context);
  if (!user) return response(401, { error: 'Authentication required' });

  const prefixes = permittedPrefixes(user);
  if (!prefixes.length) return response(403, { error: 'Signature access required' });

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return response(400, { error: 'Invalid request' });
  }

  const key = typeof body.key === 'string' ? body.key.trim() : '';
  if (!isSafeObjectKey(key, prefixes)) return response(403, { error: 'Track not permitted' });

  try {
    const command = new GetObjectCommand({
      Bucket: env('R2_BUCKET_NAME'),
      Key: key,
      ResponseContentDisposition: 'inline',
    });
    const url = await getSignedUrl(r2Client(), command, { expiresIn: 120 });
    return response(200, { url, expiresIn: 120 });
  } catch (error) {
    console.error('[signature-stream] signing failed', { name: error?.name, message: error?.message });
    return response(500, { error: 'Stream temporarily unavailable' });
  }
}
