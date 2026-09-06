import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { clientConfirmationEmail, finalConfirmationEmail, internalPaymentEmail } from '@/lib/emails/confirmation'

export const dynamic = 'force-dynamic'

const INTERNAL_RECIPIENTS = [
  process.env.STUDIO_EMAIL ?? 'info@yele.design',
  process.env.OWNER_EMAIL ?? 'davidbaobaobao@gmail.com',
]

// First-payment (50% deposit) confirmation emails for the /letsbuild build
// tiers — sent from the webhook so they only fire once Stripe confirms the
// payment actually succeeded. No-ops cleanly if RESEND_API_KEY isn't set.
async function sendBuildPaymentEmails(session: Stripe.Checkout.Session) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.log('[stripe-webhook] RESEND_API_KEY unset — build payment emails skipped')
    return
  }
  const resend = new Resend(resendKey)

  const m = session.metadata ?? {}
  const name = m.name || ''
  const firstName = name ? name.split(/\s+/)[0] : ''
  const email = m.email || session.customer_details?.email || session.customer_email || ''
  const company = m.company || ''
  const planLabel = m.planLabel || m.plan || ''
  const amount =
    typeof session.amount_total === 'number'
      ? `${(session.amount_total / 100).toFixed(2)} ${(session.currency || '').toUpperCase()}`
      : ''

  const isFinal = m.flow === 'build_final_payment'

  // 1) Client confirmation
  if (email) {
    try {
      const { subject, html, text } = isFinal
        ? finalConfirmationEmail({ firstName, planLabel })
        : clientConfirmationEmail({ firstName, planLabel, name, email, company })
      await resend.emails.send({
        from: 'Yele <noreply@yele.design>',
        to: [email],
        subject,
        html,
        text,
      })
    } catch (err) {
      console.error('[stripe-webhook] client email failed', err)
    }
  }

  // 2) Internal notification
  try {
    const { subject, html, text } = internalPaymentEmail({
      isFinal,
      name,
      email,
      company,
      planLabel,
      amount,
      sessionId: session.id,
    })
    await resend.emails.send({
      from: 'Yele Payments <noreply@yele.design>',
      to: INTERNAL_RECIPIENTS,
      replyTo: email || undefined,
      subject,
      html,
      text,
    })
  } catch (err) {
    console.error('[stripe-webhook] internal email failed', err)
  }
}

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

    // New one-time /letsbuild build first-payment flow — send confirmation +
    // internal notification emails, then done (no subscription/client record).
    if (session.metadata?.flow === 'build_first_payment' || session.metadata?.flow === 'build_final_payment') {
      await sendBuildPaymentEmails(session)
      return new Response('OK', { status: 200 })
    }

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
