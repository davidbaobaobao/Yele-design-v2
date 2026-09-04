'use client'

import { type ReactNode } from 'react'

interface FullLayoutProps {
  title: ReactNode
  microcopy?: ReactNode
  children: ReactNode
  // Wider container for grids meant to feel immersive/full-screen — the
  // one remaining FULL step (channel) keeps the narrower default.
  wide?: boolean
}

// Mode B — FULL SCREEN: title centered top, card grid full width below. No
// side panel at any breakpoint.
export default function FullLayout({ title, microcopy, children, wide }: FullLayoutProps) {
  return (
    <div className={`mx-auto w-full ${wide ? 'max-w-6xl' : 'max-w-4xl'}`}>
      <h1 className="font-display mb-2 text-center text-2xl font-bold text-ink md:text-3xl">{title}</h1>
      {microcopy && <p className="mb-6 text-center text-sm text-ink/70">{microcopy}</p>}
      {!microcopy && <div className="mb-6" />}
      {children}
    </div>
  )
}
