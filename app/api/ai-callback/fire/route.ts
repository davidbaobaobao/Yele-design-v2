import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Receiver } from '@upstash/qstash'
import { qstashClient } from '@/lib/ai-callback/qstash'
import { isInsideCallingWindow, secondsUntilCallable } from '@/lib/ai-callback/calling-window'
import { createRetellCall, buildDynamicVariables } from '@/lib/ai-callback/retell'
import { Resend } from 'resend'

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
  //
  // AI_CALLBACK_OUTSIDE_WINDOW controls what happens when the lead's local
  // time is outside 9–20 (or it's a Sunday / US federal holiday):
  //   'skip'       (default) — no AI call at all; David is emailed to call
  //                 them himself. A call the next morning is stale anyway:
  //                 the whole point is speed-to-lead.
  //   'reschedule' — re-publish the job for 9:05 the next allowed day.
  const outsideWindowMode = process.env.AI_CALLBACK_OUTSIDE_WINDOW ?? 'skip'
  if (!isInsideCallingWindow(lead.tz)) {
    const localTime = new Intl.DateTimeFormat('en-US', {
      timeZone: lead.tz || 'America/New_York', dateStyle: 'medium', timeStyle: 'short',
    }).format(new Date())

    if (outsideWindowMode !== 'reschedule') {
      await sb.from('ai_callbacks').update({
        status: 'skipped_outside_window',
        last_error: `outside calling window (${localTime} local, tz ${lead.tz}) — no AI call, David to call manually`,
      }).eq('id', lead_id)

      if (process.env.RESEND_API_KEY) {
        const opensIn = Math.round(secondsUntilCallable(lead.tz) / 60)
        await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: 'Yele AI Callback <noreply@yele.design>',
          to: [process.env.OWNER_EMAIL ?? 'davidbaobaobao@gmail.com'],
          replyTo: lead.email,
          subject: `[CALL THEM YOURSELF] ${lead.name}${lead.business ? ` (${lead.business})` : ''} — outside calling hours`,
          text: [
            'A lead came in outside their local calling window, so no AI call was placed.',
            '',
            `Name: ${lead.name}`,
            `Phone: ${lead.phone_e164}   Email: ${lead.email}`,
            `Business: ${lead.business ?? '-'}   Plan: ${lead.plan ?? '-'}`,
            `Their local time: ${localTime} (${lead.tz}, ${lead.state})`,
            `Window opens in about ${opensIn} minutes.`,
          ].join('\n'),
        }).catch(err => console.error('[ai-callback] outside-window email failed', err))
      }
      return NextResponse.json({ skipped: 'outside calling window', local_time: localTime })
    }

    if (lead.reschedules >= MAX_RESCHEDULES) {
      await sb.from('ai_callbacks').update({ status: 'skipped', last_error: 'outside window, max reschedules' }).eq('id', lead_id)
      return NextResponse.json({ skipped: 'max reschedules' })
    }
    const delay = secondsUntilCallable(lead.tz)
    const qstash = qstashClient()
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

  // 5. Dry run: everything above passed — log what WOULD be sent, email David
  //    the variables, and stop. Lets the whole pipeline be tested without a
  //    phone. AI_CALLBACK_DRY_RUN=true
  if ((process.env.AI_CALLBACK_DRY_RUN ?? 'false') === 'true') {
    const vars = buildDynamicVariables({
      id: lead.id, name: lead.name, email: lead.email, phone_e164: lead.phone_e164,
      business: lead.business, plan: lead.plan, state: lead.state ?? 'UNKNOWN',
    })
    console.log('[ai-callback] DRY RUN — would call', lead.phone_e164, vars)
    await sb.from('ai_callbacks').update({
      status: 'dry_run', call_attempts: lead.call_attempts + 1,
      call_summary: `DRY RUN ${new Date().toISOString()} — variables: ${JSON.stringify(vars)}`,
    }).eq('id', lead_id)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Yele AI Callback <noreply@yele.design>',
        to: [process.env.OWNER_EMAIL ?? 'davidbaobaobao@gmail.com'],
        subject: `[DRY RUN] AI callback would dial ${lead.phone_e164} — ${lead.name}`,
        text: [
          'All guards passed (enabled, not paid, inside legal window). No call was placed.',
          '',
          `To: ${lead.phone_e164}   State: ${lead.state}   TZ: ${lead.tz}`,
          `Scheduled at: ${lead.created_at}   Fired at: ${new Date().toISOString()}   Reschedules: ${lead.reschedules}`,
          '',
          'Dynamic variables that would be sent to Retell:',
          ...Object.entries(vars).map(([k, v]) => `  ${k}: ${v}`),
        ].join('\n'),
      }).catch(err => console.error('[ai-callback] dry-run email failed', err))
    }
    return NextResponse.json({ dry_run: true, vars })
  }

  // 6. Dial.
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
