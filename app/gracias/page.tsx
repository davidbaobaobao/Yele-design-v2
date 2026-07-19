import { Suspense } from 'react'
import Stripe from 'stripe'
import GraciasClient from './GraciasClient'

export const dynamic = 'force-dynamic'

const PLAN_VALUES: Record<string, { value: number; currency: string }> = {
  'starter':      { value: 99,  currency: 'USD' },
  'pro':          { value: 169, currency: 'USD' },
  'frontier':     { value: 699, currency: 'USD' },
  'starter-es':   { value: 49,  currency: 'EUR' },
  'pro-es':       { value: 79,  currency: 'EUR' },
  'frontier-es':  { value: 599, currency: 'EUR' },
}

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  let conversionValue = 49
  let conversionCurrency = 'EUR'
  let customerEmail: string | null = null

  if (session_id) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
      const session = await stripe.checkout.sessions.retrieve(session_id)
      const planId = session.metadata?.planId
      if (planId && PLAN_VALUES[planId]) {
        conversionValue = PLAN_VALUES[planId].value
        conversionCurrency = PLAN_VALUES[planId].currency
      }
      customerEmail = session.customer_details?.email ?? null
    } catch {
      // fall through to defaults
    }
  }

  return (
    <Suspense>
      <GraciasClient
        conversionValue={conversionValue}
        conversionCurrency={conversionCurrency}
        customerEmail={customerEmail}
      />
    </Suspense>
  )
}
