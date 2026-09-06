import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// Final (remaining 50%) payment + Yele Care subscription (first month free).
// Stripe Checkout in subscription mode: the one-time "final payment" price is
// charged immediately on the first invoice, while the recurring Yele Care price
// gets a 30-day trial (trial_period_days) so the first month is free.
//
// Final-payment price IDs are the ones created in Stripe for these products.
// The Yele Care recurring prices MUST be provided via env (create $49/mo and
// $99/mo recurring prices in Stripe):
//   STRIPE_PRICE_CARE_49  — Launch & Business ($49/mo)
//   STRIPE_PRICE_CARE_99  — Pro ($99/mo)
// Yele Care recurring prices ($49/mo and $99/mo Yele Care+). Env wins; the
// literals are the prices created in Stripe for the Yele Care products.
const CARE_49 = process.env.STRIPE_PRICE_CARE_49 ?? 'price_1UCgr4JUBlsgtyU8eyNZCtAD'
const CARE_99 = process.env.STRIPE_PRICE_CARE_99 ?? 'price_1UChHwJUBlsgtyU8l1QgioKC'

const PLANS: Record<string, { label: string; final: string; care: string }> = {
  launch: {
    label: 'Launch',
    final: process.env.STRIPE_PRICE_LAUNCH_FINAL ?? 'price_1UCh0MJUBlsgtyU8IAzhXc4u',
    care: CARE_49,
  },
  business: {
    label: 'Business',
    final: process.env.STRIPE_PRICE_BUSINESS_FINAL ?? 'price_1UCh1sJUBlsgtyU8uC6ByW5j',
    care: CARE_49,
  },
  pro: {
    label: 'Pro',
    final: process.env.STRIPE_PRICE_PRO_FINAL ?? 'price_1UCh34JUBlsgtyU813KOHJSe',
    care: CARE_99,
  },
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : ''
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yele.design'

  try {
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

    const cfg = PLANS[plan]
    if (!cfg) {
      return Response.json({ error: 'Unknown plan' }, { status: 400 })
    }
    if (!cfg.care) {
      console.error('[final-checkout] Yele Care recurring price not configured (STRIPE_PRICE_CARE_49 / STRIPE_PRICE_CARE_99)')
      return Response.json({ error: 'Yele Care subscription price not configured' }, { status: 500 })
    }

    const successParams = new URLSearchParams({ plan })
    if (name) successParams.set('name', name)
    const cancelParams = new URLSearchParams({ plan, type: 'final' })
    if (name) cancelParams.set('name', name)
    if (email) cancelParams.set('email', email)
    if (company) cancelParams.set('company', company)

    const meta = { flow: 'build_final_payment', plan, planLabel: cfg.label, name, email, company }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: cfg.final, quantity: 1 }, // one-time — charged now
        { price: cfg.care, quantity: 1 }, // recurring Yele Care — 30-day free trial
      ],
      customer_email: email || undefined,
      payment_method_collection: 'always',
      subscription_data: {
        trial_period_days: 30,
        metadata: meta,
      },
      success_url: `${baseUrl}/live?${successParams.toString()}`,
      cancel_url: `${baseUrl}/payment-failed?${cancelParams.toString()}`,
      locale: 'auto',
      allow_promotion_codes: true,
      metadata: meta,
    })

    if (!session.url) {
      return Response.json({ error: 'Could not create checkout session' }, { status: 500 })
    }
    return Response.redirect(session.url, 303)
  } catch (error) {
    console.error('[final-checkout] error', error)
    return Response.json({ error: 'Error creating checkout session' }, { status: 500 })
  }
}
