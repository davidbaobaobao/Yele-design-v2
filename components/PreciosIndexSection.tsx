'use client'

import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, type Transition } from 'framer-motion'
import { Check } from 'lucide-react'
import { PLAN_PRICES } from '@/lib/plan-prices'

const ORANGE = '#e2482f'

const plans = [
  {
    key: 'starter',
    price: `€${PLAN_PRICES.starter.monthly}`,
    badge: null as string | null,
    highlighted: false,
    name: 'Starter',
    desc: 'Tu primer paso en internet. Profesional, rápida y sin complicaciones.',
    features: ['Diseño personalizado', 'Dominio incluido', 'Adaptada a móvil', 'Panel de Control', 'Soporte continuo 24/7'],
  },
  {
    key: 'pro',
    price: '€69',
    badge: 'Más elegido',
    highlighted: true,
    name: 'Pro',
    desc: 'La versión completa. Apareces en Google y conviertes visitas en clientes.',
    features: ['Todo lo de Starter', 'Sistema de Reservas', 'SEO local incluido', 'Panel de control avanzado', 'Correo profesional incluido', 'Re-diseño anual'],
  },
  {
    key: 'enterprise',
    price: '€119',
    badge: null as string | null,
    highlighted: false,
    name: 'Enterprise',
    desc: 'Para negocios que necesitan más. Pagos, reservas e integraciones.',
    features: ['Todo lo de Pro', 'Secciones ilimitadas', 'Sistema de Pagos', 'Soporte prioritario', 'Re-diseño semestral'],
  },
]

function PricingCard({ plan, index }: { plan: typeof plans[0]; index: number }) {
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
          {plan.name}
        </p>
        <div className="flex items-end gap-1 mb-1">
          <span className="font-outfit font-semibold text-5xl tracking-tight">{plan.price}</span>
          <span className={`font-manrope text-sm mb-2 ${plan.highlighted ? 'text-white/50' : 'text-[#6B7280]'}`}>/mes</span>
        </div>
        <p className={`font-manrope text-sm leading-relaxed ${plan.highlighted ? 'text-white/60' : 'text-[#6B7280]'}`}>
          {plan.desc}
        </p>
      </div>

      <ul className="relative flex-1 flex flex-col gap-3 mb-8">
        {plan.features.map(feat => (
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
        <span className="relative z-10">Empezar por 0€</span>
      </motion.a>
    </motion.div>
  )
}

export default function PreciosIndexSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.muted = true
    v.play().catch(() => {})
  }, [])

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
        const { top, bottom } = el.getBoundingClientRect()
        const vh = window.innerHeight
        const ratio = (Math.min(bottom, vh) - Math.max(top, 0)) / vh
        if (ratio < 0.88) {
          snapping = true
          locked = true
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          window.addEventListener('wheel', preventScroll, { passive: false })
          clearTimeout(lockTimer)
          lockTimer = setTimeout(() => {
            locked = false
            snapping = false
            window.removeEventListener('wheel', preventScroll)
          }, 750)
        }
      } else if (!entry.isIntersecting) {
        snapping = false
      }
    }, { threshold: 0.12 })

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
        autoPlay muted loop playsInline
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
          <span className="font-manrope text-xl font-bold tracking-[0.2em] uppercase text-white/80 mb-5 block">
            Precios
          </span>
          <h2
            className="font-outfit font-semibold text-white tracking-tight mb-5"
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
          >
            Sin letra pequeña.
          </h2>
          <motion.span
            style={{ background: ORANGE, display: 'inline-block' }}
            animate={{
              boxShadow: [
                '0 0 0px 0px rgba(226,72,47,0)',
                '0 0 14px 4px rgba(226,72,47,0.28)',
                '0 0 0px 0px rgba(226,72,47,0)',
              ],
            }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
            className="font-manrope font-semibold text-sm text-white px-4 py-2 rounded-full"
          >
            Primer mes gratuito
          </motion.span>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <PricingCard key={plan.key} plan={plan} index={i} />
          ))}
        </div>

        <p className="text-center font-manrope text-sm text-white/50 mt-6">
          Sin permanencia. Cancela cuando quieras.
        </p>
      </div>
    </section>
  )
}
