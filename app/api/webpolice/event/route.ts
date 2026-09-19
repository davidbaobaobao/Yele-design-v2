// Lightweight funnel telemetry for the Web Police page. The client fires these
// via navigator.sendBeacon (non-blocking, doesn't affect page performance). We
// store only an opaque session id, the locale and the event name — no IP, no
// personal data — so the daily report can show a simple visitor funnel.

import { NextResponse } from 'next/server'
import { logEvent } from '@/lib/webpolice/store'

export const runtime = 'nodejs'

const toLocale = (v: unknown): 'en' | 'es' | 'zh' => (v === 'es' || v === 'zh' ? v : 'en')

// Only these named steps are accepted — anything else is ignored.
const ALLOWED = new Set([
  'page_view',      // landed on the Web Police page
  'search',         // submitted a URL to check
  'result_view',    // a verdict was shown
  'speaker_click',  // pressed the read-aloud button
  'scroll_mid',     // scrolled to the "What year your website feels" area
  'plug_view',      // reached the shameless-plug form
  'letsbuild_click',// clicked the "Check out our site" link
])

function sameOrigin(request: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  const host = request.headers.get('host')
  const src = request.headers.get('origin') ?? request.headers.get('referer')
  if (!host || !src) return false
  try { return new URL(src).host === host } catch { return false }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 })

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const event = typeof body.event === 'string' ? body.event : ''
  if (!ALLOWED.has(event)) return NextResponse.json({ ok: false }, { status: 400 })

  const sessionId = typeof body.sessionId === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(body.sessionId)
    ? (body.sessionId as string)
    : null

  await logEvent({ session_id: sessionId, locale: toLocale(body.locale), event })
    .catch(err => console.error('[webpolice] event log failed', err))

  return NextResponse.json({ ok: true })
}
