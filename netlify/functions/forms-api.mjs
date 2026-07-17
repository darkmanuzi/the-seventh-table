/**
 * V16 — Direct form API → Brevo CRM + branded email.
 * Called by forms-direct.js. No Netlify form notification/webhook required.
 */
const clean = (value = '') => String(value ?? '').trim();
const cleanEmail = (value = '') => clean(value).toLowerCase();
const escapeHtml = (value = '') => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const env = (name) => process.env[name] || globalThis.Netlify?.env?.get?.(name) || '';

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};
const response = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

const brevoHeaders = (apiKey) => ({
  accept: 'application/json',
  'api-key': apiKey,
  'content-type': 'application/json',
});

async function brevoRequest({ apiKey, path, method = 'POST', body }) {
  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    method,
    headers: brevoHeaders(apiKey),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) console.error('[Brevo] request failed', { path, status: res.status, body: text });
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch {}
  return { ok: res.ok, status: res.status, text, json, messageId: json?.messageId || json?.messageIds?.[0] || '' };
}

async function sendEmail({ apiKey, senderName, senderEmail, to, subject, htmlContent, textContent, replyTo, tags = [] }) {
  const body = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent,
    textContent,
    ...(tags.length ? { tags } : {}),
  };
  if (replyTo) body.replyTo = { email: replyTo };
  return brevoRequest({ apiKey, path: '/smtp/email', body });
}

async function upsertContact({ apiKey, email, listId, attributes = {} }) {
  if (!Number.isInteger(listId) || listId < 1) return { ok: false, status: 0, text: 'Invalid list ID' };
  // Only send non-empty attributes. Brevo may reject attributes that do not
  // exist in the account; contact failure must not block transactional mail.
  const cleanedAttributes = Object.fromEntries(
    Object.entries(attributes).filter(([, value]) => clean(value) !== ''),
  );
  return brevoRequest({
    apiKey,
    path: '/contacts',
    body: { email, listIds: [listId], updateEnabled: true, ...(Object.keys(cleanedAttributes).length ? { attributes: cleanedAttributes } : {}) },
  });
}

const frame = (kicker, title, copy, buttonLabel = 'Discover The Seventh Table', buttonUrl = 'https://the-seventh-table.com/', language = 'en', footer = 'Until the next reservation…') => `<!doctype html>
<html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#090909;color:#f3f0e8;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#090909;padding:30px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#101010;border:1px solid #4a3d27">
<tr><td align="center" style="padding:52px 30px 18px;color:#c7a86d;font-family:Georgia,'Times New Roman',serif;font-size:58px">VII</td></tr>
<tr><td align="center" style="padding:0 30px;color:#c7a86d;font-size:11px;letter-spacing:4px;text-transform:uppercase">${kicker}</td></tr>
<tr><td align="center" style="padding:24px 34px 8px;color:#f3f0e8;font-family:Georgia,'Times New Roman',serif;font-size:42px;line-height:1.1">${title}</td></tr>
<tr><td align="center" style="padding:18px 48px 8px;color:#b8b0a3;font-size:16px;line-height:1.8">${copy}</td></tr>
<tr><td align="center" style="padding:28px 30px 24px"><a href="${buttonUrl}" style="display:inline-block;border:1px solid #c7a86d;color:#f3f0e8;text-decoration:none;padding:15px 24px;font-size:11px;letter-spacing:3px;text-transform:uppercase">${buttonLabel}</a></td></tr>
<tr><td align="center" style="padding:10px 34px 42px;color:#82796a;font-family:Georgia,'Times New Roman',serif;font-size:18px">${footer}</td></tr>
<tr><td style="border-top:1px solid #2e281e;padding:24px 30px;color:#777067;font-size:11px;line-height:1.7;text-align:center">The Seventh Table · Luxury Dining Soundtracks</td></tr>
</table></td></tr></table></body></html>`;


const GUEST_I18N = {
  en: {
    subject: 'Your seat is reserved — The Seventh Table',
    kicker: 'The Guest List', title: 'Your seat is reserved.',
    copy: 'Welcome to The Seventh Table. You will receive selected invitations whenever a new Reservation is served.',
    button: 'Explore the Reservations', footer: 'Until the next reservation…'
  },
  de: {
    subject: 'Ihr Platz ist reserviert — The Seventh Table',
    kicker: 'Die Gästeliste', title: 'Ihr Platz ist reserviert.',
    copy: 'Willkommen bei The Seventh Table. Sie erhalten ausgewählte Einladungen, sobald eine neue Reservation serviert wird.',
    button: 'Reservations entdecken', footer: 'Bis zur nächsten Reservation …'
  },
  fr: {
    subject: 'Votre place est réservée — The Seventh Table',
    kicker: 'La liste des invités', title: 'Votre place est réservée.',
    copy: 'Bienvenue chez The Seventh Table. Vous recevrez des invitations sélectionnées chaque fois qu’une nouvelle Reservation sera servie.',
    button: 'Découvrir les Reservations', footer: 'Jusqu’à la prochaine Reservation…'
  },
  es: {
    subject: 'Su lugar está reservado — The Seventh Table',
    kicker: 'La lista de invitados', title: 'Su lugar está reservado.',
    copy: 'Le damos la bienvenida a The Seventh Table. Recibirá invitaciones seleccionadas cada vez que se sirva una nueva Reservation.',
    button: 'Descubrir las Reservations', footer: 'Hasta la próxima Reservation…'
  }
};

const PARTNER_I18N = {
  en: {
    subject: 'Partnership request received — The Seventh Table',
    kicker: 'Partnerships',
    title: 'Your request has been received.',
    copy: 'Thank you for reaching out to The Seventh Table. We are delighted by your interest in becoming part of our journey. Your message will be reviewed personally. We carefully select partnerships that reflect quality, authenticity and lasting value. If there is a mutual fit, we will contact you shortly.',
    dearName: (name) => `Dear ${name},`,
    dearPartner: 'Dear Partner,',
    behalf: (company) => `Thank you for reaching out on behalf of <strong>${company}</strong>.`,
    thanks: 'Thank you for reaching out.',
    button: 'Discover The Seventh Table',
    footer: 'Until the next reservation…'
  },
  de: {
    subject: 'Ihre Partnerschaftsanfrage ist eingegangen — The Seventh Table',
    kicker: 'Partnerschaften',
    title: 'Ihre Anfrage ist eingegangen.',
    copy: 'Vielen Dank für Ihr Interesse an The Seventh Table. Wir freuen uns, dass Sie Teil unserer Reise werden möchten. Ihre Nachricht wird persönlich geprüft. Wir wählen Partnerschaften sorgfältig nach Qualität, Authentizität und langfristigem Wert aus. Wenn eine gemeinsame Passung besteht, melden wir uns zeitnah bei Ihnen.',
    dearName: (name) => `Sehr geehrte/r ${name},`,
    dearPartner: 'Sehr geehrte Damen und Herren,',
    behalf: (company) => `vielen Dank für Ihre Anfrage im Namen von <strong>${company}</strong>.`,
    thanks: 'vielen Dank für Ihre Anfrage.',
    button: 'The Seventh Table entdecken',
    footer: 'Bis zur nächsten Reservation …'
  },
  fr: {
    subject: 'Votre demande de partenariat a bien été reçue — The Seventh Table',
    kicker: 'Partenariats',
    title: 'Votre demande a bien été reçue.',
    copy: 'Merci de votre intérêt pour The Seventh Table. Nous sommes heureux que vous souhaitiez prendre part à notre aventure. Votre message sera examiné personnellement. Nous sélectionnons avec soin les partenariats fondés sur la qualité, l’authenticité et la valeur à long terme. Si nos visions se rejoignent, nous vous contacterons prochainement.',
    dearName: (name) => `Bonjour ${name},`,
    dearPartner: 'Bonjour,',
    behalf: (company) => `merci de nous avoir contactés au nom de <strong>${company}</strong>.`,
    thanks: 'merci de nous avoir contactés.',
    button: 'Découvrir The Seventh Table',
    footer: 'Jusqu’à la prochaine Réservation…'
  },
  es: {
    subject: 'Hemos recibido su solicitud de colaboración — The Seventh Table',
    kicker: 'Colaboraciones',
    title: 'Hemos recibido su solicitud.',
    copy: 'Gracias por su interés en The Seventh Table. Nos alegra que desee formar parte de nuestro viaje. Su mensaje será revisado personalmente. Seleccionamos cuidadosamente colaboraciones que reflejen calidad, autenticidad y valor a largo plazo. Si existe afinidad mutua, nos pondremos en contacto con usted próximamente.',
    dearName: (name) => `Estimado/a ${name},`,
    dearPartner: 'Estimados señores:',
    behalf: (company) => `gracias por ponerse en contacto con nosotros en nombre de <strong>${company}</strong>.`,
    thanks: 'gracias por ponerse en contacto con nosotros.',
    button: 'Descubrir The Seventh Table',
    footer: 'Hasta la próxima Reserva…'
  }
};

function normalizeLanguage(value) {
  const language = clean(value).toLowerCase().slice(0, 2);
  return ['de', 'en', 'fr', 'es'].includes(language) ? language : 'en';
}

function detailsTable(data) {
  return Object.entries(data)
    .filter(([key]) => !['formName', 'form-name', 'bot-field'].includes(key))
    .map(([key, value]) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #2e281e;color:#c7a86d;vertical-align:top"><strong>${escapeHtml(key)}</strong></td><td style="padding:8px 12px;border-bottom:1px solid #2e281e;color:#f3f0e8;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`)
    .join('');
}

async function guestWorkflow({ data, email, apiKey, senderName, senderEmail }) {
  if (clean(data['marketing-consent']).toLowerCase() !== 'yes') throw new Error('Marketing consent is required');

  const language = normalizeLanguage(data.language);
  const guestText = GUEST_I18N[language];
  const mail = await sendEmail({
    apiKey, senderName, senderEmail, to: email,
    subject: guestText.subject,
    htmlContent: frame(guestText.kicker, guestText.title, guestText.copy, guestText.button, 'https://the-seventh-table.com/#reservations', language, guestText.footer),
    textContent: `${guestText.title}

${guestText.copy}`,
    tags: ['guest-list-confirmation'],
  });
  if (!mail.ok) throw new Error(`Brevo welcome email failed (${mail.status})`);

  const contact = await upsertContact({
    apiKey,
    email,
    listId: Number(env('BREVO_LIST_ID')),
    // Avoid custom attributes here: unknown Brevo attributes can reject the contact.
  });
  console.log('[forms-api] Guest completed', { email, emailStatus: mail.status, emailMessageId: mail.messageId, contactStatus: contact.status });
}

async function businessWorkflow({ formName, data, email, apiKey, senderName, senderEmail }) {
  const language = normalizeLanguage(data.language);
  const partnerText = PARTNER_I18N[language];
  const config = {
    'partner-inquiry': {
      subject: partnerText.subject, kicker: partnerText.kicker, title: partnerText.title,
      copy: partnerText.copy,
      inbox: 'partners@the-seventh-table.com', listId: Number(env('BREVO_PARTNERS_LIST_ID') || '5'),
    },
    'press-inquiry': {
      subject: 'Your press enquiry has been received', kicker: 'Press Office', title: 'Thank you for your enquiry.',
      copy: 'Thank you for contacting The Seventh Table. Your media request has been received and will be reviewed personally. We will respond as soon as possible, taking any stated editorial deadline into account.',
      inbox: 'press@the-seventh-table.com',
    },
    'licensing-inquiry': {
      subject: 'Your licensing request has been received', kicker: 'Licensing', title: 'Your request is under review.',
      copy: 'Thank you for your interest in licensing music from The Seventh Table. We will review the intended use, rights scope, territories and term, and will contact you with the next steps.',
      inbox: 'licensing@the-seventh-table.com',
    },
  }[formName];
  if (!config) throw new Error(`Unsupported form: ${formName}`);

  const name = clean(data.name);
  const company = clean(data.company);
  const greeting = formName === 'partner-inquiry'
    ? `${name ? partnerText.dearName(escapeHtml(name)) : partnerText.dearPartner}<br><br>${company ? partnerText.behalf(escapeHtml(company)) : partnerText.thanks}<br><br>${config.copy}`
    : config.copy;

  const confirmation = await sendEmail({
    apiKey, senderName, senderEmail, to: email, subject: config.subject,
    htmlContent: frame(config.kicker, config.title, greeting, formName === 'partner-inquiry' ? partnerText.button : 'Discover The Seventh Table', 'https://the-seventh-table.com/', language, formName === 'partner-inquiry' ? partnerText.footer : 'Until the next reservation…'),
    textContent: `${name ? `${formName === 'partner-inquiry' ? partnerText.dearName(name) : `Dear ${name},`}\n\n` : ''}${config.copy}`,
    replyTo: config.inbox,
    tags: [`${formName}-confirmation`],
  });
  if (!confirmation.ok) throw new Error(`Brevo confirmation email failed (${confirmation.status})`);

  const internal = await sendEmail({
    apiKey, senderName, senderEmail, to: config.inbox,
    subject: `New ${config.kicker} enquiry — ${company || name || email}`,
    htmlContent: `<!doctype html><html><body style="margin:0;background:#090909;color:#f3f0e8;font-family:Arial,Helvetica,sans-serif"><div style="max-width:720px;margin:0 auto;padding:32px"><div style="color:#c7a86d;font-family:Georgia,serif;font-size:44px;text-align:center">VII</div><h1 style="font-family:Georgia,serif;font-weight:400">New ${config.kicker} enquiry</h1><p style="color:#b8b0a3">Reply directly to this email to answer ${escapeHtml(email)}.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #4a3d27;border-collapse:collapse">${detailsTable(data)}</table></div></body></html>`,
    textContent: Object.entries(data).filter(([key]) => !['formName','form-name','bot-field'].includes(key)).map(([key,value]) => `${key}: ${value}`).join('\n'),
    replyTo: email,
    tags: [`${formName}-internal`],
  });
  if (!internal.ok) throw new Error(`Brevo internal email failed (${internal.status})`);

  if (config.listId) {
    const contact = await upsertContact({ apiKey, email, listId: config.listId });
    console.log('[forms-api] Partner CRM result', { email, status: contact.status });
  }
  console.log('[forms-api] Business completed', { formName, email, confirmationStatus: confirmation.status, confirmationMessageId: confirmation.messageId, internalStatus: internal.status, internalMessageId: internal.messageId });
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return response(405, { ok: false, message: 'Method not allowed' });
  try {
    const data = JSON.parse(event.body || '{}');
    const formName = clean(data.formName || data['form-name']);
    const email = cleanEmail(data.email);
    if (clean(data['bot-field'])) return response(200, { ok: true });
    if (!email || !email.includes('@')) return response(400, { ok: false, message: 'A valid email address is required.' });

    const apiKey = env('BREVO_API_KEY');
    if (!apiKey) throw new Error('BREVO_API_KEY is missing');
    const senderName = env('BREVO_SENDER_NAME') || 'The Seventh Table';
    const senderEmail = env('BREVO_SENDER_EMAIL') || 'hello@the-seventh-table.com';

    console.log('[forms-api] Received', { formName, email, fields: Object.keys(data) });
    if (formName === 'guest-list') await guestWorkflow({ data, email, apiKey, senderName, senderEmail });
    else await businessWorkflow({ formName, data, email, apiKey, senderName, senderEmail });

    return response(200, { ok: true });
  } catch (error) {
    console.error('[forms-api] Failed', { message: error?.message || String(error), stack: error?.stack });
    return response(500, { ok: false, message: 'The request could not be completed.' });
  }
}
