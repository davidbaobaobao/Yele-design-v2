'use client'

import { useEffect, type RefObject } from 'react'

// Same iOS-safe autoplay reliability as useVideoAutoplay, minus the
// IntersectionObserver-driven pause-when-offscreen behavior — for hero
// video that must keep looping regardless of scroll position rather than
// pausing itself the moment its own visible area drops below 50%.
//
// `enabled` (default true): for a video that shouldn't even start loading
// until its caller says so (e.g. TryForFreeSection deferring its own
// below-the-fold video until scrolled near) — pass false and this is a
// no-op until it flips true, at which point the effect re-runs and does
// its normal setup.
export function useVideoAlwaysAutoplay(ref: RefObject<HTMLVideoElement | null>, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const v = ref.current
    if (!v) return

    v.setAttribute('muted', '')
    v.setAttribute('autoplay', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.muted = true
    ;(v as HTMLVideoElement & { defaultMuted?: boolean }).defaultMuted = true

    function play() {
      if (!v || (!v.paused && !v.ended)) return
      v.muted = true
      if (v.ended) v.currentTime = 0
      if (v.networkState === HTMLMediaElement.NETWORK_EMPTY) {
        v.load()
      }
      v.play().catch(() => {
        setTimeout(() => {
          if (v && (v.paused || v.ended)) {
            v.muted = true
            v.play().catch(err => console.warn('[video autoplay] rejected after retry:', err?.name, err?.message, v.currentSrc))
          }
        }, 300)
      })
    }

    play()
    v.addEventListener('canplay', play, { once: true })
    v.addEventListener('loadeddata', play, { once: true })
    v.addEventListener('loadedmetadata', play, { once: true })
    v.addEventListener('ended', play)

    const onVisibility = () => {
      if (!document.hidden) play()
    }
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) play()
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', onPageShow)

    return () => {
      if (!v) return
      v.removeEventListener('canplay', play)
      v.removeEventListener('loadeddata', play)
      v.removeEventListener('loadedmetadata', play)
      v.removeEventListener('ended', play)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', onPageShow as EventListener)
    }
  }, [ref, enabled])
}
