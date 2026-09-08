// Simple, non-promotional acknowledgement — sent first, before the welcome +
// checkout email, so a plain "thanks, we'll be in touch" reliably lands in the
// Primary inbox even if the richer welcome email is filed under Promotions.

const LOGO_URL = 'https://wdnwacdkoowrrnyaskjl.supabase.co/storage/v1/object/public/emailimages/yele-logo.png'
const BASE = 'https://yele.design'
const PINK = '#D46FC8'
const INK = '#16161A'
const MUTED = '#6B6B72'

export function unsubscribeUrl(email?: string): string {
  const p = new URLSearchParams()
  if (email) p.set('email', email)
  return `${BASE}/api/unsubscribe?${p.toString()}`
}

// Shared footer with an unsubscribe link (also matched by a List-Unsubscribe
// header set where the email is sent).
export function unsubscribeFooterHtml(email?: string): string {
  return `<tr><td align="center" style="padding:18px 36px 30px 36px; border-top:1px solid #ededed; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <p style="margin:0 0 4px 0; font-size:13px; color:${MUTED};">Yele &middot; <a href="${BASE}" style="color:${MUTED}; text-decoration:underline;">yele.design</a></p>
    <p style="margin:0; font-size:12px; color:${MUTED};">Don&rsquo;t want emails from us? <a href="${unsubscribeUrl(email)}" style="color:${MUTED}; text-decoration:underline;">Unsubscribe</a>.</p>
  </td></tr>`
}

export function contactAckEmail({
  firstName,
  email,
}: {
  firstName?: string
  email?: string
}): { subject: string; html: string; text: string } {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,'
  const subject = 'Thanks for reaching out — Yele'

  const text = [
    hi,
    '',
    'Thank you for reaching us for your new website.',
    'One of our team members will reach you soon.',
    '',
    'Thank you,',
    'The Yele team',
    '',
    `Unsubscribe: ${unsubscribeUrl(email)}`,
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="color-scheme" content="light only" /></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; -webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr><td style="padding:36px 36px 0 36px;"><img src="${LOGO_URL}" alt="Yele" width="56" height="56" style="display:block; width:56px; height:56px; max-width:56px; border:0; outline:none;" /></td></tr>
        <tr><td style="padding:20px 36px 8px 36px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <p style="margin:0 0 16px 0; font-size:17px; line-height:1.6; color:${INK};">${hi}</p>
          <p style="margin:0 0 16px 0; font-size:17px; line-height:1.6; color:${INK};">Thank you for reaching us for <strong style="color:${PINK};">your new website</strong>.</p>
          <p style="margin:0 0 16px 0; font-size:17px; line-height:1.6; color:${INK};">One of our team members will reach you soon.</p>
          <p style="margin:0; font-size:17px; line-height:1.6; color:${INK};">Thank you,<br /><strong>The Yele team</strong></p>
        </td></tr>
        ${unsubscribeFooterHtml(email)}
      </table>
    </td></tr>
  </table>
</body></html>`

  return { subject, html, text }
}
