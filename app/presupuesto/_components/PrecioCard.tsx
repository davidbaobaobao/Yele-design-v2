'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
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
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4])

  const spotX = useTransform(smoothX, [-0.5, 0.5], [0, 100])
  const spotY = useTransform(smoothY, [-0.5, 0.5], [0, 100])
  const spotBg = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.18) 0%, transparent 55%)`

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

  return (
    <section id="precios" className="relative py-14 md:py-20 overflow-hidden">

      {/* Background video — fills entire section */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline
        poster="/media/precios/bg_poster.jpg"
        aria-hidden="true"
      >
        <source src="/media/precios/bg.webm" type="video/webm" />
        <source src="/media/precios/bg.mp4"  type="video/mp4" />
      </video>
      {/* Subtle dark scrim for legibility */}
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Heading — full-width so it stays on one line */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-10"
        >
          <span className="font-manrope text-xs tracking-[0.15em] uppercase text-white/60 mb-4 block">
            Precios
          </span>
          <h2 className="font-outfit font-semibold text-white tracking-tight whitespace-nowrap"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
            Sin letra pequeña.
          </h2>
        </motion.div>

        {/* Card */}
        <div className="max-w-md mx-auto">
          <motion.div
            ref={ref}
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-80px' }}
            className="relative bg-white text-[#1D1D1F] rounded-3xl p-8
                       shadow-[0_28px_72px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06]
                       cursor-default"
          >
            {/* Spotlight overlay */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: spotBg }}
              aria-hidden="true"
            />

            {/* Price + orange pill inline */}
            <div className="flex items-center gap-3 flex-wrap mb-7">
              <div className="flex items-end gap-1">
                <span className="font-outfit font-semibold text-6xl tracking-tight leading-none">
                  49€
                </span>
                <span className="font-manrope text-sm text-[#6B7280] mb-1.5">/mes</span>
              </div>
              <span
                style={{ background: ORANGE }}
                className="font-manrope font-semibold text-xs text-white px-3 py-1.5 rounded-full"
              >
                Primer mes gratuito
              </span>
            </div>

            {/* Features */}
            <ul className="relative flex flex-col gap-3.5 mb-8">
              {features.map(feat => (
                <li key={feat} className="flex items-center gap-2.5">
                  <Check size={15} className="flex-shrink-0 text-[#34C759]" aria-hidden="true" />
                  <span className="font-manrope text-sm text-[#1D1D1F]">{feat}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="/registro?plan=starter"
              className="relative block text-center font-manrope font-semibold text-sm py-3.5 rounded-xl
                         bg-[#1D1D1F] text-white hover:bg-black transition-colors"
            >
              Empezar por 0€
            </a>
          </motion.div>

          <p className="text-center font-manrope text-sm text-white/60 mt-6">
            Sin permanencia. Cancela cuando quieras.
          </p>
        </div>

      </div>
    </section>
  )
}
