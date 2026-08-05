'use client'

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'

type DealFadeContextValue = {
  pastThreshold: boolean
  setPastThreshold: Dispatch<SetStateAction<boolean>>
}

const DealFadeContext = createContext<DealFadeContextValue | null>(null)

// Shared between BeyondWebsite and DealStatement so both flip white->black
// at the exact same instant with the exact same transition — the stacked
// pair reads as one continuous surface turning dark, not two independently
// timed fades. DealStatement owns the actual scroll measurement (it has the
// anchor text the threshold is based on); BeyondWebsite just reads the
// result and animates its own colors to match.
export function DealFadeProvider({ children }: { children: ReactNode }) {
  const [pastThreshold, setPastThreshold] = useState(false)
  return <DealFadeContext.Provider value={{ pastThreshold, setPastThreshold }}>{children}</DealFadeContext.Provider>
}

export function useDealFade() {
  const ctx = useContext(DealFadeContext)
  if (!ctx) throw new Error('useDealFade must be used within a DealFadeProvider')
  return ctx
}
