// Meta Pixel — site-wide (mounted in app/layout.tsx via components/
// MetaPixelScript.tsx) for full-funnel attribution, regardless of which
// page/ad-platform a visitor lands on.
declare global {
  interface Window { fbq?: (...args: unknown[]) => void }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ''

const CONSENT_KEY = 'cookie-consent'
// Generic "the visitor changed their cookie choice" broadcast — dispatched
// by components/CookieBanner.tsx (not Meta-specific there on purpose, so
// that component stays a plain consent-preferences UI) and consumed here so
// MetaPixelScript can mount/unmount the moment marketing consent changes,
// without needing a page reload or polling localStorage.
export const CONSENT_UPDATED_EVENT = 'cookie-consent-updated'

// Opt-OUT model: Marketing (and Analytics) consent defaults to GRANTED the
// moment a visitor arrives — no stored preference yet means implied
// consent, not implied refusal. Only an explicit "Reject" in
// components/CookieBanner.tsx writes `marketing: false`, which is the one
// case this returns false. This matches Clarity/gtag's own default-granted
// behavior in app/layout.tsx; unlike those, though, fbq has no live
// consent-mode API to revoke effects after the fact once the base pixel
// has loaded — so this same check is also read at every call site that
// fires a NEW Meta event (trackMetaLead, trackMetaSurveyComplete below),
// so an explicit Reject at least stops further events even though the
// already-loaded pixel itself can't be un-loaded.
export function hasMarketingConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return true
    return JSON.parse(raw)?.marketing !== false
  } catch {
    return true
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
  if (typeof window === 'undefined' || typeof window.fbq !== 'function' || !hasMarketingConsent()) {
    console.warn('[meta-pixel] fbq not loaded or Marketing consent withdrawn — Lead event not sent', { eventId })
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

// Fires once a visitor finishes /survey — a stronger buying-intent signal
// than the initial Lead, so Meta's delivery/optimization can learn to find
// more people who complete it, not just people who start it. No Advanced
// Matching payload: the survey doesn't necessarily know the visitor's name/
// email/phone by this point (some entry paths reach /survey without ever
// going through a LeadForm first), so this only ever carries what the base
// Pixel already picked up (cookies/browser fingerprinting) via trackSingle.
export function trackMetaSurveyComplete() {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function' || !hasMarketingConsent()) {
    console.warn('[meta-pixel] fbq not loaded or Marketing consent withdrawn — CompleteRegistration event not sent')
    return
  }
  window.fbq('trackSingle', META_PIXEL_ID, 'CompleteRegistration')
}
