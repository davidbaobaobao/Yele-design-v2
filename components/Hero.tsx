'use client'

import Image from 'next/image'
import { Check, ChevronDown } from 'lucide-react'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { TypewriterWord } from '@/components/ui/typewriter-word'
import { CTAButton } from '@/components/ui/cta-button'

const REASSURANCES = ['Fast delivery', 'No upfront cost', 'Cancel anytime']

// ffmpeg -i hero_poster.jpeg -vf "scale=1920:-2" -q:v 7 hero_poster.jpg —
// source was a 1.3MB 2752x1536 export; a blurred/low-detail background
// compresses to ~17KB at this quality with no visible difference.
const POSTER = '/media/hero_new2/hero_poster.jpg'
const WHITE = '#F2F0EB'

const WORDS = ['Last', 'Stand out', 'Perform', 'Convert', 'Endure', 'Grow']

export default function Hero() {
  const reduceMotion = !!useHydratedReducedMotion()

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      <Image
        src={POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />

      {/* Subtle left-side gradient, only behind the text — not a full-screen
          scrim — for legibility over the background. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 55%)' }}
        aria-hidden="true"
      />

      {/* Two halves: text in the left, right reserved empty for 3D elements
          added later. Right half collapses on mobile — left just goes full
          width there. */}
      <div className="relative z-10 h-full flex">
        <div className="w-full md:w-1/2 h-full flex items-center pl-8 sm:pl-12 md:pl-16 lg:pl-24 pr-6 md:pr-8">
          <div className="max-w-xl">
            <h1 className="font-display leading-tight" style={{ fontSize: 'clamp(1.6rem, 3.75vw, 3.75rem)', color: WHITE }}>
              {/* Real, static text for SEO/a11y — the animated span below is
                  purely decorative and hidden from assistive tech so its
                  rapidly-changing partial-word states are never announced. */}
              <span className="sr-only">
                Delivering websites that last, stand out, perform, convert, endure, and grow.
              </span>
              <span aria-hidden="true">
                Delivering Websites
                <br />
                {/* whitespace-nowrap so "that" and the word can't wrap apart;
                    expandRight on TypewriterWord so the word isn't given a
                    fixed reserved width — "that " stays put and the word
                    grows to the right as shorter/longer words cycle through,
                    instead of the whole line staying a fixed centered width. */}
                <span className="whitespace-nowrap">
                  that <TypewriterWord words={WORDS} reduceMotion={reduceMotion} expandRight />
                </span>
              </span>
            </h1>

            <p className="font-body mt-6 text-lg md:text-xl leading-snug" style={{ color: 'rgba(242, 240, 235, 0.7)' }}>
              Website design, maintenance &amp; content creation
              <br />
              One subscription. From $99/mo.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <CTAButton href="/registro" variant="white">
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

        {/* Right half — intentionally empty, reserved for 3D elements. */}
        <div className="hidden md:block md:w-1/2 h-full" aria-hidden="true" />
      </div>

      {/* Scroll-down indicator — centered on the FULL viewport width (not
          the left half), independent of the two-column split above it. */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white transition-colors cursor-pointer focus-visible:outline-none motion-safe:animate-[heroScrollBounce_1.5s_ease-in-out_infinite]"
        aria-label="Scroll to next section"
      >
        <ChevronDown size={28} aria-hidden="true" />
      </button>
    </section>
  )
}
