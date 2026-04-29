import Stripe from 'stripe'

const PRICE_IDS: Record<string, Record<string, string>> = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
    annual: process.env.STRIPE_PRICE_STARTER_ANNUAL!,
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    annual: process.env.STRIPE_PRICE_PRO_ANNUAL!,
  },
  business: {
    monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY!,
    annual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL!,
  },
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  try {
    const { planId, billing, clientId, promoCode } = await request.json()

    const priceId = PRICE_IDS[planId]?.[billing]
    if (!priceId) {
      return Response.json({ error: 'Plan no disponible' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yele.design'

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/bienvenido?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/elegir-plan?client_id=${clientId ?? ''}`,
      metadata: { clientId: clientId ?? '', planId, billing },
      subscription_data: {
        metadata: { clientId: clientId ?? '', planId, billing },
      },
      locale: 'es',
      allow_promotion_codes: true,
    }

    if (promoCode) {
      try {
        const codes = await stripe.promotionCodes.list({
          code: promoCode,
          active: true,
          limit: 1,
        })
        if (codes.data.length > 0) {
          sessionParams.discounts = [{ promotion_code: codes.data[0].id }]
          delete sessionParams.allow_promotion_codes
        }
      } catch (e) {
        console.error('Promo code lookup failed:', e)
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return Response.json({ error: 'Error creando sesión de pago' }, { status: 500 })
  }
}
