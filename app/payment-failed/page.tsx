import Link from 'next/link'
import PayButton from '@/components/received/PayButton'

export const metadata = {
  title: 'Payment problem — Yele',
  robots: { index: false, follow: false },
}

const PLAN_LABEL: Record<string, string> = {
  launch: 'Launch',
  business: 'Business',
  pro: 'Pro',
}

// First-payment (50% deposit) amounts vs final-payment (remaining 50%) amounts.
const PAY_FIRST: Record<string, string> = { launch: 'Pay $349', business: 'Pay $599', pro: 'Pay $1,399' }
const PAY_FINAL: Record<string, string> = { launch: 'Pay $349', business: 'Pay $599', pro: 'Pay $1,399' }

export default function PaymentFailedPage({
  searchParams,
}: {
  searchParams: { plan?: string; name?: string; email?: string; company?: string; type?: string }
}) {
  const plan = (searchParams.plan ?? '').trim()
  const name = searchParams.name?.trim() ?? ''
  const email = searchParams.email?.trim() ?? ''
  const company = searchParams.company?.trim() ?? ''
  const isFinal = searchParams.type === 'final'
  const valid = plan === 'launch' || plan === 'business' || plan === 'pro'
  const action = isFinal ? '/api/final-checkout' : '/api/build-checkout'
  const payLabel = isFinal ? PAY_FINAL[plan] : PAY_FIRST[plan]
  const label = valid ? `Try again — ${payLabel}` : 'Try again'

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="inline-flex items-center mb-10 focus-visible:outline-none" aria-label="yele">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG, Next's image optimizer refuses to serve those */}
          <img src="/media/logomedia/mainlogo.svg" alt="" className="h-8 w-auto mx-auto" />
        </Link>

        <h1 className="font-display font-bold text-4xl md:text-5xl text-ink tracking-tight leading-tight mb-3">
          There was a problem with your payment.
        </h1>
        <p className="font-body text-muted text-lg leading-relaxed mb-10">
          {valid ? (
            <>Your payment for the {PLAN_LABEL[plan]} website didn&apos;t go through — nothing was charged. You can try again below.</>
          ) : (
            <>Your payment didn&apos;t go through — nothing was charged. You can try again below.</>
          )}
        </p>

        {valid ? (
          <div className="max-w-xs mx-auto">
            <PayButton action={action} plan={plan} name={name} email={email} company={company} label={label} popular />
          </div>
        ) : (
          <Link
            href="/letsbuild#pricing"
            className="inline-flex items-center justify-center rounded-xl bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-8 py-3.5 font-body text-base font-medium transition-colors"
          >
            Choose a plan
          </Link>
        )}

        <p className="font-body text-sm text-muted mt-6">
          Need help? Email us at{' '}
          <a href="mailto:info@yele.design" className="underline underline-offset-4 hover:text-ink transition-colors">
            info@yele.design
          </a>
          .
        </p>

        <div className="mt-8">
          <Link href="/" className="font-body text-base text-muted hover:text-ink transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
