'use client'

import { useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'

// For WebGL-hosting sections specifically (hero cubes, conveyor cards,
// the how-yele-animations glass section) — broader than useIsMobile's
// viewport-width check, which drives layout/video-source decisions
// elsewhere and shouldn't change meaning there. A touch-primary device
// can have a wide viewport (e.g. a tablet in landscape) and still not be
// able to afford a live transmission-glass scene, so this also excludes
// coarse pointers. Starts false (matches useIsMobile's own hydration-safe
// pattern) so server and first client render agree.
export function useIsLowPowerDevice() {
  const isMobile = useIsMobile()
  const [coarsePointer, setCoarsePointer] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    setCoarsePointer(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setCoarsePointer(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile || coarsePointer
}
