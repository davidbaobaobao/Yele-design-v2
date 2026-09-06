// Shared builder for the client "payment received" confirmation email — used
// by the Stripe webhook (real payments) and the guarded test endpoint. Returns
// subject + a professional, email-safe HTML layout (tables + inline styles,
// larger text) and a plain-text fallback.

const LOGO_URL = 'https://wdnwacdkoowrrnyaskjl.supabase.co/storage/v1/object/public/emailimages/yele-logo.png'
const PINK = '#D46FC8'
const INK = '#16161A'
const MUTED = '#6B6B72'

// Shared professional shell so both confirmation emails look identical.
function shell({ heading, bodyParagraphs, buttonLabel, buttonHref }: {
  heading: string
  bodyParagraphs: string[]
  buttonLabel: string
  buttonHref: string
}): string {
  const paras = bodyParagraphs
    .map(
      (p, i) =>
        `<p style="margin:0 0 ${i === bodyParagraphs.length - 1 ? '8' : '20'}px 0; font-size:18px; line-height:1.6; color:${INK};">${p}</p>`
    )
    .join('')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; -webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <tr><td align="center" style="padding:40px 40px 8px 40px;"><img src="${LOGO_URL}" alt="Yele" width="120" style="display:block; height:auto; width:120px; max-width:120px;" /></td></tr>
          <tr><td align="center" style="padding:16px 40px 0 40px;"><div style="width:48px; height:4px; border-radius:4px; background-color:${PINK};"></div></td></tr>
          <tr><td align="center" style="padding:24px 40px 0 40px;"><h1 style="margin:0; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; font-size:30px; line-height:1.25; font-weight:700; color:${INK};">${heading}</h1></td></tr>
          <tr><td style="padding:24px 40px 0 40px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">${paras}</td></tr>
          <tr><td align="center" style="padding:28px 40px 8px 40px;"><a href="${buttonHref}" style="display:inline-block; background-color:${PINK}; color:#ffffff; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; font-size:17px; font-weight:600; text-decoration:none; padding:14px 32px; border-radius:12px;">${buttonLabel}</a></td></tr>
          <tr><td style="padding:24px 40px 40px 40px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"><p style="margin:0; font-size:18px; line-height:1.6; color:${INK};">Talk soon,</p><p style="margin:0; font-size:18px; line-height:1.6; color:${INK}; font-weight:600;">The Yele team</p></td></tr>
          <tr><td align="center" style="padding:24px 40px; border-top:1px solid #ededed; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"><p style="margin:0; font-size:14px; line-height:1.5; color:${MUTED};">Yele &middot; <a href="https://yele.design" style="color:${MUTED}; text-decoration:underline;">yele.design</a></p></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// Final-payment + Yele Care subscription confirmation.
export function finalConfirmationEmail({
  firstName,
  planLabel,
}: {
  firstName?: string
  planLabel?: string
}): { subject: string; html: string; text: string } {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,'
  const forPlan = planLabel ? ` for your ${planLabel} website` : ''
  const subject = "You're all set — your website is going live"
  const text = [
    hi,
    '',
    `Thank you — we've received your final payment${forPlan}, and your Yele Care subscription is active (your first month is free).`,
    '',
    "We're setting your website live now and will be in touch shortly with the details.",
    '',
    'Talk soon,',
    'The Yele team',
  ].join('\n')
  const html = shell({
    heading: "You're all set",
    bodyParagraphs: [
      hi,
      `Thank you &mdash; we&rsquo;ve received your final payment${forPlan}, and your Yele Care subscription is active. Your first month is free.`,
      "We&rsquo;re setting your website live now and will be in touch shortly with the details.",
    ],
    buttonLabel: 'Visit yele.design',
    buttonHref: 'https://yele.design',
  })
  return { subject, html, text }
}

// Internal payment notification (to the studio + owner) — clean HTML with a
// details table, matching the client emails' look.
export function internalPaymentEmail({
  isFinal,
  name,
  email,
  company,
  planLabel,
  amount,
  sessionId,
}: {
  isFinal: boolean
  name?: string
  email?: string
  company?: string
  planLabel?: string
  amount?: string
  sessionId?: string
}): { subject: string; html: string; text: string } {
  const who = name || email || 'new customer'
  const subject = `${isFinal ? 'Final payment + Yele Care' : 'First payment'} — ${who}${planLabel ? ` (${planLabel})` : ''}`
  const intro = isFinal
    ? 'A final payment was completed and the Yele Care subscription started (first month free).'
    : 'A first payment was successfully completed.'

  const rows: [string, string][] = [
    ['Name', name || '(not provided)'],
    ['Email', email || '(not provided)'],
    ...(company ? [['Business', company] as [string, string]] : []),
    ['Plan', planLabel || '(unknown)'],
    ...(amount ? [['Amount', amount] as [string, string]] : []),
    ...(sessionId ? [['Stripe session', sessionId] as [string, string]] : []),
  ]

  const text = [intro, '', ...rows.map(([k, v]) => `${k}: ${v}`)].join('\n')

  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0; font-size:15px; color:${MUTED}; width:130px; vertical-align:top;">${k}</td><td style="padding:8px 0; font-size:15px; color:${INK}; font-weight:500; word-break:break-all;">${v}</td></tr>`
    )
    .join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="color-scheme" content="light only" /></head>
<body style="margin:0; padding:0; background-color:#f4f4f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr><td style="padding:32px 40px 0 40px;"><img src="${LOGO_URL}" alt="Yele" width="96" style="display:block; height:auto; width:96px;" /></td></tr>
        <tr><td style="padding:20px 40px 0 40px;"><div style="width:40px; height:4px; border-radius:4px; background-color:${isFinal ? '#34C759' : PINK};"></div></td></tr>
        <tr><td style="padding:16px 40px 0 40px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <h1 style="margin:0 0 8px 0; font-size:24px; font-weight:700; color:${INK};">${isFinal ? 'Final payment + Yele Care' : 'New payment received'}</h1>
          <p style="margin:0; font-size:16px; line-height:1.5; color:${INK};">${intro}</p>
        </td></tr>
        <tr><td style="padding:16px 40px 40px 40px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #ededed; margin-top:8px;">${rowsHtml}</table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  return { subject, html, text }
}

export function clientConfirmationEmail({
  firstName,
  planLabel,
}: {
  firstName?: string
  planLabel?: string
}): { subject: string; html: string; text: string } {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,'
  const forPlan = planLabel ? ` for the ${planLabel} website` : ''

  const subject = 'We received your payment — Yele'

  const text = [
    hi,
    '',
    `Thank you — we've received your payment${forPlan}.`,
    '',
    "As soon as you fill in your details, we'll get started on your website right away. Either way, we'll also reach out to you briefly.",
    '',
    'Continue your survey: https://yele.design/survey',
    '',
    'Talk soon,',
    'The Yele team',
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; -webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding:40px 40px 8px 40px;">
              <img src="${LOGO_URL}" alt="Yele" width="120" style="display:block; height:auto; width:120px; max-width:120px;" />
            </td>
          </tr>
          <!-- Accent bar -->
          <tr>
            <td align="center" style="padding:16px 40px 0 40px;">
              <div style="width:48px; height:4px; border-radius:4px; background-color:${PINK};"></div>
            </td>
          </tr>
          <!-- Heading -->
          <tr>
            <td align="center" style="padding:24px 40px 0 40px;">
              <h1 style="margin:0; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; font-size:30px; line-height:1.25; font-weight:700; color:${INK};">
                Payment received
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:24px 40px 0 40px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <p style="margin:0 0 20px 0; font-size:18px; line-height:1.6; color:${INK};">${hi}</p>
              <p style="margin:0 0 20px 0; font-size:18px; line-height:1.6; color:${INK};">
                Thank you — we&rsquo;ve received your payment${forPlan}.
              </p>
              <p style="margin:0 0 8px 0; font-size:18px; line-height:1.6; color:${INK};">
                As soon as you fill in your details, we&rsquo;ll get started on your website right away. Either way, we&rsquo;ll also reach out to you briefly.
              </p>
            </td>
          </tr>
          <!-- Button -->
          <tr>
            <td align="center" style="padding:28px 40px 8px 40px;">
              <a href="https://yele.design/survey" style="display:inline-block; background-color:${PINK}; color:#ffffff; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; font-size:17px; font-weight:600; text-decoration:none; padding:14px 32px; border-radius:12px;">
                Continue your details
              </a>
            </td>
          </tr>
          <!-- Sign-off -->
          <tr>
            <td style="padding:24px 40px 40px 40px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <p style="margin:0; font-size:18px; line-height:1.6; color:${INK};">Talk soon,</p>
              <p style="margin:0; font-size:18px; line-height:1.6; color:${INK}; font-weight:600;">The Yele team</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 40px; border-top:1px solid #ededed; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <p style="margin:0; font-size:14px; line-height:1.5; color:${MUTED};">
                Yele &middot; <a href="https://yele.design" style="color:${MUTED}; text-decoration:underline;">yele.design</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, html, text }
}
