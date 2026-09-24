// Storage + abuse-control helpers for the /webpolice tool.
//
// Every scan costs real money (a ScreenshotOne capture + a Claude vision
// call), so the endpoint is rate limited per IP, per visitor session and
// globally per day, and identical URLs are served from a 24h cache.
//
// Rows live in public.webpolice_scans (see supabase/migrations/webpolice_scans.sql).
// If Supabase is not configured the helpers degrade to an in-memory store —
// per serverless instance only, but still better than no limit at all.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

export type ScanRow = {
  session_id: string | null
  url: string
  host: string
  locale: string
  quality: number | null
  verdict: string | null
  mode: string | null
  cached: boolean
  ip_hash: string
  country: string | null
  user_agent: string | null
  referer: string | null
  result: unknown | null
  created_at?: string
  id?: string
  seed?: boolean
  // 'serious' | 'fun' — the analysis tone. Cache is keyed by tone so the two
  // modes don't serve each other's (differently-worded) results.
  tone?: string
  screenshot_url?: string | null
  // Set on failed / abandoned attempts (e.g. 'protected', 'ai_failed',
  // 'blocked', 'abandoned') so the daily report can list what went wrong.
  error?: string | null
}

const TABLE = 'webpolice_scans'

let client: SupabaseClient | null | undefined
function db(): SupabaseClient | null {
  if (client !== undefined) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  client = url && key && url !== 'https://placeholder.supabase.co'
    ? createClient(url, key, { auth: { persistSession: false } })
    : null
  if (!client) console.warn('[webpolice] Supabase not configured — using in-memory limits only')
  return client
}

// ── In-memory fallback (per instance) ────────────────────────────────────────
const mem: ScanRow[] = []
function memPrune() {
  const cutoff = Date.now() - 36 * 3600_000
  while (mem.length && new Date(mem[0].created_at ?? 0).getTime() < cutoff) mem.shift()
}

export function hashIp(ip: string): string {
  return createHash('sha256').update(`${process.env.WEBPOLICE_IP_SALT ?? 'yele-webpolice'}:${ip}`).digest('hex').slice(0, 32)
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for')
  return (fwd?.split(',')[0] || request.headers.get('x-real-ip') || '0.0.0.0').trim()
}

export async function logScan(row: ScanRow): Promise<void> {
  const created_at = new Date().toISOString()
  const supabase = db()
  if (!supabase) { mem.push({ ...row, created_at }); memPrune(); return }
  const { error } = await supabase.from(TABLE).insert({ ...row, created_at })
  if (error) {
    console.error('[webpolice] logScan failed:', error.message)
    mem.push({ ...row, created_at })
    memPrune()
  }
}

/** How many scans in the last `windowMs`, filtered by ip / session / globally. */
export async function countScans(opts: { ipHash?: string; sessionId?: string; windowMs: number }): Promise<number> {
  const since = new Date(Date.now() - opts.windowMs).toISOString()
  const supabase = db()
  if (supabase) {
    let q = supabase.from(TABLE).select('*', { count: 'exact', head: true }).gte('created_at', since)
    if (opts.ipHash) q = q.eq('ip_hash', opts.ipHash)
    if (opts.sessionId) q = q.eq('session_id', opts.sessionId)
    const { count, error } = await q
    if (!error) return count ?? 0
    console.error('[webpolice] countScans failed:', error.message)
  }
  memPrune()
  return mem.filter(r =>
    new Date(r.created_at ?? 0).getTime() >= Date.now() - opts.windowMs &&
    (!opts.ipHash || r.ip_hash === opts.ipHash) &&
    (!opts.sessionId || r.session_id === opts.sessionId)
  ).length
}

/** Timestamp of this IP's most recent scan, for the minimum-gap check. */
export async function lastScanAt(ipHash: string): Promise<number | null> {
  const supabase = db()
  if (supabase) {
    const { data, error } = await supabase.from(TABLE).select('created_at').eq('ip_hash', ipHash)
      .order('created_at', { ascending: false }).limit(1).maybeSingle()
    if (!error) return data ? new Date(data.created_at).getTime() : null
    console.error('[webpolice] lastScanAt failed:', error.message)
  }
  memPrune()
  const last = [...mem].reverse().find(r => r.ip_hash === ipHash)
  return last ? new Date(last.created_at ?? 0).getTime() : null
}

/**
 * The most recent stored analysis for this URL+locale. By default it looks
 * ALL-TIME (windowMs omitted): if we've ever analysed this URL we reuse that
 * result instead of paying for another screenshot + LLM call. Pass a windowMs
 * to restrict to a recent window.
 */
export async function findCachedScan(url: string, locale: string, tone: string = 'fun', windowMs?: number): Promise<Record<string, unknown> | null> {
  const finite = typeof windowMs === 'number' && Number.isFinite(windowMs)
  const supabase = db()
  if (supabase) {
    let q = supabase.from(TABLE).select('result').eq('url', url).eq('locale', locale).eq('tone', tone)
      .eq('seed', false).not('result', 'is', null)
    if (finite) q = q.gte('created_at', new Date(Date.now() - windowMs!).toISOString())
    const { data, error } = await q.order('created_at', { ascending: false }).limit(1).maybeSingle()
    if (error) { console.error('[webpolice] findCachedScan failed:', error.message); return null }
    return (data?.result as Record<string, unknown>) ?? null
  }
  memPrune()
  const hit = [...mem].reverse().find(r => r.url === url && r.locale === locale && (r.tone ?? 'fun') === tone && r.result && !r.seed &&
    (!finite || new Date(r.created_at ?? 0).getTime() >= Date.now() - windowMs!))
  return (hit?.result as Record<string, unknown>) ?? null
}

// ── Seed store: precomputed results for the showcase / random pool. ──────────
// Seeded rows are permanent (seed=true) and carry the full result INCLUDING the
// screenshot, so the showcase chips and the random button never call the LLM.

const seedMem = new Map<string, Record<string, unknown>>()
const seedKey = (url: string, locale: string) => `${locale}::${url}`

/** A precomputed result for this URL+locale+tone, or null. No expiry. Seeds are
 *  'fun' tone, so serious mode (tone='serious') gets none and analyses fresh. */
export async function getSeed(url: string, locale: string, tone: string = 'fun'): Promise<Record<string, unknown> | null> {
  const supabase = db()
  if (supabase) {
    const { data, error } = await supabase.from(TABLE).select('result')
      .eq('url', url).eq('locale', locale).eq('tone', tone).eq('seed', true).not('result', 'is', null)
      .order('created_at', { ascending: false }).limit(1).maybeSingle()
    if (error) { console.error('[webpolice] getSeed failed:', error.message); return null }
    return (data?.result as Record<string, unknown>) ?? null
  }
  return seedMem.get(seedKey(url, locale)) ?? null
}

/** Store (replace) a precomputed result for this URL+locale. */
export async function saveSeed(row: { url: string; host: string; locale: string; quality: number | null; verdict: string | null; result: Record<string, unknown> }): Promise<void> {
  const supabase = db()
  if (!supabase) { seedMem.set(seedKey(row.url, row.locale), row.result); return }
  await supabase.from(TABLE).delete().eq('url', row.url).eq('locale', row.locale).eq('seed', true)
  const { error } = await supabase.from(TABLE).insert({
    session_id: null, url: row.url, host: row.host, locale: row.locale,
    quality: row.quality, verdict: row.verdict, mode: 'seed', cached: false,
    ip_hash: 'seed', country: null, user_agent: 'seed', referer: null,
    result: row.result, seed: true, created_at: new Date().toISOString(),
  })
  if (error) console.error('[webpolice] saveSeed failed:', error.message)
}

/** All seeded URLs for a locale — used by the client to pick only seeded sites. */
export async function listSeededUrls(locale: string): Promise<string[]> {
  const supabase = db()
  if (supabase) {
    const { data, error } = await supabase.from(TABLE).select('url').eq('seed', true).eq('locale', locale)
    if (error) { console.error('[webpolice] listSeededUrls failed:', error.message); return [] }
    return Array.from(new Set((data ?? []).map(r => r.url as string)))
  }
  return Array.from(seedMem.keys()).filter(k => k.startsWith(`${locale}::`)).map(k => k.slice(locale.length + 2))
}

/** Scans in a visitor session that have not been emailed yet; marks them sent. */
export async function claimUnreportedScans(sessionId: string): Promise<ScanRow[]> {
  const supabase = db()
  if (!supabase) {
    const rows = mem.filter(r => r.session_id === sessionId && !(r as ScanRow & { reported?: boolean }).reported)
    rows.forEach(r => { (r as ScanRow & { reported?: boolean }).reported = true })
    return rows
  }
  const { data, error } = await supabase.from(TABLE)
    .update({ reported_at: new Date().toISOString() })
    .eq('session_id', sessionId).is('reported_at', null)
    .select('url, host, locale, quality, verdict, mode, cached, country, created_at, ip_hash, user_agent, referer')
  if (error) { console.error('[webpolice] claimUnreportedScans failed:', error.message); return [] }
  return (data ?? []) as unknown as ScanRow[]
}

/** Log a failed or abandoned attempt (no result, no screenshot) so the daily
 *  report can list what errored or what a visitor bailed on mid-run. */
export async function logMiss(row: {
  session_id: string | null; url: string; host: string; locale: string
  ip_hash: string; country: string | null; user_agent: string | null; referer: string | null
  error: string
}): Promise<void> {
  return logScan({
    session_id: row.session_id, url: row.url, host: row.host, locale: row.locale,
    quality: null, verdict: null, mode: row.error === 'abandoned' ? 'abandoned' : 'error',
    cached: false, ip_hash: row.ip_hash, country: row.country,
    user_agent: row.user_agent, referer: row.referer, result: null, error: row.error,
  })
}

/** Upload a screenshot to Supabase Storage (the `webpolice-shots` bucket) and
 *  return its public URL, so the heavy image lives in object storage instead of
 *  bloating the DB. Best-effort — returns null on any failure. */
export async function saveShot(dataUrl: string, host: string): Promise<string | null> {
  const supabase = db()
  if (!supabase) return null
  const m = dataUrl.match(/^data:([^;]+);base64,(.*)$/)
  if (!m) return null
  const buf = Buffer.from(m[2], 'base64')
  const ext = m[1].includes('png') ? 'png' : 'jpg'
  const safeHost = (host || 'site').replace(/[^a-z0-9.-]/gi, '_').slice(0, 60)
  const path = `${safeHost}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('webpolice-shots').upload(path, buf, { contentType: m[1], upsert: false })
  if (error) { console.error('[webpolice] saveShot failed:', error.message); return null }
  const { data } = supabase.storage.from('webpolice-shots').getPublicUrl(path)
  return data?.publicUrl ?? null
}

/** One stored scan (its full text result) by id — for the "view result" links
 *  in the daily report. */
export async function getScanResult(id: string): Promise<ScanRow | null> {
  const supabase = db()
  if (!supabase) return null
  const { data, error } = await supabase.from(TABLE)
    .select('url, host, locale, quality, verdict, created_at, result, screenshot_url')
    .eq('id', id).maybeSingle()
  if (error) { console.error('[webpolice] getScanResult failed:', error.message); return null }
  return (data as unknown as ScanRow) ?? null
}

/** Most recent scan of this URL+locale that actually has a stored text result —
 *  used as a fallback when a report link points at a resultless (cached) row. */
export async function findLatestResultByUrl(url: string, locale: string): Promise<ScanRow | null> {
  const supabase = db()
  if (!supabase) return null
  const { data, error } = await supabase.from(TABLE)
    .select('url, host, locale, quality, verdict, created_at, result, screenshot_url')
    .eq('url', url).eq('locale', locale).not('result', 'is', null)
    .order('created_at', { ascending: false }).limit(1).maybeSingle()
  if (error) { console.error('[webpolice] findLatestResultByUrl failed:', error.message); return null }
  return (data as unknown as ScanRow) ?? null
}

/** All real (non-seed) scans in the last `windowMs`, newest first — for the
 *  once-a-day owner digest. */
export async function scansSince(windowMs: number): Promise<ScanRow[]> {
  const since = new Date(Date.now() - windowMs).toISOString()
  const supabase = db()
  if (supabase) {
    const { data, error } = await supabase.from(TABLE)
      .select('id, url, host, locale, tone, quality, verdict, mode, cached, country, created_at, error, screenshot_url')
      .eq('seed', false).gte('created_at', since)
      .order('created_at', { ascending: false })
    if (error) { console.error('[webpolice] scansSince failed:', error.message); return [] }
    return (data ?? []).filter(r => r.mode !== 'seed') as unknown as ScanRow[]
  }
  memPrune()
  return mem.filter(r => !r.seed && r.mode !== 'seed' && new Date(r.created_at ?? 0).getTime() >= Date.now() - windowMs)
}

// ── Lightweight funnel events (webpolice_events) ─────────────────────────────
// Fire-and-forget UX events (page_view, search, result_view, speaker, etc.)
// sent from the client via navigator.sendBeacon. No IP, no PII — just an opaque
// session id, so the daily report can count distinct visitors at each step.
const EVENTS = 'webpolice_events'

export async function logEvent(e: { session_id: string | null; locale: string; event: string; meta?: unknown; page?: string; tone?: string }): Promise<void> {
  const supabase = db()
  if (!supabase) return
  const { error } = await supabase.from(EVENTS).insert({
    session_id: e.session_id, locale: e.locale, event: e.event, meta: e.meta ?? null,
    page: e.page ?? 'webpolice', tone: e.tone ?? null,
  })
  if (error) console.error('[webpolice] logEvent failed:', error.message)
}

export type FunnelCounts = Record<string, { total: number; sessions: number }>

/** Per-event totals and distinct-session counts since `sinceIso`, one page. */
export async function eventFunnelSince(sinceIso: string, page: string = 'webpolice'): Promise<FunnelCounts> {
  const supabase = db()
  if (!supabase) return {}
  const { data, error } = await supabase.from(EVENTS)
    .select('event, session_id').eq('page', page).gte('created_at', sinceIso).limit(100_000)
  if (error) { console.error('[webpolice] eventFunnelSince failed:', error.message); return {} }
  const out: FunnelCounts = {}
  const seen: Record<string, Set<string>> = {}
  for (const r of (data ?? []) as { event: string; session_id: string | null }[]) {
    const ev = r.event
    if (!out[ev]) { out[ev] = { total: 0, sessions: 0 }; seen[ev] = new Set() }
    out[ev].total++
    const s = r.session_id ?? ''
    if (s && !seen[ev].has(s)) { seen[ev].add(s); out[ev].sessions++ }
  }
  return out
}

/** Per-URL distinct-session counts for one event since `sinceIso` (desc). */
export async function eventUrlBreakdown(event: string, sinceIso: string): Promise<{ url: string; sessions: number }[]> {
  const supabase = db()
  if (!supabase) return []
  const { data, error } = await supabase.from(EVENTS)
    .select('session_id, meta').eq('event', event).eq('page', 'webpolice').gte('created_at', sinceIso).limit(100_000)
  if (error) { console.error('[webpolice] eventUrlBreakdown failed:', error.message); return [] }
  const bySite: Record<string, Set<string>> = {}
  for (const r of (data ?? []) as { session_id: string | null; meta: { url?: string } | null }[]) {
    const url = r.meta?.url
    if (!url) continue
    if (!bySite[url]) bySite[url] = new Set()
    if (r.session_id) bySite[url].add(r.session_id)
  }
  return Object.entries(bySite)
    .map(([url, s]) => ({ url, sessions: s.size }))
    .sort((a, b) => b.sessions - a.sessions)
}
