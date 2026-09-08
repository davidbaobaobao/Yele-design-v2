import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { qstashClient, QSTASH_BASE_URL } from '@/lib/ai-callback/qstash'
import { isInsideCallingWindow, secondsUntilCallable } from '@/lib/ai-callback/calling-window'
import { buildDynamicVariables } from '@/lib/ai-callback/retell'

export const dynamic = 'force-dynamic'

// Diagnostics for the AI callback pipeline. Never exposes secret VALUES —
// only whether each one is set, and its length/prefix so a truncated or
// swapped key is obvious.
//
//   GET  /api/ai-callback/debug?key=<AI_CALLBACK_DEBUG_KEY>
//        → env presence + the 5 most recent ai_callbacks rows
//   POST /api/ai-callback/debug?key=…&lead_id=<uuid>&action=republish
//        → re-publish the QStash job for that row (delay 10s)
//   POST /api/ai-callback/debug?key=…&lead_id=<uuid>&action=ping
//        → publish a QStash job with delay 5s to prove QStash can reach us

function present(name: string): string {
  const v = process.env[name]
  if (!v) return 'MISSING'
  return `set (${v.length} chars, starts "${v.slice(0, 6)}…")`
}

function authorised(request: Request): boolean {
  const expected = process.env.AI_CALLBACK_DEBUG_KEY
  if (!expected) return false
  const url = new URL(request.url)
  return url.searchParams.get('key') === expected
}

export async function GET(request: Request) {
  if (!authorised(request)) return new NextResponse('not found', { status: 404 })

  const env = {
    AI_CALLBACK_ENABLED: process.env.AI_CALLBACK_ENABLED ?? 'MISSING (treated as false)',
    AI_CALLBACK_DRY_RUN: process.env.AI_CALLBACK_DRY_RUN ?? 'MISSING (treated as false)',
    AI_CALLBACK_DELAY_SECONDS: process.env.AI_CALLBACK_DELAY_SECONDS ?? 'MISSING (default 300)',
    AI_CALLBACK_TEST_NUMBERS: process.env.AI_CALLBACK_TEST_NUMBERS ?? '(empty)',
    AI_CALLBACK_DEDUPE_HOURS: process.env.AI_CALLBACK_DEDUPE_HOURS ?? 'MISSING (default 24)',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'MISSING (default https://yele.design)',
    QSTASH_URL: process.env.QSTASH_URL ?? 'MISSING (SDK defaults to EU https://qstash.upstash.io)',
    QSTASH_TOKEN: present('QSTASH_TOKEN'),
    QSTASH_CURRENT_SIGNING_KEY: present('QSTASH_CURRENT_SIGNING_KEY'),
    QSTASH_NEXT_SIGNING_KEY: present('QSTASH_NEXT_SIGNING_KEY'),
    RETELL_API_KEY: present('RETELL_API_KEY'),
    RETELL_AGENT_ID: present('RETELL_AGENT_ID'),
    RETELL_FROM_NUMBER: process.env.RETELL_FROM_NUMBER ?? 'MISSING',
    RESEND_API_KEY: present('RESEND_API_KEY'),
    SUPABASE_SERVICE_ROLE_KEY: present('SUPABASE_SERVICE_ROLE_KEY'),
  }

  // Does the QStash token actually work? Publishing nothing, just listing.
  let qstashReachable = 'not tested (no token)'
  if (process.env.QSTASH_TOKEN) {
    try {
      const res = await fetch(`${QSTASH_BASE_URL}/v2/topics`, {
        headers: { Authorization: `Bearer ${process.env.QSTASH_TOKEN}` },
      })
      qstashReachable = res.ok ? `ok (${res.status})` : `FAILED ${res.status}: ${(await res.text()).slice(0, 200)}`
    } catch (err) {
      qstashReachable = `FAILED: ${err instanceof Error ? err.message : String(err)}`
    }
  }

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: rows, error } = await sb
    .from('ai_callbacks')
    .select('id, created_at, name, phone_e164, state, tz, plan, status, scheduled_for, reschedules, call_attempts, paid, retell_call_id, qstash_message_id, last_error')
    .order('created_at', { ascending: false })
    .limit(5)

  const now = new Date()
  const annotated = (rows ?? []).map(r => ({
    ...r,
    window_open_now: isInsideCallingWindow(r.tz, now),
    seconds_until_callable: secondsUntilCallable(r.tz, now),
    would_send: buildDynamicVariables({
      id: r.id, name: r.name, email: '', phone_e164: r.phone_e164,
      business: null, plan: r.plan as 'launch' | 'business' | 'pro' | null, state: r.state ?? 'UNKNOWN',
    }).opener,
  }))

  // Which numbers are currently blocked by the dedupe guard?
  const dedupeHours = Number(process.env.AI_CALLBACK_DEDUPE_HOURS ?? 24)
  const blocking = (rows ?? [])
    .filter(r => ['scheduled', 'calling', 'called', 'dnc'].includes(r.status)
      && Date.now() - new Date(r.created_at).getTime() < dedupeHours * 3600 * 1000)
    .map(r => `${r.phone_e164} (row ${r.id}, status ${r.status})`)

  return NextResponse.json({
    now_utc: now.toISOString(),
    env,
    dedupe_hours: dedupeHours,
    numbers_currently_blocked_from_rescheduling: blocking,
    qstash_base_url: QSTASH_BASE_URL,
    qstash_token_check: qstashReachable,
    supabase_error: error?.message ?? null,
    recent: annotated,
  })
}

export async function POST(request: Request) {
  if (!authorised(request)) return new NextResponse('not found', { status: 404 })
  const url = new URL(request.url)
  const leadId = url.searchParams.get('lead_id')
  const action = url.searchParams.get('action') ?? 'republish'
  if (!leadId) return NextResponse.json({ error: 'lead_id required' }, { status: 400 })
  if (!process.env.QSTASH_TOKEN) return NextResponse.json({ error: 'QSTASH_TOKEN missing' }, { status: 500 })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yele.design'
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  try {
    const qstash = qstashClient()
    const published = await qstash.publishJSON({
      url: `${baseUrl}/api/ai-callback/fire`,
      body: { lead_id: leadId },
      delay: action === 'ping' ? 5 : 10,
      retries: 1,
      deduplicationId: `ai-callback-debug-${leadId}-${Date.now()}`,
    })
    const messageId = Array.isArray(published) ? published[0]?.messageId : published?.messageId
    await sb.from('ai_callbacks')
      .update({ status: 'scheduled', last_error: null, qstash_message_id: messageId ?? null })
      .eq('id', leadId)
    return NextResponse.json({ ok: true, messageId, target: `${baseUrl}/api/ai-callback/fire` })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
