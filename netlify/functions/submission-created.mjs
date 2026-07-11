/**
 * Disabled in V15.2.
 * Form workflows are now triggered reliably through the HTTP POST notification
 * endpoint: /.netlify/functions/form-webhook
 */
export async function handler() {
  return {
    statusCode: 410,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ disabled: true, replacement: '/.netlify/functions/form-webhook' }),
  };
}
