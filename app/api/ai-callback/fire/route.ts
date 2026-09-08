import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Client as QStash, Receiver } from '@upstash/qstash'
import { isInsideCallingWindow, secondsUntilCallable } from '@/lib/ai-callback/calling-window'
import { createRetellCall } from '@/lib/ai-callback/retell'

export const dynamic = 'force-dynamic'

// QStash hits this ~5 min after the /letsbuild form submit. Re-checks every
// guard at fire time (payment, opt-out, legal window) and only then dials.
const MAX_RESCHEDULES = 3

export async function POST(request: Request) {
  const raw = await request.text()

  // 1. Only QStash may call this.
  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  })
  const signature = request.headers.get('upstash-signature') ?? ''
  const valid = await receiver.verify({ signature, body: raw }).catch(() => false)
  if (!valid) return new NextResponse('bad signature', { status: 401 })

  const { lead_id } = JSON.parse(raw || '{}') as { lead_id?: string }
  if (!lead_id) return NextResponse.json({ error: 'lead_id required' }, { status: 400 })

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: lead } = await sb.from('ai_callbacks').select('*').eq('id', lead_id).single()
  if (!lead) return NextResponse.json({ skipped: 'no such lead' })

  // 2. Kill switch, or already handled.
  if ((process.env.AI_CALLBACK_ENABLED ?? 'false') !== 'true') {
    await sb.from('ai_callbacks').update({ status: 'skipped', last_error: 'disabled at fire time' }).eq('id', lead_id)
    return NextResponse.json({ skipped: 'disabled' })
  }
  if (lead.status !== 'scheduled') return NextResponse.json({ skipped: `status=${lead.status}` })

  // 3. Paid the deposit in the meantime → no call.
  if (lead.paid || lead.do_not_call) {
    await sb.from('ai_callbacks').update({ status: lead.paid ? 'skipped_paid' : 'dnc' }).eq('id', lead_id)
    return NextResponse.json({ skipped: lead.paid ? 'paid' : 'dnc' })
  }

  // 4. Legal calling window in the lead's local time.
  if (!isInsideCallingWindow(lead.tz)) {
    if (lead.reschedules >= MAX_RESCHEDULES) {
      await sb.from('ai_callbacks').update({ status: 'skipped', last_error: 'outside window, max reschedules' }).eq('id', lead_id)
      return NextResponse.json({ skipped: 'max reschedules' })
    }
    const delay = secondsUntilCallable(lead.tz)
    const qstash = new QStash({ token: process.env.QSTASH_TOKEN! })
    await qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yele.design'}/api/ai-callback/fire`,
      body: { lead_id },
      delay,
      retries: 3,
      deduplicationId: `ai-callback-${lead_id}-r${lead.reschedules + 1}`,
    })
    await sb.from('ai_callbacks').update({
      reschedules: lead.reschedules + 1,
      scheduled_for: new Date(Date.now() + delay * 1000).toISOString(),
    }).eq('id', lead_id)
    return NextResponse.json({ rescheduled_seconds: delay })
  }

  // 5. Dial.
  const result = await createRetellCall({
    id: lead.id, name: lead.name, email: lead.email, phone_e164: lead.phone_e164,
    business: lead.business, plan: lead.plan, state: lead.state ?? 'UNKNOWN',
  })
  if (!result.ok) {
    console.error('[ai-callback] retell error', result.status, result.error)
    await sb.from('ai_callbacks').update({
      call_attempts: lead.call_attempts + 1,
      last_error: `retell ${result.status}: ${result.error.slice(0, 500)}`,
      ...(lead.call_attempts + 1 >= 3 ? { status: 'error' } : {}),
    }).eq('id', lead_id)
    // 5xx → QStash retries (up to 3). 4xx → don't retry a bad request.
    return new NextResponse(result.error, { status: result.status >= 500 || result.status === 0 ? 500 : 200 })
  }

  await sb.from('ai_callbacks').update({
    status: 'calling', retell_call_id: result.call_id, call_attempts: lead.call_attempts + 1,
  }).eq('id', lead_id)
  return NextResponse.json({ call_id: result.call_id })
}
