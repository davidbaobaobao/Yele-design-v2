// Privacy-first cookie-consent banner analytics endpoint.
//
// POST  — increments an aggregate counter for one banner outcome. Minimal
//         payload `{ event, page?, locale? }`. NO ids, NO IP stored, NO PII.
// GET    — CRON_SECRET-protected aggregate report (counts + rates).
//
// See docs/consent-analytics.md for exactly what is / isn't collected.

import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { buildConsentPayload, createRateLimiter } from '@/lib/consent/consentStats'
import {
  bumpConsentStat, readConsentStats, sumOutcome, rates, consentStatsEnabled, madridDay,
  type ConsentRow,
} from '@/lib/consent/consentStore'

export const runtime = 'nodejs'

// Fixed-window limiter, keyed by an ephemeral per-request hash of the IP that
// is never stored and never leaves this process. Best-effort on serverless
// (state is per-instance). Abuse here only inflates anonymous counters.
const limiter = createRateLimiter({ windowMs: 60_000, max: 20 })

function rateKey(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for')
  const ip = (fwd?.split(',')[0] || request.headers.get('x-real-ip') || '0.0.0.0').trim()
  // Hashed immediately; the raw IP is discarded with the request. The hash is
  // used only as an in-memory rate-limit key for this 60s window.
  return createHash('sha256').update(`consent-rl:${ip}`).digest('hex').slice(0, 24)
}

function sameOrigin(request: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  const host = request.headers.get('host')
  const src = request.headers.get('origin') ?? request.headers.get('referer')
  if (!host || !src) return false
  try { return new URL(src).host === host } catch { return false }
}

export async function POST(request: Request) {
  if (!consentStatsEnabled()) return NextResponse.json({ ok: true, disabled: true })
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 })
  if (!limiter.allow(rateKey(request))) return NextResponse.json({ ok: false }, { status: 429 })

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const payload = buildConsentPayload(body.event, body.page, body.locale)
  if (!payload) return NextResponse.json({ ok: false }, { status: 400 })

  await bumpConsentStat(payload.event, payload.page, payload.locale)
    .catch(err => console.error('[consent-stats] bump error', err))

  return NextResponse.json({ ok: true })
}

// Internal report. Protected with CRON_SECRET (same as the daily report) so it
// isn't publicly readable. `?days=N` (default 7) controls the window.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const days = Math.min(Math.max(Number(new URL(request.url).searchParams.get('days')) || 7, 1), 90)
  const since = new Date(Date.now() - (days - 1) * 86_400_000)
  const sinceDay = madridDay(since)
  const rows = await readConsentStats(sinceDay)

  const withRates = (o: ReturnType<typeof sumOutcome>) => ({ ...o, rates: rates(o) })

  // Overall, plus the four Spanish ad pages the report focuses on.
  const ES_PAGES = ['letsbuild', 'letsbuildnow', 'webpolice', 'tutienda'] as const
  const esPages = Object.fromEntries(
    ES_PAGES.map(p => [p, withRates(sumOutcome(rows, { page: p, locale: 'es' }))]),
  )

  // Per-day totals (denominator = that day's banner_shown).
  const dayKeys = Array.from(new Set(rows.map((r: ConsentRow) => r.day))).sort()
  const byDay = dayKeys.map(day => ({ day, ...withRates(sumOutcome(rows, { day })) }))

  return NextResponse.json({
    ok: true,
    window_days: days,
    note: 'Counts are banner OUTCOMES, not unique people — no visitor identifier is stored.',
    denominator: 'rates = outcome / banner_shown',
    total: withRates(sumOutcome(rows)),
    es_pages: esPages,
    by_day: byDay,
  })
}
