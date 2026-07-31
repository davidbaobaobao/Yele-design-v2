'use client'

import { Fragment, useMemo, useState } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

// Custom-built equivalent of Skiper UI's skiper70 "text reveal box"
// (https://skiper-ui.com/v1/skiper70) — that component is a paid Pro item
// behind a Skiper UI license key we don't have, so this reimplements the
// same described behavior (scroll-triggered, word-by-word reveal with a
// highlighted phrase) directly with framer-motion, which this codebase
// already depends on everywhere else. API is deliberately close to
// skiper70's own (children / highlight / highlightTextClass /
// highlightBgClass / className) so swapping in the real component later,
// if a license is ever purchased, only means changing the import.

const GREY: [number, number, number] = [0xc9, 0xc6, 0xbf] // unrevealed
const WHITE: [number, number, number] = [0xf2, 0xf0, 0xeb] // #F2F0EB — revealed
const PINK: [number, number, number] = [0xd4, 0x6f, 0xc8] // #D46FC8 — revealed + highlighted

// The reveal only runs across the middle of the section's scroll range — it
// starts just after the section enters and finishes just before it's past.
const REVEAL_START = 0.05
const REVEAL_END = 0.85
// Width (in words) of the soft transition each word passes through as the
// reveal boundary crosses it — a smooth blend, not a hard cut.
const TIP_WORDS = 1.5

type WordToken = {
  word: string
  idx: number
  highlighted: boolean
}

const bareWord = (w: string) => w.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').toLowerCase()

function buildWords(text: string, highlight?: string) {
  const rawWords = text.split(' ')
  const highlightWords = highlight ? highlight.split(' ').map(bareWord) : []

  // A word at index `wi` is part of the highlighted phrase if there's SOME
  // start position (wi - offset, for offset in [0, phrase length)) from
  // which the phrase matches — i.e. `wi` falls somewhere inside a matching
  // run, not just at its start.
  const words: WordToken[] = rawWords.map((word, wi) => {
    const highlighted = highlightWords.some((_, offset) => {
      const start = wi - offset
      if (start < 0) return false
      return highlightWords.every((hw, k) => bareWord(rawWords[start + k] ?? '') === hw)
    })
    return { word, idx: wi, highlighted }
  })

  return { words, totalWords: words.length }
}

function mapProgressToRevealIndex(p: number, totalWords: number) {
  if (p <= REVEAL_START) return 0
  if (p >= REVEAL_END) return totalWords
  return (totalWords * (p - REVEAL_START)) / (REVEAL_END - REVEAL_START)
}

function mix(c1: [number, number, number], c2: [number, number, number], t: number) {
  const k = Math.max(0, Math.min(1, t))
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * k)
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * k)
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * k)
  return `rgb(${r}, ${g}, ${b})`
}

// t: 0 = word not yet reached (grey), 1 = fully revealed (white, or pink if
// this word is part of the highlighted phrase).
function wordColor(t: number, highlighted: boolean): string {
  return mix(GREY, highlighted ? PINK : WHITE, t)
}

function wordGlow(t: number, highlighted: boolean): string | undefined {
  if (!highlighted || t <= 0) return undefined
  return `0 0 ${Math.round(14 * t)}px rgba(212, 111, 200, ${(t * 0.6).toFixed(2)})`
}

export default function TextReveal({
  children,
  highlight,
  className,
  scrollYProgress,
}: {
  children: string
  highlight?: string
  className?: string
  scrollYProgress: MotionValue<number>
}) {
  const { words, totalWords } = useMemo(() => buildWords(children, highlight), [children, highlight])

  const [revealIndex, setRevealIndex] = useState(() =>
    mapProgressToRevealIndex(scrollYProgress.get(), totalWords)
  )

  useMotionValueEvent(scrollYProgress, 'change', v => {
    setRevealIndex(mapProgressToRevealIndex(v, totalWords))
  })

  return (
    <p className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => {
          const d = revealIndex - w.idx
          const t = Math.max(0, Math.min(1, d / TIP_WORDS))
          return (
            <Fragment key={wi}>
              <span
                className="inline-block whitespace-nowrap"
                style={{
                  color: wordColor(t, w.highlighted),
                  textShadow: wordGlow(t, w.highlighted),
                  opacity: 0.4 + 0.6 * t,
                  filter: `blur(${(1 - t) * 3}px)`,
                  transform: `translateY(${(1 - t) * 6}px)`,
                }}
              >
                {w.word}
              </span>
              {wi < words.length - 1 ? ' ' : ''}
            </Fragment>
          )
        })}
      </span>
    </p>
  )
}
