'use client'

import { useEffect, type RefObject } from 'react'

export function useVideoAutoplay(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const v = ref.current
    if (!v) return

    // iOS Safari checks HTML attributes (not DOM properties) for autoplay eligibility.
    // React's muted/autoPlay props set DOM properties only — so we must setAttribute here.
    v.setAttribute('muted', '')
    v.setAttribute('autoplay', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.muted = true
    ;(v as HTMLVideoElement & { defaultMuted?: boolean }).defaultMuted = true

    const play = () => {
      if (v.paused) { v.muted = true; v.play().catch(() => {}) }
    }

    play()
    v.addEventListener('canplay', play, { once: true })
    v.addEventListener('loadeddata', play, { once: true })

    // Retry when video scrolls into view (handles off-screen step-card videos)
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) play() }) },
      { threshold: 0.01 }
    )
    observer.observe(v)

    const onVisibility = () => { if (!document.hidden) play() }
    const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) play() }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', onPageShow)

    return () => {
      v.removeEventListener('canplay', play)
      v.removeEventListener('loadeddata', play)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', onPageShow as EventListener)
    }
  }, [ref])
}
