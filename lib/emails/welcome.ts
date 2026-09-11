// Confirmation email sent the moment the /letsbuild lead form is submitted —
// mirrors the /received page: a welcome, "Pay and secure your spot" with the
// tier price card(s), and "we start right away". The "Pay $X" buttons are
// plain links to /api/build-checkout (GET), which creates the Stripe session
// and redirects to checkout — because emails can't submit forms.

import { unsubscribeFooterHtml } from '@/lib/emails/contactAck'

const LOGO_URL = 'https://wdnwacdkoowrrnyaskjl.supabase.co/storage/v1/object/public/emailimages/yele-logo.png'
const BASE = 'https://yele.design'
const PINK = '#D46FC8'
const INK = '#16161A'
const MUTED = '#6B6B72'

type Tier = {
  plan: 'launch' | 'business' | 'pro'
  name: string
  price: string
  from?: boolean
  care: string
  pay: string
  desc: string
  dark?: boolean
}

const TIERS: Tier[] = [
  { plan: 'launch', name: 'Launch', price: '$699', care: '$49', pay: '$349', desc: 'A functional, modern website — mobile-optimized, with your own domain, contact forms and SEO.' },
  { plan: 'business', name: 'Business', price: '$1,199', care: '$49', pay: '$599', desc: 'A functional, modern website with advanced payments and scheduling capabilities.' },
  { plan: 'pro', name: 'Pro', price: '$2,799', from: true, care: '$99', pay: '$1,399', desc: 'A functional, modern website with advanced functionality and high-performance applications.', dark: true },
]

function checkoutHref(plan: string, name: string, email: string, company: string): string {
  const p = new URLSearchParams({ plan })
  if (name) p.set('name', name)
  if (email) p.set('email', email)
  if (company) p.set('company', company)
  return `${BASE}/api/build-checkout?${p.toString()}`
}

function cardHtml(tier: Tier, name: string, email: string, company: string): string {
  const bg = tier.dark ? '#0D0E12' : '#ffffff'
  const border = tier.dark ? '#0D0E12' : '#e6e6e6'
  const title = tier.dark ? '#ffffff' : INK
  const sub = tier.dark ? 'rgba(255,255,255,0.6)' : MUTED
  const body = tier.dark ? 'rgba(255,255,255,0.8)' : '#3a3a40'
  const btnBg = tier.dark ? '#D46FC8' : INK
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px 0; background-color:${bg}; border:1px solid ${border}; border-radius:16px;">
    <tr><td style="padding:20px 22px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <p style="margin:0 0 4px 0; font-size:18px; font-weight:700; color:${title};">${tier.name}</p>
      <p style="margin:0 0 4px 0; color:${title};">
        ${tier.from ? `<span style="font-size:13px; color:${sub};">From </span>` : ''}<span style="font-size:26px; font-weight:700;">${tier.price}</span>
      </p>
      <p style="margin:0 0 16px 0; font-size:14px; line-height:1.5; color:${body};">${tier.desc}</p>
      <a href="${checkoutHref(tier.plan, name, email, company)}" style="display:block; text-align:center; background-color:${btnBg}; color:#ffffff; font-size:15px; font-weight:600; text-decoration:none; padding:12px 20px; border-radius:12px;">Pay ${tier.pay}</a>
    </td></tr>
  </table>`
}

function stepBadge(n: number): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td width="34" height="34" align="center" valign="middle" style="width:34px; height:34px; background-color:rgba(212,111,200,0.15); border-radius:17px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; font-size:15px; font-weight:700; color:${PINK};">${n}</td></tr></table>`
}

export function welcomeCheckoutEmail({
  name,
  email,
  company,
  plan,
}: {
  name?: string
  email?: string
  company?: string
  plan?: string
}): { subject: string; html: string; text: string } {
  const firstName = (name || '').trim().split(/\s+/)[0]
  const em = (email || '').trim()
  const co = (company || '').trim()
  const shown = plan && TIERS.some(t => t.plan === plan) ? TIERS.filter(t => t.plan === plan) : TIERS

  const subject = `Welcome${firstName ? ` ${firstName}` : ''} — let's get started with your website`

  const cards = shown.map(t => cardHtml(t, name || '', em, co)).join('')

  const text = [
    `Welcome${firstName ? ` ${firstName}` : ''}!`,
    "Let's get started with your website:",
    '',
    '1. Pay and secure your spot',
    "Start now by paying 50%. This locks in your project and reserves your place in our schedule — we'll start working on it right away.",
    '',
    ...shown.map(t => `${t.name} — pay ${t.pay}: ${checkoutHref(t.plan, name || '', em, co)}`),
    '',
    '2. We will start working on your website right away.',
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="color-scheme" content="light only" /></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; -webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr><td style="padding:36px 36px 0 36px;"><img src="${LOGO_URL}" alt="Yele" width="56" height="56" style="display:block; width:56px; height:56px; max-width:56px; border:0; outline:none;" /></td></tr>
        <tr><td style="padding:18px 36px 0 36px;"><div style="width:44px; height:4px; border-radius:4px; background-color:${PINK};"></div></td></tr>
        <tr><td style="padding:20px 36px 0 36px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <h1 style="margin:0 0 6px 0; font-size:30px; line-height:1.2; font-weight:700; color:${INK};">Welcome${firstName ? ` ${firstName}` : ''}!</h1>
          <p style="margin:0; font-size:18px; color:${MUTED};">Let&rsquo;s get started with your website:</p>
        </td></tr>

        <!-- Step 1 -->
        <tr><td style="padding:26px 36px 0 36px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="46" valign="top">${stepBadge(1)}</td>
            <td valign="top">
              <p style="margin:0 0 4px 0; font-size:19px; font-weight:700; color:${INK};">Pay and secure your spot</p>
              <p style="margin:0; font-size:15px; line-height:1.55; color:#3a3a40;">Start now by paying 50%. This locks in your project and reserves your place in our schedule — we&rsquo;ll start working on it right away.</p>
            </td>
          </tr></table>
        </td></tr>

        <!-- Cards -->
        <tr><td style="padding:16px 36px 0 36px;">${cards}</td></tr>

        <!-- Step 2 -->
        <tr><td style="padding:14px 36px 36px 36px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="46" valign="top">${stepBadge(2)}</td>
            <td valign="top">
              <p style="margin:6px 0 0 0; font-size:19px; font-weight:700; color:${INK};">We&rsquo;ll start working on your website right away</p>
            </td>
          </tr></table>
        </td></tr>

        ${unsubscribeFooterHtml(em)}
      </table>
    </td></tr>
  </table>
</body></html>`

  return { subject, html, text }
}
