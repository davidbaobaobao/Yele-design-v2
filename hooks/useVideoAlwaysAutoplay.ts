'use client'

import { useEffect, type RefObject } from 'react'

// Same iOS-safe autoplay reliability as useVideoAutoplay, minus the
// IntersectionObserver-driven pause-when-offscreen behavior — for hero
// video that must keep looping regardless of scroll position rather than
// pausing itself the moment its own visible area drops below 50%.
export function useVideoAlwaysAutoplay(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
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
            v.play().catch(() => {})
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
  }, [ref])
}
