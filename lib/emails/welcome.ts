// Confirmation email sent the moment the /letsbuild lead form is submitted —
// mirrors the /received page: a welcome, "Pay and secure your spot" with the
// tier price card(s), and "we start right away". The "Pay X" buttons are
// plain links to /api/build-checkout (GET), which creates the Stripe session
// and redirects to checkout — because emails can't submit forms.
//
// Localized: English (USD) plus Spanish and Chinese (EUR), matching the
// /es and /zh funnels.

import { unsubscribeFooterHtml } from '@/lib/emails/contactAck'
import type { Locale } from '@/lib/i18n/funnel'

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

// Tiers per locale. USD for English; EUR for Spanish + Chinese (numbers match
// the funnel dictionary and the Stripe EUR products).
const TIERS: Record<Locale, Tier[]> = {
  en: [
    { plan: 'launch', name: 'Launch', price: '$699', care: '$49', pay: '$349', desc: 'A functional, modern website — mobile-optimized, with your own domain, contact forms and SEO.' },
    { plan: 'business', name: 'Business', price: '$1,199', care: '$49', pay: '$599', desc: 'A functional, modern website with advanced payments and scheduling capabilities.' },
    { plan: 'pro', name: 'Pro', price: '$2,799', from: true, care: '$99', pay: '$1,399', desc: 'A functional, modern website with advanced functionality and high-performance applications.', dark: true },
  ],
  es: [
    { plan: 'launch', name: 'Launch', price: '699€', care: '49€', pay: '349€', desc: 'Una web funcional y moderna — optimizada para móvil, con tu propio dominio, formularios de contacto y SEO.' },
    { plan: 'business', name: 'Business', price: '1.199€', care: '49€', pay: '599€', desc: 'Una web funcional y moderna con pagos avanzados y sistema de reservas.' },
    { plan: 'pro', name: 'Pro', price: '2.799€', from: true, care: '99€', pay: '1.399€', desc: 'Una web funcional y moderna con funcionalidades avanzadas y aplicaciones de alto rendimiento.', dark: true },
  ],
  zh: [
    { plan: 'launch', name: 'Launch', price: '€699', care: '€49', pay: '€349', desc: '一个功能完善的现代网站 —— 适配手机、含独立域名、联系表单和 SEO。' },
    { plan: 'business', name: 'Business', price: '€1.199', care: '€49', pay: '€599', desc: '一个功能完善的现代网站，支持进阶支付与预约功能。' },
    { plan: 'pro', name: 'Pro', price: '€2.799', from: true, care: '€99', pay: '€1.399', desc: '一个功能完善的现代网站，具备进阶功能与高性能应用。', dark: true },
  ],
}

type Copy = {
  subject: (fn: string) => string
  hi: (fn: string) => string
  intro: string
  step1Title: string
  step1Body: string
  step2Title: string
  payVerb: string
  from: string
  payLine: (name: string, pay: string, href: string) => string
}

const COPY: Record<Locale, Copy> = {
  en: {
    subject: fn => `Welcome${fn} — let's get started with your website`,
    hi: fn => `Welcome${fn}!`,
    intro: "Let's get started with your website:",
    step1Title: 'Pay and secure your spot',
    step1Body: "Start now by paying 50%. This locks in your project and reserves your place in our schedule — we'll start working on it right away.",
    step2Title: "We'll start working on your website right away",
    payVerb: 'Pay',
    from: 'From ',
    payLine: (name, pay, href) => `${name} — pay ${pay}: ${href}`,
  },
  es: {
    subject: fn => `Bienvenido/a${fn} — empecemos con tu web`,
    hi: fn => `¡Bienvenido/a${fn}!`,
    intro: 'Empecemos con tu web:',
    step1Title: 'Paga y reserva tu plaza',
    step1Body: 'Empieza ahora pagando el 50%. Esto confirma tu proyecto y reserva tu lugar en nuestra agenda — empezamos a trabajar enseguida.',
    step2Title: 'Empezamos a trabajar en tu web enseguida',
    payVerb: 'Pagar',
    from: 'Desde ',
    payLine: (name, pay, href) => `${name} — paga ${pay}: ${href}`,
  },
  zh: {
    subject: fn => `欢迎${fn}，我们开始做你的网站吧`,
    hi: fn => `欢迎${fn}！`,
    intro: '我们开始做你的网站吧：',
    step1Title: '付款并锁定名额',
    step1Body: '先支付 50% 即可启动项目，并在我们的排期中为你占好位置 —— 我们会马上开工。',
    step2Title: '我们会马上开始制作你的网站',
    payVerb: '支付',
    from: '低至 ',
    payLine: (name, pay, href) => `${name} —— 支付 ${pay}：${href}`,
  },
}

function checkoutHref(plan: string, name: string, email: string, company: string, locale: Locale): string {
  const p = new URLSearchParams({ plan })
  if (name) p.set('name', name)
  if (email) p.set('email', email)
  if (company) p.set('company', company)
  if (locale !== 'en') p.set('locale', locale)
  return `${BASE}/api/build-checkout?${p.toString()}`
}

function cardHtml(tier: Tier, name: string, email: string, company: string, locale: Locale, c: Copy): string {
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
        ${tier.from ? `<span style="font-size:13px; color:${sub};">${c.from}</span>` : ''}<span style="font-size:26px; font-weight:700;">${tier.price}</span>
      </p>
      <p style="margin:0 0 16px 0; font-size:14px; line-height:1.5; color:${body};">${tier.desc}</p>
      <a href="${checkoutHref(tier.plan, name, email, company, locale)}" style="display:block; text-align:center; background-color:${btnBg}; color:#ffffff; font-size:15px; font-weight:600; text-decoration:none; padding:12px 20px; border-radius:12px;">${c.payVerb} ${tier.pay}</a>
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
  locale = 'en',
}: {
  name?: string
  email?: string
  company?: string
  plan?: string
  locale?: Locale
}): { subject: string; html: string; text: string } {
  const loc: Locale = locale === 'es' || locale === 'zh' ? locale : 'en'
  const c = COPY[loc]
  const tiers = TIERS[loc]
  const firstName = (name || '').trim().split(/\s+/)[0]
  const fn = firstName ? ` ${firstName}` : ''
  const em = (email || '').trim()
  const co = (company || '').trim()
  const shown = plan && tiers.some(t => t.plan === plan) ? tiers.filter(t => t.plan === plan) : tiers

  const subject = c.subject(fn)
  const cards = shown.map(t => cardHtml(t, name || '', em, co, loc, c)).join('')

  const text = [
    c.hi(fn),
    c.intro,
    '',
    `1. ${c.step1Title}`,
    c.step1Body,
    '',
    ...shown.map(t => c.payLine(t.name, t.pay, checkoutHref(t.plan, name || '', em, co, loc))),
    '',
    `2. ${c.step2Title}`,
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="${loc}"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="color-scheme" content="light only" /></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; -webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr><td style="padding:36px 36px 0 36px;"><img src="${LOGO_URL}" alt="Yele" width="56" height="56" style="display:block; width:56px; height:56px; max-width:56px; border:0; outline:none;" /></td></tr>
        <tr><td style="padding:18px 36px 0 36px;"><div style="width:44px; height:4px; border-radius:4px; background-color:${PINK};"></div></td></tr>
        <tr><td style="padding:20px 36px 0 36px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <h1 style="margin:0 0 6px 0; font-size:30px; line-height:1.2; font-weight:700; color:${INK};">${c.hi(fn)}</h1>
          <p style="margin:0; font-size:18px; color:${MUTED};">${c.intro}</p>
        </td></tr>

        <!-- Step 1 -->
        <tr><td style="padding:26px 36px 0 36px; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="46" valign="top">${stepBadge(1)}</td>
            <td valign="top">
              <p style="margin:0 0 4px 0; font-size:19px; font-weight:700; color:${INK};">${c.step1Title}</p>
              <p style="margin:0; font-size:15px; line-height:1.55; color:#3a3a40;">${c.step1Body}</p>
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
              <p style="margin:6px 0 0 0; font-size:19px; font-weight:700; color:${INK};">${c.step2Title}</p>
            </td>
          </tr></table>
        </td></tr>

        ${unsubscribeFooterHtml(em, loc)}
      </table>
    </td></tr>
  </table>
</body></html>`

  return { subject, html, text }
}
