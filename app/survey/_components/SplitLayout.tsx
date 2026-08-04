'use client'

import { type ReactNode } from 'react'

interface SplitLayoutProps {
  title: ReactNode
  children: ReactNode
}

// Mode A — SPLIT: left half reserved for future imagery (empty on purpose),
// right half holds the question. Collapses to a single column on mobile with
// the empty slot removed entirely (not just hidden-but-spaced).
export default function SplitLayout({ title, children }: SplitLayoutProps) {
  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 md:items-stretch md:gap-10">
      <div className="hidden md:block" aria-hidden="true">
        {/* image slot — intentionally empty, pink background shows through */}
      </div>
      <div className="flex flex-col justify-center py-10 md:py-0">
        <h1 className="font-display mb-6 text-2xl font-bold text-ink md:text-3xl">{title}</h1>
        {children}
      </div>
    </div>
  )
}
