'use client'

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import ProgressBar from './ProgressBar'

interface ArrowNavProps {
  onBack: () => void
  onForward: () => void
  backDisabled: boolean
  forwardDisabled: boolean
  submitting?: boolean
  step: number
  total: number
}

// Bottom-centered single pill: ← arrow, progress bar, → arrow, one group —
// same dark surface as the rest of the site's buttons (see
// components/ui/cta-button.tsx's "dark" variant). Replaces the old separate
// top-of-screen progress bar entirely.
export default function ArrowNav({ onBack, onForward, backDisabled, forwardDisabled, submitting, step, total }: ArrowNavProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink px-4 py-2.5 shadow-lg md:bottom-10 md:gap-5 md:px-5">
      <button
        type="button"
        onClick={onBack}
        disabled={backDisabled}
        aria-label="Previous step"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <ProgressBar step={step} total={total} />

      <button
        type="button"
        onClick={onForward}
        disabled={forwardDisabled}
        aria-label="Next step"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
      >
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
      </button>
    </div>
  )
}
