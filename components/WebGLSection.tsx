'use client'

import { useEffect, useState } from 'react'
import { WebGLShader } from '@/components/ui/web-gl-shader'
import { InfiniteGrid } from '@/components/ui/the-infinite-grid'
import { ChevronDown } from 'lucide-react'

const WORDS = ['Complicada', 'Cara', 'Aburrida']
const TYPING_SPEED = 80    // ms per char
const ERASING_SPEED = 50   // ms per char
const SHOW_DURATION = 1000 // ms to hold the full word

type Phase = 'typing' | 'showing' | 'erasing'

function useTypewriter(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState<Phase>('typing')
  const [cursorVisible, setCursorVisible] = useState(true)

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorVisible(v => !v), 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const word = words[wordIndex]

    if (phase === 'typing') {
      if (displayText.length < word.length) {
        const id = setTimeout(
          () => setDisplayText(word.slice(0, displayText.length + 1)),
          TYPING_SPEED
        )
        return () => clearTimeout(id)
      } else {
        const id = setTimeout(() => setPhase('showing'), SHOW_DURATION)
        return () => clearTimeout(id)
      }
    }

    if (phase === 'showing') {
      setPhase('erasing')
    }

    if (phase === 'erasing') {
      if (displayText.length > 0) {
        const id = setTimeout(
          () => setDisplayText(displayText.slice(0, -1)),
          ERASING_SPEED
        )
        return () => clearTimeout(id)
      } else {
        setWordIndex(i => (i + 1) % words.length)
        setPhase('typing')
      }
    }
  }, [displayText, phase, wordIndex, words])

  return { displayText, cursorVisible }
}

export default function WebGLSection() {
  const { displayText, cursorVisible } = useTypewriter(WORDS)

  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden min-h-screen bg-black">
      {/* Layer 1: scrolling grid with mouse-reveal */}
      <InfiniteGrid />

      {/* Layer 2: CMYK waves (transparent bg — grid shows through) */}
      <WebGLShader />

      {/* Layer 3: text — shifted up so it sits above the wave band */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full flex flex-col items-center text-center -translate-y-16">
        <h2
          className="font-outfit font-bold text-white leading-[1.05] tracking-tighter mb-10"
          style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
        >
          <span className="block">Una página web no es</span>
          <span className="block min-h-[1.1em]">
            {displayText}
            <span
              className="inline-block w-[3px] ml-[2px]"
              style={{
                height: '0.85em',
                background: 'rgba(255,255,255,1)',
                opacity: cursorVisible ? 1 : 0,
                transition: 'opacity 0.1s',
                verticalAlign: 'middle',
              }}
              aria-hidden="true"
            />
          </span>
        </h2>

        {/* Scroll-down button */}
        <button
          onClick={() => document.querySelector('#beneficios')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Ir a la siguiente sección"
        >
          <ChevronDown size={20} className="text-white/60" />
        </button>
      </div>
    </section>
  )
}
