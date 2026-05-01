'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, type Transition } from 'framer-motion'
import { Check } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'

const plans = [
  {
    key: 'starter',
    monthly: '€29',
    annual: '€16',
    annualNote: { es: 'o €299/año — ahorras €49', en: 'or €299/year — save €49' },
    badge: null as { es: string; en: string } | null,
    highlighted: false,
    es: {
      name: 'Starter',
      desc: 'Para autónomos y negocios que necesitan una presencia profesional online, sin complicaciones. Tu primer paso en internet.',
      features: [
        'Web de hasta 5 secciones',
        'Diseño personalizado',
        'Adaptado a móvil',
        'Dirección de tu web y dominio incluido',
        'Cambios de contenido en 24h',
      ],
    },
    en: {
      name: 'Starter',
      desc: 'For freelancers and businesses that need a professional online presence, hassle-free. Your first step online.',
      features: [
        'Website up to 5 sections',
        'Custom design',
        'Mobile-ready',
        'Web address and domain included',
        'Content updates in 24h',
      ],
    },
  },
  {
    key: 'pro',
    monthly: '€49',
    annual: '€39',
    annualNote: { es: 'o €499/año — ahorras €89', en: 'or €499/year — save €89' },
    badge: { es: 'Más elegido', en: 'Most popular' },
    highlighted: true,
    es: {
      name: 'Pro',
      desc: 'Para negocios que quieren destacar, aparecer en Google y convertir visitas en clientes. La versión completa de Yele.',
      features: [
        'Todo lo de Starter',
        'Web de hasta 6 secciones (inicio, servicios, sobre ti, galería, contacto…)',
        'Apareces cuando te buscan cerca — SEO local incluido',
        'Panel para editar tus contenidos sin tocar código',
        'Sistema de reservas o citas online',
        'Correo profesional incluido (tú@tunegocio.com)',
        'Formulario de contacto con notificaciones',
        'Revisión de diseño anual para estar siempre al día',
      ],
    },
    en: {
      name: 'Pro',
      desc: 'For businesses that want to stand out, appear on Google and convert visitors into clients. The full Yele experience.',
      features: [
        'Everything in Starter',
        'Website up to 6 sections (home, services, about, gallery, contact…)',
        'Appear when searched nearby — local SEO included',
        'Panel to edit your content without touching code',
        'Online booking or appointment system',
        'Professional email included (you@yourbusiness.com)',
        'Contact form with notifications',
        'Annual design review to always stay up to date',
      ],
    },
  },
  {
    key: 'business',
    monthly: '€89',
    annual: '€79',
    annualNote: { es: 'o €899/año — ahorras €169', en: 'or €899/year — save €169' },
    badge: null as { es: string; en: string } | null,
    highlighted: false,
    es: {
      name: 'Business',
      desc: 'Para negocios con volumen: pagos, multiidioma y posicionamiento avanzado. Una web que trabaja como un empleado más.',
      features: [
        'Todo lo de Pro',
        'Secciones ilimitadas',
        'Pagos integrados',
        'SEO avanzado — auditoría mensual y optimización continua',
        'Web en varios idiomas (español + inglés, o catalán)',
        'Analítica avanzada — sabes quién visita tu web y desde dónde',
        'Integraciones externas (WhatsApp Business, Google Calendar, CRM)',
        'Revisión de diseño semestral para estar siempre al día',
        'Soporte prioritario — respuesta en menos de 4h',
        'Cambios urgentes en 12h',
      ],
    },
    en: {
      name: 'Business',
      desc: 'For high-volume businesses: payments, multilanguage and advanced SEO. A website that works like an extra employee.',
      features: [
        'Everything in Pro',
        'Unlimited sections',
        'Integrated payments',
        'Advanced SEO — monthly audit and continuous optimization',
        'Website in multiple languages (Spanish + English, or Catalan)',
        'Advanced analytics — know who visits your site and from where',
        'External integrations (WhatsApp Business, Google Calendar, CRM)',
        'Semi-annual design review to always stay up to date',
        'Priority support — response in under 4h',
        'Urgent updates in 12h',
      ],
    },
  },
]

type Plan = typeof plans[0]

function PricingCard({ plan, index, isAnnual, t }: {
  plan: Plan
  index: number
  isAnnual: boolean
  t: (es: string, en: string) => string
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
        <p className={`font-manrope text-sm font-medium mb-2 ${plan.highlighted ? 'text-white/50' : 'text-[#86868B]'}`}>
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
          <span className={`font-manrope text-sm mb-2 ${plan.highlighted ? 'text-white/50' : 'text-[#86868B]'}`}>/mes</span>
        </div>
        {!isAnnual && (
          <p className={`font-manrope text-xs mb-3 ${plan.highlighted ? 'text-white/40' : 'text-[#86868B]'}`}>
            {t(plan.annualNote.es, plan.annualNote.en)}
          </p>
        )}
        <p className={`font-manrope text-sm leading-relaxed ${plan.highlighted ? 'text-white/60' : 'text-[#86868B]'}`}>
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
        href="#contacto"
        onClick={e => { e.preventDefault(); document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' }) }}
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
        <span className="relative z-10">{t('Empezar', 'Get started')}</span>
      </motion.a>
    </motion.div>
  )
}

export default function Precios() {
  const { t } = useLang()
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const isAnnual = billing === 'annual'

  return (
    <section id="precios" className="py-24 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' } as Transition}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-12"
        >
          <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
            {t('Precios', 'Pricing')}
          </span>
          <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-4">
            {t('Sin letra pequeña.', 'No fine print.')}
          </h2>
          <p className="font-manrope text-[#86868B] text-lg mb-8">
            {t('Elige tu plan. Cambia cuando quieras.', 'Choose your plan. Change whenever you want.')}
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center bg-[#F5F5F7] rounded-xl p-1 gap-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`relative font-manrope text-sm px-5 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                billing === 'monthly' ? 'text-[#1D1D1F]' : 'text-[#86868B]'
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
                billing === 'annual' ? 'text-[#1D1D1F]' : 'text-[#86868B]'
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
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <PricingCard key={plan.key} plan={plan} index={i} isAnnual={isAnnual} t={t} />
          ))}
        </div>

        <p className="text-center font-manrope text-sm text-[#86868B] mt-8">
          {t('Sin permanencia. Cancela cuando quieras.', 'No lock-in. Cancel anytime.')}
        </p>
      </div>
    </section>
  )
}
