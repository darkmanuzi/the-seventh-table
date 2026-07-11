THE SEVENTH TABLE — VERSION 11

WHAT IS NEW
- “Now serving” status bar
- Elegant countdown to 13 July 2026
- Countdown automatically changes to “Now serving” after launch
- Smooth internal page transitions
- Improved Open Graph and X/Twitter sharing metadata
- Refined Guest List trust message and loading behavior
- Existing Netlify Forms, honeypot protection and thank-you page retained
- Automatic welcome-email function retained

DEPLOYMENT
Upload the CONTENTS of this folder to Netlify, or deploy the complete folder through your existing workflow.

COUNTDOWN DATE
To change the date, open index.html and edit:
data-release="2026-07-13T00:00:00+02:00"

WELCOME EMAIL
See SETUP-WELCOME-EMAIL.txt. A paid Netlify plan does not itself provide outbound newsletter email delivery; the included function uses Resend after the two environment variables are configured.
