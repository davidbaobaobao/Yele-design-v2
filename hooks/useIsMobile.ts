'use client'

import { useEffect, useState } from 'react'

const QUERY = '(max-width: 767px)'

// Same breakpoint Tailwind's `md:` prefix uses — matches the width video
// sections already switch layout at. Starts false so server and first
// client render agree (no hydration mismatch, same pattern as
// useHydratedReducedMotion); resolves to the real value right after mount.
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
