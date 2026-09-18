// Simple, non-promotional acknowledgement — sent first, before the welcome +
// checkout email, so a plain "thanks, we'll be in touch" reliably lands in the
// Primary inbox even if the richer welcome email is filed under Promotions.

import type { Locale } from '@/lib/i18n/funnel'

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

const FOOTER_UNSUB: Record<Locale, { q: string; link: string }> = {
  en: { q: 'Don&rsquo;t want emails from us?', link: 'Unsubscribe' },
  es: { q: '¿No quieres recibir emails nuestros?', link: 'Cancelar suscripción' },
  zh: { q: '不想再收到我们的邮件？', link: '取消订阅' },
}

// Shared footer with an unsubscribe link (also matched by a List-Unsubscribe
// header set where the email is sent).
export function unsubscribeFooterHtml(email?: string, locale: Locale = 'en'): string {
  const u = FOOTER_UNSUB[locale] ?? FOOTER_UNSUB.en
  return `<tr><td align="center" style="padding:18px 36px 30px 36px; border-top:1px solid #ededed; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <p style="margin:0 0 4px 0; font-size:13px; color:${MUTED};">Yele &middot; <a href="${BASE}" style="color:${MUTED}; text-decoration:underline;">yele.design</a></p>
    <p style="margin:0; font-size:12px; color:${MUTED};">${u.q} <a href="${unsubscribeUrl(email)}" style="color:${MUTED}; text-decoration:underline;">${u.link}</a>.</p>
  </td></tr>`
}

type AckCopy = { subject: string; hi: (fn: string) => string; line1Pre: string; line1Strong: string; line1Post: string; line2: string; thanks: string; team: string }

const ACK: Record<Locale, AckCopy> = {
  en: {
    subject: 'Thanks for reaching out — Yele',
    hi: fn => (fn ? `Hi ${fn},` : 'Hi,'),
    line1Pre: 'Thank you for reaching us for ', line1Strong: 'your new website', line1Post: '.',
    line2: 'One of our team members will reach you soon.',
    thanks: 'Thank you,', team: 'The Yele team',
  },
  es: {
    subject: 'Gracias por escribirnos — Yele',
    hi: fn => (fn ? `Hola ${fn},` : 'Hola,'),
    line1Pre: 'Gracias por contactarnos para ', line1Strong: 'tu nueva web', line1Post: '.',
    line2: 'Un miembro de nuestro equipo te contactará muy pronto.',
    thanks: 'Gracias,', team: 'El equipo de Yele',
  },
  zh: {
    subject: '感谢你的联系 —— Yele',
    hi: fn => (fn ? `你好 ${fn}，` : '你好，'),
    line1Pre: '感谢你联系我们，为你打造', line1Strong: '你的新网站', line1Post: '。',
    line2: '我们的团队成员会很快与你联系。',
    thanks: '谢谢，', team: 'Yele 团队',
  },
}

export function contactAckEmail({
  firstName,
  email,
  locale = 'en',
}: {
  firstName?: string
  email?: string
  locale?: Locale
}): { subject: string; html: string; text: string } {
  const loc: Locale = locale === 'es' || locale === 'zh' ? locale : 'en'
  const c = ACK[loc]
  const fn = (firstName || '').trim()
  const hi = c.hi(fn)

  const text = [
    hi,
    '',
    `${c.line1Pre}${c.line1Strong}${c.line1Post}`,
    c.line2,
    '',
    c.thanks,
    c.team,
    '',
    `${(FOOTER_UNSUB[loc] ?? FOOTER_UNSUB.en).link}: ${unsubscribeUrl(email)}`,
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="${loc}"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="color-scheme" content="light only" /></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; -webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr><td style="padding:36px 36px 0 36px;"><img src="${LOGO_URL}" alt="Yele" width="56" height="56" style="display:block; width:56px; height:56px; max-width:56px; border:0; outline:none;" /></td></tr>
        <tr><td style="padding:20px 36px 8px 36px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <p style="margin:0 0 16px 0; font-size:17px; line-height:1.6; color:${INK};">${hi}</p>
          <p style="margin:0 0 16px 0; font-size:17px; line-height:1.6; color:${INK};">${c.line1Pre}<strong style="color:${PINK};">${c.line1Strong}</strong>${c.line1Post}</p>
          <p style="margin:0 0 16px 0; font-size:17px; line-height:1.6; color:${INK};">${c.line2}</p>
          <p style="margin:0; font-size:17px; line-height:1.6; color:${INK};">${c.thanks}<br /><strong>${c.team}</strong></p>
        </td></tr>
        ${unsubscribeFooterHtml(email, loc)}
      </table>
    </td></tr>
  </table>
</body></html>`

  return { subject: c.subject, html, text }
}
