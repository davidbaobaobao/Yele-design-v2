'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, type Transition } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

export default function CTASection() {
  const { t } = useLang()
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  const spotX = useTransform(smoothX, [-0.5, 0.5], [0, 100])
  const spotY = useTransform(smoothY, [-0.5, 0.5], [0, 100])
  const spotlight = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, rgba(99,120,255,0.10) 0%, transparent 60%)`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section className="py-24 md:py-32 bg-[#F5F5F7]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' } as Transition}
          viewport={{ once: true, margin: '-80px' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden rounded-3xl bg-white border border-black/[0.06] cursor-default"
          whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.09)', transition: { duration: 0.2 } }}
        >
          {/* Spotlight */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{ background: spotlight }}
            aria-hidden="true"
          />

          <div className="grid md:grid-cols-2 gap-0 items-center">

            {/* Left — text, centered */}
            <div className="relative px-8 py-16 md:px-14 md:py-20 flex flex-col items-center text-center">
              <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
                {t('Estás a un paso', "You're one step away")}<br />
                <span className="text-[#86868B]">{t('de la web que mereces.', 'from the website you deserve.')}</span>
              </h2>

              <p className="font-manrope text-[#86868B] text-lg mb-10 max-w-sm">
                {t(
                  'Cuéntanos tu negocio y ten tu web lista en menos de una semana.',
                  'Tell us about your business and have your website ready in less than a week.'
                )}
              </p>

              <motion.a
                href="/registro"
                className="relative overflow-hidden inline-flex items-center gap-2 font-manrope font-medium text-base bg-[#1D1D1F] text-white px-8 py-4 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
                whileHover="hover"
                whileTap={{ scale: 0.97, transition: { duration: 0.15 } as Transition }}
                initial="rest"
              >
                <motion.span
                  className="absolute inset-0 bg-black"
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.3, ease: 'easeOut' } as Transition}
                  style={{ originX: 0 }}
                  aria-hidden="true"
                />
                <span className="relative z-10">{t('Quiero mi web', 'I want my website')}</span>
                <span className="relative z-10" aria-hidden="true">→</span>
              </motion.a>
            </div>

            {/* Right — video */}
            <div className="relative hidden md:flex items-center justify-center px-8 py-10 h-full">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.10)]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                  aria-hidden="true"
                >
                  <source src="/videos/webflow.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
