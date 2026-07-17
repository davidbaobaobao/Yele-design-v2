'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, type Transition } from 'framer-motion'
import { Check } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'
import { PLAN_PRICES } from '@/lib/plan-prices'

const plans = [
  {
    key: 'starter',
    monthly: `€${PLAN_PRICES.starter.monthly}`,
    annual: '€990',
    annualNote: { es: 'o €990/año — ahorras €198', en: 'or €990/year — save €198' },
    badge: null as { es: string; en: string } | null,
    highlighted: false,
    es: {
      name: 'Starter',
      desc: 'Tu primera presencia online. Funcional, profesional y sin complicaciones.',
      features: [
        'Web funcional, sin límite de páginas',
        'Dominio personalizado',
        'Panel de control, actualiza tu contenido',
        'SEO on-page e indexación',
        'Email personalizado',
        'Creación de contenido multimedia — básico',
        'Soporte 24/7',
      ],
    },
    en: {
      name: 'Starter',
      desc: 'Your first step online. Functional, professional and hassle-free.',
      features: [
        'Functional website, no page limit',
        'Custom domain',
        'Control panel, update your content',
        'On-page SEO & indexing',
        'Custom email',
        'Media creation — basic',
        '24/7 support',
      ],
    },
  },
  {
    key: 'pro',
    monthly: `€${PLAN_PRICES.pro.monthly}`,
    annual: '€1.690',
    annualNote: { es: 'o €1.690/año — ahorras €338', en: 'or €1,690/year — save €338' },
    badge: { es: 'Más elegido', en: 'Most popular' } as { es: string; en: string } | null,
    highlighted: true,
    es: {
      name: 'Pro',
      desc: 'Todo lo que necesitas para crecer. Branding, pagos y automatización.',
      features: [
        'Todo lo de Starter, más:',
        'Branding',
        'Sistema de pagos',
        'Calendario y reservas',
        'Rediseño periódico de elementos',
        'Optimización Google Business Profile',
        'Asistente de chat IA automático',
      ],
    },
    en: {
      name: 'Pro',
      desc: 'Everything you need to grow. Branding, payments and automation.',
      features: [
        'Everything in Starter, plus:',
        'Branding',
        'Payment system',
        'Calendar & reservations',
        'Periodic redesign of website elements',
        'Google Business Profile optimization',
        'AI automatic chat assistant',
      ],
    },
  },
  {
    key: 'frontier',
    monthly: `€${PLAN_PRICES.frontier.monthly}`,
    annual: '€6.990',
    annualNote: { es: 'o €6.990/año — ahorras €1.398', en: 'or €6,990/year — save €1,398' },
    badge: null as { es: string; en: string } | null,
    highlighted: false,
    es: {
      name: 'Frontier',
      desc: 'Marketing activo, SEO avanzado y contenido continuo para líderes del sector.',
      features: [
        'Todo lo de Pro, más:',
        'Creación de contenido multimedia — mensual',
        'Campañas de marketing — mensual',
        'SEO avanzado backlinks (cloud stacks)',
        'Generación de artículos y contenido — semanal',
        'Gestión Google Ads — bajo demanda',
        'Notas de prensa (1/trimestre)',
      ],
    },
    en: {
      name: 'Frontier',
      desc: 'Active marketing, advanced SEO and continuous content for industry leaders.',
      features: [
        'Everything in Pro, plus:',
        'Media content creation — monthly',
        'Marketing campaigns — monthly',
        'Advanced SEO backlinks (cloud stacks)',
        'Article and content generation — weekly',
        'Google Ads management — on demand',
        'Press releases (1/quarter)',
      ],
    },
  },
]

type Plan = typeof plans[0]

function PricingCard({ plan, index, isAnnual, t, withShadow }: {
  plan: Plan
  index: number
  isAnnual: boolean
  t: (es: string, en: string) => string
  withShadow?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4])

  const spotX = useTransform(smoothX, [-0.5, 0.5], [0, 100])
  const spotY = useTransform(smoothY, [-0.5, 0.5], [0, 100])
  const spotBg = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.10) 0%, transparent 55%)`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  const price = isAnnual ? plan.annual : plan.monthly
  const features = plan.es.features

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' } as Transition}
      viewport={{ once: true, margin: '-80px' }}
      className={`relative flex flex-col rounded-3xl p-8 cursor-default ${
        plan.highlighted
          ? 'bg-[#1D1D1F] text-white shadow-[0_24px_64px_rgba(0,0,0,0.2)] ring-1 ring-white/10'
          : withShadow
            ? 'bg-[#F5F5F7] text-[#1D1D1F] shadow-[0_16px_56px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.07]'
            : 'bg-[#F5F5F7] text-[#1D1D1F]'
      }`}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ background: spotBg }}
        aria-hidden="true"
      />

      {plan.badge && (
        <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-manrope font-semibold px-3 py-1 rounded-full ${
          plan.highlighted ? 'bg-white text-[#1D1D1F]' : 'bg-[#1D1D1F] text-white'
        }`}>
          {t(plan.badge.es, plan.badge.en)}
        </span>
      )}

      <div className="relative mb-6">
        <p className={`font-manrope text-sm font-medium mb-2 ${plan.highlighted ? 'text-white/50' : 'text-[#6B7280]'}`}>
          {t(plan.es.name, plan.en.name)}
        </p>
        <div className="flex items-end gap-1 mb-1">
          <motion.span
            key={price}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-outfit font-semibold text-5xl tracking-tight"
          >
            {price}
          </motion.span>
          <span className={`font-manrope text-sm mb-2 ${plan.highlighted ? 'text-white/50' : 'text-[#6B7280]'}`}>{isAnnual ? '/año' : '/mes'}</span>
        </div>
        <p className={`font-manrope text-sm leading-relaxed ${plan.highlighted ? 'text-white/60' : 'text-[#6B7280]'}`}>
          {t(plan.es.desc, plan.en.desc)}
        </p>
      </div>

      <ul className="relative flex-1 flex flex-col gap-3 mb-8">
        {t(features.join('||'), plan.en.features.join('||'))
          .split('||')
          .map((feat: string) => (
            <li key={feat} className="flex items-start gap-2.5">
              <Check size={15} className="mt-0.5 flex-shrink-0 text-[#34C759]" aria-hidden="true" />
              <span className={`font-manrope text-sm ${plan.highlighted ? 'text-white/80' : 'text-[#1D1D1F]'}`}>
                {feat}
              </span>
            </li>
          ))}
      </ul>

      <motion.a
        href={`/registro?plan=${plan.key}`}
        aria-label={t(`Empezar con el plan ${plan.es.name}`, `Get started with ${plan.en.name} plan`)}
        className={`relative overflow-hidden block text-center font-manrope font-medium text-sm py-3.5 rounded-xl cursor-pointer ${
          plan.highlighted
            ? 'bg-white text-[#1D1D1F]'
            : 'bg-[#1D1D1F] text-white'
        }`}
        whileHover="hover"
        whileTap={{ scale: 0.97, transition: { duration: 0.15 } as Transition }}
        initial="rest"
      >
        <motion.span
          className={`absolute inset-0 ${plan.highlighted ? 'bg-[#F5F5F7]' : 'bg-black'}`}
          variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
          transition={{ duration: 0.3, ease: 'easeOut' } as Transition}
          style={{ originX: 0 }}
          aria-hidden="true"
        />
        <span className="relative z-10">{t('Empezar gratis', 'Start for free')}</span>
      </motion.a>
    </motion.div>
  )
}

export default function Precios({ singlePlan, noBg }: { singlePlan?: string; noBg?: boolean } = {}) {
  const { t } = useLang()
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const isAnnual = billing === 'annual'

  const displayPlans = singlePlan ? plans.filter(p => p.key === singlePlan) : plans

  return (
    <section id="precios" className={`py-14 md:py-20 ${noBg ? '' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' } as Transition}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-8"
        >
          <h2 className="font-outfit font-semibold text-5xl md:text-6xl text-[#1D1D1F] tracking-tight mb-6">
            {t('Precios', 'Pricing')}
          </h2>

          {/* Toggle — hidden in single-plan mode */}
          {!singlePlan && <div className="inline-flex items-center bg-[#F5F5F7] rounded-xl p-1 gap-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`relative font-manrope text-sm px-5 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                billing === 'monthly' ? 'text-[#1D1D1F]' : 'text-[#6B7280]'
              }`}
            >
              {billing === 'monthly' && (
                <motion.div
                  layoutId="billing-pill"
                  className="absolute inset-0 bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t('Mensual', 'Monthly')}</span>
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`relative flex items-center gap-1.5 font-manrope text-sm px-5 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                billing === 'annual' ? 'text-[#1D1D1F]' : 'text-[#6B7280]'
              }`}
            >
              {billing === 'annual' && (
                <motion.div
                  layoutId="billing-pill"
                  className="absolute inset-0 bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t('Anual', 'Annual')}</span>
              <span className="relative z-10 text-xs bg-[#34C759]/10 text-[#34C759] px-1.5 py-0.5 rounded-full font-medium">
                -20%
              </span>
            </button>
          </div>}
        </motion.div>

        <div className={singlePlan ? 'max-w-md mx-auto' : 'grid md:grid-cols-3 gap-6 items-stretch'}>
          {displayPlans.map((plan, i) => (
            <PricingCard key={plan.key} plan={plan} index={i} isAnnual={isAnnual} t={t} withShadow={!!singlePlan} />
          ))}
        </div>

        <p className="text-center font-manrope text-sm text-[#6B7280] mt-6">
          {t('Sin permanencia. Cancela cuando quieras.', 'No lock-in. Cancel anytime.')}
        </p>
        <p className="text-center font-manrope text-sm text-[#6B7280] mt-3">
          {t(
            '¿Necesitas SEO avanzado, Sistema de Reservas, Tienda Online, Telefonía IA?',
            'Need advanced SEO, Booking system, Online store, AI telephony?'
          )}{' '}
          <a href="#contacto" className="text-[#1D1D1F] font-medium underline underline-offset-2 hover:text-[#0066CC] transition-colors">
            {t('Pregúntanos', 'Ask us')}
          </a>
        </p>
      </div>
    </section>
  )
}
