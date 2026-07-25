'use client'

import { Fragment, useMemo, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const GREY: [number, number, number] = [0xc9, 0xc6, 0xbf] // #C9C6BF — unfilled
const INK: [number, number, number] = [0x16, 0x16, 0x1a] // #16161A — filled
const AMBER: [number, number, number] = [0xc9, 0x7f, 0x3d] // #C97F3D — "and stay"

// Strip surrounding punctuation so "stay." matches the target word "stay".
const bareWord = (w: string) => w.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')

// Function-form transform — framer-motion's range-array useTransform (mv,
// [in], [out]) doesn't reliably track live scroll updates in this app
// (found and worked around the same way in Hero.tsx/WhatWeDo.tsx). Colors
// are interpolated by hand instead of relying on useTransform's built-in
// color tweening, which only works with the array form.
function colorMap(to: [number, number, number]) {
  return (v: number) => {
    const t = Math.max(0, Math.min(1, v))
    const r = Math.round(GREY[0] + (to[0] - GREY[0]) * t)
    const g = Math.round(GREY[1] + (to[1] - GREY[1]) * t)
    const b = Math.round(GREY[2] + (to[2] - GREY[2]) * t)
    return `rgb(${r}, ${g}, ${b})`
  }
}

function Word({ word, isAmberTarget, isLast }: { word: string; isAmberTarget: boolean; isLast: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  // Progress 0 when the word's top hits 90% of viewport height (just
  // entering from the bottom), 1 when it reaches 45% (upper-middle) — each
  // word tracks its own position, not one shared section-level progress, so
  // lines already on screen read as further along than lines just arriving.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.45'] })
  const color = useTransform(scrollYProgress, colorMap(isAmberTarget ? AMBER : INK))

  return (
    <Fragment>
      <motion.span ref={ref} style={{ color }} className="inline-block whitespace-nowrap">
        {word}
      </motion.span>
      {!isLast ? ' ' : ''}
    </Fragment>
  )
}

function buildWords(text: string, amberPhrase: string) {
  const rawWords = text.split(' ')
  const amberWords = amberPhrase.split(' ').map(bareWord)
  return rawWords.map((word, wi) => {
    const isAmberTarget = amberWords.some((_, offset) => {
      const start = wi - offset
      if (start < 0) return false
      return amberWords.every((aw, k) => bareWord(rawWords[start + k] ?? '') === aw)
    })
    return { word, isAmberTarget }
  })
}

export default function MissionFillText({ text, amberPhrase }: { text: string; amberPhrase: string }) {
  const words = useMemo(() => buildWords(text, amberPhrase), [text, amberPhrase])

  return (
    <p className="font-display font-bold leading-[1.25] tracking-tight max-w-[80vw] text-[clamp(1.75rem,3.2vw,3.25rem)]">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <Word key={wi} word={w.word} isAmberTarget={w.isAmberTarget} isLast={wi === words.length - 1} />
        ))}
      </span>
    </p>
  )
}
