'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type Transition } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

export default function CTASection() {
  const { t } = useLang()
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 18 })
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 18 })

  const rotateY = useTransform(smoothX, [-0.5, 0.5], ['-12deg', '12deg'])
  const rotateX = useTransform(smoothY, [-0.5, 0.5], ['8deg', '-8deg'])

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
      <div className="max-w-6xl mx-auto px-6" style={{ perspective: '1200px' }}>
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' } as Transition}
          viewport={{ once: true, margin: '-80px' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden rounded-3xl cursor-default"
          style={{ rotateX, rotateY }}
          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        >
          {/* Full-bleed video */}
          <div className="absolute inset-0">
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
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content overlay */}
          <div className="relative z-10 px-8 py-20 md:px-14 md:py-28 flex flex-col items-center text-center">
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-white tracking-tight mb-6 leading-tight">
              {t('Estás a un paso', "You're one step away")}<br />
              <span className="text-white/60">{t('de la web que mereces.', 'from the website you deserve.')}</span>
            </h2>

            <p className="font-manrope text-white/70 text-lg mb-10 max-w-sm">
              {t(
                'Cuéntanos tu negocio y ten tu web lista en menos de una semana.',
                'Tell us about your business and have your website ready in less than a week.'
              )}
            </p>

            <motion.a
              href="/registro"
              className="relative overflow-hidden inline-flex items-center gap-2 font-manrope font-medium text-base bg-white text-[#1D1D1F] px-8 py-4 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              whileHover="hover"
              whileTap={{ scale: 0.97, transition: { duration: 0.15 } as Transition }}
              initial="rest"
            >
              <motion.span
                className="absolute inset-0 bg-[#F0F0F0]"
                variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                transition={{ duration: 0.3, ease: 'easeOut' } as Transition}
                style={{ originX: 0 }}
                aria-hidden="true"
              />
              <span className="relative z-10">{t('Quiero mi web', 'I want my website')}</span>
              <span className="relative z-10" aria-hidden="true">→</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
