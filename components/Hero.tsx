'use client'

import { useEffect, useRef, useState } from 'react'
import { useVideoAlwaysAutoplay } from '@/hooks/useVideoAlwaysAutoplay'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const VIDEO_DIR = '/media/hero_new'
const POSTER = `${VIDEO_DIR}/hero_new_poster.jpg`
const WHITE = '#F2F0EB'
const ACCENT = '#D46FC8'

const WORDS = ['Last', 'Stand out', 'Perform', 'Convert', 'Endure', 'Grow']
const TYPE_MS = 70
const ERASE_MS = 40
const HOLD_MS = 1500
// Reserves stable width for the longest word so the layout never jumps as
// shorter/longer words type in and erase.
const LONGEST_CH = Math.max(...WORDS.map(w => w.length))

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

// Types the current word in char-by-char, holds, erases char-by-char, then
// advances to the next word (wrapping around) — a small state machine driven
// by chained setTimeouts rather than a single interval, since type/hold/erase
// each run at a different pace.
function TypewriterWord({ reduceMotion }: { reduceMotion: boolean }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'erasing'>('typing')

  // useHydratedReducedMotion() starts false and only resolves to its real
  // value after mount (hydration-safe), so a useState initializer keyed on
  // reduceMotion would freeze on the wrong (pre-hydration) value forever —
  // this runs again once reduceMotion actually flips to true.
  useEffect(() => {
    if (reduceMotion) setText(WORDS[0])
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    const word = WORDS[index]
    let timer: number

    if (phase === 'typing') {
      if (text.length < word.length) {
        timer = window.setTimeout(() => setText(word.slice(0, text.length + 1)), TYPE_MS)
      } else {
        timer = window.setTimeout(() => setPhase('erasing'), HOLD_MS)
      }
    } else {
      if (text.length > 0) {
        timer = window.setTimeout(() => setText(word.slice(0, text.length - 1)), ERASE_MS)
      } else {
        setIndex(i => (i + 1) % WORDS.length)
        setPhase('typing')
      }
    }

    return () => window.clearTimeout(timer)
  }, [text, phase, index, reduceMotion])

  return (
    <span className="inline-block" style={{ minWidth: `${LONGEST_CH}ch` }}>
      <span style={{ color: ACCENT }}>{text}</span>
      {!reduceMotion && (
        <span
          aria-hidden="true"
          className="inline-block ml-1 animate-pulse align-middle"
          style={{ width: '3px', height: '0.85em', backgroundColor: WHITE }}
        />
      )}
    </span>
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
          <h1 className="font-display leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', color: WHITE }}>
            {/* Real, static text for SEO/a11y — the animated span below is
                purely decorative and hidden from assistive tech so its
                rapidly-changing partial-word states are never announced. */}
            <span className="sr-only">
              Delivering websites that last, stand out, perform, convert, endure, and grow.
            </span>
            <span aria-hidden="true">
              Delivering websites that
              <br />
              <TypewriterWord reduceMotion={reduceMotion} />
            </span>
          </h1>

          <p className="font-body mt-6 text-lg md:text-xl" style={{ color: 'rgba(242, 240, 235, 0.7)' }}>
            Design, content &amp; maintenance — one subscription. From $99/mo.
          </p>

          <a
            href="/registro"
            className="inline-block mt-8 font-body text-sm font-medium bg-bone text-ink px-6 py-3 rounded-full cursor-pointer transition-transform active:scale-95"
          >
            Start for free
          </a>
        </div>
      </div>
    </section>
  )
}
