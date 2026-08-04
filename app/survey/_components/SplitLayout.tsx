'use client'

import { type ReactNode } from 'react'

interface SplitLayoutProps {
  title: ReactNode
  children: ReactNode
}

// Mode A — SPLIT, full-bleed two-tone: LEFT half stays the strong brand
// pink (survey-bg) — an empty image slot reserved for photography later.
// RIGHT half is the lighter survey-bg-soft, holding the question. Both
// halves are direct grid cells spanning this component's full box (which
// page.tsx sizes to the full viewport, no max-width/padding wrapper around
// it) so the two pinks meet edge to edge with no border, gap, or shadow
// between them. Any breathing room for the fixed progress bar / arrow nav
// lives INSIDE the content column's own padding, not on a shared outer
// wrapper — that would otherwise show as a same-color gap that breaks the
// full-bleed edges.
export default function SplitLayout({ title, children }: SplitLayoutProps) {
  return (
    <div className="grid h-full w-full flex-1 grid-cols-1 md:grid-cols-2">
      <div className="hidden bg-survey-bg md:block" aria-hidden="true">
        {/* image slot — intentionally empty, strong pink shows through */}
      </div>
      <div className="flex flex-col justify-center bg-survey-bg-soft px-6 pb-24 pt-12 md:px-16 md:pb-28 md:pt-16 lg:px-20">
        <h1 className="font-display mb-6 text-2xl font-bold text-ink md:text-3xl">{title}</h1>
        {children}
      </div>
    </div>
  )
}
