'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ClarityScript from '@/components/ClarityScript'

export default function GraciasClient({
  conversionValue,
  conversionCurrency,
  customerEmail,
}: {
  conversionValue: number
  conversionCurrency: string
  customerEmail: string | null
}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag = (window as any).gtag
    if (!gtag) return

    // Enhanced Conversions: pass email so Google can hash and match
    if (customerEmail) {
      gtag('set', 'user_data', { email: customerEmail })
    }

    gtag('event', 'conversion', {
      send_to: 'AW-18281072925/AH2nCP-4p8ocEJ2SjI1E',
      value: conversionValue,
      currency: conversionCurrency,
      transaction_id: sessionId,
    })
  }, [searchParams, conversionValue, conversionCurrency, customerEmail])

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-6">
      <ClarityScript />
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-1.5 mb-10 focus-visible:outline-none">
          <span className="w-2 h-2 rounded-full bg-[#34C759]" aria-hidden="true" />
          <span className="font-display font-semibold text-sm text-ink">
            yele<span className="text-muted font-normal">.design</span>
          </span>
        </Link>

        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-[#34C759]/10 flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="font-display font-semibold text-3xl text-ink tracking-tight mb-3">
          You&apos;re in!
        </h1>
        <p className="font-body text-muted text-base leading-relaxed mb-8">
          Your free month has started. Here&apos;s what to do next.
        </p>

        {/* Next steps */}
        <div className="bg-base rounded-2xl p-6 text-left mb-8">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-muted mb-4">Next steps</p>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="font-display font-semibold text-ink text-sm flex-shrink-0">①</span>
              <p className="font-body text-sm text-ink leading-relaxed">
                Explain more about your business and goals at{' '}
                <a href="https://yele.design/survey" className="underline hover:text-muted transition-colors">
                  yele.design/survey
                </a>
              </p>
            </div>
            <div className="flex gap-3">
              <span className="font-display font-semibold text-ink text-sm flex-shrink-0">②</span>
              <p className="font-body text-sm text-ink leading-relaxed">
                We will contact you as soon as we receive your information.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/survey"
            className="inline-flex items-center justify-center gap-2 font-body font-medium text-sm bg-ink text-white px-6 py-3.5 rounded-xl hover:bg-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
          >
            Start now
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <Link
            href="/"
            className="font-body text-sm text-muted hover:text-ink transition-colors py-2"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
