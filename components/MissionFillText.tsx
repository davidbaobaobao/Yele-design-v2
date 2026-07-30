'use client'

import { Fragment, useMemo, useState } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

// Unfilled characters sit at this light warm grey (not a dim near-invisible
// tone — the fill reads as grey -> pink -> white, so the "unfilled" state
// needs to be clearly visible on its own).
const GREY: [number, number, number] = [0xc9, 0xc6, 0xbf]
const WHITE: [number, number, number] = [0xf2, 0xf0, 0xeb] // #F2F0EB — filled
const PINK: [number, number, number] = [0xd4, 0x6f, 0xc8] // #D46FC8 — traveling tip accent

// The fill only runs across the middle of the section's scroll range — it
// starts just after the section pins and finishes just before it releases.
const FILL_START = 0.05
const FILL_END = 0.85
// Width (in characters) of the glowing tip zone a character passes through
// as the fill boundary crosses it: grey -> pink (first half) -> white
// (second half), pink peaking at the zone's midpoint.
const TIP_CHARS = 3
const TIP_HALF = TIP_CHARS / 2

type WordToken = {
  word: string
  chars: { ch: string; idx: number }[]
}

function buildWords(text: string) {
  let globalIndex = 0
  const words: WordToken[] = text.split(' ').map(word => {
    const chars = Array.from(word).map(ch => ({ ch, idx: globalIndex++ }))
    return { word, chars }
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

// d = how far past this char the fill has progressed. d <= 0: still grey
// (not reached yet). 0 < d < TIP_CHARS: inside the traveling tip — ramps
// grey -> pink over the first half, then pink -> white over the second half,
// so pink peaks at the zone's midpoint rather than at a hard edge. d >=
// TIP_CHARS: fully filled, solid white.
function charColor(charIndex: number, fillIndex: number): string {
  const d = fillIndex - charIndex
  if (d <= 0) return rgbStr(GREY)
  if (d >= TIP_CHARS) return rgbStr(WHITE)
  if (d <= TIP_HALF) return mix(GREY, PINK, d / TIP_HALF)
  return mix(PINK, WHITE, (d - TIP_HALF) / (TIP_CHARS - TIP_HALF))
}

// Subtle pink glow on just the tip chars, strongest at the zone's midpoint
// (peak pink) and fading to none at both edges — extra drama on top of the
// color shift itself.
function charGlow(charIndex: number, fillIndex: number): string | undefined {
  const d = fillIndex - charIndex
  if (d <= 0 || d >= TIP_CHARS) return undefined
  const intensity = 1 - Math.abs(d - TIP_HALF) / TIP_HALF
  if (intensity <= 0) return undefined
  return `0 0 10px rgba(212, 111, 200, ${(intensity * 0.75).toFixed(2)})`
}

export default function MissionFillText({
  text,
  scrollYProgress,
  className,
  style,
}: {
  text: string
  scrollYProgress: MotionValue<number>
  className?: string
  style?: React.CSSProperties
}) {
  const { words, totalChars } = useMemo(() => buildWords(text), [text])

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
                <span
                  key={idx}
                  style={{ color: charColor(idx, fillIndex), textShadow: charGlow(idx, fillIndex) }}
                >
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
