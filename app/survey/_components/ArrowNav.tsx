'use client'

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

interface ArrowNavProps {
  onBack: () => void
  onForward: () => void
  backDisabled: boolean
  forwardDisabled: boolean
  submitting?: boolean
}

// Bottom-centered ← → pair, same dark pill surface as the rest of the site's
// buttons (see components/ui/cta-button.tsx's "dark" variant).
export default function ArrowNav({ onBack, onForward, backDisabled, forwardDisabled, submitting }: ArrowNavProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 md:bottom-10">
      <button
        type="button"
        onClick={onBack}
        disabled={backDisabled}
        aria-label="Previous step"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-all duration-200 hover:bg-[#26262C] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onForward}
        disabled={forwardDisabled}
        aria-label="Next step"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-all duration-200 hover:bg-[#26262C] disabled:cursor-not-allowed disabled:opacity-30"
      >
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
      </button>
    </div>
  )
}
