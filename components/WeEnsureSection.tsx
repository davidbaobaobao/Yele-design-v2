'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'
import { useLang } from '@/context/LanguageContext'

export default function WeEnsureSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoAutoplay(videoRef)
  const { t } = useLang()

  return (
    <section data-snap-section className="relative w-full min-h-screen overflow-hidden">

      <Image
        src="/media/weensure/weensure_poster.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />

      <video
        ref={videoRef}
        loop
        muted
        autoPlay
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/media/weensure/weensure_hq.webm" type="video/webm" />
        <source src="/media/weensure/weensure_hq.mp4" type="video/mp4" />
      </video>

      {/* Scroll-hint arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })} aria-label="Scroll to next section" className="cursor-pointer bg-transparent border-0 p-0">
          <div className="scroll-arrow-wrap">
            <div className="scroll-arrow-spin">
              <svg width="52" height="52" viewBox="0 0 120 120" fill="none" stroke="#e2482f" strokeWidth="14" strokeLinecap="butt" strokeLinejoin="miter" aria-hidden="true">
                <polyline points="30,42 60,78 90,42" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      <div className="absolute inset-0 flex items-center z-20">
        <motion.div
          className="w-full md:w-1/2 px-6 md:pl-16 md:pr-12 lg:pr-20 text-left md:text-right"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: 0.15 }}
          viewport={{ once: true, amount: 0.5 }}
        >

          <h2
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(38px, 5vw, 70px)',
              lineHeight: 1.0,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              margin: '0 0 16px 0',
            }}
          >
            <span style={{ color: '#ffffff' }}>
              {t('Garantizamos', 'We ensure')}
            </span>
            <br />
            <span className="we-subtitle-orange">
              {t('máximo rendimiento', 'peak performance')}
            </span>
          </h2>

          <p
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(18px, 1.5vw, 20px)',
              lineHeight: 1.7,
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
            }}
          >
            {t(
              'Siempre online. Siempre fiable.',
              'Always online. Always reliable.'
            )}
          </p>

        </motion.div>
      </div>

    </section>
  )
}
