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
  seed?: boolean
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

/** A stored analysis for the same URL+locale inside the cache window. */
export async function findCachedScan(url: string, locale: string, windowMs = 24 * 3600_000): Promise<Record<string, unknown> | null> {
  const since = new Date(Date.now() - windowMs).toISOString()
  const supabase = db()
  if (supabase) {
    const { data, error } = await supabase.from(TABLE).select('result').eq('url', url).eq('locale', locale)
      .eq('seed', false).not('result', 'is', null).gte('created_at', since)
      .order('created_at', { ascending: false }).limit(1).maybeSingle()
    if (error) { console.error('[webpolice] findCachedScan failed:', error.message); return null }
    return (data?.result as Record<string, unknown>) ?? null
  }
  memPrune()
  const hit = [...mem].reverse().find(r => r.url === url && r.locale === locale && r.result && !r.seed &&
    new Date(r.created_at ?? 0).getTime() >= Date.now() - windowMs)
  return (hit?.result as Record<string, unknown>) ?? null
}

// ── Seed store: precomputed results for the showcase / random pool. ──────────
// Seeded rows are permanent (seed=true) and carry the full result INCLUDING the
// screenshot, so the showcase chips and the random button never call the LLM.

const seedMem = new Map<string, Record<string, unknown>>()
const seedKey = (url: string, locale: string) => `${locale}::${url}`

/** A precomputed result for this URL+locale, or null. No expiry. */
export async function getSeed(url: string, locale: string): Promise<Record<string, unknown> | null> {
  const supabase = db()
  if (supabase) {
    const { data, error } = await supabase.from(TABLE).select('result')
      .eq('url', url).eq('locale', locale).eq('seed', true).not('result', 'is', null)
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

/** All real (non-seed) scans in the last `windowMs`, newest first — for the
 *  once-a-day owner digest. */
export async function scansSince(windowMs: number): Promise<ScanRow[]> {
  const since = new Date(Date.now() - windowMs).toISOString()
  const supabase = db()
  if (supabase) {
    const { data, error } = await supabase.from(TABLE)
      .select('url, host, locale, quality, verdict, mode, cached, country, created_at')
      .eq('seed', false).gte('created_at', since)
      .order('created_at', { ascending: false })
    if (error) { console.error('[webpolice] scansSince failed:', error.message); return [] }
    return (data ?? []).filter(r => r.mode !== 'seed') as unknown as ScanRow[]
  }
  memPrune()
  return mem.filter(r => !r.seed && r.mode !== 'seed' && new Date(r.created_at ?? 0).getTime() >= Date.now() - windowMs)
}
