'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'
import { useLang } from '@/context/LanguageContext'

export default function WeDesignSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoAutoplay(videoRef)
  const { t } = useLang()

  return (
    <section data-snap-section className="relative w-full min-h-screen overflow-hidden">

      {/* Zoom-out wrapper — scale(0.88) shows more of the scene; section bg clips the edges */}
      <div className="absolute inset-0" style={{ transform: 'scale(0.88)', transformOrigin: 'center' }}>
        <Image
          src="/media/wedesign/wedesign_poster.jpg"
          alt=""
          fill
          priority
          unoptimized
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
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/media/wedesign/wedesign_hq.webm" type="video/webm" />
          <source src="/media/wedesign/wedesign_hq.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Gradient fades — aggressive blend so no visible transition between white and video */}
      <div className="absolute top-0 left-0 right-0 h-[55%] bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 left-0 w-[40%] bg-gradient-to-r from-white via-white/70 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-[40%] bg-gradient-to-l from-white via-white/70 to-transparent z-10 pointer-events-none" />

      {/* Scroll-hint arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="scroll-arrow-wrap">
          <div className="scroll-arrow-spin">
            <svg width="52" height="52" viewBox="0 0 120 120" fill="none" stroke="#e2482f" strokeWidth="14" strokeLinecap="butt" strokeLinejoin="miter" aria-hidden="true">
              <polyline points="30,42 60,78 90,42" />
            </svg>
          </div>
        </div>
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
              fontSize: 'clamp(30px, 3.8vw, 58px)',
              lineHeight: 1.0,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              margin: '0 0 20px 0',
            }}
          >
            <span style={{ color: '#000000' }}>
              {t('Diseñamos', 'We design')}
            </span>
            <br />
            <span className="we-subtitle-orange" style={{ fontSize: 'clamp(38px, 5vw, 72px)' }}>
              {t('tu visión', 'your vision')}
            </span>
          </h2>

          <div
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(13px, 1.3vw, 18px)',
              lineHeight: 1.7,
              fontWeight: 400,
              color: '#555555',
            }}
          >
            <p style={{ margin: 0 }}>{t('De webs que impactan visualmente', 'From bold statement websites')}</p>
            <p style={{ margin: 0 }}>{t('a webs de alta conversión', 'to high converting websites')}</p>
            <p style={{ margin: 0 }}>{t('y todo lo que hay entre medias.', 'and everything in between.')}</p>
          </div>

        </motion.div>
      </div>

    </section>
  )
}
