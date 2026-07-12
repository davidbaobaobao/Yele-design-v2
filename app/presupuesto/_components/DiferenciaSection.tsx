'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function DiferenciaSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => { videoRef.current?.play().catch(() => {}) }, [])

  return (
    <section className="relative min-h-screen flex items-start md:items-center overflow-hidden">

      {/* Background video — shifted 150px down, no mask */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-right-bottom md:object-center"
        style={{ transform: 'translateY(150px)' }}
        autoPlay muted loop playsInline
        poster="/media/diferencia/orbital2_poster.jpg"
        aria-hidden="true"
      >
        <source src="/media/diferencia/orbital2_hero.mp4"  type="video/mp4" />
        <source src="/media/diferencia/orbital2_hero.webm" type="video/webm" />
      </video>

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
