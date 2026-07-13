'use client'

import { useRef, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'

export default function DiferenciaSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)

  useEffect(() => { videoRef.current?.play().catch(() => {}) }, [])

  /* ── Desktop spotlight ── */
  const mouseX  = useMotionValue(-2000)
  const mouseY  = useMotionValue(-2000)
  const scrimBg = useMotionTemplate`radial-gradient(720px circle at ${mouseX}px ${mouseY}px, rgba(10,10,15,0.02) 0%, rgba(10,10,15,0.42) 52%, rgba(10,10,15,0.78) 85%)`

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth < 768) return
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-2000)
    mouseY.set(-2000)
  }, [mouseX, mouseY])

  /* ── Auto-snap on scroll entry + 750ms lock ── */
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
      className="relative min-h-screen flex items-start md:items-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mobile: position video so purple elements are visible; no translateY shift */}
      <style>{`
        @media (max-width: 767px) {
          .dif-vid { object-position: right bottom; }
        }
      `}</style>

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover dif-vid"
        autoPlay muted loop playsInline
        poster="/media/diferencia/orbital2_poster.jpg"
        aria-hidden="true"
      >
        <source src="/media/diferencia/orbital2_hero.mp4"  type="video/mp4" />
        <source src="/media/diferencia/orbital2_hero.webm" type="video/webm" />
      </video>

      {/* Desktop mouse-tracking spotlight scrim */}
      <motion.div
        className="absolute inset-0 hidden md:block"
        style={{ background: scrimBg }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-20 pt-24 pb-16 md:py-20">
        <div className="max-w-2xl">

          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="font-outfit font-extrabold text-white tracking-tight leading-none mb-10 text-left whitespace-nowrap"
            style={{ fontSize: 'clamp(32px, 4vw, 58px)' }}
          >
            LA DIFERENCIA
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="font-manrope leading-relaxed mb-12 space-y-2 text-left"
            style={{ fontSize: 'clamp(15px, 1.6vw, 20px)' }}
          >
            <p className="text-white/60">
              Otras agencias te entregan la web… y se lavan las manos.
            </p>
            <p className="text-white">
              Nosotros estamos... <strong className="font-bold">Siempre.</strong>
            </p>
            <p className="text-white/60">
              Mejora constante... Siempre al día.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="/registro?plan=starter"
              className="font-manrope font-semibold text-base bg-white text-[#1D1D1F]
                         px-8 py-3.5 rounded-xl hover:bg-[#F5F5F7] transition-colors"
            >
              Empezar por 0€
            </a>
            <a
              href="#contacto"
              className="font-manrope font-semibold text-base text-white
                         border border-white/25 px-8 py-3.5 rounded-xl
                         hover:bg-white/10 transition-colors"
            >
              Contáctanos
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
