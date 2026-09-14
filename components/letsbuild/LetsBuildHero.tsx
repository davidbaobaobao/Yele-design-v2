'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Check, ChevronDown, Star } from 'lucide-react'
import { useIsLowPowerDevice } from '@/hooks/useIsLowPowerDevice'
import ReputationBadge from '@/components/ReputationBadge'
import { getFunnelDict, type Locale } from '@/lib/i18n/funnel'

// WebGL, canvas-drawn textures — client/browser only, no useful SSR output.
const CubesScene = dynamic(() => import('@/components/CubesScene'), { ssr: false })

// Same poster the homepage hero uses — a tiny (~32KB) blurred gradient that
// paints instantly as the LCP background while the cubes boot behind it.
const POSTER = '/media/hero_new2/hero_poster.jpg'

// Mirrors components/Hero.tsx: the poster + text + pills (the LCP/conversion
// path) paint immediately, and the 3 cubes are deferred — mounted only after
// the first paint, only within ~300px of view, never on low-power/mobile —
// so they never compete with the hero's key elements for the critical path.
function useDeferredCubes(sectionRef: React.RefObject<HTMLElement | null>) {
  const [paintedFired, setPaintedFired] = useState(false)
  const [near, setNear] = useState(false)
  const [far, setFar] = useState(true)
  const isLowPower = useIsLowPowerDevice()

  useEffect(() => {
    if (isLowPower || !sectionRef.current || !('IntersectionObserver' in window)) return
    const el = sectionRef.current
    const loadIO = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) setNear(true)
      },
      { rootMargin: '300px 0px' }
    )
    const unloadIO = new IntersectionObserver(
      entries => setFar(!entries[0]?.isIntersecting),
      { rootMargin: '100% 0px' }
    )
    loadIO.observe(el)
    unloadIO.observe(el)
    return () => {
      loadIO.disconnect()
      unloadIO.disconnect()
    }
  }, [sectionRef, isLowPower])

  useEffect(() => {
    if (isLowPower) return
    // Warm both this component's chunk and the "three" chunk in parallel with
    // the first-paint yield below, so they're already in the network queue by
    // the time <CubesScene/> actually mounts.
    void import('@/components/CubesScene')
    void import('three')
    let raf1 = 0
    let raf2 = 0
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPaintedFired(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [isLowPower])

  return paintedFired && near && !far && !isLowPower
}

export default function LetsBuildHero({ locale = 'en' }: { locale?: Locale }) {
  const sectionRef = useRef<HTMLElement>(null)
  const showCubes = useDeferredCubes(sectionRef)
  const h = getFunnelDict(locale).hero

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100svh-132px)] w-full overflow-hidden"
      style={{ backgroundColor: '#0D0E12' }}
    >
      <Image
        src={POSTER}
        alt=""
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />

      {/* Cubes — full-width/height background layer. The cluster stays
          right-of-center via its own aspect-aware offset (CubesScene.tsx).
          Never mounted on mobile/coarse-pointer or before first paint. */}
      {showCubes && (
        <div className="hidden md:block absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <CubesScene />
        </div>
      )}

      {/* Feathered left→right scrim so the text stays legible over the poster
          and cubes without a hard edge. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0) 75%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 min-h-[calc(100svh-132px)] flex items-center px-6 md:px-16 lg:pl-44 xl:pl-60 2xl:pl-72 pt-16 pb-28 md:pb-10">
        <div className="w-full max-w-2xl">
          {/* Google 5-star reviews pill */}
          <div className="mb-5 inline-flex items-center gap-2.5 rounded-full bg-white px-3.5 py-2 shadow-lg shadow-black/20">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" className="flex-shrink-0">
              <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.93H1.3v3.09A12 12 0 0 0 12 24z" />
              <path fill="#FBBC05" d="M5.31 14.32a7.2 7.2 0 0 1 0-4.63V6.6H1.3a12 12 0 0 0 0 10.81l4.01-3.09z" />
              <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.3 6.6l4.01 3.09C6.25 6.85 8.89 4.75 12 4.75z" />
            </svg>
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="#FBBC05" strokeWidth={0} aria-hidden="true" />
              ))}
            </span>
            <span className="font-body text-xs md:text-sm font-semibold text-[#16161A]">{h.reviews}</span>
          </div>

          <Link href="/" className="block mb-5 md:mb-7 focus-visible:outline-none" aria-label="yele">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/logomedia/mainlogo.svg" alt="" width={120} height={38} className="h-8 md:h-10 w-auto" />
          </Link>

          <h1
            className="font-display font-bold text-white tracking-tight leading-[1.03] mb-5 md:mb-7"
            style={{ fontSize: 'clamp(2.6rem, 5.6vw, 5.25rem)' }}
          >
            {getFunnelDict(locale).heroTitle.split('\n').map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>

          <ul className="space-y-3 md:space-y-3.5 mb-8 md:mb-9">
            {h.points.map(point => (
              <li key={point} className="flex items-start gap-3">
                <Check size={22} className="text-[#D46FC8] flex-shrink-0 mt-0.5 md:mt-1" aria-hidden="true" />
                <span className="font-body text-lg md:text-xl font-semibold text-white/90">{point}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-4 mb-8 md:mb-10">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center font-body font-semibold text-base md:text-lg bg-[#F2F0EB] hover:bg-white px-8 py-4 rounded-full transition-colors active:scale-95"
              style={{ color: '#16161A' }}
            >
              {h.pricing}
            </a>
            <a
              href="#lead-form"
              className="inline-flex items-center justify-center font-body text-base md:text-lg font-medium text-white px-7 py-4 rounded-full border border-white/30 transition-colors hover:bg-white/10 active:scale-95"
            >
              {h.startNow}
            </a>
          </div>

          <ReputationBadge className="scale-110 origin-left" locale={locale} />
        </div>
      </div>

      {/* Animated scroll-down indicator — centered on the full hero width,
          bounces to invite scrolling to the logo marquee below. A pink ring
          around the chevron makes it clearly visible over the dark cubes. */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#D46FC8]/60 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-[#D46FC8]/20 hover:border-[#D46FC8] cursor-pointer focus-visible:outline-none motion-safe:animate-[heroScrollBounce_1.5s_ease-in-out_infinite]"
        aria-label={h.scrollDown}
      >
        <ChevronDown size={26} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </section>
  )
}
