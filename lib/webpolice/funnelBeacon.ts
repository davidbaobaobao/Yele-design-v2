// Shared, consent-aware funnel beacon used across pages (webpolice, letsbuild).
// Fire-and-forget via sendBeacon. Opt-OUT model — matches the site-wide Meta
// Pixel (lib/metaPixel.ts hasMarketingConsent): default GRANTED on arrival so
// EU ad traffic that hasn't clicked "Accept" is still counted; only an explicit
// Reject (analytics:false) stops it. Events are first-party and PII-free.

export function funnelBeacon(event: string, page: string, extra?: { locale?: string; tone?: string; url?: string }): void {
  if (typeof window === 'undefined') return
  try {
    try {
      const raw = localStorage.getItem('cookie-consent')
      if (raw && JSON.parse(raw).analytics === false) return
    } catch { /* ignore → allow (opt-out default) */ }

    let sid = ''
    try {
      const k = 'wp_session'
      sid = sessionStorage.getItem(k) || ''
      if (!sid) {
        sid = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^A-Za-z0-9_-]/g, '')
        sessionStorage.setItem(k, sid)
      }
    } catch { /* ignore */ }

    const locale = extra?.locale
      ?? (location.pathname.startsWith('/es') ? 'es' : location.pathname.startsWith('/zh') ? 'zh' : 'en')
    const payload = JSON.stringify({ event, page, locale, sessionId: sid, tone: extra?.tone, url: extra?.url })
    const blob = new Blob([payload], { type: 'application/json' })
    if (!navigator.sendBeacon?.('/api/webpolice/event', blob)) {
      fetch('/api/webpolice/event', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
    }
  } catch { /* best-effort */ }
}
