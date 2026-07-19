'use client'

import { useEffect, type RefObject } from 'react'

export function useVideoAutoplay(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const v = ref.current
    if (!v) return

    // iOS Safari requires these as HTML attributes (not just DOM properties).
    v.setAttribute('muted', '')
    v.setAttribute('autoplay', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.muted = true
    ;(v as HTMLVideoElement & { defaultMuted?: boolean }).defaultMuted = true

    function play() {
      if (!v || !v.paused) return
      v.muted = true
      // iOS Safari sometimes ignores `loop` and fires `ended` instead of restarting.
      // Reset currentTime so replay begins from the start.
      if (v.ended) v.currentTime = 0
      // If the video was set to preload="none", kick off loading first.
      if (v.networkState === HTMLMediaElement.NETWORK_EMPTY) {
        v.load()
      }
      v.play().catch(() => {})
    }

    // Immediate attempt (works when already in viewport)
    play()
    v.addEventListener('canplay',       play, { once: true })
    v.addEventListener('loadeddata',    play, { once: true })
    // Extra retry for Safari which sometimes fires neither event reliably
    v.addEventListener('loadedmetadata', play, { once: true })

    // iOS Safari often ignores the `loop` attribute and stops at the end.
    // Manually restart on every `ended` event to guarantee looping.
    v.addEventListener('ended', play)

    // Recover from stalled state (network hiccup or iOS background resource limits).
    v.addEventListener('stalled', play)

    // Retry whenever the video enters the viewport — handles deferred preload="none" videos
    // and recovers from background-tab pausing on iOS.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) play() })
      },
      { threshold: 0.01 }
    )
    observer.observe(v)

    // Recover from iOS background-tab suspend
    const onVisibility = () => { if (!document.hidden) play() }
    // Recover from bfcache restore (Safari back-swipe)
    const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) play() }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', onPageShow)

    return () => {
      if (!v) return
      v.removeEventListener('canplay',        play)
      v.removeEventListener('loadeddata',     play)
      v.removeEventListener('loadedmetadata', play)
      v.removeEventListener('ended',          play)
      v.removeEventListener('stalled',        play)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', onPageShow as EventListener)
    }
  }, [ref])
}
