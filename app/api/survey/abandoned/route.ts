import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { colorLabels, goalLabel, involvementLabel, planLabel, styleLabels, TOTAL_STEPS } from '@/app/survey/_lib/data'

export const dynamic = 'force-dynamic'

const RECIPIENTS = [
  process.env.STUDIO_EMAIL ?? 'info@yele.design',
  process.env.OWNER_EMAIL ?? 'davidbaobaobao@gmail.com',
]

const ABANDON_AFTER_MS = 2 * 60 * 60 * 1000 // 2 hours

interface AbandonedRow {
  id: string
  updated_at: string
  name: string | null
  company: string | null
  email: string | null
  phone: string | null
  plan_interest: string | null
  goal: string | null
  involvement_level: string | null
  styles: string[] | null
  colors: string[] | null
  business: string | null
  sells: string | null
  current_step: number | null
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const cutoff = new Date(Date.now() - ABANDON_AFTER_MS).toISOString()

    const { data: rows, error } = await supabaseAdmin
      .from('survey_responses')
      .select('id, updated_at, name, company, email, phone, plan_interest, goal, involvement_level, styles, colors, business, sells, current_step')
      .eq('completed', false)
      .eq('flagged', false)
      .lt('updated_at', cutoff)
      .or('email.not.is.null,phone.not.is.null')

    if (error) {
      console.error('[survey/abandoned] query error', error.message)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const leads = (rows ?? []) as AbandonedRow[]

    if (leads.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: 'Yele Survey <info@yele.design>',
        to: RECIPIENTS,
        subject: `${leads.length} incomplete survey lead${leads.length > 1 ? 's' : ''} to follow up`,
        html: buildDigestEmail(leads),
      })
    } else {
      console.log('[survey/abandoned] RESEND_API_KEY not set — digest skipped', { count: leads.length })
    }

    const { error: flagError } = await supabaseAdmin
      .from('survey_responses')
      .update({ flagged: true })
      .in('id', leads.map((l) => l.id))

    if (flagError) {
      console.error('[survey/abandoned] flag error', flagError.message)
    }

    return NextResponse.json({ ok: true, sent: leads.length })
  } catch (err) {
    console.error('[survey/abandoned] error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function buildDigestEmail(leads: AbandonedRow[]): string {
  const row = (label: string, value: string | null | undefined) =>
    value
      ? `<tr>
          <td style="padding:6px 12px;font-size:11px;font-weight:600;color:#8A8A92;text-transform:uppercase;letter-spacing:0.06em;width:140px;vertical-align:top;">${label}</td>
          <td style="padding:6px 12px;font-size:13px;color:#16161A;vertical-align:top;">${value}</td>
        </tr>`
      : ''

  const card = (lead: AbandonedRow) => `
    <div style="border:1px solid #E8E4DF;border-radius:8px;margin-bottom:16px;overflow:hidden;">
      <div style="background:#F7F6F3;padding:10px 16px;font-size:13px;font-weight:700;color:#16161A;">
        ${lead.name || lead.company || 'Anonymous lead'} — stopped at step ${lead.current_step ?? '?'} of ${TOTAL_STEPS}
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Company', lead.company)}
        ${row('Email', lead.email)}
        ${row('Phone', lead.phone)}
        ${row('Plan', lead.plan_interest ? planLabel(lead.plan_interest) : null)}
        ${row('Involvement', lead.involvement_level ? involvementLabel(lead.involvement_level) : null)}
        ${row('Goal', lead.goal ? goalLabel(lead.goal) : null)}
        ${row('Styles', lead.styles?.length ? styleLabels(lead.styles).join(', ') : null)}
        ${row('Colours', lead.colors?.length ? colorLabels(lead.colors).join(', ') : null)}
        ${row('What they do', lead.business)}
        ${row('Sells / edge', lead.sells)}
        ${row('Last activity', new Date(lead.updated_at).toLocaleString('en-US'))}
      </table>
    </div>`

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F7F6F3;font-family:Arial,sans-serif;">
<div style="max-width:640px;margin:0 auto;background:#FFFFFF;">
  <div style="background:#16161A;padding:24px 32px;">
    <span style="font-size:20px;font-weight:700;color:#FFFFFF;font-family:Georgia,serif;">yele</span>
    <span style="color:#D46FC8;font-size:20px;font-weight:700;">.design</span>
    <span style="color:#8A8A92;font-size:12px;margin-left:12px;">Abandoned survey digest</span>
  </div>
  <div style="padding:24px 32px;">
    <h1 style="margin:0 0 4px;font-size:22px;color:#16161A;font-family:Georgia,serif;font-weight:400;">${leads.length} lead${leads.length > 1 ? 's' : ''} didn&apos;t finish</h1>
    <p style="margin:0 0 20px;font-size:13px;color:#8A8A92;">Left inactive for 2+ hours with contact info on file. Worth a follow-up.</p>
    ${leads.map(card).join('')}
  </div>
  <div style="background:#F7F6F3;padding:16px 32px;font-size:11px;color:#8A8A92;text-align:center;border-top:1px solid #E8E4DF;">
    Yele Studio · yele.design
  </div>
</div>
</body></html>`
}
