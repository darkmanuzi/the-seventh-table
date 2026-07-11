# V16 — Direct Forms

- Replaced unreliable form-event/webhook chain with direct browser-to-function calls.
- Added `forms-direct.js` for all four forms.
- Added `netlify/functions/forms-api.mjs`.
- Preserved Netlify Forms archiving as a non-blocking secondary step.
- Added visible client-side failure handling.
- Removed the old guest submit handler to prevent double submission.
