# Signature R2 streaming

The private Cloudflare R2 bucket is connected only from Netlify Functions. Audio files must never be committed to GitHub or copied into the Netlify publish directory.

## Required production variables

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_ENDPOINT`

## Object layout

Upload Signature audio with stable, URL-safe object keys:

```text
signatures/filipe-silva/arrival-sunset/01-canapes-by-the-sea.mp3
signatures/filipe-silva/dinner/01-example.mp3
signatures/filipe-silva/dessert-after-dinner/01-example.mp3
```

## Access model

The `signature-stream` function requires an authenticated Netlify Identity user. It checks the user's `app_metadata.roles` before issuing a two-minute signed R2 URL.

Initial role mapping:

```text
signature-filipe-silva -> signatures/filipe-silva/
```

Never expose the function without authentication and role enforcement. Public bucket access, an `r2.dev` URL, and a public custom domain must remain disabled.
