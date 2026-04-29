'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    desc: 'Para autónomos y negocios que necesitan presencia online clara y profesional.',
    monthlyPrice: 20,
    annualMonthly: 16,
    annualTotal: 192,
    features: [
      'Web de hasta 5 secciones',
      'Diseño personalizado',
      'Adaptado a móvil',
      'Hosting y dominio incluido',
      'Cambios de contenido en 48h',
    ],
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'Más elegido',
    desc: 'Para negocios que quieren destacar y convertir más visitas en clientes.',
    monthlyPrice: 49,
    annualMonthly: 39.20,
    annualTotal: 470.40,
    features: [
      'Todo lo de Starter',
      'Web de hasta 10 secciones',
      'Blog o sección de noticias',
      'Formulario de contacto avanzado',
      'SEO local incluido',
      'Cambios prioritarios en 24h',
    ],
    highlighted: true,
  },
  {
    id: 'business',
    name: 'Business',
    desc: 'Para negocios con necesidades específicas: tienda, reservas, multiidioma.',
    monthlyPrice: 99,
    annualMonthly: 79.20,
    annualTotal: 950.40,
    features: [
      'Todo lo de Pro',
      'Funcionalidades a medida',
      'Integración con reservas o tienda',
      'Soporte prioritario',
      'Cambios en 12h',
    ],
    highlighted: false,
  },
]

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function ElegirPlanContent() {
  const searchParams = useSearchParams()
  const clientId = searchParams.get('client_id')

  const [annual, setAnnual] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  function applyPromo() {
    if (!promoCode.trim()) return
    setPromoApplied(true)
    setPromoError('')
  }

  async function selectPlan(planId: string) {
    setLoading(planId)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billing: annual ? 'annual' : 'monthly',
          clientId,
          promoCode: promoApplied ? promoCode.trim() : null,
        }),
      })
      const { url, error } = await res.json()
      if (error || !url) {
        setLoading(null)
        alert('Error al procesar. Por favor inténtalo de nuevo.')
        return
      }
      window.location.href = url
    } catch {
      setLoading(null)
      alert('Error al procesar. Por favor inténtalo de nuevo.')
    }
  }

  // On mobile Pro card comes first
  const mobileOrder = [PLANS[1], PLANS[0], PLANS[2]]

  return (
    <div className="min-h-screen bg-[#F5F5F7] px-4 py-14">
      <div className="max-w-5xl mx-auto">

        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Link href="/" className="inline-flex items-center gap-1.5 focus-visible:outline-none">
            <span className="w-2 h-2 rounded-full bg-[#34C759]" aria-hidden="true" />
            <span className="font-outfit font-semibold text-sm text-[#1D1D1F]">
              yele<span className="text-[#86868B] font-normal">.design</span>
            </span>
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="font-outfit font-semibold text-4xl sm:text-5xl text-[#1D1D1F] tracking-tight mb-3">
            Sin letra pequeña.
          </h1>
          <p className="font-manrope text-[#86868B] text-lg">
            Elige tu plan. Cambia cuando quieras.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center bg-white border border-black/[0.08] rounded-xl p-1">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`font-manrope text-sm px-5 py-2 rounded-lg transition-all cursor-pointer ${
                !annual ? 'bg-[#1D1D1F] text-white' : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`font-manrope text-sm px-5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                annual ? 'bg-[#1D1D1F] text-white' : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              Anual
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                annual ? 'bg-white/20 text-white' : 'bg-[#34C759]/15 text-[#25A244]'
              }`}>
                −20%
              </span>
            </button>
          </div>
        </div>

        {/* Desktop cards: 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 md:items-start gap-4 mb-8">
          {PLANS.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              annual={annual}
              loading={loading}
              onSelect={selectPlan}
            />
          ))}
        </div>

        {/* Mobile cards: stacked, Pro first */}
        <div className="md:hidden flex flex-col gap-4 mb-8">
          {mobileOrder.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              annual={annual}
              loading={loading}
              onSelect={selectPlan}
              mobile
            />
          ))}
        </div>

        {/* Promo code */}
        <div className="max-w-sm mx-auto mb-6">
          <p className="font-manrope text-xs text-[#86868B] mb-2 text-center">
            ¿Tienes un código promocional?
          </p>
          {promoApplied ? (
            <div className="flex items-center justify-center gap-2 font-manrope text-sm text-[#25A244]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Código <strong>{promoCode.toUpperCase()}</strong> aplicado
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="CÓDIGO"
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError('') }}
                  onKeyDown={e => e.key === 'Enter' && applyPromo()}
                  className="flex-1 bg-white border border-black/[0.12] rounded-xl px-4 py-2.5 font-manrope text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:border-[#1D1D1F] transition-colors uppercase tracking-widest"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="font-manrope font-medium text-sm bg-[#1D1D1F] text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
              {promoError && (
                <p className="font-manrope text-xs text-red-500 mt-1.5 text-center">{promoError}</p>
              )}
            </>
          )}
        </div>

        {/* Fine print */}
        <p className="font-manrope text-xs text-[#86868B] text-center">
          Sin permanencia. Cancela cuando quieras.
        </p>

      </div>
    </div>
  )
}

type Plan = typeof PLANS[number]

function PlanCard({ plan, annual, loading, onSelect, mobile }: {
  plan: Plan
  annual: boolean
  loading: string | null
  onSelect: (id: string) => void
  mobile?: boolean
}) {
  const isLoading = loading === plan.id
  const anyLoading = loading !== null
  const price = annual ? plan.annualMonthly : plan.monthlyPrice
  const priceDisplay = Number.isInteger(price) ? price.toString() : price.toFixed(2).replace('.', ',')

  if (plan.highlighted) {
    return (
      <div className={`relative flex flex-col ${!mobile ? '-mt-3 -mb-3' : ''}`}>
        {/* Badge */}
        {'badge' in plan && plan.badge && (
          <div className="flex justify-center mb-2">
            <span className="font-manrope font-semibold text-xs bg-[#1D1D1F] text-white px-3 py-1 rounded-full">
              {plan.badge}
            </span>
          </div>
        )}
        <div className="flex-1 bg-[#1D1D1F] rounded-2xl p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="font-outfit font-semibold text-xl text-white mb-1">{plan.name}</h3>
            <p className="font-manrope text-sm text-white/60 leading-relaxed">{plan.desc}</p>
          </div>
          <div className="mb-5">
            <div className="flex items-baseline gap-1">
              <span className="font-outfit font-semibold text-4xl text-white">€{priceDisplay}</span>
              <span className="font-manrope text-sm text-white/60">/mes</span>
            </div>
            {annual && (
              <p className="font-manrope text-xs text-white/40 mt-0.5">
                Facturado €{plan.annualTotal.toFixed(2).replace('.', ',')}/año
              </p>
            )}
          </div>
          <ul className="space-y-2.5 flex-1 mb-6">
            {plan.features.map(f => (
              <li key={f} className="flex items-start gap-2 font-manrope text-sm text-white/80">
                <span className="text-[#34C759] mt-0.5 flex-shrink-0"><CheckIcon /></span>
                {f}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onSelect(plan.id)}
            disabled={anyLoading}
            className="w-full font-manrope font-semibold text-sm bg-white text-[#1D1D1F] py-3.5 rounded-xl hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#1D1D1F]/30 border-t-[#1D1D1F] rounded-full animate-spin" />
                Cargando…
              </>
            ) : 'Empezar'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-black/[0.08] rounded-2xl p-6 flex flex-col">
      <div className="mb-4">
        <h3 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-1">{plan.name}</h3>
        <p className="font-manrope text-sm text-[#86868B] leading-relaxed">{plan.desc}</p>
      </div>
      <div className="mb-5">
        <div className="flex items-baseline gap-1">
          <span className="font-outfit font-semibold text-4xl text-[#1D1D1F]">€{priceDisplay}</span>
          <span className="font-manrope text-sm text-[#86868B]">/mes</span>
        </div>
        {annual && (
          <p className="font-manrope text-xs text-[#86868B] mt-0.5">
            Facturado €{plan.annualTotal.toFixed(2).replace('.', ',')}/año
          </p>
        )}
      </div>
      <ul className="space-y-2.5 flex-1 mb-6">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2 font-manrope text-sm text-[#3D3D3D]">
            <span className="text-[#34C759] mt-0.5 flex-shrink-0"><CheckIcon /></span>
            {f}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onSelect(plan.id)}
        disabled={anyLoading}
        className="w-full font-manrope font-semibold text-sm bg-[#1D1D1F] text-white py-3.5 rounded-xl hover:bg-black transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Cargando…
          </>
        ) : 'Empezar'}
      </button>
    </div>
  )
}

export default function ElegirPlanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F7]" />}>
      <ElegirPlanContent />
    </Suspense>
  )
}
