'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'
import { useLang } from '@/context/LanguageContext'

export default function WeDesignSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoAutoplay(videoRef)
  const { t } = useLang()

  return (
    <section className="relative w-full min-h-screen overflow-hidden">

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

      {/* Text — left half, right-aligned, vertically centered */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full md:w-1/2 px-6 md:pl-16 md:pr-12 lg:pr-20 text-left md:text-right">

          {/* Main heading */}
          <h2
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(24px, 2.8vw, 42px)',
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
            <span style={{ color: '#898484' }}>
              {t('tu visión', 'your vision')}
            </span>
          </h2>

          {/* 3 smaller descriptor lines */}
          <div
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(11px, 1vw, 14px)',
              lineHeight: 1.7,
              fontWeight: 400,
              color: '#555555',
              letterSpacing: '0',
            }}
          >
            <p style={{ margin: 0 }}>{t('De webs que impactan visualmente', 'From bold statement websites')}</p>
            <p style={{ margin: 0 }}>{t('a webs de alta conversión', 'to high converting websites')}</p>
            <p style={{ margin: 0 }}>{t('y todo lo que hay entre medias.', 'and everything in between.')}</p>
          </div>

        </div>
      </div>

    </section>
  )
}
