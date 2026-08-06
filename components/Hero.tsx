'use client'

import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { useVideoAlwaysAutoplay } from '@/hooks/useVideoAlwaysAutoplay'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { TextGradient } from '@/components/ui/text-gradient'
import { CTAButton } from '@/components/ui/cta-button'

const REASSURANCES = ['Fast delivery', 'No upfront cost', 'Cancel anytime']

const VIDEO_DIR = '/media/hero6'
const POSTER = `${VIDEO_DIR}/hero6_poster.jpg`
const WHITE = '#F2F0EB'

const WORDS = ['Last', 'Stand out', 'Perform', 'Convert', 'Endure', 'Grow']
const TYPE_MS = 70
const ERASE_MS = 40
const HOLD_MS = 1500
// Reserves stable width for the longest word so the layout never jumps as
// shorter/longer words type in and erase.
const LONGEST_CH = Math.max(...WORDS.map(w => w.length))

// ffmpeg -i hero6.mp4 -vf "scale=1920:-2" -c:v libx264 -profile:v main -crf 24
//   -preset slow -pix_fmt yuv420p -movflags +faststart -an hero6_hq.mp4
// (+ webm sibling via libvpx-vp9 -crf 35 -b:v 0 — source was a 26MB/20.7Mbps
// 2560x1440 export with an unused audio track; this brings it down to a few
// MB without looking soft.)
function Sources() {
  return (
    <>
      <source src={`${VIDEO_DIR}/hero6_hq.webm`} type="video/webm" />
      <source src={`${VIDEO_DIR}/hero6_hq.mp4`} type="video/mp4" />
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

  // text is only ever '' at the two moments a soft fade should happen: the
  // very first mount (before typing starts) and the brief gap between one
  // word finishing its erase and the next word's first character — so
  // driving opacity off text.length directly (with a CSS transition) gets
  // the fade-out/fade-in for free with no extra state or timers.
  return (
    <span
      className="inline-block"
      style={{ minWidth: `${LONGEST_CH}ch`, opacity: text.length === 0 ? 0 : 1, transition: 'opacity 300ms ease' }}
    >
      <TextGradient as="span">{text}</TextGradient>
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

  // Belt-and-suspenders on top of useVideoAlwaysAutoplay (which already sets
  // muted imperatively + retries play()) — React can drop the `muted` prop
  // on mount in some cases, and iOS Safari specifically requires muted to be
  // set as a DOM property (not just the attribute) before play() succeeds.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    const p = v.play()
    if (p) p.catch(() => {})
  }, [])

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="metadata"
        poster={POSTER}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <Sources />
      </video>

      {/* Dark scrim over the whole frame (not just behind the text) — the
          centered layout now sits over the video's busy middle area on any
          viewport width, so the legibility wash needs to cover everything,
          not just a left-side gradient like the old left-aligned layout. */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          {/* Clamp lowered further (5.25rem -> 3.75rem max, min/preferred
              scaled the same ~0.71 ratio) so "Delivering websites that" fits
              on a single line at this width instead of wrapping to a 3rd
              line — the animated word stays the 2nd line. */}
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
              <TypewriterWord reduceMotion={reduceMotion} />
            </span>
          </h1>

          <p className="font-body mt-6 text-lg md:text-xl leading-snug" style={{ color: 'rgba(242, 240, 235, 0.7)' }}>
            Website design, maintenance &amp; content creation
            <br />
            One subscription. From $99/mo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
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
            className="flex flex-col sm:flex-row sm:items-center justify-center gap-2 sm:gap-4 mt-10 font-body text-base md:text-lg"
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
