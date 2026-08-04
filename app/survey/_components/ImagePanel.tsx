'use client'

import { type LucideIcon } from 'lucide-react'

interface ImagePanelProps {
  icon: LucideIcon
  eyebrow: string
  quote: string
}

// No dedicated photography exists yet for this flow, so each step gets a
// brand-gradient art panel (icon + short line) instead of a mismatched stock
// photo. Swap for real imagery later by replacing this component's body.
export default function ImagePanel({ icon: Icon, eyebrow, quote }: ImagePanelProps) {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-3xl md:h-full md:rounded-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#D46FC8] via-[#B784D8] to-[#7B8CDE]" />
      <div
        className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-[#16161A]/15 blur-3xl"
        aria-hidden
      />
      <div className="relative flex h-full flex-col justify-between p-8 md:p-12">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          {eyebrow}
        </span>
        <div className="flex flex-col gap-4">
          <Icon className="h-10 w-10 text-white/90" strokeWidth={1.5} />
          <p className="font-display max-w-xs text-xl font-bold leading-snug text-white md:text-2xl">
            {quote}
          </p>
        </div>
      </div>
    </div>
  )
}
