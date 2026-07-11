/** V14 — Netlify Forms → Brevo CRM, branded welcome and enquiry acknowledgements. */
const brevoHeaders = (apiKey) => ({accept:'application/json','api-key':apiKey,'content-type':'application/json'});
const sendEmail = async ({apiKey,senderName,senderEmail,to,subject,htmlContent,textContent,replyTo}) => {
  const body={sender:{name:senderName,email:senderEmail},to:[{email:to}],subject,htmlContent,textContent};
  if(replyTo) body.replyTo={email:replyTo};
  const r=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:brevoHeaders(apiKey),body:JSON.stringify(body)});
  if(!r.ok) console.error('Brevo email error:',r.status,await r.text());
  return r.ok;
};
const frame=(kicker,title,copy,buttonLabel='Discover The Seventh Table',buttonUrl='https://the-seventh-table.com/')=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#090909;color:#f3f0e8;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#090909;padding:30px 12px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#101010;border:1px solid #4a3d27"><tr><td align="center" style="padding:52px 30px 18px;color:#c7a86d;font-family:Georgia,Times New Roman,serif;font-size:58px">VII</td></tr><tr><td align="center" style="padding:0 30px;color:#c7a86d;font-size:11px;letter-spacing:4px;text-transform:uppercase">${kicker}</td></tr><tr><td align="center" style="padding:24px 34px 8px;color:#f3f0e8;font-family:Georgia,Times New Roman,serif;font-size:42px;line-height:1.1">${title}</td></tr><tr><td align="center" style="padding:18px 48px 8px;color:#b8b0a3;font-size:16px;line-height:1.8">${copy}</td></tr><tr><td align="center" style="padding:28px 30px 24px"><a href="${buttonUrl}" style="display:inline-block;border:1px solid #c7a86d;color:#f3f0e8;text-decoration:none;padding:15px 24px;font-size:11px;letter-spacing:3px;text-transform:uppercase">${buttonLabel}</a></td></tr><tr><td align="center" style="padding:10px 34px 42px;color:#82796a;font-family:Georgia,Times New Roman,serif;font-size:18px">Until the next reservation…</td></tr><tr><td style="border-top:1px solid #2e281e;padding:24px 30px;color:#777067;font-size:11px;line-height:1.7;text-align:center">The Seventh Table · Luxury Dining Soundtracks</td></tr></table></td></tr></table></body></html>`;
export default async (request)=>{
 try{
  const body=await request.json(); const payload=body?.payload||body||{}; const formName=payload?.form_name||payload?.formName; const data=payload?.data||{};
  const email=String(data.email||'').trim().toLowerCase(); if(!email||!email.includes('@')) return new Response('Skipped',{status:200});
  const apiKey=Netlify.env.get('BREVO_API_KEY'); if(!apiKey) return new Response('Configuration missing',{status:200});
  const senderEmail=Netlify.env.get('BREVO_SENDER_EMAIL')||'hello@the-seventh-table.com'; const senderName=Netlify.env.get('BREVO_SENDER_NAME')||'The Seventh Table';
  if(formName==='guest-list'){
    const consent=String(data['marketing-consent']||'').toLowerCase(); if(consent!=='yes') return new Response('Skipped',{status:200});
    const listId=Number(Netlify.env.get('BREVO_LIST_ID')); if(!Number.isInteger(listId)) return new Response('Configuration missing',{status:200});
    const attributes={SOURCE:String(data.source||'website'),CONSENT:'yes',CONSENT_DATE:String(data['submitted-at']||new Date().toISOString())};
    const contact=await fetch('https://api.brevo.com/v3/contacts',{method:'POST',headers:brevoHeaders(apiKey),body:JSON.stringify({email,attributes,listIds:[listId],updateEnabled:true})});
    if(!contact.ok){console.error('Brevo contact error:',contact.status,await contact.text());return new Response('Handled',{status:200});}
    await sendEmail({apiKey,senderName,senderEmail,to:email,subject:'Welcome to The Seventh Table',htmlContent:frame('The Guest List','Your seat is reserved.','Welcome to The Seventh Table. You will receive selected invitations whenever a new Reservation is served.','Explore the Reservations','https://the-seventh-table.com/#reservations'),textContent:'Welcome. Your seat is reserved. You will receive selected invitations whenever a new Reservation is served.'});
    return new Response('OK',{status:200});
  }
  const messages={
    'partner-inquiry':{subject:'Thank you for your interest in The Seventh Table',kicker:'Partnerships',title:'Your request has been received.',copy:'Thank you for reaching out to The Seventh Table. We are delighted by your interest in becoming part of our journey. Your message will be reviewed personally. We carefully select partnerships that reflect quality, authenticity and lasting value. If there is a mutual fit, we will contact you shortly.',reply:'partners@the-seventh-table.com'},
    'press-inquiry':{subject:'Your press enquiry has been received',kicker:'Press Office',title:'Thank you for your enquiry.',copy:'Thank you for contacting The Seventh Table. Your media request has been received and will be reviewed personally. We will respond as soon as possible, taking any stated editorial deadline into account.',reply:'press@the-seventh-table.com'},
    'licensing-inquiry':{subject:'Your licensing request has been received',kicker:'Licensing',title:'Your request is under review.',copy:'Thank you for your interest in licensing music from The Seventh Table. We will review the intended use, rights scope, territories and term, and will contact you with the next steps.',reply:'licensing@the-seventh-table.com'}
  };
  const m=messages[formName]; if(!m) return new Response('Ignored',{status:200});

  // CRM routing: keep business enquiries separate from the public Guest List.
  // Partners use Brevo list #5 by default. The value can be overridden later
  // in Netlify with BREVO_PARTNERS_LIST_ID without changing the code.
  if(formName==='partner-inquiry'){
    const partnersListId=Number(Netlify.env.get('BREVO_PARTNERS_LIST_ID')||'5');
    if(Number.isInteger(partnersListId)){
      const partnerAttributes={
        FIRSTNAME:String(data.name||'').trim(),
        COMPANY:String(data.company||'').trim(),
        SOURCE:'website-partner-form',
        CONSENT:String(data['privacy-consent']||'no'),
        CONSENT_DATE:new Date().toISOString()
      };
      const partnerContact=await fetch('https://api.brevo.com/v3/contacts',{
        method:'POST',headers:brevoHeaders(apiKey),
        body:JSON.stringify({email,attributes:partnerAttributes,listIds:[partnersListId],updateEnabled:true})
      });
      if(!partnerContact.ok) console.error('Brevo partner contact error:',partnerContact.status,await partnerContact.text());
    }
  }

  // 1) Branded acknowledgement to the person/company who submitted the form.
  const contactName=String(data.name||'').trim();
  const companyName=String(data.company||'').trim();
  const greeting=formName==='partner-inquiry'
    ? `${contactName ? `Dear ${contactName},<br><br>` : 'Dear Partner,<br><br>'}Thank you for reaching out on behalf of ${companyName ? `<strong>${companyName}</strong>` : 'your organisation'}.<br><br>${m.copy}`
    : m.copy;
  const textGreeting=formName==='partner-inquiry'
    ? `${contactName ? `Dear ${contactName},\n\n` : 'Dear Partner,\n\n'}Thank you for reaching out on behalf of ${companyName||'your organisation'}.\n\n${m.copy}`
    : m.copy;
  await sendEmail({apiKey,senderName,senderEmail,to:email,subject:m.subject,htmlContent:frame(m.kicker,m.title,greeting,'Discover The Seventh Table','https://the-seventh-table.com/'),textContent:textGreeting,replyTo:m.reply});

  // 2) Internal notification to the correct business alias. This does not depend
  // on a separate Netlify form-notification rule and therefore works immediately.
  const safe = (v='') => String(v).replace(/[<>]/g,'').trim();
  const details = Object.entries(data)
    .filter(([key]) => !['form-name','bot-field'].includes(key))
    .map(([key,value]) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #2e281e;color:#c7a86d;vertical-align:top"><strong>${safe(key)}</strong></td><td style="padding:8px 12px;border-bottom:1px solid #2e281e;color:#f3f0e8;white-space:pre-wrap">${safe(value)}</td></tr>`)
    .join('');
  const internalHtml = `<!doctype html><html><body style="margin:0;background:#090909;color:#f3f0e8;font-family:Arial,Helvetica,sans-serif"><div style="max-width:720px;margin:0 auto;padding:32px"><div style="color:#c7a86d;font-family:Georgia,serif;font-size:44px;text-align:center">VII</div><h1 style="font-family:Georgia,serif;font-weight:400">New ${m.kicker} enquiry</h1><p style="color:#b8b0a3">A new enquiry was submitted through the website. Reply directly to this email to answer ${safe(email)}.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #4a3d27;border-collapse:collapse">${details}</table></div></body></html>`;
  const internalText = Object.entries(data).filter(([key]) => !['form-name','bot-field'].includes(key)).map(([key,value]) => `${key}: ${value}`).join('\n');
  await sendEmail({apiKey,senderName,senderEmail,to:m.reply,subject:`New ${m.kicker} enquiry — ${safe(data.company||data.name||email)}`,htmlContent:internalHtml,textContent:internalText,replyTo:email});

  return new Response('OK',{status:200});
 }catch(e){console.error('V14 form function failed:',e);return new Response('Handled',{status:200});}
};
