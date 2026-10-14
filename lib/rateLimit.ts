// Lightweight per-IP rate limiting + same-origin check for the public form
// endpoints (lead, contact, survey). Keyed on a hash of the request IP that is
// never stored — used only transiently in memory for the window. Best-effort on
// serverless (per-instance), which is enough to blunt form-spam / cost abuse.

import { createHash } from 'crypto'

type Bucket = { count: number; reset: number }
const stores = new Map<string, Map<string, Bucket>>()

function ipKey(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for')
  const ip = (fwd?.split(',')[0] || request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || '0.0.0.0').trim()
  return createHash('sha256').update(`rl:${ip}`).digest('hex').slice(0, 24)
}

/** Same-origin check for state-changing form posts (production only). */
export function sameOrigin(request: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  const host = request.headers.get('host')
  const src = request.headers.get('origin') ?? request.headers.get('referer')
  if (!host || !src) return false
  try { return new URL(src).host === host } catch { return false }
}

/** Fixed-window limiter. Returns true if the request is allowed. */
export function rateLimit(request: Request, opts: { name: string; max: number; windowMs: number }): boolean {
  const now = Date.now()
  let store = stores.get(opts.name)
  if (!store) { store = new Map(); stores.set(opts.name, store) }
  const key = ipKey(request)
  const cur = store.get(key)
  if (!cur || now >= cur.reset) {
    store.set(key, { count: 1, reset: now + opts.windowMs })
    if (store.size > 5000) store.forEach((v, k) => { if (now >= v.reset) store!.delete(k) })
    return true
  }
  if (cur.count >= opts.max) return false
  cur.count++
  return true
}

/** Combined guard: optional same-origin + rate limit. Returns a Response to
 *  short-circuit the handler, or null to proceed. */
export function guard(
  request: Request,
  opts: { name: string; max: number; windowMs: number; checkOrigin?: boolean },
): Response | null {
  const json = (status: number, error: string) =>
    new Response(JSON.stringify({ error }), { status, headers: { 'Content-Type': 'application/json' } })
  if (opts.checkOrigin !== false && !sameOrigin(request)) return json(403, 'forbidden')
  if (!rateLimit(request, opts)) return json(429, 'Too many requests. Please try again shortly.')
  return null
}
