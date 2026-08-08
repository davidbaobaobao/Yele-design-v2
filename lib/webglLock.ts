// Global "only one live WebGL scene at a time" arbitration. The hero
// cubes, conveyor cards, and the two how-yele-animations subsections are
// four separate, unrelated component trees, each independently deciding
// when to mount/unmount its own canvas or iframe. Under normal scrolling
// that's fine — sections don't overlap — but each component's own lazy-
// load/unload margins can legitimately overlap for a stretch of scroll
// distance, which is exactly how two heavy WebGL contexts (one of them
// transmission glass) end up live at once and freeze the tab.
//
// Plain module-level singleton, not React state — these are unrelated
// component trees with no shared ancestor to hold context in. "Last
// claimant wins": whichever section most recently became the primary one
// on screen evicts whoever held the slot before, which matches normal
// monotonic scroll-through behavior.
type Listener = (isHolder: boolean) => void

let holder: string | null = null
const listeners = new Map<string, Listener>()

export function subscribeWebglSlot(id: string, listener: Listener): () => void {
  listeners.set(id, listener)
  return () => {
    listeners.delete(id)
    if (holder === id) holder = null
  }
}

export function claimWebglSlot(id: string) {
  if (holder === id) return
  const prev = holder
  holder = id
  if (prev) listeners.get(prev)?.(false)
  listeners.get(id)?.(true)
}

export function releaseWebglSlot(id: string) {
  if (holder !== id) return
  holder = null
  listeners.get(id)?.(false)
}
