/**
 * V15.2 — Reliable Netlify Forms HTTP POST webhook → Brevo.
 *
 * Configure one Netlify form submission notification with this URL:
 * https://the-seventh-table.com/.netlify/functions/form-webhook
 *
 * Required environment variables:
 *   BREVO_API_KEY
 *   BREVO_LIST_ID
 *
 * Optional:
 *   BREVO_PARTNERS_LIST_ID (defaults to 5)
 *   BREVO_SENDER_EMAIL (defaults to hello@the-seventh-table.com)
 *   BREVO_SENDER_NAME (defaults to The Seventh Table)
 *   FORM_WEBHOOK_SECRET (then append ?secret=VALUE to the notification URL)
 */

const clean = (value = '') => String(value ?? '').trim();
const cleanEmail = (value = '') => clean(value).toLowerCase();
const escapeHtml = (value = '') =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const env = (name) => process.env[name] || globalThis.Netlify?.env?.get?.(name) || '';

const brevoHeaders = (apiKey) => ({
  accept: 'application/json',
  'api-key': apiKey,
  'content-type': 'application/json',
});

async function brevoRequest({ apiKey, path, method = 'POST', body }) {
  const response = await fetch(`https://api.brevo.com/v3${path}`, {
    method,
    headers: brevoHeaders(apiKey),
    body: JSON.stringify(body),
  });

  const responseText = await response.text();
  if (!response.ok) {
    console.error(`[Brevo] ${method} ${path} failed`, {
      status: response.status,
      response: responseText,
    });
  }

  return { ok: response.ok, status: response.status, responseText };
}

async function sendEmail({ apiKey, senderName, senderEmail, to, subject, htmlContent, textContent, replyTo }) {
  const body = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent,
    textContent,
  };
  if (replyTo) body.replyTo = { email: replyTo };
  return brevoRequest({ apiKey, path: '/smtp/email', body });
}

const frame = (kicker, title, copy, buttonLabel = 'Discover The Seventh Table', buttonUrl = 'https://the-seventh-table.com/') => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#090909;color:#f3f0e8;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#090909;padding:30px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#101010;border:1px solid #4a3d27">
<tr><td align="center" style="padding:52px 30px 18px;color:#c7a86d;font-family:Georgia,'Times New Roman',serif;font-size:58px">VII</td></tr>
<tr><td align="center" style="padding:0 30px;color:#c7a86d;font-size:11px;letter-spacing:4px;text-transform:uppercase">${kicker}</td></tr>
<tr><td align="center" style="padding:24px 34px 8px;color:#f3f0e8;font-family:Georgia,'Times New Roman',serif;font-size:42px;line-height:1.1">${title}</td></tr>
<tr><td align="center" style="padding:18px 48px 8px;color:#b8b0a3;font-size:16px;line-height:1.8">${copy}</td></tr>
<tr><td align="center" style="padding:28px 30px 24px"><a href="${buttonUrl}" style="display:inline-block;border:1px solid #c7a86d;color:#f3f0e8;text-decoration:none;padding:15px 24px;font-size:11px;letter-spacing:3px;text-transform:uppercase">${buttonLabel}</a></td></tr>
<tr><td align="center" style="padding:10px 34px 42px;color:#82796a;font-family:Georgia,'Times New Roman',serif;font-size:18px">Until the next reservation…</td></tr>
<tr><td style="border-top:1px solid #2e281e;padding:24px 30px;color:#777067;font-size:11px;line-height:1.7;text-align:center">The Seventh Table · Luxury Dining Soundtracks</td></tr>
</table></td></tr></table></body></html>`;

function parseBody(event) {
  if (!event?.body) return {};
  try {
    return JSON.parse(event.body);
  } catch {
    const params = new URLSearchParams(event.body);
    return Object.fromEntries(params.entries());
  }
}

function normaliseSubmission(raw) {
  const payload = raw?.payload && typeof raw.payload === 'object' ? raw.payload : raw;
  const data = payload?.data && typeof payload.data === 'object'
    ? payload.data
    : raw?.data && typeof raw.data === 'object'
      ? raw.data
      : payload;

  const formName = clean(
    payload?.form_name || payload?.formName || raw?.form_name || raw?.formName || data?.['form-name'] || data?.form_name,
  );

  return { payload, data: data || {}, formName };
}

function detectFormName(formName, data) {
  if (formName) return formName;
  if ('marketing-consent' in data) return 'guest-list';
  if ('partnership-type' in data) return 'partner-inquiry';
  if ('deadline' in data || 'publication' in data) return 'press-inquiry';
  if ('use' in data) return 'licensing-inquiry';
  return 'unknown';
}

async function upsertContact({ apiKey, email, listId, attributes, label }) {
  if (!Number.isInteger(listId)) {
    console.error(`[${label}] Invalid Brevo list ID`, { listId });
    return false;
  }
  const result = await brevoRequest({
    apiKey,
    path: '/contacts',
    body: { email, attributes, listIds: [listId], updateEnabled: true },
  });
  console.log(`[${label}] CRM contact ${result.ok ? 'saved' : 'not saved'}`, { email, listId, status: result.status });
  return result.ok;
}

function internalDetailsTable(data) {
  return Object.entries(data)
    .filter(([key]) => !['form-name', 'bot-field'].includes(key))
    .map(([key, value]) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #2e281e;color:#c7a86d;vertical-align:top"><strong>${escapeHtml(key)}</strong></td><td style="padding:8px 12px;border-bottom:1px solid #2e281e;color:#f3f0e8;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`)
    .join('');
}

async function handleGuest({ data, email, apiKey, senderName, senderEmail }) {
  const consent = clean(data['marketing-consent']).toLowerCase();
  if (consent !== 'yes') {
    console.warn('[guest-list] Missing marketing consent; skipped', { email });
    return;
  }

  const listId = Number(env('BREVO_LIST_ID'));
  const [contact, mail] = await Promise.all([
    upsertContact({
      apiKey,
      email,
      listId,
      label: 'guest-list',
      attributes: {
        SOURCE: clean(data.source) || 'website',
        CONSENT: 'yes',
        CONSENT_DATE: clean(data['submitted-at']) || new Date().toISOString(),
      },
    }),
    sendEmail({
      apiKey,
      senderName,
      senderEmail,
      to: email,
      subject: 'Welcome to The Seventh Table',
      htmlContent: frame(
        'The Guest List',
        'Your seat is reserved.',
        'Welcome to The Seventh Table. You will receive selected invitations whenever a new Reservation is served.',
        'Explore the Reservations',
        'https://the-seventh-table.com/#reservations',
      ),
      textContent: 'Welcome to The Seventh Table. Your seat is reserved. You will receive selected invitations whenever a new Reservation is served.',
    }),
  ]);

  console.log('[guest-list] Workflow completed', { email, contactSaved: contact, emailSent: mail.ok, emailStatus: mail.status });
}

async function handleBusiness({ formName, data, email, apiKey, senderName, senderEmail }) {
  const messages = {
    'partner-inquiry': {
      subject: 'Thank you for your interest in The Seventh Table',
      kicker: 'Partnerships',
      title: 'Your request has been received.',
      copy: 'Thank you for reaching out to The Seventh Table. We are delighted by your interest in becoming part of our journey. Your message will be reviewed personally. We carefully select partnerships that reflect quality, authenticity and lasting value. If there is a mutual fit, we will contact you shortly.',
      reply: 'partners@the-seventh-table.com',
    },
    'press-inquiry': {
      subject: 'Your press enquiry has been received',
      kicker: 'Press Office',
      title: 'Thank you for your enquiry.',
      copy: 'Thank you for contacting The Seventh Table. Your media request has been received and will be reviewed personally. We will respond as soon as possible, taking any stated editorial deadline into account.',
      reply: 'press@the-seventh-table.com',
    },
    'licensing-inquiry': {
      subject: 'Your licensing request has been received',
      kicker: 'Licensing',
      title: 'Your request is under review.',
      copy: 'Thank you for your interest in licensing music from The Seventh Table. We will review the intended use, rights scope, territories and term, and will contact you with the next steps.',
      reply: 'licensing@the-seventh-table.com',
    },
  };

  const message = messages[formName];
  if (!message) {
    console.warn('[forms] Unknown business form ignored', { formName });
    return;
  }

  const name = clean(data.name);
  const company = clean(data.company);
  const greeting = formName === 'partner-inquiry'
    ? `${name ? `Dear ${escapeHtml(name)},<br><br>` : 'Dear Partner,<br><br>'}Thank you for reaching out${company ? ` on behalf of <strong>${escapeHtml(company)}</strong>` : ''}.<br><br>${message.copy}`
    : message.copy;
  const textGreeting = formName === 'partner-inquiry'
    ? `${name ? `Dear ${name},\n\n` : 'Dear Partner,\n\n'}Thank you for reaching out${company ? ` on behalf of ${company}` : ''}.\n\n${message.copy}`
    : message.copy;

  const tasks = [];
  if (formName === 'partner-inquiry') {
    tasks.push(upsertContact({
      apiKey,
      email,
      listId: Number(env('BREVO_PARTNERS_LIST_ID') || '5'),
      label: formName,
      attributes: {
        FIRSTNAME: name,
        COMPANY: company,
        SOURCE: 'website-partner-form',
        CONSENT: clean(data['privacy-consent']) || 'no',
        CONSENT_DATE: new Date().toISOString(),
      },
    }));
  }

  tasks.push(sendEmail({
    apiKey,
    senderName,
    senderEmail,
    to: email,
    subject: message.subject,
    htmlContent: frame(message.kicker, message.title, greeting),
    textContent: textGreeting,
    replyTo: message.reply,
  }));

  const details = internalDetailsTable(data);
  const internalHtml = `<!doctype html><html><body style="margin:0;background:#090909;color:#f3f0e8;font-family:Arial,Helvetica,sans-serif"><div style="max-width:720px;margin:0 auto;padding:32px"><div style="color:#c7a86d;font-family:Georgia,serif;font-size:44px;text-align:center">VII</div><h1 style="font-family:Georgia,serif;font-weight:400">New ${message.kicker} enquiry</h1><p style="color:#b8b0a3">A new enquiry was submitted through the website. Reply directly to this email to answer ${escapeHtml(email)}.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #4a3d27;border-collapse:collapse">${details}</table></div></body></html>`;
  const internalText = Object.entries(data)
    .filter(([key]) => !['form-name', 'bot-field'].includes(key))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  tasks.push(sendEmail({
    apiKey,
    senderName,
    senderEmail,
    to: message.reply,
    subject: `New ${message.kicker} enquiry — ${company || name || email}`,
    htmlContent: internalHtml,
    textContent: internalText,
    replyTo: email,
  }));

  const results = await Promise.all(tasks);
  console.log(`[${formName}] Workflow completed`, {
    email,
    results: results.map((result) => typeof result === 'boolean' ? result : { ok: result.ok, status: result.status }),
  });
}

async function runWorkflow(raw) {
  const { data, formName: suppliedName } = normaliseSubmission(raw);
  const formName = detectFormName(suppliedName, data);
  const email = cleanEmail(data.email);

  console.log('[webhook] Submission received', { formName, fields: Object.keys(data), hasEmail: Boolean(email) });

  if (!email || !email.includes('@')) throw new Error(`No valid email address for form ${formName}`);
  const apiKey = env('BREVO_API_KEY');
  if (!apiKey) throw new Error('BREVO_API_KEY is missing');

  const senderEmail = env('BREVO_SENDER_EMAIL') || 'hello@the-seventh-table.com';
  const senderName = env('BREVO_SENDER_NAME') || 'The Seventh Table';

  if (formName === 'guest-list') {
    await handleGuest({ data, email, apiKey, senderName, senderEmail });
  } else {
    await handleBusiness({ formName, data, email, apiKey, senderName, senderEmail });
  }
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { Allow: 'POST' }, body: 'Method not allowed' };
  }

  const requiredSecret = env('FORM_WEBHOOK_SECRET');
  if (requiredSecret) {
    const suppliedSecret = new URLSearchParams(event.rawQuery || event.rawQueryString || '').get('secret');
    if (suppliedSecret !== requiredSecret) {
      console.warn('[webhook] Rejected request with invalid secret');
      return { statusCode: 401, body: 'Unauthorized' };
    }
  }

  try {
    const raw = parseBody(event);
    await runWorkflow(raw);
    return { statusCode: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    console.error('[webhook] Workflow failed', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { statusCode: 500, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ok: false }) };
  }
}
