'use client'

import { Fragment, useMemo, useState } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'
import { TextGradient } from '@/components/ui/text-gradient'

// Custom-built equivalent of Skiper UI's skiper70 "text reveal box"
// (https://skiper-ui.com/v1/skiper70) — that component is a paid Pro item
// behind a Skiper UI license key we don't have, so this reimplements the
// same described behavior (scroll-triggered, word-by-word reveal with a
// highlighted phrase) directly with framer-motion, which this codebase
// already depends on everywhere else. API is deliberately close to
// skiper70's own (children / highlight / highlightTextClass /
// highlightBgClass / className) so swapping in the real component later,
// if a license is ever purchased, only means changing the import.

const REVEAL_START = 0.05
const REVEAL_END = 0.85
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
          const wordStyle = {
            opacity: 0.4 + 0.6 * t,
            filter: `blur(${(1 - t) * 3}px)`,
            transform: `translateY(${(1 - t) * 6}px)`,
          }
          return (
            <Fragment key={wi}>
              {w.highlighted ? (
                // The accent phrase is always the pink -> purple -> blue
                // TextGradient, never plain white like the rest of the text.
                <span className="inline-block whitespace-nowrap" style={wordStyle}>
                  <TextGradient as="span" duration={4}>
                    {w.word}
                  </TextGradient>
                </span>
              ) : (
                <span
                  className="inline-block whitespace-nowrap"
                  style={{ ...wordStyle, color: '#F2F0EB' }}
                >
                  {w.word}
                </span>
              )}
              {wi < words.length - 1 ? ' ' : ''}
            </Fragment>
          )
        })}
      </span>
    </p>
  )
}
