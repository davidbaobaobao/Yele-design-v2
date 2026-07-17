'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'

export default function WeCreateSection() {
  const { t } = useLang()

  return (
    <section data-snap-section className="relative w-full min-h-screen overflow-hidden">

      <Image
        src="/media/we%20create/bgvideo_poster.jpg"
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />

      <video
        loop
        muted
        autoPlay
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/media/we%20create/bgvideo_hq.webm" type="video/webm" />
        <source src="/media/we%20create/bgvideo_hq.mp4" type="video/mp4" />
      </video>

      {/* Scroll-hint arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="scroll-arrow-bounce">
          <svg className="scroll-arrow-spin" width="38" height="38" viewBox="0 0 24 24"
            fill="none" stroke="#e2482f" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
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
            <span style={{ color: '#ffffff' }}>
              {t('Creamos', 'We create')}
            </span>
            <br />
            <span className="we-subtitle-orange" style={{ fontSize: 'clamp(38px, 5vw, 72px)' }}>
              {t('todo el contenido que necesitas', 'Any content you need')}
            </span>
          </h2>

          <div
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(13px, 1.3vw, 18px)',
              lineHeight: 1.7,
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <p style={{ margin: 0 }}>{t('De fotografía y vídeo', 'From photography and video')}</p>
            <p style={{ margin: 0 }}>{t('a copy e ilustraciones', 'to copy and illustrations')}</p>
            <p style={{ margin: 0 }}>{t('Para que tu web sea impactante y llamativa.', 'So your website looks stunning and eye-catching.')}</p>
          </div>

        </motion.div>
      </div>

    </section>
  )
}
