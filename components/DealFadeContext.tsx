'use client'

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'

type DealFadeContextValue = {
  pastThreshold: boolean
  setPastThreshold: Dispatch<SetStateAction<boolean>>
}

const DealFadeContext = createContext<DealFadeContextValue | null>(null)

// Shared between BeyondWebsite, LatestFeaturedWork, and StatsBold so all
// three flip white->black at the exact same instant with the exact same
// transition — they read as one continuous surface turning dark, not
// independently timed fades. LatestFeaturedWork owns the actual trigger
// (an IntersectionObserver on its own section); BeyondWebsite and
// StatsBold just read the result and animate their own colors to match.
// DealStatement, sandwiched between LatestFeaturedWork and StatsBold, does
// NOT use this context — it has its own fixed dark background instead.
export function DealFadeProvider({ children }: { children: ReactNode }) {
  const [pastThreshold, setPastThreshold] = useState(false)
  return <DealFadeContext.Provider value={{ pastThreshold, setPastThreshold }}>{children}</DealFadeContext.Provider>
}

export function useDealFade() {
  const ctx = useContext(DealFadeContext)
  if (!ctx) throw new Error('useDealFade must be used within a DealFadeProvider')
  return ctx
}

// Non-throwing variant — returns null when there is no provider. Used by
// LatestFeaturedWork's forceDark mode (/letsbuild), where the gallery runs
// standalone and always-dark, outside the homepage's DealFadeProvider group.
export function useOptionalDealFade() {
  return useContext(DealFadeContext)
}
