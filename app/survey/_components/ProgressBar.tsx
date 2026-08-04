'use client'

interface ProgressBarProps {
  step: number
  total: number
}

// Inline track + "X / total" label — meant to sit inside the same pill as
// the back/forward arrows (see ArrowNav), not fixed on its own elsewhere on
// screen. Muted track, brand-pink fill (contrasts against the dark pill).
export default function ProgressBar({ step, total }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/25 sm:w-36 md:w-48">
        <div
          className="h-full rounded-full bg-survey-bg transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <span className="font-mono text-xs font-semibold text-white/90 whitespace-nowrap">
        {step} / {total}
      </span>
    </div>
  )
}
