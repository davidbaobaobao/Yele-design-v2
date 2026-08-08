'use client'

import { useEffect, useState, type RefObject } from 'react'
import { claimWebglSlot, releaseWebglSlot, subscribeWebglSlot } from '@/lib/webglLock'

// Claims the single global "live WebGL scene" slot (lib/webglLock.ts)
// whenever the observed element is PRIMARY on screen (>=50% visible) — a
// tighter bar than the usual lazy-load margins, so this only fires once a
// section is genuinely the one being looked at, not just "nearby."
// Returns whether THIS instance currently holds the slot; callers gate
// their actual live-scene mount on that, not just on their own
// visibility, since something else might be holding it instead.
//
// `enabled`: pass false to force-release and stop observing entirely —
// e.g. on a low-power device that should never hold the slot, or while
// the tab is hidden.
export function useWebglSlot(id: string, sectionRef: RefObject<HTMLElement | null>, enabled: boolean): boolean {
  const [isHolder, setIsHolder] = useState(false)

  useEffect(() => {
    return subscribeWebglSlot(id, setIsHolder)
  }, [id])

  useEffect(() => {
    if (!enabled) {
      releaseWebglSlot(id)
      return
    }
    const el = sectionRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) claimWebglSlot(id)
        else releaseWebglSlot(id)
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      releaseWebglSlot(id)
    }
    // sectionRef is a stable ref object for the component's lifetime —
    // its .current target doesn't change, only enabled/id do.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, enabled])

  return isHolder
}
