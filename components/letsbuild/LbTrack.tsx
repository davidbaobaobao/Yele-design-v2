'use client'

import { useEffect, useRef } from 'react'

// Lightweight, consent-aware funnel telemetry for /letsbuild. Fire-and-forget
// via sendBeacon; each step fires at most once per page load. No IP, no PII —
// just an opaque session id, so the daily report can show how far visitors
// scroll. Sent to the shared webpolice event endpoint with page='letsbuild'.
const fired = new Set<string>()

function consentAllows(): boolean {
  // Geo-split — matches the site-wide Meta Pixel (lib/metaPixel.ts
  // hasMarketingConsent). An explicit stored choice always wins; with none
  // yet, allow only for detected non-EU visitors (yele_eu=0, set by
  // middleware). EU/unknown wait for an explicit Accept in the cookie panel
  // (prior opt-in). Events are first-party and PII-free (opaque session id,
  // no IP).
  try {
    const raw = localStorage.getItem('cookie-consent')
    if (raw) return JSON.parse(raw).analytics !== false
    return document.cookie.split('; ').some(c => c === 'yele_eu=0')
  } catch { return false }
}

function sessionId(): string {
  try {
    const k = 'wp_session'
    let v = sessionStorage.getItem(k)
    if (!v) {
      v = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^A-Za-z0-9_-]/g, '')
      sessionStorage.setItem(k, v)
    }
    return v
  } catch { return '' }
}

function beacon(event: string, page: string) {
  try {
    if (fired.has(page + event)) return
    fired.add(page + event)
    if (!consentAllows()) return
    const locale = document.location.pathname.startsWith('/es') ? 'es' : document.location.pathname.startsWith('/zh') ? 'zh' : 'en'
    const payload = JSON.stringify({ event, page, locale, sessionId: sessionId() })
    const blob = new Blob([payload], { type: 'application/json' })
    if (!navigator.sendBeacon?.('/api/webpolice/event', blob)) {
      fetch('/api/webpolice/event', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
    }
  } catch { /* best-effort */ }
}

/** Fires `lb_hero` on mount (visitor loaded the page). */
export function LbHeroPing({ page = 'letsbuild' }: { page?: string }) {
  useEffect(() => { beacon('lb_hero', page) }, [page])
  return null
}

/** Invisible sentinel that fires `event` the first time it scrolls into view. */
export function LbSeen({ event, page = 'letsbuild' }: { event: string; page?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { beacon(event, page); io.disconnect() }
    }, { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [event, page])
  return <div ref={ref} aria-hidden="true" className="h-px w-full" />
}
