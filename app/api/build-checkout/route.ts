import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// First-payment (50% to start) products for the /letsbuild one-time build
// tiers. Env vars win when set; the literal price IDs are the ones created in
// Stripe for these three products so the flow works without extra config.
// USD is the default; the Spanish + Chinese versions charge in EUR.
const PRICE_IDS_USD: Record<string, string> = {
  launch: process.env.STRIPE_PRICE_LAUNCH_FIRST ?? 'price_1UCfy6JUBlsgtyU8yKKeulK4',
  business: process.env.STRIPE_PRICE_BUSINESS_FIRST ?? 'price_1UCfzQJUBlsgtyU8c2fMR8vd',
  pro: process.env.STRIPE_PRICE_PRO_FIRST ?? 'price_1UCg1UJUBlsgtyU8Km6dJF1O',
}

const PRICE_IDS_EUR: Record<string, string> = {
  launch: process.env.STRIPE_PRICE_LAUNCH_FIRST_EUR ?? 'price_1UGowuJUBlsgtyU8BsLC9nm8',
  business: process.env.STRIPE_PRICE_BUSINESS_FIRST_EUR ?? 'price_1UGozcJUBlsgtyU8PqoBviMy',
  pro: process.env.STRIPE_PRICE_PRO_FIRST_EUR ?? 'price_1UGp1nJUBlsgtyU84fgVJ7Ch',
}

// es + zh checkouts are priced in EUR; everything else in USD.
function pricesFor(locale: string): Record<string, string> {
  return locale === 'es' || locale === 'zh' ? PRICE_IDS_EUR : PRICE_IDS_USD
}

const PLAN_LABEL: Record<string, string> = {
  launch: 'Launch',
  business: 'Business',
  pro: 'Pro',
}

async function createSession({ plan, name, email, company, locale }: { plan: string; name: string; email: string; company: string; locale: string }) {
  const priceId = pricesFor(locale)[plan]
  if (!priceId) return { error: 'Unknown plan', status: 400 as const }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yele.design'

  const successParams = new URLSearchParams({ welcome: '1' })
  if (name) successParams.set('name', name)
  if (company) successParams.set('company', company)
  if (email) successParams.set('email', email)

  const cancelParams = new URLSearchParams({ plan })
  if (name) cancelParams.set('name', name)
  if (email) cancelParams.set('email', email)
  if (company) cancelParams.set('company', company)
  if (locale) cancelParams.set('locale', locale)

  // Stripe Tax: with the products set to "tax not included" (exclusive), IVA/VAT
  // is added ON TOP at checkout based on the address the customer enters — so
  // the "+ IVA" on the site becomes a real line on the Stripe page. Needs Stripe
  // Tax active on the account; set STRIPE_AUTOMATIC_TAX=0 to turn it off.
  const automaticTax = process.env.STRIPE_AUTOMATIC_TAX !== '0'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email || undefined,
    success_url: `${baseUrl}/survey?${successParams.toString()}`,
    cancel_url: `${baseUrl}/payment-failed?${cancelParams.toString()}`,
    locale: 'auto',
    allow_promotion_codes: true,
    automatic_tax: { enabled: automaticTax },
    billing_address_collection: 'required',
    metadata: { flow: 'build_first_payment', plan, planLabel: PLAN_LABEL[plan] ?? plan, name, email, company, locale },
    payment_intent_data: { metadata: { flow: 'build_first_payment', plan, name, email, company } },
  })

  if (!session.url) return { error: 'Could not create checkout session', status: 500 as const }
  return { url: session.url }
}

// GET — used by the "Pay $X" buttons in the confirmation email (a plain link).
// e.g. /api/build-checkout?plan=launch&name=..&email=..&company=..
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const res = await createSession({
      plan: (url.searchParams.get('plan') ?? '').trim(),
      name: (url.searchParams.get('name') ?? '').trim(),
      email: (url.searchParams.get('email') ?? '').trim(),
      company: (url.searchParams.get('company') ?? '').trim(),
      locale: (url.searchParams.get('locale') ?? '').trim(),
    })
    if ('error' in res) {
      // Fall back to the pricing section rather than showing a raw error.
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yele.design'
      return Response.redirect(`${baseUrl}/letsbuild#pricing`, 303)
    }
    return Response.redirect(res.url, 303)
  } catch (error) {
    console.error('[build-checkout GET] error', error)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yele.design'
    return Response.redirect(`${baseUrl}/letsbuild#pricing`, 303)
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let plan = '', name = '', email = '', company = '', locale = ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      plan = String(body.plan ?? '').trim()
      name = String(body.name ?? '').trim()
      email = String(body.email ?? '').trim()
      company = String(body.company ?? '').trim()
      locale = String(body.locale ?? '').trim()
    } else {
      const form = await request.formData()
      const g = (k: string) => { const v = form.get(k); return typeof v === 'string' ? v.trim() : '' }
      plan = g('plan'); name = g('name'); email = g('email'); company = g('company'); locale = g('locale')
    }
    const res = await createSession({ plan, name, email, company, locale })
    if ('error' in res) return Response.json({ error: res.error }, { status: res.status })
    return Response.redirect(res.url, 303)
  } catch (error) {
    console.error('[build-checkout] error', error)
    return Response.json({ error: 'Error creating checkout session' }, { status: 500 })
  }
}
