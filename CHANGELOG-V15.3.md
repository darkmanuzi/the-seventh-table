# V15.3 — Existing Function Webhook Fix

- Reuses the Netlify-deployed `submission-created` function.
- Accepts Netlify Form HTTP POST notification payloads.
- Sends branded Guest, Partner, Press, and Licensing acknowledgements through Brevo.
- Adds contacts to the appropriate Brevo lists.
- Sends internal Partner, Press, and Licensing enquiry notifications.
- Produces detailed Netlify function logs.
