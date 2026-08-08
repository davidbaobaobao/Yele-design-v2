// Shared by both booking paths — the Cal.com embed on app/schedule and the
// Yelebot chatbot's bookCall tool (components/YelebotWidget.tsx) — so
// "book_call" reports as one conversion action regardless of which path a
// visitor used. Same typed-gtag pattern as the other conversions
// (onboarding_form_submit, sign_up in app/empezar/page.tsx).
declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

const BOOKCALL_CONVERSION_SEND_TO = 'AW-18281072925/VbuFCOimp94cEJ2SjI1E'

// PRIMARY conversion — a confirmed call booking, never a mere click/intent
// to book. email is best-effort for Enhanced Conversions matching, not
// required to fire.
export function trackBookCall(email?: string) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  if (email) window.gtag('set', 'user_data', { email })
  window.gtag('event', 'conversion', { send_to: BOOKCALL_CONVERSION_SEND_TO })
}
