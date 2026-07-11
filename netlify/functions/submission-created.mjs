/**
 * V15.1 — Netlify verified form events → Brevo CRM + branded email replies.
 *
 * Uses Netlify's current event-handler syntax. The hidden `form-name` field in
 * every form identifies the workflow. CRM failures are logged but never block
 * the acknowledgement email.
 */

const brevoHeaders = (apiKey) => ({
  accept: 'application/json',
  'api-key': apiKey,
  'content-type': 'application/json',
});

const clean = (value = '') => String(value).trim();
const cleanEmail = (value = '') => clean(value).toLowerCase();
const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const getEnv = (name) => Netlify.env.get(name);

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

async function sendEmail({
  apiKey,
  senderName,
  senderEmail,
  to,
  subject,
  htmlContent,
  textContent,
  replyTo,
}) {
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

const frame = (
  kicker,
  title,
  copy,
  buttonLabel = 'Discover The Seventh Table',
  buttonUrl = 'https://the-seventh-table.com/',
) => `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#090909;color:#f3f0e8;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#090909;padding:30px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#101010;border:1px solid #4a3d27">
<tr><td align="center" style="padding:52px 30px 18px;color:#c7a86d;font-family:Georgia,'Times New Roman',serif;font-size:58px">VII</td></tr>
<tr><td align="center" style="padding:0 30px;color:#c7a86d;font-size:11px;letter-spacing:4px;text-transform:uppercase">${kicker}</td></tr>
<tr><td align="center" style="padding:24px 34px 8px;color:#f3f0e8;font-family:Georgia,'Times New Roman',serif;font-size:42px;line-height:1.1">${title}</td></tr>
<tr><td align="center" style="padding:18px 48px 8px;color:#b8b0a3;font-size:16px;line-height:1.8">${copy}</td></tr>
<tr><td align="center" style="padding:28px 30px 24px"><a href="${buttonUrl}" style="display:inline-block;border:1px solid #c7a86d;color:#f3f0e8;text-decoration:none;padding:15px 24px;font-size:11px;letter-spacing:3px;text-transform:uppercase">${buttonLabel}</a></td></tr>
<tr><td align="center" style="padding:10px 34px 42px;color:#82796a;font-family:Georgia,'Times New Roman',serif;font-size:18px">Until the next reservation…</td></tr>
<tr><td style="border-top:1px solid #2e281e;padding:24px 30px;color:#777067;font-size:11px;line-height:1.7;text-align:center">The Seventh Table · Luxury Dining Soundtracks</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

function detectFormName(data) {
  const explicit = clean(data['form-name'] || data.form_name || data.formName);
  if (explicit) return explicit;

  // Safe fallbacks in case Netlify omits its internal hidden form field.
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

  console.log(`[${label}] CRM contact ${result.ok ? 'saved' : 'not saved'}`, {
    email,
    listId,
    status: result.status,
  });
  return result.ok;
}

function internalDetailsTable(data) {
  return Object.entries(data)
    .filter(([key]) => !['form-name', 'bot-field'].includes(key))
    .map(
      ([key, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #2e281e;color:#c7a86d;vertical-align:top"><strong>${escapeHtml(key)}</strong></td><td style="padding:8px 12px;border-bottom:1px solid #2e281e;color:#f3f0e8;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
}

async function handleGuest({ data, email, apiKey, senderName, senderEmail }) {
  const consent = clean(data['marketing-consent']).toLowerCase();
  if (consent !== 'yes') {
    console.warn('[guest-list] Missing marketing consent; workflow skipped', { email });
    return;
  }

  const listId = Number(getEnv('BREVO_LIST_ID'));
  await upsertContact({
    apiKey,
    email,
    listId,
    label: 'guest-list',
    attributes: {
      SOURCE: clean(data.source) || 'website',
      CONSENT: 'yes',
      CONSENT_DATE: clean(data['submitted-at']) || new Date().toISOString(),
    },
  });

  // The welcome email is deliberately independent of CRM success.
  const mail = await sendEmail({
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
    textContent:
      'Welcome to The Seventh Table. Your seat is reserved. You will receive selected invitations whenever a new Reservation is served.',
  });

  console.log(`[guest-list] Welcome email ${mail.ok ? 'sent' : 'failed'}`, {
    email,
    status: mail.status,
  });
}

async function handleBusiness({ formName, data, email, apiKey, senderName, senderEmail }) {
  const messages = {
    'partner-inquiry': {
      subject: 'Thank you for your interest in The Seventh Table',
      kicker: 'Partnerships',
      title: 'Your request has been received.',
      copy:
        'Thank you for reaching out to The Seventh Table. We are delighted by your interest in becoming part of our journey. Your message will be reviewed personally. We carefully select partnerships that reflect quality, authenticity and lasting value. If there is a mutual fit, we will contact you shortly.',
      reply: 'partners@the-seventh-table.com',
    },
    'press-inquiry': {
      subject: 'Your press enquiry has been received',
      kicker: 'Press Office',
      title: 'Thank you for your enquiry.',
      copy:
        'Thank you for contacting The Seventh Table. Your media request has been received and will be reviewed personally. We will respond as soon as possible, taking any stated editorial deadline into account.',
      reply: 'press@the-seventh-table.com',
    },
    'licensing-inquiry': {
      subject: 'Your licensing request has been received',
      kicker: 'Licensing',
      title: 'Your request is under review.',
      copy:
        'Thank you for your interest in licensing music from The Seventh Table. We will review the intended use, rights scope, territories and term, and will contact you with the next steps.',
      reply: 'licensing@the-seventh-table.com',
    },
  };

  const message = messages[formName];
  if (!message) {
    console.warn('[forms] Unknown business form ignored', { formName });
    return;
  }

  if (formName === 'partner-inquiry') {
    const partnersListId = Number(getEnv('BREVO_PARTNERS_LIST_ID') || '5');
    await upsertContact({
      apiKey,
      email,
      listId: partnersListId,
      label: 'partner-inquiry',
      attributes: {
        FIRSTNAME: clean(data.name),
        COMPANY: clean(data.company),
        SOURCE: 'website-partner-form',
        CONSENT: clean(data['privacy-consent']) || 'no',
        CONSENT_DATE: new Date().toISOString(),
      },
    });
  }

  const contactName = escapeHtml(clean(data.name));
  const companyName = escapeHtml(clean(data.company));
  const greeting =
    formName === 'partner-inquiry'
      ? `${contactName ? `Dear ${contactName},<br><br>` : 'Dear Partner,<br><br>'}Thank you for reaching out${companyName ? ` on behalf of <strong>${companyName}</strong>` : ''}.<br><br>${message.copy}`
      : message.copy;
  const textGreeting =
    formName === 'partner-inquiry'
      ? `${contactName ? `Dear ${clean(data.name)},\n\n` : 'Dear Partner,\n\n'}Thank you for reaching out${clean(data.company) ? ` on behalf of ${clean(data.company)}` : ''}.\n\n${message.copy}`
      : message.copy;

  const acknowledgement = await sendEmail({
    apiKey,
    senderName,
    senderEmail,
    to: email,
    subject: message.subject,
    htmlContent: frame(
      message.kicker,
      message.title,
      greeting,
      'Discover The Seventh Table',
      'https://the-seventh-table.com/',
    ),
    textContent: textGreeting,
    replyTo: message.reply,
  });

  console.log(`[${formName}] Acknowledgement ${acknowledgement.ok ? 'sent' : 'failed'}`, {
    email,
    status: acknowledgement.status,
  });

  const details = internalDetailsTable(data);
  const internalHtml = `<!doctype html><html><body style="margin:0;background:#090909;color:#f3f0e8;font-family:Arial,Helvetica,sans-serif"><div style="max-width:720px;margin:0 auto;padding:32px"><div style="color:#c7a86d;font-family:Georgia,serif;font-size:44px;text-align:center">VII</div><h1 style="font-family:Georgia,serif;font-weight:400">New ${message.kicker} enquiry</h1><p style="color:#b8b0a3">A new enquiry was submitted through the website. Reply directly to this email to answer ${escapeHtml(email)}.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #4a3d27;border-collapse:collapse">${details}</table></div></body></html>`;
  const internalText = Object.entries(data)
    .filter(([key]) => !['form-name', 'bot-field'].includes(key))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  const internal = await sendEmail({
    apiKey,
    senderName,
    senderEmail,
    to: message.reply,
    subject: `New ${message.kicker} enquiry — ${clean(data.company || data.name || email)}`,
    htmlContent: internalHtml,
    textContent: internalText,
    replyTo: email,
  });

  console.log(`[${formName}] Internal notification ${internal.ok ? 'sent' : 'failed'}`, {
    recipient: message.reply,
    status: internal.status,
  });
}

async function processVerifiedSubmission(event) {
  const data = event?.data && typeof event.data === 'object' ? event.data : {};
  const formName = detectFormName(data);
  const email = cleanEmail(data.email);

  console.log('[forms] Verified submission received', {
    formName,
    fields: Object.keys(data),
    hasEmail: Boolean(email),
  });

  if (!email || !email.includes('@')) {
    console.warn('[forms] No valid email address; workflow skipped', { formName });
    return;
  }

  const apiKey = getEnv('BREVO_API_KEY');
  if (!apiKey) {
    console.error('[forms] BREVO_API_KEY is missing');
    return;
  }

  const senderEmail = getEnv('BREVO_SENDER_EMAIL') || 'hello@the-seventh-table.com';
  const senderName = getEnv('BREVO_SENDER_NAME') || 'The Seventh Table';

  if (formName === 'guest-list') {
    await handleGuest({ data, email, apiKey, senderName, senderEmail });
    return;
  }

  await handleBusiness({ formName, data, email, apiKey, senderName, senderEmail });
}

export default {
  async formSubmitted(event) {
    try {
      await processVerifiedSubmission(event);
    } catch (error) {
      console.error('[forms] Unhandled form workflow error', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  },
};
