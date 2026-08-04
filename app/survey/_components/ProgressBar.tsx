'use client'

interface ProgressBarProps {
  step: number
  total: number
}

export default function ProgressBar({ step, total }: ProgressBarProps) {
  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-20 h-1 bg-black/10">
        <div
          className="h-full bg-ink transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <div className="fixed left-5 top-5 z-20 rounded-full bg-black/10 px-3 py-1 font-mono text-xs font-semibold text-ink md:left-8 md:top-8">
        {step} / {total}
      </div>
    </>
  )
}
