# Cookie-consent banner analytics

Privacy-first, aggregate-only measurement of how visitors interact with the
cookie-consent modal (`components/CookieBanner.tsx`). The goal is to understand
**consent-banner conversion in aggregate** — not to track or profile people.

## What is measured

Four banner outcomes, each a named event:

| Event        | Fired when                                                            |
|--------------|-----------------------------------------------------------------------|
| `shown`      | The banner is displayed (visitor has no stored choice yet).           |
| `accept`     | The visitor enables any non-essential category (Accept all, or Save with a toggle on). |
| `reject`     | The visitor declines all non-essential (Necessary only / Reject all / Save with everything off). |
| `no_choice`  | The visitor **leaves the page while the banner is still unresolved** (see definition below). |

`accept` / `reject` are measurement only. They do **not** change what consent is
stored, and `reject` is treated exactly like `accept` by the analytics path
(same code, same payload shape). The analytics never gate the visitor's ability
to reject.

## Definition of "no choice"

`no_choice` is **not** counted when the banner appears. It is counted only when
the visitor leaves the page (navigation away, tab/window close, or the page
entering the back/forward cache) **while no Accept/Reject decision has been
made**. The signal used is the `pagehide` event, sent via `navigator.sendBeacon`.

`pagehide` is chosen over `beforeunload` (unreliable, blocks bfcache) and over
`visibilitychange→hidden` (fires on a mere tab switch, which would over-count).
It is the simplest reliable signal that matches "left without choosing". It
fires at most once per page load and only if no decision was made.

## What data is collected

Exactly three fields per event (`lib/consent/consentStats.ts` → `buildConsentPayload`):

```json
{ "event": "accept", "page": "letsbuild", "locale": "es" }
```

- `event` — one of the four names above (allowlisted).
- `page` — a **coarse allowlisted label** (`letsbuild` | `letsbuildnow` |
  `webpolice` | `tutienda` | `other`), derived from the path. Never a raw URL.
- `locale` — `en` | `es` | `zh` | `other`.

These are folded into **aggregate counters** in Postgres: one row per
`(day, page, locale, event)` with a `count`. No per-event records, no row per
visitor.

## What is deliberately NOT collected

- **No cookies** are set by this feature, before or after consent.
- **No persistent visitor identifier** (no UUID, no localStorage/sessionStorage
  id, no advertising id, no fingerprint). Nothing links two events to the same
  person.
- **No IP address is stored.** The API uses the request IP only transiently, as
  a salted SHA-256 hash, as an in-memory rate-limit key for a 60-second window;
  it is never written to the database and never sent anywhere.
- **No names, emails, account ids, precise location, URLs, page content, form
  data, or arbitrary browser data.**

Because there is no identifier, the four counts are **outcomes, not unique
people**. The reports state this explicitly; do not treat `accept` as "unique
users who accepted".

## Where the data lives / retention

- **Storage:** Supabase Postgres, table `public.consent_stats` (Yele Design
  project `wdnwacdkoowrrnyaskjl`), incremented atomically via the
  `bump_consent_stat(day, page, locale, event)` SQL function.
- **Fallback:** if Supabase is not configured, counters are kept in-memory
  per-instance (used in local/dev and tests).
- **Retention:** the table stores only small daily aggregates with no personal
  data, so there is nothing per-person to expire. Prune old daily rows on
  whatever schedule the team prefers (e.g. keep 12–24 months for trend lines).
  There is no individual-event table to retain or minimise.

## Third-party processor

**None.** Events go to our own first-party endpoint (`/api/consent-stats`) and
our own Supabase database. No third-party analytics SDK is loaded for this.

## Endpoints

- `POST /api/consent-stats` — increments a counter. Same-origin only,
  rate-limited, allowlist-validated. Invalid event names → `400`.
- `GET  /api/consent-stats?days=N` — aggregate report (counts + rates),
  protected by `CRON_SECRET` (`Authorization: Bearer <CRON_SECRET>`).
- The daily owner email (`/api/webpolice/daily-report`) includes a **Cookie
  consent** section with yesterday's counts/rates for the four Spanish ad pages
  plus an overall.

Rates use **`banner_shown` as the denominator**:

```
accept_rate    = accepts   / banner_shown
reject_rate    = rejects   / banner_shown
no_choice_rate = no_choice / banner_shown
```

When `banner_shown` is 0, rates are reported as `—` (never a divide-by-zero).

## How to disable

Set the environment variable `CONSENT_STATS_DISABLED=1`. The API then no-ops
(returns `{ ok: true, disabled: true }`) and no counters are written. The client
beacon still posts but is ignored server-side. Remove the variable (or set it to
anything other than `1`) to re-enable.

## Tests

`lib/consent/consentStats.test.ts` (run with `npm test`) covers: the event
allowlist (valid + rejected), page/locale normalisation, minimal payload shape
(only `event`/`page`/`locale`, no id/url/ip), accept↔reject symmetry, the rate
limiter, and the aggregate counters + rate math (denominator = shown, no
divide-by-zero). The `no_choice`/DOM/integration behaviour of the banner itself
is best verified with a browser/e2e check.

## ⚠️ Legal note

This implementation is designed to be **privacy-preserving**, but privacy-
preserving is **not** the same as **legally compliant**. The following points
should be confirmed by the site's privacy/legal team before relying on them,
especially under EU/Spanish (ePrivacy / LSSI / AEPD) rules:

1. Whether firing `shown` / `no_choice` **before** a consent choice is
   acceptable as anonymous, no-identifier, no-cookie aggregate measurement of
   the consent tool itself (commonly argued as permissible, but it is a
   judgement call for your DPO/lawyer).
2. Whether the coarse `page` + `locale` labels are acceptable to you as
   non-personal context.
3. Your chosen retention period for the daily aggregate rows.
4. Disclosure of this measurement in your privacy/cookie policy, if required.
