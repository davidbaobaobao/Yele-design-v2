'use client'

import { useRef, useEffect } from 'react'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, type Transition } from 'framer-motion'
import { Check } from 'lucide-react'
import { PLAN_PRICES } from '@/lib/plan-prices'
import { useLang } from '@/context/LanguageContext'

const plans = [
  {
    key: 'starter',
    price: PLAN_PRICES.starter.monthly,
    badge: null as string | null,
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
    price: PLAN_PRICES.pro.monthly,
    badge: 'Most popular',
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
    price: PLAN_PRICES.frontier.monthly,
    badge: null as string | null,
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

type Plan = Omit<typeof plans[0], 'price'> & { price: number }
type TFn = (es: string, en: string) => string

function PricingCard({ plan, index, t }: { plan: Plan; index: number; t: TFn }) {
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
  function handleMouseLeave() { mouseX.set(0); mouseY.set(0) }

  const features = t(plan.es.features.join('||'), plan.en.features.join('||')).split('||')

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
          ? 'bg-[#1D1D1F] text-white shadow-[0_24px_64px_rgba(0,0,0,0.5)] ring-1 ring-white/10'
          : 'bg-[#F5F5F7] text-[#1D1D1F] shadow-[0_16px_56px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.07]'
      }`}
    >
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ background: spotBg }}
        aria-hidden="true"
      />

      {plan.badge && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-manrope font-semibold px-3 py-1 rounded-full bg-white text-[#1D1D1F] whitespace-nowrap">
          {plan.badge}
        </span>
      )}

      <div className="relative mb-6">
        <p className={`font-manrope text-sm font-medium mb-2 ${plan.highlighted ? 'text-white/50' : 'text-[#6B7280]'}`}>
          {t(plan.es.name, plan.en.name)}
        </p>
        <div className="flex items-end gap-1 mb-1">
          <span className={`font-manrope text-2xl font-semibold mb-1 ${plan.highlighted ? 'text-white/60' : 'text-[#6B7280]'}`}>
            {t('', '$')}
          </span>
          <span className="font-outfit font-semibold text-5xl tracking-tight">{plan.price}</span>
          <span className={`font-manrope text-sm mb-2 ${plan.highlighted ? 'text-white/50' : 'text-[#6B7280]'}`}>
            {t(' €/mes', '/mo')}
          </span>
        </div>
      </div>

      <ul className="relative flex-1 flex flex-col gap-3 mb-8">
        {features.map(feat => (
          <li key={feat} className="flex items-start gap-2.5">
            <Check size={15} className="mt-0.5 flex-shrink-0 text-[#34C759]" aria-hidden="true" />
            <span className={`font-manrope text-sm ${plan.highlighted ? 'text-white/80' : 'text-[#1D1D1F]'}`}>{feat}</span>
          </li>
        ))}
      </ul>

      <motion.a
        href={`/registro?plan=${plan.key}`}
        className={`relative overflow-hidden block text-center font-manrope font-medium text-sm py-3.5 rounded-xl cursor-pointer ${
          plan.highlighted ? 'bg-white text-[#1D1D1F]' : 'bg-[#1D1D1F] text-white'
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

export default function PreciosIndexSection() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoAutoplay(videoRef)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let snapping = false
    let locked = false
    let lockTimer: ReturnType<typeof setTimeout>

    function preventScroll(e: WheelEvent) {
      if (locked) e.preventDefault()
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (window.innerWidth < 768) return
      if (entry.isIntersecting && !snapping) {
        snapping = true
        locked = true
        const { top } = el.getBoundingClientRect()
        if (Math.abs(top) > 20) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        window.addEventListener('wheel', preventScroll, { passive: false })
        clearTimeout(lockTimer)
        lockTimer = setTimeout(() => {
          locked = false
          snapping = false
          window.removeEventListener('wheel', preventScroll)
        }, 700)
      } else if (!entry.isIntersecting) {
        snapping = false
        locked = false
        window.removeEventListener('wheel', preventScroll)
      }
    }, { threshold: 0.3 })

    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(lockTimer)
      window.removeEventListener('wheel', preventScroll)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="precios"
      className="relative min-h-screen flex items-center overflow-hidden py-24"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline preload="auto"
        poster="/media/precios/precios2_poster.jpg"
        aria-hidden="true"
      >
        <source src="/media/precios/precios2_hero.mp4" type="video/mp4" />
        <source src="/media/precios/precios2_hero.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-10"
        >
          <h2
            className="font-outfit font-semibold text-white tracking-tight mb-6"
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
          >
            {t('Precios', 'Pricing')}
          </h2>

          {/* Orange gradient pill — same wave animation as We* subtitles */}
          <span className="we-pill-orange font-manrope font-semibold text-base text-white px-6 py-3 rounded-full inline-block">
            {t('Primer mes gratuito', 'First month free')}
          </span>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <PricingCard key={plan.key} plan={plan} index={i} t={t} />
          ))}
        </div>

        <p className="text-center font-manrope text-sm font-bold text-white mt-6">
          {t('Sin permanencia. Cancela cuando quieras.', 'No lock-in. Cancel anytime.')}
        </p>

        <div className="text-center mt-4">
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-manrope text-sm font-semibold text-white underline underline-offset-4 hover:text-white/80 transition-colors cursor-pointer"
          >
            {t('Ayúdame a decidir', 'Help me decide')}
          </button>
        </div>
      </div>
    </section>
  )
}
