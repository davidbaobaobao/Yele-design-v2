'use client'

import { useRef, useEffect } from 'react'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useScroll } from 'framer-motion'
import { Check } from 'lucide-react'

const ORANGE = '#e2482f'

const features = [
  'Diseño Alucinante',
  'Adaptada a móvil',
  'Mantenimiento incluido',
  'Dominio incluido',
  'Panel de Control',
  'Soporte continuo 24/7',
]

export default function PrecioCard() {
  const sectionRef  = useRef<HTMLElement>(null)
  const cardRef     = useRef<HTMLDivElement>(null)
  const videoBgRef  = useRef<HTMLVideoElement>(null)

  useVideoAutoplay(videoBgRef)

  /* ── Scroll-based card parallax (mobile) ── */
  const { scrollYProgress: secScroll } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const cardScrollY = useTransform(secScroll, [0, 0.5, 1], [36, 0, -36])

  /* ── 3D parallax tilt ── */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4])
  const spotX   = useTransform(smoothX, [-0.5, 0.5], [0, 100])
  const spotY   = useTransform(smoothY, [-0.5, 0.5], [0, 100])
  /* Spotlight is stronger on the gradient card so it shows against the shaded bg */
  const spotBg  = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.55) 0%, transparent 60%)`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function handleMouseLeave() { mouseX.set(0); mouseY.set(0) }

  /* ── Auto-snap to fill screen + 2s scroll lock on entry ── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let snapping = false
    let locked   = false
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
          locked   = true
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          window.addEventListener('wheel', preventScroll, { passive: false })
          clearTimeout(lockTimer)
          lockTimer = setTimeout(() => {
            locked   = false
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
      className="relative min-h-screen flex items-center overflow-hidden py-16"
    >
      <video
        ref={videoBgRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline preload="auto"
        poster="/media/precios/precios2_poster.jpg"
        aria-hidden="true"
      >
        <source src="/media/precios/precios2_hero.mp4"  type="video/mp4" />
        <source src="/media/precios/precios2_hero.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-10"
        >
          {/* "Precios" label — larger */}
          <span className="font-manrope text-xl font-bold tracking-[0.2em] uppercase text-white/80 mb-5 block">
            Precios
          </span>
          <h2
            className="font-outfit font-semibold text-white tracking-tight whitespace-nowrap"
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
          >
            Sin letra pequeña.
          </h2>
        </motion.div>

        {/* Card */}
        <div className="max-w-md mx-auto">
          <motion.div
            ref={cardRef}
            style={{
              rotateX,
              rotateY,
              y: cardScrollY,
              transformPerspective: 1000,
              background: 'linear-gradient(155deg, #ffffff 0%, #dde0eb 100%)',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-80px' }}
            className="relative rounded-3xl p-10 cursor-default
                       shadow-[0_28px_72px_rgba(0,0,0,0.4)] ring-1 ring-white/20"
          >
            {/* Mouse-follow spotlight — more visible on gradient */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: spotBg }}
              aria-hidden="true"
            />

            {/* Price + animated orange pill */}
            <div className="flex items-center gap-4 flex-wrap mb-8">
              <div className="flex items-end gap-1">
                <span className="font-outfit font-semibold text-6xl tracking-tight leading-none text-[#1D1D1F]">
                  49€
                </span>
                <span className="font-manrope text-sm text-[#6B7280] mb-1.5">/mes</span>
              </div>

              {/* Pill — slow ambient glow */}
              <motion.span
                style={{ background: ORANGE }}
                animate={{
                  boxShadow: [
                    '0 0 0px 0px rgba(226,72,47,0)',
                    '0 0 14px 4px rgba(226,72,47,0.28)',
                    '0 0 0px 0px rgba(226,72,47,0)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="font-manrope font-semibold text-sm text-white px-4 py-2 rounded-full block"
              >
                Primer mes gratuito
              </motion.span>
            </div>

            {/* Features */}
            <ul className="relative flex flex-col gap-4 mb-10">
              {features.map(feat => (
                <li key={feat} className="flex items-center gap-3">
                  <Check size={16} className="flex-shrink-0 text-[#34C759]" aria-hidden="true" />
                  <span className="font-manrope text-sm text-[#1D1D1F]">{feat}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="/registro?plan=starter"
              className="relative block text-center font-manrope font-semibold text-sm py-4 rounded-xl
                         bg-[#1D1D1F] text-white hover:bg-black transition-colors"
            >
              Empezar por 0€
            </a>
          </motion.div>

          {/* Footer note — bold and visible */}
          <p className="text-center font-manrope text-sm font-semibold text-white mt-6">
            Sin permanencia. Cancela cuando quieras.
          </p>
        </div>

      </div>
    </section>
  )
}
