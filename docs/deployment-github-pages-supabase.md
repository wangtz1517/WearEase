# GitHub Pages + Supabase Deployment

## 1. Frontend URL

This project is deployed as a GitHub Pages project site:

```text
https://wangtz1517.github.io/WearEase/
```

The static site is published by:

- `.github/workflows/deploy-pages.yml`
- `scripts/build-pages.js`

After pushing to `main`, check:

```text
GitHub repository -> Actions -> Deploy GitHub Pages
```

## 2. Supabase Base Setup

Run the SQL in:

```text
supabase/schema.sql
```

Then configure:

```text
Authentication -> URL Configuration
```

Use:

```text
Site URL:
https://wangtz1517.github.io/WearEase/

Redirect URL:
https://wangtz1517.github.io/WearEase/
```

## 3. Public Frontend Config

Fill `public-config.js` with your public project settings:

```js
window.APP_CONFIG = Object.assign(
  {
    siteUrl: "https://wangtz1517.github.io/WearEase/",
    supabaseUrl: "https://YOUR_PROJECT.supabase.co",
    supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",
    supabaseBucket: "garment-images",
    aiIntakeFunctionName: "ai-intake"
  },
  window.APP_CONFIG || {}
);
```

Notes:

- `supabaseAnonKey` is the public browser key.
- Never put `service_role` into `public-config.js`.
- `aiServiceBaseUrl` is no longer required for the web AI flow.

## 4. Edge Function Secrets

The AI workflow now uses a Supabase Edge Function instead of the local `127.0.0.1` service.

Required secrets are listed in:

```text
supabase/functions/.env.example
```

Minimum production values:

```text
AI_PROVIDER=seedream
VOLCENGINE_API_KEY=...
VOLCENGINE_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
VOLCENGINE_IMAGE_MODEL=doubao-seedream-5-0-260128
GARMENT_IMAGES_BUCKET=garment-images
```

You can set them either in the Supabase dashboard or with the CLI.

Example CLI command:

```bash
supabase secrets set \
  AI_PROVIDER=seedream \
  VOLCENGINE_API_KEY=your_key \
  VOLCENGINE_BASE_URL=https://ark.cn-beijing.volces.com/api/v3 \
  VOLCENGINE_IMAGE_MODEL=doubao-seedream-5-0-260128 \
  GARMENT_IMAGES_BUCKET=garment-images
```

## 5. Edge Function Deployment

Function source:

```text
supabase/functions/ai-intake/index.ts
```

Optional CLI config:

```text
supabase/config.toml
```

The `ai-intake` function is configured with `verify_jwt = false` because the project uses the newer
publishable key format. Auth is still enforced inside the function by validating the `Authorization`
header against Supabase Auth.

Typical deployment flow:

```bash
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy ai-intake
```

This function:

- requires a signed-in Supabase user
- calls the Volcengine image API with server-side secrets
- uploads the generated output image into Supabase Storage
- returns the final public image URL to the browser

## 6. Current AI Behavior

The browser AI studio now works like this:

1. User signs in on the website.
2. `studio/intake-studio.js` invokes `ai-intake`.
3. The function generates the cleaned garment image.
4. The result image is uploaded to `garment-images`.
5. The studio sends the final garment payload back into the wardrobe page.

This means:

- cross-device AI usage is supported after the function is deployed
- your local computer does not need to stay online
- the Volcengine API key stays server-side

## 7. Local Legacy Service

The old local service still exists in:

```text
ai-intake-service/
```

But it is no longer required for GitHub Pages production usage.
