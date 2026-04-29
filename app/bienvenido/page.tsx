'use client'

export const dynamic = 'force-dynamic'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
}

function BienvenidoContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [planName, setPlanName] = useState('')

  useEffect(() => {
    if (!sessionId) return
    fetch(`/api/checkout-details?session_id=${sessionId}`)
      .then(r => r.json())
      .then(d => {
        if (d.planName) setPlanName(PLAN_LABELS[d.planName] || d.planName)
      })
      .catch(() => {})
  }, [sessionId])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">

        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-1.5 mb-10 focus-visible:outline-none">
          <span className="w-2 h-2 rounded-full bg-[#34C759]" aria-hidden="true" />
          <span className="font-outfit font-semibold text-sm text-[#1D1D1F]">
            yele<span className="text-[#86868B] font-normal">.design</span>
          </span>
        </Link>

        {/* Check icon */}
        <div className="w-16 h-16 rounded-full bg-[#34C759]/10 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="font-outfit font-semibold text-3xl text-[#1D1D1F] tracking-tight mb-3">
          ¡Bienvenido a Yele!
        </h1>
        <p className="font-manrope text-[#86868B] text-base leading-relaxed mb-2">
          Tu suscripción está activa
          {planName ? <> — <strong className="text-[#1D1D1F]">Plan {planName}</strong></> : ''}.
        </p>
        <p className="font-manrope text-[#86868B] text-base leading-relaxed mb-8">
          Ya estamos trabajando en tu web. Te contactaremos en menos de 24 horas.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="https://app.yele.design"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-manrope font-medium text-sm bg-[#1D1D1F] text-white px-6 py-3.5 rounded-xl hover:bg-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
          >
            Acceder a mi panel
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <p className="font-manrope text-xs text-[#86868B]">
            ¿Preguntas?{' '}
            <a href="mailto:info@yele.design" className="underline hover:text-[#1D1D1F] transition-colors">
              info@yele.design
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}

export default function BienvenidoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <BienvenidoContent />
    </Suspense>
  )
}
