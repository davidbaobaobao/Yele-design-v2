'use client'

import { Fragment, useMemo, useState } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

const BONE: [number, number, number] = [0xf2, 0xf0, 0xeb] // #F2F0EB
const GREY: [number, number, number] = [0x3a, 0x3a, 0x40] // #3A3A40
const AMBER: [number, number, number] = [0xe8, 0xa0, 0x5c] // #E8A05C

// Progress window the fill animates across; outside it the text is a flat
// grey (before) or flat fill color (after) — see mapProgressToFillIndex.
const PROGRESS_START = 0.1
const PROGRESS_END = 0.9
// Padding past the last character so the trailing edge of the fill boundary
// (a ~4-char blend zone) fully clears the text before PROGRESS_END.
const TAIL_PAD = 5

type WordToken = {
  word: string
  isAmberTarget: boolean
  chars: { ch: string; idx: number }[]
}

// Strip surrounding punctuation so "stay." matches the target word "stay".
const bareWord = (w: string) => w.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')

function buildWords(text: string, amberPhrase: string) {
  const rawWords = text.split(' ')
  const amberWords = amberPhrase.split(' ').map(bareWord)
  let globalIndex = 0

  const words: WordToken[] = rawWords.map((word, wi) => {
    // Match the amber phrase as a contiguous word sequence starting at wi.
    const isAmberTarget = amberWords.some((_, offset) => {
      const start = wi - offset
      if (start < 0) return false
      return amberWords.every((aw, k) => bareWord(rawWords[start + k] ?? '') === aw)
    })
    const chars = Array.from(word).map(ch => ({ ch, idx: globalIndex++ }))
    return { word, isAmberTarget, chars }
  })

  return { words, totalChars: globalIndex }
}

function mapProgressToFillIndex(p: number, totalChars: number) {
  const end = totalChars + TAIL_PAD
  if (p <= PROGRESS_START) return 0
  if (p >= PROGRESS_END) return end
  return (end * (p - PROGRESS_START)) / (PROGRESS_END - PROGRESS_START)
}

function mix(c1: [number, number, number], c2: [number, number, number], t: number) {
  const k = Math.max(0, Math.min(1, t))
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * k)
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * k)
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * k)
  return `rgb(${r}, ${g}, ${b})`
}

const rgbStr = (c: [number, number, number]) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`

// Distance from the fill tip drives the color:
//  d <= -4        already filled solid (bone, or amber for the target word)
//  d  >  1        not yet reached, solid grey
//  -4 < d <= 0     behind/at the tip — blends amber (d=0) -> filled color (d=-4)
//   0 < d <= 1     just ahead of the tip — blends amber (d=0) -> grey (d=1)
function charColor(charIndex: number, f: number, isAmberTarget: boolean): string {
  const filled = isAmberTarget ? AMBER : BONE
  const d = charIndex - f

  if (d <= -4) return rgbStr(filled)
  if (d > 1) return rgbStr(GREY)
  if (d <= 0) return mix(AMBER, filled, (d + 4) / 4)
  return mix(AMBER, GREY, d)
}

export default function MissionFillText({
  text,
  amberPhrase,
  scrollYProgress,
}: {
  text: string
  amberPhrase: string
  scrollYProgress: MotionValue<number>
}) {
  const { words, totalChars } = useMemo(() => buildWords(text, amberPhrase), [text, amberPhrase])

  const [fillIndex, setFillIndex] = useState(() =>
    mapProgressToFillIndex(scrollYProgress.get(), totalChars)
  )

  useMotionValueEvent(scrollYProgress, 'change', v => {
    const raw = mapProgressToFillIndex(v, totalChars)
    // Round to the nearest half-character so we don't re-render every pixel.
    const rounded = Math.round(raw * 2) / 2
    setFillIndex(prev => (prev === rounded ? prev : rounded))
  })

  return (
    <p
      className="font-display font-bold leading-[1.15] tracking-tight max-w-[85vw] indent-[3ch] text-[clamp(1.75rem,7vw,3rem)] md:text-[clamp(2rem,4vw,4.5rem)]"
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <Fragment key={wi}>
            <span className="inline-block whitespace-nowrap">
              {w.chars.map(({ ch, idx }) => (
                <span key={idx} style={{ color: charColor(idx, fillIndex, w.isAmberTarget) }}>
                  {ch}
                </span>
              ))}
            </span>
            {/* Spaces live outside the inline-block word wrappers so the
                browser still wraps lines at normal word boundaries. */}
            {wi < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
    </p>
  )
}
