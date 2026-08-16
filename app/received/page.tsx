import Link from 'next/link'

export const metadata = {
  title: 'Thanks — Yele',
  robots: { index: false, follow: false },
}

// Thank-you landing after a successful /start discovery-form submit.
export default function ReceivedPage() {
  return (
    <div className="min-h-screen bg-[#0D0E12] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 mb-10 focus-visible:outline-none">
          <span className="w-2 h-2 rounded-full bg-[#D46FC8]" aria-hidden="true" />
          <span className="font-display font-semibold text-sm text-white">
            yele<span className="text-white/50 font-normal">.design</span>
          </span>
        </Link>

        <div className="w-12 h-12 rounded-full bg-[#D46FC8]/10 flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#D46FC8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="font-display font-semibold text-3xl text-white tracking-tight mb-3">
          Thanks — we&apos;ve got your details.
        </h1>
        <p className="font-body text-white/60 text-base leading-relaxed mb-10">
          We&apos;ll email you shortly about how we can grow your business.
        </p>

        <Link
          href="/schedule"
          className="font-body text-sm text-white/70 hover:text-white transition-colors underline underline-offset-4"
        >
          Can&apos;t wait? Book a 10-min intro call →
        </Link>

        <div className="mt-10">
          <Link href="/" className="font-body text-xs text-white/40 hover:text-white/70 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
