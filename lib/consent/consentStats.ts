// Privacy-first cookie-consent banner analytics — pure helpers (no I/O, no
// deps) so they can be unit-tested and reused by both the API route and the
// client beacon. See docs/consent-analytics.md for the privacy rationale.

// The four banner outcomes. These are the ONLY event names accepted.
export const CONSENT_EVENTS = ['shown', 'accept', 'reject', 'no_choice'] as const
export type ConsentEvent = (typeof CONSENT_EVENTS)[number]

// Coarse page label — an allowlist, never a raw URL (which could carry query
// params / personal data). Anything unrecognised collapses to 'other'.
export const CONSENT_PAGES = ['letsbuild', 'letsbuildnow', 'webpolice', 'tutienda', 'other'] as const
export type ConsentPage = (typeof CONSENT_PAGES)[number]

export const CONSENT_LOCALES = ['en', 'es', 'zh', 'other'] as const
export type ConsentLocale = (typeof CONSENT_LOCALES)[number]

const EVENT_SET = new Set<string>(CONSENT_EVENTS)
const PAGE_SET = new Set<string>(CONSENT_PAGES)
const LOCALE_SET = new Set<string>(CONSENT_LOCALES)

/** Validate an event name against the allowlist. Returns null if invalid. */
export function normEvent(v: unknown): ConsentEvent | null {
  return typeof v === 'string' && EVENT_SET.has(v) ? (v as ConsentEvent) : null
}

/** Normalise a page label to the allowlist; unknown → 'other'. */
export function normPage(v: unknown): ConsentPage {
  return typeof v === 'string' && PAGE_SET.has(v) ? (v as ConsentPage) : 'other'
}

/** Normalise a locale to the allowlist; unknown → 'other'. */
export function normLocale(v: unknown): ConsentLocale {
  return typeof v === 'string' && LOCALE_SET.has(v) ? (v as ConsentLocale) : 'other'
}

/** Derive the coarse page label from a pathname (client-side helper). Checks
 *  letsbuildnow before letsbuild since the former contains the latter. */
export function pageFromPath(pathname: string): ConsentPage {
  if (pathname.includes('letsbuildnow')) return 'letsbuildnow'
  if (pathname.includes('letsbuild')) return 'letsbuild'
  if (pathname.includes('tutienda')) return 'tutienda'
  if (pathname.includes('webpolice')) return 'webpolice'
  return 'other'
}

export function localeFromPath(pathname: string): ConsentLocale {
  if (pathname.startsWith('/es')) return 'es'
  if (pathname.startsWith('/zh')) return 'zh'
  return 'en'
}

/** The MINIMAL payload sent by the client — exactly these three keys, nothing
 *  else (no ids, no url, no browser data). Returns null for invalid events so
 *  callers never send junk. */
export function buildConsentPayload(
  event: unknown,
  page: unknown,
  locale: unknown,
): { event: ConsentEvent; page: ConsentPage; locale: ConsentLocale } | null {
  const ev = normEvent(event)
  if (!ev) return null
  return { event: ev, page: normPage(page), locale: normLocale(locale) }
}

// ── Rate limiting (no persistent visitor tracking) ───────────────────────────
// A fixed-window counter keyed by whatever ephemeral key the caller supplies
// (we use a per-request hash of the IP that is NEVER stored). State lives only
// in memory for the duration of the window and is pruned, so nothing about a
// visitor persists. Best-effort on serverless (per-instance) — documented.
export function createRateLimiter(opts: { windowMs: number; max: number }) {
  const hits = new Map<string, { count: number; reset: number }>()
  return {
    allow(key: string, now: number = Date.now()): boolean {
      const cur = hits.get(key)
      if (!cur || now >= cur.reset) {
        hits.set(key, { count: 1, reset: now + opts.windowMs })
        // Opportunistic prune so the map can't grow unbounded.
        if (hits.size > 5000) {
          hits.forEach((v, k) => { if (now >= v.reset) hits.delete(k) })
        }
        return true
      }
      if (cur.count >= opts.max) return false
      cur.count++
      return true
    },
    _size() { return hits.size },
  }
}
