'use client'

import { useRef } from 'react'
import { useVideoAlwaysAutoplay } from '@/hooks/useVideoAlwaysAutoplay'
import { TextLoop } from '@/components/ui/text-loop'

const VIDEO_DIR = '/media/hero_new'
const POSTER = `${VIDEO_DIR}/hero_new_poster.jpg`
const WHITE = '#F2F0EB'

const WORDS = ['last', 'stand out', 'perform', 'convert', 'endure', 'grow']

// ffmpeg -i hero_new.mp4 -c:v libx264 -profile:v high -crf 24 -preset slow
//   -pix_fmt yuv420p -movflags +faststart -an out.mp4  (+ webm sibling —
//   came out much smaller here, 711KB vs 2.65MB, so webm-first)
function Sources() {
  return (
    <>
      <source src={`${VIDEO_DIR}/hero_new_hq.webm`} type="video/webm" />
      <source src={`${VIDEO_DIR}/hero_new_hq.mp4`} type="video/mp4" />
    </>
  )
}

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useVideoAlwaysAutoplay(videoRef)

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="auto"
        poster={POSTER}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <Sources />
      </video>

      {/* Subtle left-side gradient, only behind the text — not a full-screen
          scrim — for legibility over whatever's playing behind it. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 55%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-full flex items-center justify-start pl-8 md:pl-16">
        <div className="max-w-[60%]">
          {/* Clamp max lowered ~12.5% (6rem -> 5.25rem, min/preferred scaled
              the same amount) so "Delivering websites that" ends before the
              video's curved monitor shape instead of running into it. */}
          <h1 className="font-display leading-tight" style={{ fontSize: 'clamp(2.25rem, 5.25vw, 5.25rem)', color: WHITE }}>
            {/* Real, static text for SEO/a11y — the animated span below is
                purely decorative and hidden from assistive tech so its
                rapidly-changing partial-word states are never announced. */}
            <span className="sr-only">
              Delivering websites that last, stand out, perform, convert, endure, and grow.
            </span>
            <span aria-hidden="true">
              <TextLoop
                staticText="Delivering websites that"
                rotatingTexts={WORDS}
                interval={2600}
                className="font-display"
                staticTextClassName="text-bone"
                rotatingTextClassName="bg-gradient-to-r from-[#D46FC8] via-[#5B4B9E] to-[#7B8CDE] bg-clip-text text-transparent"
                cursorClassName="bg-[#D46FC8]"
              />
            </span>
          </h1>

          <p className="font-body mt-6 text-lg md:text-xl leading-snug" style={{ color: 'rgba(242, 240, 235, 0.7)' }}>
            Website design, maintenance &amp; content creation
            <br />
            One subscription. From $99/mo.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <a
              href="/registro"
              className="group relative inline-block overflow-hidden font-body text-sm font-medium text-white px-6 py-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,111,200,0.4)] active:scale-95"
              style={{ background: 'linear-gradient(90deg, #D46FC8 0%, #5B4B9E 55%, #7B8CDE 100%)' }}
            >
              {/* Reversed-gradient overlay, faded in on hover — brightens/
                  shifts the button rather than swapping to a flat color, so
                  it still reads as the same gradient, just livelier. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, #7B8CDE 0%, #5B4B9E 45%, #D46FC8 100%)' }}
              />
              <span className="relative">Start for free</span>
            </a>
            <a
              href="#contacto"
              className="inline-block font-body text-sm font-medium text-white px-6 py-3 rounded-full cursor-pointer border border-white/30 transition-colors hover:bg-white/10 active:scale-95"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
