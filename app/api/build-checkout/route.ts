import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// First-payment (50% to start) products for the /letsbuild one-time build
// tiers. Env vars win when set; the literal price IDs are the ones created in
// Stripe for these three products so the flow works without extra config.
const PRICE_IDS: Record<string, string> = {
  launch: process.env.STRIPE_PRICE_LAUNCH_FIRST ?? 'price_1UCfy6JUBlsgtyU8yKKeulK4',
  business: process.env.STRIPE_PRICE_BUSINESS_FIRST ?? 'price_1UCfzQJUBlsgtyU8c2fMR8vd',
  pro: process.env.STRIPE_PRICE_PRO_FIRST ?? 'price_1UCg1UJUBlsgtyU8Km6dJF1O',
}

const PLAN_LABEL: Record<string, string> = {
  launch: 'Launch',
  business: 'Business',
  pro: 'Pro',
}

async function createSession({ plan, name, email, company }: { plan: string; name: string; email: string; company: string }) {
  const priceId = PRICE_IDS[plan]
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

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email || undefined,
    success_url: `${baseUrl}/survey?${successParams.toString()}`,
    cancel_url: `${baseUrl}/payment-failed?${cancelParams.toString()}`,
    locale: 'auto',
    allow_promotion_codes: true,
    metadata: { flow: 'build_first_payment', plan, planLabel: PLAN_LABEL[plan] ?? plan, name, email, company },
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
    let plan = '', name = '', email = '', company = ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      plan = String(body.plan ?? '').trim()
      name = String(body.name ?? '').trim()
      email = String(body.email ?? '').trim()
      company = String(body.company ?? '').trim()
    } else {
      const form = await request.formData()
      const g = (k: string) => { const v = form.get(k); return typeof v === 'string' ? v.trim() : '' }
      plan = g('plan'); name = g('name'); email = g('email'); company = g('company')
    }
    const res = await createSession({ plan, name, email, company })
    if ('error' in res) return Response.json({ error: res.error }, { status: res.status })
    return Response.redirect(res.url, 303)
  } catch (error) {
    console.error('[build-checkout] error', error)
    return Response.json({ error: 'Error creating checkout session' }, { status: 500 })
  }
}
