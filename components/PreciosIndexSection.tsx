'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, type Transition } from 'framer-motion'
import { Check } from 'lucide-react'
import { PLAN_PRICES, PLAN_PRICES_USD } from '@/lib/plan-prices'
import { useLang } from '@/context/LanguageContext'
import { CTAButton } from '@/components/ui/cta-button'
import { isNavJumping } from '@/lib/nav-scroll'

type Feature = { text: string; tooltip?: string }

const plans = [
  {
    key: 'starter',
    priceEs: PLAN_PRICES.starter.monthly,
    priceEn: PLAN_PRICES_USD.starter.monthly,
    badge: null as string | null,
    highlighted: false,
    es: {
      name: 'Starter',
      desc: 'Tu primera presencia online. Funcional, profesional y sin complicaciones.',
      features: [
        { text: 'Web funcional, sin límite de páginas' },
        { text: 'Dominio personalizado' },
        { text: 'Panel de control, actualiza tu contenido' },
        { text: 'SEO on-page e indexación' },
        { text: 'Email personalizado' },
        {
          text: 'Creación de contenido multimedia — básico',
          tooltip: 'Creamos todos los vídeos e imágenes necesarios para que tu web luzca espectacular y única.',
        },
        { text: 'Soporte 24/7' },
      ] as Feature[],
    },
    en: {
      name: 'Starter',
      desc: 'Your first step online. Functional, professional and hassle-free.',
      features: [
        { text: 'Functional website, no page limit' },
        { text: 'Custom domain' },
        { text: 'Control panel — update your content' },
        { text: 'On-page SEO & indexing' },
        { text: 'Custom email' },
        {
          text: 'Media creation — basic',
          tooltip:
            "We create all the required videos and image content so your website looks stunning and unlike anyone else's.",
        },
        { text: '24/7 support' },
      ] as Feature[],
    },
  },
  {
    key: 'pro',
    priceEs: PLAN_PRICES.pro.monthly,
    priceEn: PLAN_PRICES_USD.pro.monthly,
    badge: 'Most popular',
    highlighted: true,
    es: {
      name: 'Pro',
      desc: 'Todo lo que necesitas para crecer. Branding, pagos y automatización.',
      features: [
        { text: 'Todo lo de Starter, más:' },
        { text: 'Branding', tooltip: 'Modernización y renovación de la marca de tu empresa.' },
        { text: 'Sistema de pagos', tooltip: 'Acepta pagos de tus productos.' },
        { text: 'Calendario y reservas' },
        {
          text: 'Rediseño periódico de elementos',
          tooltip: 'Cada tres meses, distintos elementos pueden reajustarse o rediseñarse.',
        },
        {
          text: 'Creación de contenido — Avanzado',
          tooltip: 'Hasta 1 vídeo + 20 imágenes al mes, bajo demanda.',
        },
        { text: 'SEO avanzado' },
        { text: 'Chatbot IA inteligente' },
      ] as Feature[],
    },
    en: {
      name: 'Pro',
      desc: 'Everything you need to grow. Branding, payments and automation.',
      features: [
        { text: 'Everything in Starter, plus:' },
        { text: 'Branding', tooltip: 'Company brand modernization and revamp.' },
        { text: 'Payment system', tooltip: 'Accept payments for your products.' },
        { text: 'Calendar & reservations' },
        {
          text: 'Periodic redesign of website elements',
          tooltip: 'Every three months, different elements can be readjusted or redesigned.',
        },
        {
          text: 'Media creation — Advanced',
          tooltip: 'Up to 1 video + 20 images per month, on demand.',
        },
        { text: 'Advanced SEO optimization' },
        { text: 'AI Intelligent Chatbot' },
      ] as Feature[],
    },
  },
  {
    key: 'frontier',
    priceEs: PLAN_PRICES.frontier.monthly,
    priceEn: PLAN_PRICES_USD.frontier.monthly,
    badge: null as string | null,
    highlighted: false,
    es: {
      name: 'Frontier',
      desc: 'Marketing activo, SEO avanzado y contenido continuo para líderes del sector.',
      features: [
        { text: 'Todo lo de Pro, más:' },
        {
          text: 'Creación de contenido — Frontier',
          tooltip: 'Hasta 4 vídeos y 80 imágenes al mes, bajo demanda.',
        },
        {
          text: 'Campañas de marketing',
          tooltip: 'Campaña de marketing mensual, con todo el material completo.',
        },
        { text: 'SEO avanzado backlinks (cloud stacks)' },
        {
          text: 'Generación de artículos y contenido',
          tooltip: 'Mensual: 1 artículo para mejorar el posicionamiento en índices.',
        },
        { text: 'Gestión de Google Ads', tooltip: 'Bajo demanda — 1 campaña incluida.' },
        {
          text: 'Chatbot IA y recepcionista telefónico IA',
          tooltip:
            'Bajo demanda, configuración con inteligencia artificial. Coste adicional desde $10 por 1M tokens para chatbots, y desde $0.25 por minuto para llamadas telefónicas con IA.',
        },
      ] as Feature[],
    },
    en: {
      name: 'Frontier',
      desc: 'Active marketing, advanced SEO and continuous content for industry leaders.',
      features: [
        { text: 'Everything in Pro, plus:' },
        {
          text: 'Media creation — Frontier',
          tooltip: 'Up to 4 videos and 80 images per month, on demand.',
        },
        {
          text: 'Marketing campaigns',
          tooltip: 'Monthly marketing campaign, complete material set.',
        },
        { text: 'Advanced SEO backlinks (cloud stacks)' },
        {
          text: 'Article and content generation',
          tooltip: 'Monthly: 1 article to improve index positioning.',
        },
        { text: 'Google Ads management', tooltip: 'On demand — 1 campaign included.' },
        {
          text: 'AI chatbot and AI phone receptionist',
          tooltip:
            'On demand, AI intelligence setup. Additional cost from $10 per 1M tokens for chatbots, and from $0.25 per minute for AI phone calls.',
        },
      ] as Feature[],
    },
  },
]

type Plan = typeof plans[0]
type TFn = (es: string, en: string) => string

// Click-to-toggle info popover for a single feature — accessible (button +
// aria-expanded, closes on outside click or Esc) rather than a hover-only
// tooltip, which doesn't work on touch devices.
function FeatureTooltip({ text, dark }: { text: string; dark: boolean }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <span ref={wrapRef} className="relative inline-flex flex-shrink-0 align-middle">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label="More info"
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full border text-[10px] leading-none font-body cursor-pointer transition-opacity ${
          dark ? 'border-white/40 text-white/70 hover:opacity-100' : 'border-ink/40 text-ink/70 hover:opacity-100'
        } opacity-70`}
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 rounded-lg bg-[#1C1D24] text-white text-xs leading-relaxed p-3 shadow-[0_12px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/10"
        >
          {text}
        </span>
      )}
    </span>
  )
}

function PricingCard({ plan, index, t }: { plan: Plan; index: number; t: TFn }) {
  const { lang } = useLang()
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

  const features = lang === 'es' ? plan.es.features : plan.en.features

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
      className={`relative flex flex-col rounded-3xl cursor-default ${
        plan.highlighted
          ? 'px-8 py-12 bg-[#1C1D24] text-white shadow-[0_24px_64px_rgba(0,0,0,0.5)] ring-1 ring-[#7B8CDE]/30'
          : 'p-8 bg-base text-ink shadow-[0_16px_56px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.07]'
      }`}
    >
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ background: spotBg }}
        aria-hidden="true"
      />

      {plan.badge && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-body font-semibold px-3 py-1 rounded-full bg-white text-ink whitespace-nowrap">
          {plan.badge}
        </span>
      )}

      <div className="relative mb-6">
        <p className={`font-body text-sm font-medium mb-2 ${plan.highlighted ? 'text-white/50' : 'text-muted'}`}>
          {t(plan.es.name, plan.en.name)}
        </p>
        <div className="flex items-end gap-1 mb-2">
          <span className={`font-body text-2xl font-semibold mb-1 ${plan.highlighted ? 'text-white/60' : 'text-muted'}`}>
            {t('', '$')}
          </span>
          <span className="font-display font-semibold text-5xl tracking-tight">{t(String(plan.priceEs), String(plan.priceEn))}</span>
          <span className={`font-body text-sm mb-2 ${plan.highlighted ? 'text-white/50' : 'text-muted'}`}>
            {t(' €/mes', '/mo')}
          </span>
        </div>
        {/* Pill — inside card next to price; slightly larger on highlighted */}
        <span className={`we-pill-orange font-body font-semibold text-white rounded-full inline-flex items-center whitespace-nowrap self-start ${
          plan.highlighted ? 'text-sm px-4 py-1.5' : 'text-xs px-3 py-1'
        }`}>
          {t('Primer mes gratis', 'First month free')}
        </span>
      </div>

      <ul className="relative flex-1 flex flex-col gap-3 mb-8">
        {features.map(feat => {
          const isHeader = feat.text.includes('plus:') || feat.text.includes('más:')
          return (
            <li key={feat.text} className="flex items-start gap-2.5">
              {!isHeader && (
                <Check size={15} className="mt-0.5 flex-shrink-0 text-[#34C759]" aria-hidden="true" />
              )}
              {/* Plain inline flow (not inline-flex) — the tooltip icon needs
                  to sit as part of the TEXT's own line-wrapping, right after
                  the last word, not as a flex sibling: a flex row vertically
                  centers the icon against the text's WHOLE block height,
                  which for a 2-line feature (e.g. "Periodic redesign of
                  website elements") puts it centered between the two lines
                  instead of inline after the final word. */}
              <span className={`font-body text-sm ${plan.highlighted ? 'text-white/80' : 'text-ink'} ${isHeader ? 'font-bold' : ''}`}>
                {feat.text}
                {feat.tooltip && (
                  <>
                    {' '}
                    <FeatureTooltip text={feat.tooltip} dark={plan.highlighted} />
                  </>
                )}
              </span>
            </li>
          )
        })}
      </ul>

      {/* All three plans share the same glowing CTA pill now — "light"
          (bone) on Pro's dark card, "dark" (near-black) on Starter/
          Frontier's light bg-base cards, for contrast either way. */}
      <CTAButton
        href={t(`/registro?plan=${plan.key}-es`, `/registro?plan=${plan.key}`)}
        variant={plan.highlighted ? 'light' : 'dark'}
        className="w-full"
      >
        {t('Empezar gratis', 'Try for free')}
      </CTAButton>
    </motion.div>
  )
}

export default function PreciosIndexSection() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

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
      if (isNavJumping()) return
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
      data-nav-dark
      className="relative min-h-screen flex items-center overflow-hidden py-24 scroll-mt-24"
      style={{ backgroundColor: '#0D0E12' }}
    >
      {/* Soft pink ambient light behind the 3 cards — three blurred radial
          blooms roughly under each card's horizontal position, low opacity
          so it reads as illumination on the black bg rather than a shape. */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 480px 420px at 15% 58%, rgba(212,111,200,0.24), transparent 70%), ' +
            'radial-gradient(ellipse 560px 480px at 50% 55%, rgba(212,111,200,0.3), transparent 70%), ' +
            'radial-gradient(ellipse 480px 420px at 85% 58%, rgba(212,111,200,0.24), transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-10"
        >
          <h2
            className="font-display font-semibold text-bone tracking-tight"
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
          >
            {t('Precios', 'Pricing')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <PricingCard key={plan.key} plan={plan} index={i} t={t} />
          ))}
        </div>

        <p className="text-center font-body text-sm font-bold text-bone mt-6">
          {t('Sin permanencia. Cancela cuando quieras.', 'No lock-in. Cancel anytime.')}
        </p>

        <div className="text-center mt-4">
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-body text-sm font-semibold text-bone underline underline-offset-4 hover:text-bone/80 transition-colors cursor-pointer"
          >
            {t('Ayúdame a decidir', 'Help me decide')}
          </button>
        </div>
      </div>
    </section>
  )
}
