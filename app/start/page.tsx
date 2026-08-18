import Link from 'next/link'
import LeadForm from '@/components/LeadForm'

// Path 1 of the split onboarding flow — public discovery form. Captures
// lead details for any visitor (no auth, no plan/payment involved) and
// hands off to the sales team via /api/lead (see components/LeadForm.tsx —
// shared with /websites, the Meta-ads landing page, so the two form
// implementations never drift apart). Distinct from /signup (Path 2), the
// private paid flow reachable only by direct link — see the "Already
// decided?" zone below, which is the one place this page links there.
export default function StartPage() {
  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-white flex items-center justify-center px-6 py-8 md:py-4">
      <div className="w-full max-w-md">
        <h1 className="sr-only">Let&apos;s build the best website in your industry</h1>

        <Link href="/" className="inline-flex items-center mb-5 focus-visible:outline-none" aria-label="yele">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG, Next's image optimizer refuses to serve those */}
          <img src="/media/logomedia/mainlogo.svg" alt="" className="h-8 w-auto" />
        </Link>

        <div className="mb-5">
          <h2 className="font-display font-semibold text-4xl text-ink tracking-tight leading-[1.08] mb-2.5">
            Let&apos;s build the best website in your industry.
          </h2>
          <p className="font-body text-base text-muted leading-relaxed">
            Share a few details and we&apos;ll come back with how Yele can elevate your business — bringing you more calls, bookings and customers.
          </p>
        </div>

        <LeadForm variant="light" ctaLabel="Let's chat" />

        {/* Secondary zone — visually separated so it never competes with
            the primary form/CTA above. */}
        <div className="mt-5 pt-4 border-t border-hairline text-center">
          <p className="font-body text-xs text-muted mb-2.5">Already decided?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/signup"
              className="font-body text-xs font-medium text-ink hover:text-muted border border-hairline rounded-full px-4 py-2 transition-colors"
            >
              Sign up now
            </Link>
            <Link
              href="/schedule"
              className="font-body text-xs text-muted hover:text-ink transition-colors"
            >
              Prefer to talk? Book a free 10-min intro call
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
