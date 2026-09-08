import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import Retell from 'retell-sdk'

export const dynamic = 'force-dynamic'

// Retell → us. Configure in Retell: Agent → Webhook URL =
// https://yele.design/api/ai-callback/retell-webhook, events: call_analyzed
// (call_ended is accepted too, used only to mark no-answers early).
//
// Writes the post-call analysis to ai_callbacks, then sends (1) the promised
// details email to the lead and (2) a one-line brief to David.

const INTERNAL_RECIPIENTS = [
  process.env.STUDIO_EMAIL ?? 'info@yele.design',
  process.env.OWNER_EMAIL ?? 'davidbaobaobao@gmail.com',
]
const PLAN_LABEL: Record<string, string> = { launch: 'Launch', business: 'Business', pro: 'Pro' }
const PLAN_PRICE: Record<string, string> = { launch: '$699', business: '$1,199', pro: 'from $2,799' }

// Shape of the Retell webhook body we read. Anything else in the payload is
// ignored; custom_analysis_data keys are whatever the agent's post-call
// analysis fields are named.
type RetellWebhookPayload = {
  event: string
  call: {
    metadata?: { lead_id?: string }
    duration_ms?: number
    disconnection_reason?: string
    recording_url?: string
    transcript?: string
    call_analysis?: {
      in_voicemail?: boolean
      call_summary?: string
      custom_analysis_data?: Record<string, unknown>
    }
  }
}

function bool(v: unknown): boolean | null {
  if (typeof v === 'boolean') return v
  if (typeof v === 'string') return /^(true|yes)$/i.test(v)
  return null
}
function text(v: unknown): string | null {
  if (v === undefined || v === null || v === '') return null
  return String(v).slice(0, 2000)
}

export async function POST(request: Request) {
  const raw = await request.text()

  const apiKey = process.env.RETELL_API_KEY
  const signature = request.headers.get('x-retell-signature') ?? ''
  if (!apiKey || !Retell.verify(raw, apiKey, signature)) {
    return new NextResponse('bad signature', { status: 401 })
  }

  const payload = JSON.parse(raw) as RetellWebhookPayload
  const { event, call } = payload
  const lead_id: string | undefined = call?.metadata?.lead_id
  if (!lead_id) return NextResponse.json({ ignored: 'no lead_id in metadata' })

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  if (event === 'call_ended') {
    // Cheap early marker; the real data arrives with call_analyzed.
    await sb.from('ai_callbacks').update({
      call_duration_ms: call.duration_ms ?? null,
      recording_url: call.recording_url ?? null,
    }).eq('id', lead_id).eq('status', 'calling')
    return NextResponse.json({ ok: true })
  }
  if (event !== 'call_analyzed') return NextResponse.json({ ignored: event })

  const analysis = call.call_analysis ?? {}
  const a = analysis.custom_analysis_data ?? {}
  const inVoicemail = !!analysis.in_voicemail
  const reached = (bool(a.reached) ?? false) && !inVoicemail
  const doNotCall = bool(a.do_not_call) ?? false
  const wrongNumber = bool(a.wrong_number) ?? false

  const update = {
    status: doNotCall ? 'dnc' : wrongNumber ? 'wrong_number' : 'called',
    reached,
    paying_now: bool(a.paying_now),
    payment_issue: bool(a.payment_issue),
    website_goal: text(a.website_goal),
    has_existing_site: text(a.has_existing_site),
    plan_interest: text(a.plan_interest),
    questions_asked: text(a.questions_asked),
    callback_window: text(a.callback_window),
    confirmed_email: text(a.confirmed_email),
    wants_human: bool(a.wants_human),
    transferred: bool(a.transferred),
    do_not_call: doNotCall,
    wrong_number: wrongNumber,
    open_questions: text(a.open_questions),
    sentiment: text(a.sentiment),
    call_summary: text(analysis.call_summary),
    transcript: call.transcript ? String(call.transcript).slice(0, 20000) : null,
    recording_url: call.recording_url ?? null,
    call_duration_ms: call.duration_ms ?? null,
    disconnection_reason: call.disconnection_reason ?? null,
  }
  await sb.from('ai_callbacks').update(update).eq('id', lead_id)

  const { data: lead } = await sb.from('ai_callbacks').select('*').eq('id', lead_id).single()
  if (!lead) return NextResponse.json({ ok: true })

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ ok: true, emails: 'skipped (no RESEND_API_KEY)' })
  const resend = new Resend(resendKey)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yele.design'
  const firstName = (lead.name ?? '').trim().split(/\s+/)[0] || ''
  const planLabel = lead.plan ? PLAN_LABEL[lead.plan] : ''
  const planPrice = lead.plan ? PLAN_PRICE[lead.plan] : ''
  const to = lead.confirmed_email || lead.email

  // A call that never connected (invalid/unreachable number) tells us nothing
  // about the lead and the number is bad — don't send the "we just spoke"
  // follow-up, just flag it for David.
  const unreachable = ['invalid_destination', 'no_such_number', 'dial_failed', 'dial_busy']
    .includes(String(call.disconnection_reason ?? '').toLowerCase())

  // 1) The email Ava promised — sent whether they picked up or not, unless
  //    they opted out / wrong number / already paid / number unreachable.
  if (!doNotCall && !wrongNumber && !lead.paid && !unreachable) {
    const payUrl = `${baseUrl}/received?${new URLSearchParams({
      name: lead.name ?? '', email: to, company: lead.business ?? '', ...(lead.plan ? { plan: lead.plan } : {}),
    }).toString()}`
    const when = lead.callback_window && lead.callback_window !== 'email only'
      ? `I'll call you ${lead.callback_window}.`
      : lead.callback_window === 'email only'
        ? 'You asked for the details by email, so here they are — reply to this email or call if you want to talk.'
        : "I'll call you shortly to go through it."
    const planLine = planLabel
      ? `You picked the ${planLabel} plan — ${planPrice}, half to start and half when the site goes live.`
      : 'Plans are Launch $699, Business $1,199 and Pro from $2,799 — half to start and half when the site goes live.'
    try {
      await resend.emails.send({
        from: 'David at Yele <noreply@yele.design>',
        to: [to],
        replyTo: 'info@yele.design',
        subject: `${firstName ? `${firstName}, your` : 'Your'} website with Yele — details and next step`,
        text: [
          `Hi ${firstName || 'there'},`,
          '',
          `Thanks for your request${lead.business ? ` for ${lead.business}` : ''}.`,
          planLine,
          'Delivery is under 4 weeks. I design and build every site myself — no templates.',
          '',
          `Review the plan and start when you're ready: ${payUrl}`,
          '',
          when,
          '',
          'David',
          'Yele — yele.design',
          '+34 655 517 760',
        ].join('\n'),
      })
    } catch (err) {
      console.error('[ai-callback] lead email failed', err)
    }
  }

  // 2) Brief for David.
  const flag = doNotCall ? 'DNC' : wrongNumber ? 'Wrong number' : unreachable ? 'BAD NUMBER' : inVoicemail ? 'Voicemail' : reached ? 'Reached' : 'No answer'
  const urgent = lead.wants_human || lead.payment_issue || lead.paying_now || unreachable
  try {
    await resend.emails.send({
      from: 'Yele AI Callback <noreply@yele.design>',
      to: INTERNAL_RECIPIENTS,
      replyTo: to,
      subject: `${urgent ? '[URGENT] ' : ''}${flag} — ${lead.name}${lead.business ? ` (${lead.business})` : ''} · ${planLabel || 'no plan'} · call ${lead.callback_window ?? 'any time'}`,
      text: [
        `Phone: ${lead.phone_e164}   Email: ${to}   State: ${lead.state}`,
        call.disconnection_reason ? `Call ended: ${call.disconnection_reason}` : null,
        `Goal: ${lead.website_goal ?? '-'}`,
        `Existing site: ${lead.has_existing_site ?? '-'}   Plan interest: ${lead.plan_interest ?? '-'}`,
        lead.paying_now ? 'Said they are PAYING NOW — check Stripe in 30 min.' : null,
        lead.payment_issue ? 'PAYMENT ISSUE — send a payment link.' : null,
        lead.wants_human ? `Wants a human. Transferred: ${lead.transferred ? 'yes' : 'no'}` : null,
        `Questions asked: ${lead.questions_asked ?? '-'}`,
        `Open questions for David: ${lead.open_questions ?? '-'}`,
        `Sentiment: ${lead.sentiment ?? '-'}`,
        '',
        `Summary: ${lead.call_summary ?? '-'}`,
        `Recording: ${lead.recording_url ?? '-'}`,
      ].filter(l => l !== null).join('\n'),
    })
  } catch (err) {
    console.error('[ai-callback] internal email failed', err)
  }

  return NextResponse.json({ ok: true })
}
