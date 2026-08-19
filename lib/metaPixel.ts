// Meta Pixel client-side "Lead" event — same shape/intent as lib/gtag.ts's
// Google Ads helpers, for /newwebsite (the Meta-ads-only landing page).
//
// TODO: the Meta Pixel base script isn't installed in app/layout.tsx yet
// (only the Google Ads gtag + MS Clarity <Script> tags are there today).
// Once a real Pixel ID is added — e.g.
//   fbq('init', '<PIXEL_ID>'); fbq('track', 'PageView');
// — window.fbq will exist and this starts actually sending the event; no
// other changes needed here or in the caller (components/LeadForm.tsx).
// Until then this only console.warns so it's obvious in dev/prod logs that
// the Lead event was attempted but had nowhere to go.
declare global {
  interface Window { fbq?: (...args: unknown[]) => void }
}

// eventId must be the SAME id sent to /api/lead's `eventId` field (see
// components/LeadForm.tsx and app/api/lead/route.ts) — Meta dedupes a
// browser-pixel event and a server-side Conversions API event that share
// one event_id into a single Lead instead of double-counting it.
export function trackMetaLead(eventId: string, email?: string) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    console.warn('[meta-pixel] TODO: Meta Pixel base script not installed — Lead event not sent', { eventId })
    return
  }
  window.fbq('track', 'Lead', email ? { em: email } : {}, { eventID: eventId })
}
