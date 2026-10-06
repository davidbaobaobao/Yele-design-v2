// Aggregate-counter storage for the cookie-consent banner analytics. Stores
// ONLY per-(day, page, locale, event) counts — never individual events, never
// a visitor id. Supabase (public.consent_stats) with an in-memory fallback so
// the endpoint and tests work without a DB configured.
//
// Disable entirely by setting CONSENT_STATS_DISABLED=1 (spec req. 12).

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { ConsentEvent, ConsentPage, ConsentLocale } from './consentStats'

export function consentStatsEnabled(): boolean {
  return process.env.CONSENT_STATS_DISABLED !== '1'
}

let client: SupabaseClient | null | undefined
function db(): SupabaseClient | null {
  if (client !== undefined) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  client = url && key && url !== 'https://placeholder.supabase.co'
    ? createClient(url, key, { auth: { persistSession: false } })
    : null
  return client
}

// Day bucket = the calendar date in Europe/Madrid (aligns with the 13:00-Madrid
// daily report), as an ISO YYYY-MM-DD string.
export function madridDay(d: Date = new Date()): string {
  // en-CA gives YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(d)
}

// ── In-memory fallback (per instance) ────────────────────────────────────────
type Key = string // `${day}|${page}|${locale}|${event}`
const mem = new Map<Key, number>()
const k = (day: string, page: string, locale: string, event: string) => `${day}|${page}|${locale}|${event}`

export async function bumpConsentStat(
  event: ConsentEvent,
  page: ConsentPage,
  locale: ConsentLocale,
  day: string = madridDay(),
): Promise<void> {
  if (!consentStatsEnabled()) return
  const supabase = db()
  if (!supabase) {
    const key = k(day, page, locale, event)
    mem.set(key, (mem.get(key) ?? 0) + 1)
    return
  }
  const { error } = await supabase.rpc('bump_consent_stat', {
    p_day: day, p_page: page, p_locale: locale, p_event: event,
  })
  if (error) console.error('[consent-stats] bump failed:', error.message)
}

export type ConsentRow = { day: string; page: string; locale: string; event: string; count: number }

/** Read raw counter rows on/after `sinceDay` (inclusive). */
export async function readConsentStats(sinceDay: string): Promise<ConsentRow[]> {
  const supabase = db()
  if (!supabase) {
    const out: ConsentRow[] = []
    mem.forEach((count, key) => {
      const [day, page, locale, event] = key.split('|')
      if (day >= sinceDay) out.push({ day, page, locale, event, count })
    })
    return out
  }
  const { data, error } = await supabase
    .from('consent_stats')
    .select('day, page, locale, event, count')
    .gte('day', sinceDay)
    .limit(10_000)
  if (error) { console.error('[consent-stats] read failed:', error.message); return [] }
  return (data ?? []) as ConsentRow[]
}

export type Outcome = { shown: number; accept: number; reject: number; no_choice: number }

export function emptyOutcome(): Outcome {
  return { shown: 0, accept: 0, reject: 0, no_choice: 0 }
}

/** Fold rows into an outcome total, optionally filtered by page/locale. */
export function sumOutcome(rows: ConsentRow[], filter?: { page?: string; locale?: string; day?: string }): Outcome {
  const o = emptyOutcome()
  for (const r of rows) {
    if (filter?.page && r.page !== filter.page) continue
    if (filter?.locale && r.locale !== filter.locale) continue
    if (filter?.day && r.day !== filter.day) continue
    if (r.event in o) o[r.event as keyof Outcome] += r.count
  }
  return o
}

/** Rates with banner_shown as the denominator (clearly defined). Returns null
 *  rates when there were no displays, so callers never divide by zero. */
export function rates(o: Outcome): { accept: number | null; reject: number | null; no_choice: number | null } {
  if (o.shown <= 0) return { accept: null, reject: null, no_choice: null }
  return {
    accept: o.accept / o.shown,
    reject: o.reject / o.shown,
    no_choice: o.no_choice / o.shown,
  }
}

// Test-only: reset the in-memory store.
export function __resetMemForTests() { mem.clear() }
