// Records that a visitor started a Web Police search but left before it
// finished — fired by a page-hide beacon from the client. Surfaces in the
// daily report so you can see which sites people bailed on mid-run.

import { NextResponse } from 'next/server'
import { logMiss, hashIp, clientIp } from '@/lib/webpolice/store'
import { normalizeUrl } from '../analyze/route'

export const runtime = 'nodejs'

const toLocale = (v: unknown): 'en' | 'es' | 'zh' => (v === 'es' || v === 'zh' ? v : 'en')

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
  const raw = typeof body.url === 'string' ? body.url.trim().slice(0, 2000) : ''
  const u = normalizeUrl(raw)
  if (!u) return NextResponse.json({ ok: false }, { status: 400 })

  const sessionId = typeof body.sessionId === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(body.sessionId)
    ? (body.sessionId as string)
    : null

  await logMiss({
    session_id: sessionId,
    url: u.toString(),
    host: u.hostname,
    locale: toLocale(body.locale),
    ip_hash: hashIp(clientIp(request)),
    country: request.headers.get('x-vercel-ip-country'),
    user_agent: (request.headers.get('user-agent') ?? '').slice(0, 300),
    referer: request.headers.get('referer')?.slice(0, 300) ?? null,
    error: 'abandoned',
  }).catch(err => console.error('[webpolice] abandon log failed', err))

  return NextResponse.json({ ok: true })
}
