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

function str(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : ''
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yele.design'

  try {
    // The /received card CTAs post a normal HTML form (so the browser follows
    // the 303 redirect straight to Stripe Checkout). Fall back to JSON for
    // programmatic callers.
    const contentType = request.headers.get('content-type') || ''
    let plan = ''
    let name = ''
    let email = ''
    let company = ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      plan = String(body.plan ?? '').trim()
      name = String(body.name ?? '').trim()
      email = String(body.email ?? '').trim()
      company = String(body.company ?? '').trim()
    } else {
      const form = await request.formData()
      plan = str(form.get('plan'))
      name = str(form.get('name'))
      email = str(form.get('email'))
      company = str(form.get('company'))
    }

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return Response.json({ error: 'Unknown plan' }, { status: 400 })
    }

    // Forward name/company (and welcome flag) into the survey the customer
    // lands on after paying. Stripe can only pre-fill the email field of its
    // own checkout — name/company ride along as metadata + success_url params.
    const successParams = new URLSearchParams({ welcome: '1' })
    if (name) successParams.set('name', name)
    if (company) successParams.set('company', company)
    if (email) successParams.set('email', email)

    // On cancel/failure, send them to the retry page with everything needed to
    // re-launch checkout for the exact same product.
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
      metadata: {
        flow: 'build_first_payment',
        plan,
        planLabel: PLAN_LABEL[plan] ?? plan,
        name,
        email,
        company,
      },
      payment_intent_data: {
        metadata: { flow: 'build_first_payment', plan, name, email, company },
      },
    })

    if (!session.url) {
      return Response.json({ error: 'Could not create checkout session' }, { status: 500 })
    }

    // 303 so the browser re-issues a GET to Stripe's hosted checkout.
    return Response.redirect(session.url, 303)
  } catch (error) {
    console.error('[build-checkout] error', error)
    return Response.json({ error: 'Error creating checkout session' }, { status: 500 })
  }
}
