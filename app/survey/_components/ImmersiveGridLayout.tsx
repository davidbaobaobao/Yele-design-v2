'use client'

import { type ReactNode } from 'react'

interface ImmersiveGridLayoutProps {
  title: ReactNode
  microcopy?: ReactNode
  children: ReactNode
}

// For the two 8-card grids (style, colours): a compact header (shrink-0)
// plus a flex-1 grid area that claims the rest of the step's full-height
// box — unlike FullLayout, nothing here is centered or capped to a reading
// max-width, since the goal is the grid itself filling essentially the
// whole viewport so all 8 cards fit with no vertical scroll.
export default function ImmersiveGridLayout({ title, microcopy, children }: ImmersiveGridLayoutProps) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mb-3 shrink-0 text-center md:mb-4">
        <h1 className="font-display text-xl font-bold text-ink sm:text-2xl md:text-3xl">{title}</h1>
        {microcopy && <p className="mt-1 text-xs text-ink/70 sm:text-sm">{microcopy}</p>}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  )
}
