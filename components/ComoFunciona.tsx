'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const steps = [
  {
    num: '01',
    img: '/como-funciona/step-01.jpg',
    es: { title: 'Cuéntanos tu negocio', desc: 'Rellenas un formulario breve. Nos dices qué haces, a quién, y cómo quieres que te vean.' },
    en: { title: 'Tell us about your business', desc: 'Fill out a short form. Tell us what you do, who you serve, and how you want to be seen.' },
  },
  {
    num: '02',
    img: '/como-funciona/step-02.jpg',
    es: { title: 'Nosotros lo diseñamos', desc: 'En 1 semana tienes un sitio profesional, adaptado a tu sector, con tu contenido real.' },
    en: { title: 'We design it', desc: 'In 1 week you have a professional site, tailored to your industry, with your real content.' },
  },
  {
    num: '03',
    img: '/como-funciona/step-03.jpg',
    es: { title: 'Tu web, en marcha', desc: 'Apruebas, publicamos. Tu web está live y empieza a trabajar por ti desde el primer día.' },
    en: { title: 'Your website, live', desc: 'You approve, we publish. Your site is live and starts working for you from day one.' },
  },
  {
    num: '04',
    img: '/como-funciona/step-04.jpg',
    es: { title: 'Soporte continuo', desc: 'Actualizamos, mantenemos y mejoramos tu web. Tú no tocas código. Nunca.' },
    en: { title: 'Ongoing support', desc: 'We update, maintain and improve your website. You never touch the code.' },
  },
]

/* ── Timings ──────────────────────────────────────────────────── */
const ANIM_MS  = 340   // height animation duration
const HOLD_MS  = 2000  // lock after each expand (ignores scrolls)

export default function ComoFunciona({ noBg }: { noBg?: boolean } = {}) {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  /* displayCard: index 0-3 = that card is expanded; -1 = all collapsed */
  const [displayCard, setDisplayCard] = useState(0)
  const [activeCard,  setActiveCard]  = useState(0) // drives progress pills

  const displayRef = useRef(0)
  const lockedRef  = useRef(false) // true during animation + 2s hold

  /* ── Section-in-view helper ── */
  function sectionIsActive() {
    const el = sectionRef.current
    if (!el) return false
    const { top, bottom } = el.getBoundingClientRect()
    const vh = window.innerHeight
    const visible = Math.min(bottom, vh) - Math.max(top, 0)
    return visible / vh > 0.55 // section fills >55% of viewport
  }

  /* ── Wheel handler (desktop only) ── */
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (window.innerWidth < 768) return
      if (!sectionIsActive()) return

      const cur       = displayRef.current
      const goingDown = e.deltaY > 0

      // At boundaries: let page scroll naturally
      if (goingDown  && cur === steps.length - 1) return
      if (!goingDown && cur === 0) return

      // Consume the event regardless (prevent page scroll while inside section)
      e.preventDefault()

      // During lock: consume but don't advance
      if (lockedRef.current) return

      // ── Start transition ──
      lockedRef.current = true
      const next = goingDown ? cur + 1 : cur - 1

      // Phase 1: collapse (all cards → height 0)
      setDisplayCard(-1)
      displayRef.current = -1

      setTimeout(() => {
        // Phase 2: expand next card
        setDisplayCard(next)
        setActiveCard(next)
        displayRef.current = next

        // Phase 3: hold 2 s, then unlock
        setTimeout(() => {
          lockedRef.current = false
        }, HOLD_MS)
      }, ANIM_MS)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  /* ── Auto-snap section to fill the viewport on entry ── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    let snapping = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !snapping) {
          const { top, bottom } = el.getBoundingClientRect()
          const vh = window.innerHeight
          const visible = Math.min(bottom, vh) - Math.max(top, 0)

          // If section doesn't yet fill the viewport, snap it into place
          if (visible / vh < 0.88) {
            snapping = true
            lockedRef.current = true

            // Reset to card 0 each time we enter
            setDisplayCard(0)
            setActiveCard(0)
            displayRef.current = 0

            // Smooth-scroll so section top aligns with viewport top
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })

            // Release lock after scroll + brief pause
            setTimeout(() => {
              snapping = false
              lockedRef.current = false
            }, 950)
          } else {
            // Already filling viewport — just lock briefly
            lockedRef.current = true
            setTimeout(() => { lockedRef.current = false }, 600)
          }
        } else if (!entry.isIntersecting) {
          snapping = false
          lockedRef.current = true
          // Reset card for next entry
          setDisplayCard(0)
          setActiveCard(0)
          displayRef.current = 0
        }
      },
      { threshold: 0.12 }  // fire when section first peeks into view
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      className={`md:h-screen flex items-center py-14 md:py-0 ${noBg ? '' : 'bg-[#F5F5F7]'}`}
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* ── Left: heading ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              {t('Cómo funciona', 'How it works')}
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-5 leading-tight">
              {t('Cuatro pasos.', 'Four steps.')}
            </h2>
            <p className="font-manrope text-[#6B7280] text-lg leading-relaxed max-w-sm">
              {t(
                'Sin reuniones interminables. Sin presupuestos sorpresa.',
                'No endless meetings. No surprise costs.'
              )}
            </p>

            {/* Progress pills */}
            <div className="flex gap-2 mt-8">
              {steps.map((s, i) => (
                <motion.div
                  key={s.num}
                  className="h-[3px] rounded-full"
                  animate={{
                    width: i === activeCard ? 32 : 20,
                    backgroundColor:
                      i === activeCard
                        ? '#1D1D1F'
                        : 'rgba(29,29,31,0.12)',
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              ))}
            </div>
          </motion.div>

          {/* ── Right: 4 step cards ── */}
          <div className="flex flex-col gap-2.5">
            {steps.map((step, i) => {
              const expanded = displayCard === i
              return (
                <div
                  key={step.num}
                  className={`rounded-2xl overflow-hidden transition-colors duration-500 ${
                    expanded
                      ? 'bg-[#1D1D1F] shadow-[0_20px_56px_rgba(0,0,0,0.2)]'
                      : 'bg-white border border-black/[0.07] shadow-sm'
                  }`}
                >
                  {/* ── Animated image ── */}
                  <motion.div
                    animate={{ height: expanded ? 172 : 0 }}
                    transition={{
                      duration: ANIM_MS / 1000,
                      ease: expanded
                        ? [0.16, 1, 0.3, 1]   // expand: fast in, settle
                        : [0.4, 0, 0.6, 1],   // collapse: fast out
                    }}
                    className="relative overflow-hidden"
                  >
                    <div className="relative" style={{ height: 172 }}>
                      <Image
                        src={step.img}
                        alt={t(step.es.title, step.en.title)}
                        fill
                        unoptimized
                        className="object-cover object-center"
                      />
                    </div>
                  </motion.div>

                  {/* ── Card content ── */}
                  <div className={`transition-all duration-400 ${expanded ? 'p-6' : 'p-4'}`}>
                    <span
                      className={`font-outfit text-4xl font-semibold block mb-2 leading-none transition-colors duration-500 ${
                        expanded ? 'text-white/18' : 'text-[#6B7280]/25'
                      }`}
                    >
                      {step.num}
                    </span>
                    <h3
                      className={`font-outfit font-semibold text-[17px] transition-colors duration-500 ${
                        expanded ? 'text-white' : 'text-[#1D1D1F]'
                      }`}
                    >
                      {t(step.es.title, step.en.title)}
                    </h3>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.p
                          key="desc"
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.32, ease: 'easeInOut' }}
                          className="font-manrope text-sm leading-relaxed text-white/58 overflow-hidden"
                        >
                          {t(step.es.desc, step.en.desc)}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
