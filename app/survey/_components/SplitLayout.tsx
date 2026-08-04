'use client'

import { type ReactNode } from 'react'

interface SplitLayoutProps {
  title: ReactNode
  children: ReactNode
  // Filename (no extension) under public/media/surveymedia/, e.g. "page11"
  // -> page11.webp. Left when unset, the strong brand pink shows through
  // instead — used on the steps where PersistentLeftVideo overlays this
  // same slot (a fixed sibling in page.tsx, z-index above this div).
  leftImage?: string
}

// Mode A — SPLIT, full-bleed two-tone: LEFT half is either a step-specific
// photo (leftImage) or, when unset, the strong brand pink (survey-bg) — the
// video-covered steps rely on that pink only ever peeking through if the
// video overlay is somehow absent. RIGHT half is the lighter
// survey-bg-soft, holding the question. Both halves are direct grid cells
// spanning this component's full box (which page.tsx sizes to the full
// viewport, no max-width/padding wrapper around it) so the two sides meet
// edge to edge with no border, gap, or shadow between them. Any breathing
// room for the fixed progress bar / arrow nav lives INSIDE the content
// column's own padding, not on a shared outer wrapper — that would
// otherwise show as a same-color gap that breaks the full-bleed edges.
export default function SplitLayout({ title, children, leftImage }: SplitLayoutProps) {
  return (
    <div className="grid h-full w-full flex-1 grid-cols-1 md:grid-cols-2">
      <div className="hidden bg-survey-bg md:block" aria-hidden="true">
        {leftImage && (
          // eslint-disable-next-line @next/next/no-img-element -- fixed known filename, simple full-bleed cover image
          <img src={`/media/surveymedia/${leftImage}.webp`} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-col justify-center bg-survey-bg-soft px-6 pb-24 pt-12 md:px-16 md:pb-28 md:pt-16 lg:px-20">
        <h1 className="font-display mb-6 text-2xl font-bold text-ink md:text-3xl">{title}</h1>
        {children}
      </div>
    </div>
  )
}
