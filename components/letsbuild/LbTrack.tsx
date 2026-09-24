'use client'

import { useEffect, useRef } from 'react'

// Lightweight, consent-aware funnel telemetry for /letsbuild. Fire-and-forget
// via sendBeacon; each step fires at most once per page load. No IP, no PII —
// just an opaque session id, so the daily report can show how far visitors
// scroll. Sent to the shared webpolice event endpoint with page='letsbuild'.
const fired = new Set<string>()

function consentAllows(): boolean {
  try {
    const raw = localStorage.getItem('cookie-consent')
    const consent = raw ? (JSON.parse(raw).analytics ? 'accept' : 'reject') : 'none'
    if (consent === 'reject') return false
    // EU visitors who haven't chosen yet: don't send (stricter, simplest).
    const eu = !document.cookie.split('; ').some(c => c === 'yele_eu=0')
    if (eu && consent !== 'accept') return false
    return true
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

function beacon(event: string) {
  try {
    if (fired.has(event)) return
    fired.add(event)
    if (!consentAllows()) return
    const locale = document.location.pathname.startsWith('/es') ? 'es' : document.location.pathname.startsWith('/zh') ? 'zh' : 'en'
    const payload = JSON.stringify({ event, page: 'letsbuild', locale, sessionId: sessionId() })
    const blob = new Blob([payload], { type: 'application/json' })
    if (!navigator.sendBeacon?.('/api/webpolice/event', blob)) {
      fetch('/api/webpolice/event', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
    }
  } catch { /* best-effort */ }
}

/** Fires `lb_hero` on mount (visitor loaded the page). */
export function LbHeroPing() {
  useEffect(() => { beacon('lb_hero') }, [])
  return null
}

/** Invisible sentinel that fires `event` the first time it scrolls into view. */
export function LbSeen({ event }: { event: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { beacon(event); io.disconnect() }
    }, { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [event])
  return <div ref={ref} aria-hidden="true" className="h-px w-full" />
}
