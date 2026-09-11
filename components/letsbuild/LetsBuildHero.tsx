'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { useIsLowPowerDevice } from '@/hooks/useIsLowPowerDevice'
import ReputationBadge from '@/components/ReputationBadge'

// WebGL, canvas-drawn textures — client/browser only, no useful SSR output.
const CubesScene = dynamic(() => import('@/components/CubesScene'), { ssr: false })

// Same poster the homepage hero uses — a tiny (~32KB) blurred gradient that
// paints instantly as the LCP background while the cubes boot behind it.
const POSTER = '/media/hero_new2/hero_poster.jpg'

const KEY_POINTS = [
  'From $699',
  'No tasteless templates',
  'No DIY — we build everything for you',
  'Delivery under 4 weeks',
]

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

export default function LetsBuildHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const showCubes = useDeferredCubes(sectionRef)

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

      <div className="relative z-10 min-h-[calc(100svh-132px)] flex items-center px-6 md:px-12 lg:pl-28 xl:pl-40 pt-16 pb-10">
        <div className="w-full max-w-xl">
          <Link href="/" className="inline-flex items-center mb-5 md:mb-7 focus-visible:outline-none" aria-label="yele">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/logomedia/mainlogo.svg" alt="" width={102} height={32} className="h-7 md:h-8 w-auto" />
          </Link>

          <h1
            className="font-display font-bold text-white tracking-tight leading-[1.05] mb-4 md:mb-6"
            style={{ fontSize: 'clamp(2rem, 4.6vw, 4rem)' }}
          >
            Let&apos;s build your website
          </h1>

          <ul className="space-y-2 md:space-y-2.5 mb-6 md:mb-7">
            {KEY_POINTS.map(point => (
              <li key={point} className="flex items-start gap-2.5">
                <Check size={16} className="text-[#D46FC8] flex-shrink-0 mt-0.5 md:mt-1" aria-hidden="true" />
                <span className="font-body text-sm md:text-base font-semibold text-white/90">{point}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-4 mb-7 md:mb-8">
            <a
              href="#lead-form"
              className="inline-flex items-center justify-center font-body font-medium text-base bg-[#F2F0EB] hover:bg-white text-[#16161A] px-7 py-3.5 rounded-full transition-colors active:scale-95"
              style={{ color: '#16161A' }}
            >
              Start now
            </a>
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center font-body text-sm font-medium text-white px-6 py-3 rounded-full border border-white/30 transition-colors hover:bg-white/10 active:scale-95"
            >
              Book a free intro call
            </Link>
          </div>

          <ReputationBadge />
        </div>
      </div>
    </section>
  )
}
