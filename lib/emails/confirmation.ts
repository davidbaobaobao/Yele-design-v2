// Shared builder for the client "payment received" confirmation email — used
// by the Stripe webhook (real payments) and the guarded test endpoint. Returns
// subject + a professional, email-safe HTML layout (tables + inline styles,
// larger text) and a plain-text fallback.

const LOGO_URL = 'https://wdnwacdkoowrrnyaskjl.supabase.co/storage/v1/object/public/emailimages/yele-logo.png'
const PINK = '#D46FC8'
const INK = '#16161A'
const MUTED = '#6B6B72'

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
