# V15.2 — Reliable Form Webhook

- Replaced the non-firing form event subscriber with a normal Netlify Function endpoint.
- Added robust parsing for Netlify HTTP POST form notification payloads.
- Restored branded Guest, Partner, Press and Licensing replies.
- Preserved Brevo CRM list routing.
- Added detailed function logs and explicit HTTP error responses.
- Disabled the previous event function to prevent future duplicate emails.
