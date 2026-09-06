'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

// Submits the /api/build-checkout form (which 303-redirects to Stripe) and
// shows a loading state while the browser navigates to checkout. Used on
// /received (the tier cards) and /payment-failed (the retry button).
export default function PayButton({
  plan,
  name,
  email,
  company,
  label,
  popular = false,
  action = '/api/build-checkout',
}: {
  plan: string
  name: string
  email: string
  company: string
  label: string
  popular?: boolean
  action?: string
}) {
  const [loading, setLoading] = useState(false)
  return (
    <form action={action} method="POST" className="w-full" onSubmit={() => setLoading(true)}>
      <input type="hidden" name="plan" value={plan} />
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="company" value={company} />
      <button
        type="submit"
        disabled={loading}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-body text-base font-medium transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-80 ${
          popular ? 'bg-[#D46FC8] text-white hover:bg-[#DE85D2]' : 'bg-ink text-white hover:bg-ink/90'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Redirecting…
          </>
        ) : (
          label
        )}
      </button>
    </form>
  )
}
