// Shared, consent-aware funnel beacon used across pages (webpolice, letsbuild).
// Fire-and-forget via sendBeacon. Geo-split consent (matches the Meta Pixel):
// an explicit stored choice wins; with none yet, it sends only for detected
// non-EU visitors (yele_eu=0) — EU/unknown wait for an explicit Accept.

// Geo-split: explicit stored choice wins; with none yet, allow only for
// detected non-EU visitors (yele_eu=0). EU/unknown wait for an explicit Accept.
function funnelConsentAllows(): boolean {
  try {
    const raw = localStorage.getItem('cookie-consent')
    if (raw) return JSON.parse(raw).analytics !== false
    return document.cookie.split('; ').some(c => c === 'yele_eu=0')
  } catch {
    return false
  }
}

export function funnelBeacon(event: string, page: string, extra?: { locale?: string; tone?: string; url?: string }): void {
  if (typeof window === 'undefined') return
  try {
    if (!funnelConsentAllows()) return

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
