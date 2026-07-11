/**
 * Scheduled social campaign bridge.
 * Sends one prepared daily post to a Make, Zapier, Buffer or Metricool webhook.
 * Required environment variable: SOCIAL_WEBHOOK_URL
 * Optional: SOCIAL_WEBHOOK_SECRET
 */
export default async () => {
  const webhookUrl = Netlify.env.get('SOCIAL_WEBHOOK_URL');
  if (!webhookUrl) {
    console.log('Social campaign skipped: SOCIAL_WEBHOOK_URL is not set.');
    return new Response('Not configured', { status: 200 });
  }

  const day = new Date().getUTCDay();
  const posts = {
    0: { theme:'Sunday atmosphere', text:'Dim the lights. Pour a glass. Your table is ready. Discover The Seventh Table.', url:'https://the-seventh-table.com/?utm_source=automation&utm_medium=social&utm_campaign=evergreen&utm_content=sunday' },
    1: { theme:'Monday destination', text:'Every Reservation is a destination. Where will your table take you next?', url:'https://the-seventh-table.com/#reservations?utm_source=automation&utm_medium=social&utm_campaign=evergreen&utm_content=monday' },
    2: { theme:'Tuesday story', text:'Music should not dominate a room. It should define its soul.', url:'https://the-seventh-table.com/#journey?utm_source=automation&utm_medium=social&utm_campaign=evergreen&utm_content=tuesday' },
    3: { theme:'Wednesday guest list', text:'A private invitation awaits. Reserve your seat at The Seventh Table.', url:'https://the-seventh-table.com/#guest-list?utm_source=automation&utm_medium=social&utm_campaign=evergreen&utm_content=wednesday' },
    4: { theme:'Thursday hospitality', text:'Created for restaurants, hotels, lounges and unforgettable evenings.', url:'https://the-seventh-table.com/licensing.html?utm_source=automation&utm_medium=social&utm_campaign=evergreen&utm_content=thursday' },
    5: { theme:'Friday evening', text:'Friday evening has a soundtrack. Welcome to The Seventh Table.', url:'https://the-seventh-table.com/?utm_source=automation&utm_medium=social&utm_campaign=evergreen&utm_content=friday' },
    6: { theme:'Saturday invitation', text:'Tonight, take a seat somewhere unforgettable.', url:'https://the-seventh-table.com/#reservations?utm_source=automation&utm_medium=social&utm_campaign=evergreen&utm_content=saturday' }
  };
  const post = posts[day];
  const secret = Netlify.env.get('SOCIAL_WEBHOOK_SECRET');
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(secret ? { 'x-social-secret': secret } : {})
    },
    body: JSON.stringify({
      brand: 'The Seventh Table',
      campaign: 'evergreen-launch',
      scheduledAt: new Date().toISOString(),
      ...post
    })
  });
  if (!response.ok) {
    console.error('Social webhook failed:', response.status, await response.text());
    return new Response('Webhook error handled', { status: 200 });
  }
  console.log('Daily social campaign payload delivered.');
  return new Response('OK', { status: 200 });
};

export const config = { schedule: '0 10 * * *' };
