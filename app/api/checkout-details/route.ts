import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return Response.json({ error: 'No session' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })

    return Response.json({
      planName: session.metadata?.planId || '',
      amount: session.amount_total,
      currency: session.currency,
    })
  } catch (error) {
    console.error('Checkout details error:', error)
    return Response.json({ error: 'Session not found' }, { status: 404 })
  }
}
