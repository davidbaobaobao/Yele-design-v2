import Link from 'next/link'

export const metadata = {
  title: 'Thanks — Yele',
  robots: { index: false, follow: false },
}

const STEPS = [
  {
    text: 'Tell us your direction — a 2-minute design survey (or a quick call if you’d rather talk).',
  },
  {
    text: "We design your first draft for your business. Then, from your feedback, we improve it until you're satisfied.",
  },
  {
    text: 'You approve, it goes live — and that’s the day of your first payment. Nothing before.',
  },
]

// Thank-you landing after a successful /start discovery-form submit — the
// bridge into the design survey rather than a dead end. name/email/company
// arrive as query params from /start's redirect (router.push(`/received?
// name=...&email=...&company=...`)); React escapes `name` automatically as
// plain JSX text, so no extra sanitizing is needed beyond trimming/capping
// length for layout's sake. email/company are forwarded as-is to /survey's
// own query string below, where they go through the same trim/prefill
// handling as name.
export default function ReceivedPage({
  searchParams,
}: {
  searchParams: { name?: string; email?: string; company?: string }
}) {
  const rawName = searchParams.name?.trim() ?? ''
  const name = rawName.length > 0 && rawName.length <= 60 ? rawName : ''

  const surveyParams = new URLSearchParams()
  if (rawName) surveyParams.set('name', rawName)
  const email = searchParams.email?.trim() ?? ''
  if (email) surveyParams.set('email', email)
  const company = searchParams.company?.trim() ?? ''
  if (company) surveyParams.set('company', company)
  const surveyHref = surveyParams.toString() ? `/survey?${surveyParams.toString()}` : '/survey'

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full">
        <Link href="/" className="inline-flex items-center mb-8 focus-visible:outline-none" aria-label="yele">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG, Next's image optimizer refuses to serve those */}
          <img src="/media/logomedia/mainlogo.svg" alt="" className="h-8 w-auto" />
        </Link>

        <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink tracking-tight leading-tight mb-3">
          {name ? (
            <>You&apos;re in, {name}. Let&apos;s design your website.</>
          ) : (
            <>You&apos;re in. Let&apos;s design your website.</>
          )}
        </h1>
        <p className="font-body text-muted text-base leading-relaxed mb-8">
          We&apos;ve got your details. From here it&apos;s simple:
        </p>

        <ol className="space-y-5 mb-10">
          {STEPS.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-display font-bold text-xl text-[#D46FC8] w-6 flex-shrink-0" aria-hidden="true">
                {i + 1}
              </span>
              <p className="font-body text-sm text-ink/80 leading-relaxed pt-0.5">{step.text}</p>
            </li>
          ))}
        </ol>

        <Link
          href={surveyHref}
          className="w-full inline-flex items-center justify-center gap-2 font-body font-medium text-base bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-6 py-3.5 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Take the 2-minute design survey
        </Link>

        <div className="text-center mt-4">
          <Link
            href="/schedule"
            className="font-body text-sm text-muted hover:text-ink transition-colors underline underline-offset-4"
          >
            Rather talk it through? Book a 15-min call →
          </Link>
        </div>

        <p className="text-center font-body text-xs text-muted mt-8">
          You&apos;ll hear from a real person within one business day.
        </p>

        <div className="text-center mt-6">
          <Link href="/" className="font-body text-xs text-muted hover:text-ink transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
