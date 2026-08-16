'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import { PricingCardsGrid } from '@/components/PricingCards'
import { isNavJumping } from '@/lib/nav-scroll'

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
          <p className="font-body text-base text-white/60 mt-3">
            {t(
              'Elige un plan. Diseñamos tu web. Pagas solo cuando esté online.',
              "Pick a plan. We design your site. You pay only once it's live."
            )}
          </p>
        </motion.div>

        <PricingCardsGrid />

        <p className="text-center font-body text-sm font-bold text-bone mt-6">
          {t(
            'Sin coste inicial. Tu primer pago llega el día que tu web esté online. Sin permanencia — cancela cuando quieras.',
            'No upfront cost. Your first payment lands the day your site goes live. No contract — cancel anytime.'
          )}
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
