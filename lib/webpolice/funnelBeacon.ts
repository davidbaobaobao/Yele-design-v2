// Shared, consent-aware funnel beacon used across pages (webpolice, letsbuild).
// Fire-and-forget via sendBeacon; respects the cookie-consent choice the same
// way the rest of the funnel does (reject → never; EU undecided → don't send).

export function funnelBeacon(event: string, page: string, extra?: { locale?: string; tone?: string; url?: string }): void {
  if (typeof window === 'undefined') return
  try {
    let consent: 'accept' | 'reject' | 'none' = 'none'
    try {
      const raw = localStorage.getItem('cookie-consent')
      if (raw) consent = JSON.parse(raw).analytics ? 'accept' : 'reject'
    } catch { /* ignore */ }
    if (consent === 'reject') return
    let eu = true
    try { eu = !document.cookie.split('; ').some(c => c === 'yele_eu=0') } catch { /* ignore */ }
    if (eu && consent !== 'accept') return

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
