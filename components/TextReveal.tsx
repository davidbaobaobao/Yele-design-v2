'use client'

import { Fragment, useMemo, useState } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'
import { TextGradient } from '@/components/ui/text-gradient'

// Custom-built equivalent of Skiper UI's skiper70 "text reveal box"
// (https://skiper-ui.com/v1/skiper70) — that component is a paid Pro item
// behind a Skiper UI license key we don't have, so this reimplements the
// same described behavior (scroll-triggered, per-character reveal with a
// glowing pink tip at the fill boundary, plus an optional highlighted
// phrase) directly with framer-motion, which this codebase already depends
// on everywhere else.

// REVEAL_START pushed from 0.05 -> 0.15 — the fill used to start almost
// immediately; this delays it until the text is roughly a line into view.
const REVEAL_START = 0.15
const REVEAL_END = 0.85
// Width, in CHARACTERS, of the glowing tip — reveal is now per-character
// (was per-word), so this is a much narrower window than the old TIP_WORDS.
const TIP_CHARS = 2.5

const GREY: [number, number, number] = [0xc9, 0xc6, 0xc0] // #C9C6C0-ish unrevealed grey (#C9C6BF)
const PINK: [number, number, number] = [0xd4, 0x6f, 0xc8] // #D46FC8 — deep pink
const LIGHT_PINK: [number, number, number] = [0xf0, 0xa8, 0xde] // #F0A8DE — shine highlight, brightest point
const WHITE: [number, number, number] = [0xf2, 0xf0, 0xeb] // #F2F0EB — fully revealed

function mix(a: [number, number, number], b: [number, number, number], t: number) {
  const k = Math.max(0, Math.min(1, t))
  const r = Math.round(a[0] + (b[0] - a[0]) * k)
  const g = Math.round(a[1] + (b[1] - a[1]) * k)
  const bch = Math.round(a[2] + (b[2] - a[2]) * k)
  return `rgb(${r}, ${g}, ${bch})`
}

// Grey -> pink -> light-pink (shine) -> white, so the tip reads as the same
// pink/light-pink/white shine sweeping through the text, resolving to a
// plain white "revealed" state rather than a flat grey->white blend.
function charColor(t: number) {
  if (t <= 0.35) return mix(GREY, PINK, t / 0.35)
  if (t <= 0.65) return mix(PINK, LIGHT_PINK, (t - 0.35) / 0.3)
  return mix(LIGHT_PINK, WHITE, (t - 0.65) / 0.35)
}

// Soft blurred glow, peaking exactly where the color peaks (t=0.5, the
// light-pink shine highlight) and fading out toward both ends — a triangle,
// not a plateau, so it reads as a tip travelling past rather than a static
// highlight.
function charGlow(t: number): string | undefined {
  const k = 1 - Math.abs(t - 0.5) * 2
  if (k < 0.08) return undefined
  return `0 0 ${(8 * k).toFixed(1)}px rgba(240, 168, 222, ${(0.75 * k).toFixed(2)})`
}

type WordToken = {
  word: string
  chars: string[]
  charStart: number
  highlighted: boolean
}

const bareWord = (w: string) => w.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').toLowerCase()

function buildWords(text: string, highlight?: string) {
  const rawWords = text.split(' ')
  const highlightWords = highlight ? highlight.split(' ').map(bareWord) : []

  let charCursor = 0
  const words: WordToken[] = rawWords.map((word, wi) => {
    if (word === '\n') {
      return { word: '\n', chars: [], charStart: charCursor, highlighted: false }
    }
    // A word at index `wi` is part of the highlighted phrase if there's SOME
    // start position (wi - offset, for offset in [0, phrase length)) from
    // which the phrase matches — i.e. `wi` falls somewhere inside a matching
    // run, not just at its start.
    const highlighted = highlightWords.some((_, offset) => {
      const start = wi - offset
      if (start < 0) return false
      return highlightWords.every((hw, k) => bareWord(rawWords[start + k] ?? '') === hw)
    })
    const chars = Array.from(word)
    const token = { word, chars, charStart: charCursor, highlighted }
    charCursor += chars.length
    return token
  })

  return { words, totalChars: charCursor }
}

function mapProgressToRevealIndex(p: number, totalChars: number) {
  // A char's `t` only reaches 1 (fully white) once revealIndex is TIP_CHARS
  // past its own index (see the `d / TIP_CHARS` below) — capping the max
  // reveal index at `totalChars` meant the last ~TIP_CHARS characters could
  // never get there, so they stayed stuck mid-blend (pink) even once
  // scrolled fully past REVEAL_END. Extending the ceiling to
  // `totalChars - 1 + TIP_CHARS` lets the very last character reach t=1.
  const maxIndex = totalChars - 1 + TIP_CHARS
  if (p <= REVEAL_START) return 0
  if (p >= REVEAL_END) return maxIndex
  return (maxIndex * (p - REVEAL_START)) / (REVEAL_END - REVEAL_START)
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
  const { words, totalChars } = useMemo(() => buildWords(children, highlight), [children, highlight])

  const [revealIndex, setRevealIndex] = useState(() =>
    mapProgressToRevealIndex(scrollYProgress.get(), totalChars)
  )

  useMotionValueEvent(scrollYProgress, 'change', v => {
    setRevealIndex(mapProgressToRevealIndex(v, totalChars))
  })

  return (
    <p className={className}>
      <span className="sr-only">{children.replace(/\s*\n\s*/g, ' ')}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => {
          // A standalone "\n" word (from a " \n " join in the source string)
          // is a line-break marker, not real text — render it as an actual
          // <br/> instead of an animated word span, so multi-line source
          // strings still reveal in one continuous sweep across all lines.
          if (w.word === '\n') return <br key={wi} />

          return (
            <Fragment key={wi}>
              {w.highlighted ? (
                // The accent phrase (if a `highlight` is passed) is always
                // the pink -> light-pink -> white shine TextGradient, never
                // resolving to flat white like the rest. `isolation: isolate`
                // forces this into its own stacking/compositing context —
                // without it, Chromium sometimes fails to paint a
                // background-clip:text sibling when surrounded by the
                // filter-blurred reveal chars, rendering it fully invisible.
                <span className="inline-block whitespace-nowrap" style={{ isolation: 'isolate' }}>
                  <TextGradient as="span" duration={4}>
                    {w.word}
                  </TextGradient>
                </span>
              ) : (
                <span className="inline-block whitespace-nowrap">
                  {w.chars.map((ch, ci) => {
                    const globalIdx = w.charStart + ci
                    const d = revealIndex - globalIdx
                    const t = Math.max(0, Math.min(1, d / TIP_CHARS))
                    return (
                      <span
                        key={ci}
                        className="inline-block"
                        style={{
                          color: charColor(t),
                          textShadow: charGlow(t),
                          opacity: 0.4 + 0.6 * t,
                          filter: `blur(${(1 - t) * 3}px)`,
                          transform: `translateY(${(1 - t) * 6}px)`,
                        }}
                      >
                        {ch}
                      </span>
                    )
                  })}
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
