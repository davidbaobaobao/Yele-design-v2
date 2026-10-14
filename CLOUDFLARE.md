# Deploying to Cloudflare Workers (OpenNext)

This repo is Cloudflare-ready **and** still deploys to Vercel unchanged. The
Cloudflare-specific bits are either config files Vercel ignores, or gated behind
the `CF_WORKERS` env flag.

## 0. Make the v4 working copy (one time)

```bash
cd /Users/davidbao/Developer/Yele-v3
rsync -a --exclude node_modules --exclude .next --exclude .open-next --exclude .vercel \
  Yele-design-v2/ yele-v4-cf/
cd yele-v4-cf
npm install
```

## 1. What was changed for Cloudflare (already in this repo)

- **Stripe** (`app/api/*checkout*`, `stripe-webhook`, `gracias`): now use
  `Stripe.createFetchHttpClient()`, and the webhook uses
  `constructEventAsync(... createSubtleCryptoProvider())`. Required on Workers;
  harmless on Vercel.
- **Middleware geo** (`middleware.ts`): reads `cf-ipcountry` **or**
  `x-vercel-ip-country`, so EU detection / locale routing works on both hosts.
- **Images** (`next.config.mjs`): `images.unoptimized` is `true` only when
  `CF_WORKERS=1` (Cloudflare build). Vercel keeps full image optimization.
- **Adapter**: `open-next.config.ts`, `wrangler.jsonc`, and the
  `preview:cf` / `deploy:cf` scripts.

## 2. Deploy

```bash
cd yele-v4-cf
npx wrangler login

# Test in the real Workers runtime first:
npm run preview:cf       # builds with CF_WORKERS=1, serves locally on workerd

# Deploy to the *.workers.dev URL:
npm run deploy:cf
```

## 3. Secrets / env vars (Cloudflare)

`NEXT_PUBLIC_*` are build-time — put them in a `.env` file in `yele-v4-cf` so
they're inlined at build. Everything else is a runtime **secret**:

```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put CRON_SECRET
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put SCREENSHOT_API_KEY
# + any others your code reads. List them with:
#   grep -rhoE "process\.env\.[A-Z0-9_]+" app lib components | sort -u
```

`.dev.vars` (same KEY=value format) holds them for local `preview:cf`.

## 4. Cron jobs (Vercel crons do NOT run on Cloudflare)

`vercel.json` crons stop working on Cloudflare. Two options to keep the daily
report + abandoned-survey jobs:

- **Simplest — external cron.** Use a free scheduler (e.g. cron-job.org) to hit
  the endpoints on schedule with the bearer header:
  `GET https://yele.design/api/webpolice/daily-report`
  `GET https://yele.design/api/survey/abandoned`
  Header: `Authorization: Bearer <CRON_SECRET>`.
  (The report has its own 13:00-Madrid guard; schedule it hourly 11:00–12:00 UTC
  or just once at 13:00 Madrid.)
- **Native — Cron Triggers.** Uncomment `triggers.crons` in `wrangler.jsonc` and
  add a `scheduled()` handler that `fetch()`es those routes. OpenNext supports a
  custom worker entry for this; more setup than the external cron.

## 5. Stripe webhook

The webhook endpoint URL is configured in the Stripe dashboard. While testing on
`*.workers.dev`, add a temporary webhook pointing there (or use the Stripe CLI
`stripe listen --forward-to`). Once you point your real domain at Cloudflare, the
existing `https://yele.design/api/stripe-webhook` endpoint keeps working.

## 6. Go-live checklist (test on *.workers.dev BEFORE pointing DNS)

- [ ] Every landing page renders (/, /es, /letsbuild, /es/letsbuild, /es/tutienda, /webpolice …).
- [ ] Lead forms submit → lead email arrives, Meta CAPI fires (if token set).
- [ ] A **Stripe test-mode checkout** completes end-to-end and the webhook marks it paid.
- [ ] `/es` EU visitors get the opt-in cookie banner (geo header working).
- [ ] Web Police captures a screenshot + analysis.
- [ ] OG image (`/opengraph-image`) renders (next/og on Workers — verify).
- [ ] Cron endpoints respond 200 with the bearer header.

Keep the Vercel deployment live as instant rollback until all boxes are ticked,
then switch DNS.
