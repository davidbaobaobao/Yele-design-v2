'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ClarityScript from '@/components/ClarityScript'

const inputClass = 'w-full bg-white border border-black/[0.12] rounded-xl px-4 py-3 font-manrope text-sm text-[#1D1D1F] placeholder-[#6B7280] focus:outline-none focus:border-[#1D1D1F] transition-colors'
const labelClass = 'font-manrope text-xs text-[#6B7280] mb-1.5 block'
const errorClass = 'font-manrope text-xs text-red-500 mt-1'

const USD_PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    price: 99,
    currency: '$',
    description: 'Perfect for small businesses getting their first professional website.',
    features: ['Professional website', 'Custom domain', 'Content management panel', 'On-page SEO', '24/7 support'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 169,
    currency: '$',
    description: 'For growing businesses that need more presence and features.',
    features: ['Everything in Starter', 'Unlimited pages', 'Custom email', 'Priority support', 'Advanced SEO'],
    highlight: true,
  },
  {
    key: 'frontier',
    name: 'Frontier',
    price: 699,
    currency: '$',
    description: 'Full-service for ambitious brands that want the best.',
    features: ['Everything in Pro', 'Custom animations', 'Multimedia content creation', 'Dedicated account manager', 'Monthly strategy calls'],
  },
]

const ES_PLANS = [
  {
    key: 'starter-es',
    name: 'Starter',
    price: 49,
    currency: '€',
    description: 'Ideal para pequeños negocios que quieren su primera web profesional.',
    features: ['Web profesional', 'Dominio personalizado', 'Panel de control', 'SEO on-page', 'Soporte 24/7'],
  },
  {
    key: 'pro-es',
    name: 'Pro',
    price: 79,
    currency: '€',
    description: 'Para negocios en crecimiento que necesitan más presencia y funcionalidades.',
    features: ['Todo lo de Starter', 'Páginas ilimitadas', 'Email personalizado', 'Soporte prioritario', 'SEO avanzado'],
    highlight: true,
  },
  {
    key: 'frontier-es',
    name: 'Frontier',
    price: 599,
    currency: '€',
    description: 'Servicio completo para marcas ambiciosas que quieren lo mejor.',
    features: ['Todo lo de Pro', 'Animaciones personalizadas', 'Creación multimedia', 'Gestor de cuenta dedicado', 'Llamadas mensuales de estrategia'],
  },
]

type FormData = {
  nombre_negocio: string
  nombre_contacto: string
  ciudad: string
  email: string
  telefono: string
  descripcion: string
  rgpd: boolean
}

export default function EmpezarPage() {
  const supabase = createClientComponentClient()
  const [step, setStep] = useState<'form' | 'pricing' | 'checkout'>('form')
  const [lang, setLang] = useState<'en' | 'es'>('en')
  const [clientId, setClientId] = useState('')
  const [loading, setLoading] = useState(false)
  const [planLoading, setPlanLoading] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [formData, setFormData] = useState<FormData>({
    nombre_negocio: '',
    nombre_contacto: '',
    ciudad: '',
    email: '',
    telefono: '',
    descripcion: '',
    rgpd: false,
  })

  useEffect(() => {
    if (sessionStorage.getItem('yele_lang') === 'es') setLang('es')
  }, [])

  // Returning user: already submitted form + picked a plan → auto-checkout
  useEffect(() => {
    const submitted = sessionStorage.getItem('yele_submitted')
    const plan = sessionStorage.getItem('yele_plan')
    if (submitted === 'true' && plan) {
      setStep('checkout')
      const storedClientId = sessionStorage.getItem('yele_clientId') ?? ''
      fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan, billing: 'monthly', clientId: storedClientId }),
      })
        .then(r => r.json())
        .then(({ url }) => {
          if (url) {
            sessionStorage.removeItem('yele_submitted')
            sessionStorage.removeItem('yele_plan')
            sessionStorage.removeItem('yele_clientId')
            sessionStorage.removeItem('yele_lang')
            window.location.href = url
          }
        })
    }
  }, [])

  function set(key: keyof FormData, value: string | boolean) {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!formData.nombre_contacto.trim()) e.nombre_contacto = 'Your name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email'
    if (!formData.rgpd) e.rgpd = 'You must accept the privacy policy'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)
    setSubmitError('')

    const { data: { session } } = await supabase.auth.getSession()

    const response = await fetch('/api/intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      setSubmitError('Something went wrong. Please try again or email us at info@yele.design')
      setLoading(false)
      return
    }

    const result = await response.json()
    const newClientId = result.clientId ?? ''
    const preSelectedPlan = sessionStorage.getItem('yele_plan')

    if (preSelectedPlan) {
      // ES flow or user already picked a plan → go straight to Stripe
      const checkoutRes = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: preSelectedPlan, billing: 'monthly', clientId: newClientId }),
      })
      const { url, error: checkoutError } = await checkoutRes.json()
      if (checkoutError || !url) {
        setSubmitError(checkoutError || 'Payment setup failed. Please try again.')
        setLoading(false)
        return
      }
      window.location.href = url
    } else {
      // EN generic flow → show pricing inline
      setClientId(newClientId)
      setLoading(false)
      setStep('pricing')
    }
  }

  async function handlePickPlan(planKey: string) {
    setPlanLoading(planKey)
    const checkoutRes = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: planKey, billing: 'monthly', clientId }),
    })
    const { url, error } = await checkoutRes.json()
    if (error || !url) {
      setPlanLoading(null)
      return
    }
    window.location.href = url
  }

  if (step === 'checkout') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-manrope text-sm text-[#6B7280]">Setting up your subscription…</p>
        </div>
      </div>
    )
  }

  if (step === 'pricing') {
    return (
      <div className="min-h-screen bg-white px-6 py-12">
        <ClarityScript />
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 mb-10 focus-visible:outline-none">
            <span className="w-2 h-2 rounded-full bg-[#34C759]" aria-hidden="true" />
            <span className="font-outfit font-semibold text-sm text-[#1D1D1F]">
              yele<span className="text-[#6B7280] font-normal">.design</span>
            </span>
          </Link>

          <div className="mb-10">
            <p className="font-manrope text-xs font-medium text-[#34C759] uppercase tracking-widest mb-2">
              {lang === 'es' ? 'Paso 2 de 2' : 'Step 2 of 2'}
            </p>
            <h2 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">
              {lang === 'es' ? 'Elige tu plan' : 'Choose your plan'}
            </h2>
            <p className="font-manrope text-sm text-[#6B7280]">
              {lang === 'es'
                ? 'Primer mes gratis — sin cargo hoy. Cancela cuando quieras.'
                : 'First month free — no charge today. Cancel anytime.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {(lang === 'es' ? ES_PLANS : USD_PLANS).map(plan => (
              <div
                key={plan.key}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  plan.highlight
                    ? 'border-[#1D1D1F] bg-[#1D1D1F] text-white'
                    : 'border-black/[0.1] bg-white text-[#1D1D1F]'
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#34C759] text-white font-manrope text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Most popular
                  </span>
                )}
                <p className={`font-outfit font-semibold text-base mb-1 ${plan.highlight ? 'text-white' : 'text-[#1D1D1F]'}`}>
                  {plan.name}
                </p>
                <p className={`font-manrope text-xs leading-relaxed mb-4 ${plan.highlight ? 'text-white/60' : 'text-[#6B7280]'}`}>
                  {plan.description}
                </p>
                <div className="mb-5">
                  <span className={`font-outfit font-bold text-3xl ${plan.highlight ? 'text-white' : 'text-[#1D1D1F]'}`}>
                    {plan.currency}{plan.price}
                  </span>
                  <span className={`font-manrope text-xs ml-1 ${plan.highlight ? 'text-white/50' : 'text-[#6B7280]'}`}>/mo</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 font-manrope text-xs ${plan.highlight ? 'text-white/80' : 'text-[#6B7280]'}`}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
                        <path d="M2 6l3 3 5-5" stroke={plan.highlight ? '#34C759' : '#34C759'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => handlePickPlan(plan.key)}
                  disabled={planLoading !== null}
                  className={`w-full font-manrope font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50 ${
                    plan.highlight
                      ? 'bg-white text-[#1D1D1F] hover:bg-[#F5F5F7]'
                      : 'bg-[#1D1D1F] text-white hover:bg-black'
                  }`}
                >
                  {planLoading === plan.key ? 'Loading…' : 'Start free month →'}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center font-manrope text-xs text-[#6B7280] mt-8">
            {lang === 'es'
              ? 'Todos los planes incluyen 1 mes gratis. Sin cargo hoy.'
              : 'All plans include a free 1-month trial. No credit card charged today.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <ClarityScript />
      <div className="max-w-md mx-auto">

        <h1 className="sr-only">Tell us about your business</h1>

        <Link href="/" className="inline-flex items-center gap-1.5 mb-10 focus-visible:outline-none">
          <span className="w-2 h-2 rounded-full bg-[#34C759]" aria-hidden="true" />
          <span className="font-outfit font-semibold text-sm text-[#1D1D1F]">
            yele<span className="text-[#6B7280] font-normal">.design</span>
          </span>
        </Link>

        <div className="mb-8">
          <p className="font-manrope text-xs font-medium text-[#34C759] uppercase tracking-widest mb-2">Step 1 of 2</p>
          <h2 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">
            Tell us about your business
          </h2>
          <p className="font-manrope text-sm text-[#6B7280]">
            We&apos;ll set everything up for you. Takes less than 2 minutes.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Company name</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Barber Montserrat"
              value={formData.nombre_negocio}
              onChange={e => set('nombre_negocio', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="Your full name"
              value={formData.nombre_contacto}
              onChange={e => set('nombre_contacto', e.target.value)}
            />
            {errors.nombre_contacto && <p className={errorClass}>{errors.nombre_contacto}</p>}
          </div>

          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Barcelona"
              value={formData.ciudad}
              onChange={e => set('ciudad', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={inputClass}
              placeholder="you@email.com"
              value={formData.email}
              onChange={e => set('email', e.target.value)}
              autoComplete="email"
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          <div>
            <label className={labelClass}>Phone number</label>
            <input
              type="tel"
              className={inputClass}
              placeholder="+34 600 000 000"
              value={formData.telefono}
              onChange={e => set('telefono', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Describe your business in a few words</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="e.g. Family barbershop in central Barcelona, open for 10 years..."
              value={formData.descripcion}
              onChange={e => set('descripcion', e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rgpd}
                onChange={e => set('rgpd', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#1D1D1F] flex-shrink-0"
              />
              <span className="font-manrope text-sm text-[#1D1D1F]">
                I have read and accept the{' '}
                <Link href="/politica-privacidad" target="_blank" className="underline hover:text-[#6B7280] transition-colors">
                  privacy policy
                </Link>
                <span className="text-red-500 ml-0.5">*</span>
              </span>
            </label>
            {errors.rgpd && <p className={`${errorClass} ml-7`}>{errors.rgpd}</p>}
          </div>

          {submitError && (
            <p className="font-manrope text-xs text-red-500 text-center">{submitError}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 font-manrope font-medium text-sm bg-[#1D1D1F] text-white px-6 py-3.5 rounded-xl hover:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
          >
            {loading ? 'Saving…' : 'Continue →'}
          </button>

          <p className="text-center font-manrope text-xs text-[#6B7280]">
            No charge today. Your free month starts now.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="font-manrope text-xs text-[#6B7280] hover:text-[#1D1D1F] transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
