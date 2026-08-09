'use client'

import { useEffect, useState, type RefObject } from 'react'

export type RevealState = 'hidden' | 'reveal' | 'shown'

// Entrance-animation trigger for cards/blocks that were getting caught
// mid-slide on fast scrolls. Two problems, one hook:
//
// 1. Fires EARLY — a positive IntersectionObserver rootMargin expands the
//    root's bottom edge by `marginPx`, so the callback fires while the
//    element is still that far below the real viewport. A short (~200ms)
//    animation then has time to settle before the user actually scrolls
//    it into view, instead of starting only once it's already on screen.
//    (Positive margin = earlier trigger, negative = later/stricter — the
//    opposite of what a "grow the hitbox" intuition might suggest.)
// 2. Skips entirely if already visible — on a fast enough scroll (or a
//    direct anchor-link landing), the first observer callback can fire
//    with the element ALREADY substantially inside the real, un-expanded
//    viewport. Replaying a slide-in at that point means the user either
//    never sees the "start" or catches it mid-motion, which reads as
//    laggy. boundingClientRect (real position, unaffected by rootMargin)
//    is checked at that moment — if it's already mostly on screen, the
//    caller renders straight to its final state with no animation at all.
export function useEarlyReveal(ref: RefObject<Element | null>, marginPx = 250): RevealState {
  const [state, setState] = useState<RevealState>('hidden')

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setState('shown')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const alreadyOnScreen = entry.boundingClientRect.top < window.innerHeight * 0.6
        setState(alreadyOnScreen ? 'shown' : 'reveal')
        io.disconnect()
      },
      { rootMargin: `0px 0px ${marginPx}px 0px`, threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
    // ref is a stable object for the component's lifetime; only its
    // .current target matters and that's read once above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
