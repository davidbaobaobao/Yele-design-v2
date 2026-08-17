import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import {
  channelLabel,
  colorLabels,
  effectLabels,
  functionalityLabels,
  goalLabel,
  involvementLabel,
  planLabel,
  styleLabels,
  updateOftenLabels,
} from '@/app/survey/_lib/data'

const RECIPIENTS = [
  process.env.STUDIO_EMAIL ?? 'info@yele.design',
  process.env.OWNER_EMAIL ?? 'davidbaobaobao@gmail.com',
]

// Handles both debounced per-step autosaves (completed omitted/false) and the
// final submit (completed: true). All writes go through the service-role key
// server-side rather than the browser writing to Supabase directly — a plain
// anon RLS policy permissive enough for upsert-on-conflict also requires
// SELECT visibility on the row, which would let anyone holding the public
// anon key dump every lead's contact details.
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      company,
      email,
      phone,
      planInterest,
      goal,
      involvementLevel,
      preferredChannel,
      styles,
      colors,
      effects,
      business,
      sells,
      links,
      noWebPresence,
      services,
      servicesFromLinks,
      address,
      hours,
      updateOften,
      functionality,
      logoUrl,
      photoUrls,
      needsBranding,
      currentStep,
      completed,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing session id' }, { status: 400 })
    }

    const isCompleting = completed === true

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let alreadyCompleted = false
    if (isCompleting) {
      const { data: existing } = await supabaseAdmin
        .from('survey_responses')
        .select('completed')
        .eq('id', id)
        .maybeSingle()
      alreadyCompleted = existing?.completed === true
    }

    const payload: Record<string, unknown> = {
      id,
      updated_at: new Date().toISOString(),
      name: name || null,
      company: company || null,
      email: email || null,
      phone: phone || null,
      plan_interest: planInterest || null,
      goal: goal || null,
      involvement_level: involvementLevel || null,
      preferred_channel: preferredChannel || null,
      styles: styles ?? [],
      colors: colors ?? [],
      effects: effects ?? [],
      business: business || null,
      sells: sells || null,
      links: links ?? {},
      no_web_presence: noWebPresence ?? false,
      services: services ?? [],
      services_from_links: servicesFromLinks ?? false,
      address: address ?? {},
      hours: hours ?? {},
      update_often: updateOften ?? [],
      functionality: functionality ?? [],
      logo_url: logoUrl || null,
      photo_urls: photoUrls ?? [],
      needs_branding: needsBranding ?? false,
      current_step: currentStep ?? 1,
    }
    if (isCompleting) payload.completed = true

    const { error: upsertError } = await supabaseAdmin.from('survey_responses').upsert(payload)

    if (upsertError) {
      console.error('[survey] upsert error', upsertError.message)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (isCompleting && !alreadyCompleted) {
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey) {
        const resend = new Resend(resendKey)
        await resend.emails.send({
          from: 'Yele Survey <info@yele.design>',
          to: RECIPIENTS,
          replyTo: email || undefined,
          subject: `New survey completed — ${name || company || 'anonymous lead'}`,
          html: buildCompletionEmail({
            name,
            company,
            email,
            phone,
            planInterest,
            goal,
            involvementLevel,
            preferredChannel,
            styles,
            colors,
            effects,
            business,
            sells,
            links,
            noWebPresence,
            services,
            servicesFromLinks,
            address,
            hours,
            updateOften,
            functionality,
            logoUrl,
            photoUrls,
            needsBranding,
          }),
        })
      } else {
        console.log('[survey] RESEND_API_KEY not set — completion email skipped', { id })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[survey] error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

interface CompletionEmailData {
  name?: string
  company?: string
  email?: string
  phone?: string
  planInterest?: string
  goal?: string
  involvementLevel?: string
  preferredChannel?: string
  styles?: string[]
  colors?: string[]
  effects?: string[]
  business?: string
  sells?: string
  links?: Record<string, string>
  noWebPresence?: boolean
  services?: { name: string; price: string }[]
  servicesFromLinks?: boolean
  address?: { hasPhysical?: boolean; line1?: string; city?: string; state?: string; zip?: string }
  hours?: { mode?: string; preset?: string }
  updateOften?: string[]
  functionality?: string[]
  logoUrl?: string
  photoUrls?: string[]
  needsBranding?: boolean
}

function buildCompletionEmail(data: CompletionEmailData): string {
  const row = (label: string, value: string | undefined | null) =>
    value
      ? `<tr>
          <td style="padding:8px 16px;font-size:12px;font-weight:600;color:#8A8A92;text-transform:uppercase;letter-spacing:0.06em;width:160px;vertical-align:top;">${label}</td>
          <td style="padding:8px 16px;font-size:14px;color:#16161A;vertical-align:top;">${value}</td>
        </tr>`
      : ''

  const section = (title: string, rows: string) =>
    rows
      ? `<div style="margin-bottom:24px;">
      <div style="background:#F7F6F3;padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#8A8A92;">${title}</div>
      <table style="width:100%;border-collapse:collapse;border:1px solid #E8E4DF;">${rows}</table>
    </div>`
      : ''

  const linkRows = data.links
    ? Object.entries(data.links)
        .filter(([, v]) => v)
        .map(([k, v]) => row(k, v))
        .join('')
    : ''

  const servicesText = data.services?.length
    ? data.services
        .filter((s) => s.name)
        .map((s) => `${s.name}${s.price ? ` — ${s.price}` : ''}`)
        .join('<br/>')
    : ''

  const addr = data.address
  const addressText = addr?.hasPhysical
    ? [addr.line1, addr.city, addr.state, addr.zip].filter(Boolean).join(', ')
    : addr?.hasPhysical === false
      ? 'Online only / mobile business'
      : ''

  const hoursText = data.hours?.mode === 'google'
    ? 'Pulled from Google Business Profile'
    : data.hours?.mode === 'preset'
      ? data.hours.preset
      : data.hours?.mode === 'custom'
        ? 'Custom (see admin panel)'
        : ''

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F7F6F3;font-family:Arial,sans-serif;">
<div style="max-width:640px;margin:0 auto;background:#FFFFFF;">
  <div style="background:#16161A;padding:24px 32px;">
    <span style="font-size:20px;font-weight:700;color:#FFFFFF;font-family:Georgia,serif;">yele</span>
    <span style="color:#D46FC8;font-size:20px;font-weight:700;">.design</span>
    <span style="color:#8A8A92;font-size:12px;margin-left:12px;">Survey completed</span>
  </div>
  <div style="padding:28px 32px 8px;">
    <h1 style="margin:0;font-size:26px;color:#16161A;font-family:Georgia,serif;font-weight:400;letter-spacing:-0.02em;">${data.name || data.company || 'New lead'}</h1>
    <p style="margin:6px 0 0;font-size:14px;color:#8A8A92;">${[data.company, data.email, data.phone].filter(Boolean).join(' · ')}</p>
  </div>
  <div style="padding:16px 32px 32px;">
    ${section(
      'Contact',
      row('Name', data.name) +
        row('Company', data.company) +
        row('Email', data.email) +
        row('Phone', data.phone) +
        row('Preferred channel', data.preferredChannel ? channelLabel(data.preferredChannel) : null)
    )}
    ${section('Plan interest', row('Plan', data.planInterest ? planLabel(data.planInterest) : null))}
    ${section(
      'Design brief',
      row('Involvement', data.involvementLevel ? involvementLabel(data.involvementLevel) : null) +
        row('Goal', data.goal ? goalLabel(data.goal) : null) +
        row('Styles', data.styles?.length ? styleLabels(data.styles).join(', ') : null) +
        row('Colours', data.colors?.length ? colorLabels(data.colors).join(', ') : null) +
        row('Site feel', data.effects?.length ? effectLabels(data.effects).join(', ') : null)
    )}
    ${section(
      'The business',
      row('What they do', data.business) + row('What they sell / edge', data.sells)
    )}
    ${section(
      'Online presence',
      row('Not online yet', data.noWebPresence ? 'Yes' : null) + linkRows
    )}
    ${section(
      'Services / products',
      row('Pull from links', data.servicesFromLinks ? 'Yes' : null) + row('Listed', servicesText || null)
    )}
    ${section('Location & hours', row('Address', addressText || null) + row('Hours', hoursText || null))}
    ${section(
      'Site upkeep',
      row('Updates often', data.updateOften?.length ? updateOftenLabels(data.updateOften).join(', ') : null)
    )}
    ${section(
      'Functionality wanted',
      row('Features', data.functionality?.length ? functionalityLabels(data.functionality).join(', ') : null)
    )}
    ${section(
      'Assets',
      row('Needs branding', data.needsBranding ? 'Yes' : null) +
        row('Logo', data.logoUrl || null) +
        row('Photos', data.photoUrls?.length ? `${data.photoUrls.length} uploaded` : null)
    )}
    <div style="text-align:center;margin-top:24px;">
      <a href="https://app.yele.design/admin" style="display:inline-block;background:#16161A;color:#FFFFFF;font-weight:700;font-size:13px;padding:14px 32px;text-decoration:none;letter-spacing:0.04em;border-radius:8px;">
        Ver en panel de admin →
      </a>
    </div>
  </div>
  <div style="background:#F7F6F3;padding:16px 32px;font-size:11px;color:#8A8A92;text-align:center;border-top:1px solid #E8E4DF;">
    Yele Studio · yele.design · Survey completed ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
  </div>
</div>
</body></html>`
}
