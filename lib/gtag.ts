// Shared Google Ads conversion helpers. Same typed-gtag pattern as
// onboarding_form_submit/sign_up in app/empezar/page.tsx; conversions used
// across more than one file (unlike those two) live here instead.
declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

const BOOKCALL_CONVERSION_SEND_TO = 'AW-18281072925/VbuFCOimp94cEJ2SjI1E'

// PRIMARY conversion — a confirmed call booking, never a mere click/intent
// to book. email is best-effort for Enhanced Conversions matching, not
// required to fire. Shared by both booking paths — the Cal.com embed on
// app/schedule and the Yelebot chatbot's bookCall tool
// (components/YelebotWidget.tsx) — so book_call reports as one conversion
// action regardless of which path a visitor used.
export function trackBookCall(email?: string) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  if (email) window.gtag('set', 'user_data', { email })
  window.gtag('event', 'conversion', { send_to: BOOKCALL_CONVERSION_SEND_TO })
}

const CONTACT_CONVERSION_SEND_TO = 'AW-18281072925/INLiCIfUrN4cEJ2SjI1E'

// SECONDARY conversion — a confirmed contact-form submit (components/
// ContactForm.tsx, the #contacto section's own form — distinct from the
// /empezar onboarding form's onboarding_form_submit). email is the address
// the visitor entered, for Enhanced Conversions matching.
export function trackContactFormSubmit(email?: string) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  if (email) window.gtag('set', 'user_data', { email })
  window.gtag('event', 'conversion', { send_to: CONTACT_CONVERSION_SEND_TO })
}
