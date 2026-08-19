// Meta Pixel — installed on /newwebsite ONLY (see components/MetaPixelScript.tsx
// and app/newwebsite/page.tsx), not site-wide: Google's own gtag already
// covers every other page (app/layout.tsx), and /newwebsite is explicitly
// Meta-exclusive traffic that must never count toward Google Ads.
declare global {
  interface Window { fbq?: (...args: unknown[]) => void }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ''

const CONSENT_KEY = 'cookie-consent'
// Generic "the visitor changed their cookie choice" broadcast — dispatched
// by components/CookieBanner.tsx (not Meta-specific there on purpose, so
// that component stays a plain consent-preferences UI) and consumed here so
// MetaPixelScript can mount the moment marketing consent is granted, without
// needing a page reload or polling localStorage.
export const CONSENT_UPDATED_EVENT = 'cookie-consent-updated'

// Meta Pixel is a marketing/advertising cookie in this site's own consent
// taxonomy (components/CookieBanner.tsx's Essential/Analytics/Marketing
// split) — distinct from "Analytics", and gated more conservatively than
// Google Ads/Clarity's implied-consent-by-default pattern in app/layout.tsx
// since fbq has no live consent-mode API to revoke effects after the fact
// once loaded.
export function hasMarketingConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return false
    return JSON.parse(raw)?.marketing === true
  } catch {
    return false
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

// Meta's own first-party click/browser-id cookies, set automatically once
// the Pixel script has loaded — forwarded to /api/lead so the server-side
// Conversions API event carries them too (see app/api/lead/route.ts).
export function getMetaCookies(): { fbc?: string; fbp?: string } {
  return { fbc: readCookie('_fbc'), fbp: readCookie('_fbp') }
}

// Fires the "Lead" event scoped to just this one pixel (trackSingle, not
// track — deliberate in case a second, site-wide pixel is ever installed
// later, so this call can never double-fire on it) plus manual Advanced
// Matching: re-initializing with whatever user data we have right before
// firing is Meta's own documented pattern for attaching Advanced Matching
// data that wasn't known yet at the page's initial fbq('init', ...) call
// (see MetaPixelScript.tsx, which fires that first init with no user data
// since nobody's filled the form yet at that point). Meta's SDK hashes
// em/ph/fn itself client-side, so these are passed as plain (trimmed/
// lowercased) text, not pre-hashed — only the server-side CAPI call in
// app/api/lead/route.ts needs to hash manually.
export function trackMetaLead(eventId: string, user: { email?: string; phone?: string; name?: string }) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    console.warn('[meta-pixel] fbq not loaded (consent not granted yet, or Pixel blocked) — Lead event not sent', { eventId })
    return
  }
  const em = user.email?.trim().toLowerCase()
  const ph = user.phone?.replace(/\D/g, '')
  const fn = user.name?.trim().split(/\s+/)[0]?.toLowerCase()

  const advancedMatching: Record<string, string> = {}
  if (em) advancedMatching.em = em
  if (ph) advancedMatching.ph = ph
  if (fn) advancedMatching.fn = fn
  if (Object.keys(advancedMatching).length > 0) {
    window.fbq('init', META_PIXEL_ID, advancedMatching)
  }

  window.fbq('trackSingle', META_PIXEL_ID, 'Lead', {}, { eventID: eventId })
}
