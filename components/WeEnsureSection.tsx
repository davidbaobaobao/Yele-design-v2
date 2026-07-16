'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'
import { useLang } from '@/context/LanguageContext'

export default function WeEnsureSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoAutoplay(videoRef)
  const { t } = useLang()

  return (
    <section className="relative w-full min-h-screen overflow-hidden">

      <Image
        src="/media/weensure/weensure_poster.jpg"
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
        <source src="/media/weensure/weensure_hq.webm" type="video/webm" />
        <source src="/media/weensure/weensure_hq.mp4" type="video/mp4" />
      </video>

      {/* Text — left half, right-aligned, vertically centered */}
      <div className="absolute inset-0 flex items-center z-20">
        <div className="w-full md:w-1/2 px-6 md:pl-16 md:pr-12 lg:pr-20 text-left md:text-right">

          <h2
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(24px, 2.8vw, 42px)',
              lineHeight: 1.0,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              margin: '0 0 16px 0',
            }}
          >
            <span style={{ color: '#000000' }}>
              {t('Garantizamos', 'We ensure')}
            </span>
            <br />
            <span style={{ color: '#898484' }}>
              {t('máximo rendimiento', 'peak performance')}
            </span>
          </h2>

          <p
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(11px, 1vw, 14px)',
              lineHeight: 1.7,
              fontWeight: 400,
              color: '#555555',
              margin: 0,
            }}
          >
            {t(
              'Siempre online. Siempre fiable.',
              'Always online. Always reliable.'
            )}
          </p>

        </div>
      </div>

    </section>
  )
}
