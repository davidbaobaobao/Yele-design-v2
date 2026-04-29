import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing signature', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return new Response('Webhook signature invalid', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const clientId = session.metadata?.clientId
    const planId = session.metadata?.planId

    if (clientId) {
      const { error } = await supabaseAdmin
        .from('clients')
        .update({
          plan: planId,
          status: 'intake_pending',
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          subscription_active: true,
        })
        .eq('id', clientId)

      if (error) console.error('Supabase update error:', error)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const clientId = sub.metadata?.clientId
    if (clientId) {
      await supabaseAdmin
        .from('clients')
        .update({ subscription_active: false, status: 'paused' })
        .eq('id', clientId)
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const clientId = sub.metadata?.clientId
    if (clientId) {
      await supabaseAdmin
        .from('clients')
        .update({ subscription_active: sub.status === 'active' })
        .eq('id', clientId)
    }
  }

  return new Response('OK', { status: 200 })
}
