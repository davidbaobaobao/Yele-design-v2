'use client'

import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'

export default function WeCreateSection() {
  const { t } = useLang()

  return (
    <section className="relative w-full min-h-screen overflow-hidden">

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

      {/* Text — left half, right-aligned, vertically centered */}
      <div className="absolute inset-0 flex items-center z-20">
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
              {t('Creamos', 'We create')}
            </span>
            <br />
            {/* mix-blend-mode: difference → text shows complementary colors of the video behind it */}
            <span style={{ color: '#ffffff', mixBlendMode: 'difference', display: 'inline-block' }}>
              {t('todo el contenido que necesitas', 'Any content you need')}
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
            <p style={{ margin: 0 }}>{t('De fotografía y vídeo', 'From photography and video')}</p>
            <p style={{ margin: 0 }}>{t('a copy e ilustraciones', 'to copy and illustrations')}</p>
            <p style={{ margin: 0 }}>{t('Para que tu web sea impactante y llamativa.', 'So your website looks stunning and eye-catching.')}</p>
          </div>

        </div>
      </div>

    </section>
  )
}
