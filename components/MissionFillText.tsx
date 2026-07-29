'use client'

import { Fragment, useMemo, useState } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

// Inverted for the black section bg: unfilled starts dim (close to the
// black bg) and fills up to bone (light), the reverse of the original
// light-bg version (grey -> ink).
const GREY: [number, number, number] = [0x3a, 0x3a, 0x40] // dim — unfilled, close to black bg
const INK: [number, number, number] = [0xf2, 0xf0, 0xeb] // #F2F0EB (bone) — filled
const AMBER: [number, number, number] = [0xc9, 0x7f, 0x3d] // #C97F3D — "and stay"

// The fill only runs across the middle of the section's scroll range — it
// starts just after the section pins and finishes just before it releases.
const FILL_START = 0.05
const FILL_END = 0.85
// Characters within this many positions of the fill edge blend instead of
// snapping, for a soft edge rather than a hard cut.
const BOUNDARY_CHARS = 2

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
  if (p <= FILL_START) return 0
  if (p >= FILL_END) return totalChars
  return (totalChars * (p - FILL_START)) / (FILL_END - FILL_START)
}

function mix(c1: [number, number, number], c2: [number, number, number], t: number) {
  const k = Math.max(0, Math.min(1, t))
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * k)
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * k)
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * k)
  return `rgb(${r}, ${g}, ${b})`
}

const rgbStr = (c: [number, number, number]) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`

// d = how far past this char the fill has progressed. d >= BOUNDARY_CHARS is
// solid filled, d <= 0 is solid grey, in between blends for a soft edge.
function charColor(charIndex: number, fillIndex: number, isAmberTarget: boolean): string {
  const target = isAmberTarget ? AMBER : INK
  const d = fillIndex - charIndex
  if (d >= BOUNDARY_CHARS) return rgbStr(target)
  if (d <= 0) return rgbStr(GREY)
  return mix(GREY, target, d / BOUNDARY_CHARS)
}

export default function MissionFillText({
  text,
  amberPhrase,
  scrollYProgress,
  className,
  style,
}: {
  text: string
  amberPhrase: string
  scrollYProgress: MotionValue<number>
  className?: string
  style?: React.CSSProperties
}) {
  const { words, totalChars } = useMemo(() => buildWords(text, amberPhrase), [text, amberPhrase])

  const [fillIndex, setFillIndex] = useState(() =>
    Math.round(mapProgressToFillIndex(scrollYProgress.get(), totalChars))
  )

  useMotionValueEvent(scrollYProgress, 'change', v => {
    const rounded = Math.round(mapProgressToFillIndex(v, totalChars))
    setFillIndex(prev => (prev === rounded ? prev : rounded))
  })

  return (
    <p className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <Fragment key={wi}>
            <span className="inline whitespace-nowrap">
              {w.chars.map(({ ch, idx }) => (
                <span key={idx} style={{ color: charColor(idx, fillIndex, w.isAmberTarget) }}>
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
    </p>
  )
}
