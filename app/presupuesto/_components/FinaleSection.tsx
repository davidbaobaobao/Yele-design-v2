'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RegistroButton } from './CTAButtons'

export default function FinaleSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.muted = true
    v.play().catch(() => {})
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline
        poster="/media/finale/finale_poster.jpg"
        aria-hidden="true"
      >
        <source src="/media/finale/finale_hero.mp4"  type="video/mp4" />
        <source src="/media/finale/finale_hero.webm" type="video/webm" />
      </video>

      {/* Dark scrim */}
      <div className="absolute inset-0 bg-[#0a0a0f]/55" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="font-outfit font-light text-white tracking-tight leading-none mb-10"
          style={{ fontSize: 'clamp(40px, 7vw, 100px)' }}
        >
          Pide tu página web<br />
          <span style={{ fontWeight: 700 }}>Ahora</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <RegistroButton
            href="/registro?plan=starter"
            className="font-manrope font-semibold text-lg bg-white text-[#1D1D1F]
                       px-10 py-4 rounded-2xl hover:bg-[#F5F5F7] transition-colors"
          >
            Empezar por 0€
          </RegistroButton>
        </motion.div>

      </div>
    </section>
  )
}
