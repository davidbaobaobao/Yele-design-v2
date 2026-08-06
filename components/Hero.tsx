'use client'

import { useRef } from 'react'
import { Check } from 'lucide-react'
import { useVideoAlwaysAutoplay } from '@/hooks/useVideoAlwaysAutoplay'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { TypewriterWord } from '@/components/ui/typewriter-word'
import { CTAButton } from '@/components/ui/cta-button'

const REASSURANCES = ['Fast delivery', 'No upfront cost', 'Cancel anytime']

const VIDEO_DIR = '/media/hero_new'
const POSTER = `${VIDEO_DIR}/hero_new_poster.jpg`
const WHITE = '#F2F0EB'

const WORDS = ['Last', 'Stand out', 'Perform', 'Convert', 'Endure', 'Grow']

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
  const reduceMotion = !!useHydratedReducedMotion()

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
          {/* Clamp lowered further (5.25rem -> 3.75rem max, min/preferred
              scaled the same ~0.71 ratio) so "Delivering websites that" fits
              on a single line at the current max-w-[60%] width instead of
              wrapping to a 3rd line — the animated word stays the 2nd line. */}
          <h1 className="font-display leading-tight" style={{ fontSize: 'clamp(1.6rem, 3.75vw, 3.75rem)', color: WHITE }}>
            {/* Real, static text for SEO/a11y — the animated span below is
                purely decorative and hidden from assistive tech so its
                rapidly-changing partial-word states are never announced. */}
            <span className="sr-only">
              Delivering websites that last, stand out, perform, convert, endure, and grow.
            </span>
            <span aria-hidden="true">
              Delivering websites that
              <br />
              <TypewriterWord words={WORDS} reduceMotion={reduceMotion} />
            </span>
          </h1>

          <p className="font-body mt-6 text-lg md:text-xl leading-snug" style={{ color: 'rgba(242, 240, 235, 0.7)' }}>
            Website design, maintenance &amp; content creation
            <br />
            One subscription. From $99/mo.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <CTAButton href="/registro" variant="pink">
              Start for free
            </CTAButton>
            <a
              href="#contacto"
              className="inline-block font-body text-sm font-medium text-white px-6 py-3 rounded-full cursor-pointer border border-white/30 transition-colors hover:bg-white/10 active:scale-95"
            >
              Contact us
            </a>
          </div>

          {/* Reassurance row — kept well clear of the buttons above (mt-10)
              so it doesn't read as part of the same cluster. One step down
              from the hero subtitle's own size (text-lg/md:text-xl ->
              text-base/md:text-lg) — still reads as a real trust signal,
              just not competing with the subtitle for attention. */}
          <div
            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-10 font-body text-base md:text-lg"
            style={{ color: 'rgba(242, 240, 235, 0.55)' }}
          >
            {REASSURANCES.map((phrase, i) => (
              <span key={phrase} className="inline-flex items-center gap-4">
                {i > 0 && <span aria-hidden="true" className="hidden sm:inline opacity-50">·</span>}
                <span className="inline-flex items-center gap-2">
                  <Check size={16} className="opacity-70 flex-shrink-0" aria-hidden="true" />
                  {phrase}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
