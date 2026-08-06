'use client'

import { useEffect, useState } from 'react'
import { TextGradient } from '@/components/ui/text-gradient'

const TYPE_MS = 70
const ERASE_MS = 40
const HOLD_MS = 1500
const CURSOR_COLOR = '#F2F0EB'

// Types the current word in char-by-char, holds, erases char-by-char, then
// advances to the next word (wrapping around) — a small state machine driven
// by chained setTimeouts rather than a single interval, since type/hold/erase
// each run at a different pace. Extracted from Hero so any other section
// that wants the identical rotating-word effect (pink TextGradient + blinking
// cursor) can reuse it exactly rather than reimplementing it — pass a stable
// (module-level) `words` array, not an inline literal, since it's
// intentionally not in the effects' dependency arrays (same as when it was
// a hardcoded constant).
export function TypewriterWord({ words, reduceMotion }: { words: string[]; reduceMotion: boolean }) {
  const longestCh = Math.max(...words.map(w => w.length))
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'erasing'>('typing')

  // useHydratedReducedMotion() (the caller's reduceMotion) starts false and
  // only resolves to its real value after mount, so a useState initializer
  // keyed on reduceMotion would freeze on the wrong (pre-hydration) value
  // forever — this runs again once reduceMotion actually flips to true.
  useEffect(() => {
    if (reduceMotion) setText(words[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    const word = words[index]
    let timer: number

    if (phase === 'typing') {
      if (text.length < word.length) {
        timer = window.setTimeout(() => setText(word.slice(0, text.length + 1)), TYPE_MS)
      } else {
        timer = window.setTimeout(() => setPhase('erasing'), HOLD_MS)
      }
    } else {
      if (text.length > 0) {
        timer = window.setTimeout(() => setText(word.slice(0, text.length - 1)), ERASE_MS)
      } else {
        setIndex(i => (i + 1) % words.length)
        setPhase('typing')
      }
    }

    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, phase, index, reduceMotion])

  // text is only ever '' at the two moments a soft fade should happen: the
  // very first mount (before typing starts) and the brief gap between one
  // word finishing its erase and the next word's first character — so
  // driving opacity off text.length directly (with a CSS transition) gets
  // the fade-out/fade-in for free with no extra state or timers.
  return (
    <span
      className="inline-block"
      style={{ minWidth: `${longestCh}ch`, opacity: text.length === 0 ? 0 : 1, transition: 'opacity 300ms ease' }}
    >
      <TextGradient as="span">{text}</TextGradient>
      {!reduceMotion && (
        <span
          aria-hidden="true"
          className="inline-block ml-1 animate-pulse align-middle"
          style={{ width: '3px', height: '0.85em', backgroundColor: CURSOR_COLOR }}
        />
      )}
    </span>
  )
}
