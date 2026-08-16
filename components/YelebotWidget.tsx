'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { X, ArrowUp, ChevronDown } from 'lucide-react'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { trackBookCall, trackContactCall } from '@/lib/gtag'

const ROBOT_DIR = '/media/robot'

// The pricing section's real id is #precios (Spanish, matches the rest of
// this codebase's in-page anchors) — not the literal "pricing"/"contact"
// naming a spec might assume. Verified against PreciosIndexSection.tsx and
// ContactForm.tsx before wiring these. how-it-works/faq match Nav.tsx's own
// anchors (HowWeWork.tsx / FAQClient.tsx).
const PRICING_SECTION_ID = 'precios'
const CONTACT_SECTION_ID = 'contacto'
const HOW_IT_WORKS_SECTION_ID = 'how-it-works'
const FAQ_SECTION_ID = 'faq'
// Same number as the Contact section's own tel: link (ContactForm.tsx).
const PHONE_TEL = 'tel:+12138458604'

function scrollPageToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// "Call us" does both: scrolls to the contact section AND launches the
// device dialer — the scroll is a visual confirmation of intent that keeps
// working even when the tel: link itself is a no-op (most desktop browsers
// with no registered handler). trackContactCall() fires right before the
// tel: launch, not after — the conversion beacon uses sendBeacon/keepalive
// so it survives the tab handing off to the dialer, and firing here (not
// blocking on it) means the dialer intent is never delayed by analytics.
function callUs() {
  scrollPageToId(CONTACT_SECTION_ID)
  trackContactCall()
  window.location.href = PHONE_TEL
}

type Pill = { label: string; value: string; scrollToId?: string }

const PILLS: Pill[] = [
  { label: 'How can Yele help me build a website?', value: 'How can Yele help me build a website?' },
  { label: 'How much does it cost? 💰', value: 'How much does it cost?', scrollToId: PRICING_SECTION_ID },
  {
    label: 'How could MY business use this?',
    value: 'How could an AI chat assistant like this one help MY business?',
  },
  { label: '📅 Book a call tomorrow', value: 'Book a call tomorrow' },
  { label: "What's the weather? ☀️", value: "What's the weather? ☀️" },
  { label: 'Tell me a joke 😄', value: 'Tell me a joke 😄' },
]

// Fires `callback` on a re-randomized delay each time (not a fixed-period
// setInterval) so the blink/"try me" timing doesn't read as mechanically
// regular across visitors. Disabled entirely (no timers at all) when
// `enabled` is false — used to fully stop for prefers-reduced-motion rather
// than just hiding the visual result.
function useRandomInterval(callback: () => void, minMs: number, maxMs: number, enabled: boolean) {
  const savedCallback = useRef(callback)
  savedCallback.current = callback

  useEffect(() => {
    if (!enabled) return
    let timer: ReturnType<typeof setTimeout>
    const schedule = () => {
      const delay = minMs + Math.random() * (maxMs - minMs)
      timer = setTimeout(() => {
        savedCallback.current()
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(timer)
  }, [minMs, maxMs, enabled])
}

function partsToText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text)
    .join('')
}

// The floating launcher: levitating robot image, periodic blink (image swap,
// with an eyelid-overlay fallback if the blink frame ever fails to load),
// and a periodic "try me" callout. All animation is skipped for
// prefers-reduced-motion — just a static robot.
function RobotLauncher({ open, onClick }: { open: boolean; onClick: () => void }) {
  const reduceMotion = !!useHydratedReducedMotion()
  const [blinking, setBlinking] = useState(false)
  const [blinkImgFailed, setBlinkImgFailed] = useState(false)
  // Starts true (visible immediately on load) instead of waiting for the
  // first interval tick — the effect below handles its initial fade-out;
  // useRandomInterval below picks up the recurring show/hide cycle after
  // that, same as before.
  const [showTryMe, setShowTryMe] = useState(true)

  const triggerBlink = useCallback(() => {
    setBlinking(true)
    setTimeout(() => setBlinking(false), 150)
  }, [])

  useRandomInterval(triggerBlink, 4000, 6000, !reduceMotion)

  useEffect(() => {
    if (open) return
    const timer = setTimeout(() => setShowTryMe(false), 2500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const triggerTryMe = useCallback(() => {
    if (open) return
    setShowTryMe(true)
    setTimeout(() => setShowTryMe(false), 2500)
  }, [open])

  useRandomInterval(triggerTryMe, 4000, 5000, !reduceMotion && !open)

  const showBlinkFrame = blinking && !blinkImgFailed

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close chat with Yelebot' : 'Chat with Yelebot'}
      aria-expanded={open}
      className="group relative flex items-end justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D46FC8]"
      style={{ width: 104 }}
    >
      {!reduceMotion && !open && showTryMe && (
        <span
          aria-hidden="true"
          className="yelebot-tryme absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 font-display text-xs font-bold text-white shadow-[0_4px_18px_rgba(212,111,200,0.55)]"
          style={{
            background: 'linear-gradient(90deg, #D46FC8 0%, #F0A6E4 50%, #D46FC8 100%)',
            backgroundSize: '200% auto',
          }}
        >
          try me ✨
        </span>
      )}

      <span
        className={`relative block ${reduceMotion ? '' : 'yelebot-float'}`}
        style={{ width: 104 }}
      >
        {/* next/image (not a raw <img>) so Next resizes/re-encodes a
            properly-sized derivative server-side instead of the browser
            crudely scaling the full 512px source down in CSS — quality={100}
            keeps that resize from adding its own softening on top of the
            source. Source is a lossless-cropped WebP at ~4.9x the displayed
            width, so this is a clean downscale, never an upscale. */}
        <Image
          src={`${ROBOT_DIR}/robot2.webp`}
          alt=""
          width={512}
          height={466}
          quality={100}
          priority
          sizes="104px"
          className="w-full h-auto drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
          style={{ opacity: showBlinkFrame ? 0 : 1, imageRendering: 'auto' }}
        />
        <Image
          src={`${ROBOT_DIR}/robot_blink2.webp`}
          alt=""
          width={512}
          height={466}
          quality={100}
          sizes="104px"
          onError={() => setBlinkImgFailed(true)}
          className="absolute inset-0 w-full h-auto drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
          style={{ opacity: showBlinkFrame ? 1 : 0, imageRendering: 'auto' }}
        />

        {/* Eyelid-overlay fallback — only ever visible if robot_blink2.webp
            404s, positioned roughly over the robot's eyes for the ~512x466
            crop. Two dark bars that scaleY 0->1->0 to fake a blink without
            needing a second image. */}
        {blinking && blinkImgFailed && (
          <span aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <span
              className="yelebot-blink-lid absolute rounded-full bg-[#3a2a4a]"
              style={{ left: '28%', top: '38%', width: '16%', height: '7%' }}
            />
            <span
              className="yelebot-blink-lid absolute rounded-full bg-[#3a2a4a]"
              style={{ left: '56%', top: '38%', width: '16%', height: '7%' }}
            />
          </span>
        )}
      </span>
    </button>
  )
}

// Bold-only inline markdown — the system prompt only ever asks the model
// for **bold** and short bullet lists, so a couple of regexes cover it
// without pulling in a full remark/rehype pipeline for a chat bubble.
function renderInlineBold(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${keyPrefix}-${i}`} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    )
  )
}

// Splits assistant replies into paragraphs and "- "/"* " bullet groups so
// short lists render as an actual <ul> instead of a wall of dashes.
function MarkdownLite({ text }: { text: string }) {
  const lines = text.split('\n')
  const blocks: ReactNode[] = []
  let bullets: string[] = []

  const flushBullets = () => {
    if (bullets.length === 0) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-1 list-disc space-y-1 pl-4">
        {bullets.map((item, i) => (
          <li key={i}>{renderInlineBold(item, `b${blocks.length}-${i}`)}</li>
        ))}
      </ul>
    )
    bullets = []
  }

  lines.forEach((line, i) => {
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)/)
    if (bulletMatch) {
      bullets.push(bulletMatch[1])
      return
    }
    flushBullets()
    if (line.trim() !== '') {
      blocks.push(
        <p key={`p-${i}`} className="my-0">
          {renderInlineBold(line, `p${i}`)}
        </p>
      )
    }
  })
  flushBullets()

  return <div className="space-y-1.5">{blocks}</div>
}

function MessageBubble({ role, text }: { role: string; text: string }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[92%] rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed ${isUser ? 'whitespace-pre-wrap' : ''}`}
        style={
          isUser
            ? { backgroundColor: '#D46FC8', color: '#16161A' }
            : { backgroundColor: '#232329', color: 'rgba(255,255,255,0.92)' }
        }
      >
        {isUser ? text : <MarkdownLite text={text} />}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl px-4 py-3" style={{ backgroundColor: '#232329' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-white/50 motion-safe:animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// Tool-call parts come through as { type: "tool-<name>", state } on the
// LAST assistant message while a tool is mid-flight (state
// "input-streaming"/"input-available") — once it resolves, state flips to
// "output-available"/"output-error" and the model's own follow-up text
// narrates the result, so this only needs to cover the "still running" gap.
function activeToolLabel(messages: { role: string; parts: { type: string; state?: string }[] }[]): string | null {
  const last = messages[messages.length - 1]
  if (!last || last.role !== 'assistant') return null
  for (const part of last.parts) {
    if (!part.type.startsWith('tool-')) continue
    if (part.state === 'input-streaming' || part.state === 'input-available') {
      const name = part.type.slice('tool-'.length)
      if (name === 'checkAvailability') return 'Checking availability…'
      if (name === 'bookCall') return 'Booking…'
      return 'Working on it…'
    }
  }
  return null
}

// book_call conversion — scans every message (not just the last one) for a
// bookCall tool part that's actually resolved successfully (state
// "output-available", output.success true from lib/cal.ts's
// CreateBookingResult) — never on the user merely asking to book, and
// never on a failed/declined booking. Returns each one's bookingId (to
// dedupe against re-renders/repeated tool results) alongside the email the
// model passed as the tool's input, for Enhanced Conversions.
function findConfirmedBookings(
  messages: { role: string; parts: { type: string; state?: string; input?: unknown; output?: unknown }[] }[]
): { bookingId: number; email?: string }[] {
  const found: { bookingId: number; email?: string }[] = []
  for (const m of messages) {
    if (m.role !== 'assistant') continue
    for (const part of m.parts) {
      if (part.type !== 'tool-bookCall' || part.state !== 'output-available') continue
      const output = part.output as { success?: boolean; bookingId?: number } | undefined
      if (!output?.success || typeof output.bookingId !== 'number') continue
      const input = part.input as { email?: string } | undefined
      found.push({ bookingId: output.bookingId, email: input?.email })
    }
  }
  return found
}

function StatusBubble({ label }: { label: string }) {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5" style={{ backgroundColor: '#232329' }}>
        <span className="h-1.5 w-1.5 rounded-full bg-[#D46FC8] motion-safe:animate-pulse" />
        <span className="font-body text-xs text-white/70">{label}</span>
      </div>
    </div>
  )
}

const QUICK_ACTION_CLASS =
  'rounded-full border border-white/15 px-3 py-1.5 font-body text-xs font-medium text-white/70 transition-colors hover:border-[#D46FC8]/60 hover:text-white'

// Highlighted variant — currently just "Pricing" and "Call us" — solid
// brand pink instead of the outline treatment, same pill shape/size.
const QUICK_ACTION_PINK_CLASS =
  'rounded-full px-3 py-1.5 font-body text-xs font-medium text-white bg-[#D46FC8] hover:bg-[#DE85D2] transition-colors'

// Genuine navigation (leaves the page) — only "Start for free"/"Services" use this now.
function QuickLink({ href, children, pink = false }: { href: string; children: ReactNode; pink?: boolean }) {
  return (
    <a href={href} className={pink ? QUICK_ACTION_PINK_CLASS : QUICK_ACTION_CLASS}>
      {children}
    </a>
  )
}

// Same look as QuickLink but an in-page action (send a chat message and/or
// scroll the page) instead of navigating away.
function QuickAction({ onClick, children, pink = false }: { onClick: () => void; children: ReactNode; pink?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={pink ? QUICK_ACTION_PINK_CLASS : QUICK_ACTION_CLASS}>
      {children}
    </button>
  )
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastScrolledIdRef = useRef<string | null>(null)
  const [showMoreBelow, setShowMoreBelow] = useState(false)
  const busy = status === 'submitted' || status === 'streaming'

  const updateShowMoreBelow = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowMoreBelow(distanceFromBottom > 32)
  }, [])

  // Nudges the list down by ~10 lines (not all the way to the bottom, and
  // not aligned to any particular element) once per new assistant reply —
  // guarded by lastScrolledIdRef so it fires once per message id, not on
  // every streamed token. Long replies rely on the "more below" fade +
  // chevron (below) rather than auto-scrolling to their end.
  useEffect(() => {
    const lastMsg = messages[messages.length - 1]
    if (lastMsg && lastMsg.role === 'assistant' && lastMsg.id !== lastScrolledIdRef.current) {
      lastScrolledIdRef.current = lastMsg.id
      const TEN_LINES_PX = 240
      scrollRef.current?.scrollBy({ top: TEN_LINES_PX, behavior: 'smooth' })
    }
    // Content height still changes on every token — keep the "more below"
    // fade/chevron in sync without re-triggering the scroll above.
    const raf = requestAnimationFrame(updateShowMoreBelow)
    return () => cancelAnimationFrame(raf)
  }, [messages, busy, updateShowMoreBelow])

  // book_call conversion — fires once per distinct confirmed booking
  // (never on merely asking the bot to book), guarded by bookingId so
  // re-renders/repeated tool results in the same conversation can't
  // double-fire it.
  const trackedBookingIdsRef = useRef<Set<number>>(new Set())
  useEffect(() => {
    for (const { bookingId, email } of findConfirmedBookings(messages)) {
      if (trackedBookingIdsRef.current.has(bookingId)) continue
      trackedBookingIdsRef.current.add(bookingId)
      trackBookCall(email)
    }
  }, [messages])

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || busy) return
      sendMessage({ text: trimmed })
      setInput('')
    },
    [busy, sendMessage]
  )

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[70] flex h-[75vh] w-full flex-col overflow-hidden rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.5)] sm:inset-x-auto sm:bottom-28 sm:right-6 sm:h-[560px] sm:w-[430px] sm:rounded-3xl sm:shadow-[0_0_60px_rgba(212,111,200,0.25),0_8px_40px_rgba(0,0,0,0.5)]"
      style={{ backgroundColor: '#16171C' }}
      role="dialog"
      aria-label="Chat with Yelebot"
    >
      <header className="flex shrink-0 items-center justify-between border-b border-white/8 px-5 py-4">
        <span className="font-display text-base font-bold text-white">Ask Yelebot 🤖</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="relative min-h-0 flex-1">
        <div ref={scrollRef} onScroll={updateShowMoreBelow} className="h-full space-y-3 overflow-y-auto px-5 py-4">
          {messages.length === 0 && (
            <>
              <MessageBubble role="assistant" text="Hi! I'm Yele's AI agent 🤖 — ask me anything:" />
              <div className="flex flex-col gap-2 pt-1">
                {PILLS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => {
                      // The scroll targets the page itself (document), not
                      // scrollRef's internal chat list — the panel is a
                      // fixed overlay, so the underlying page scrolls behind
                      // it while the chat stays open exactly as it is.
                      if (p.scrollToId) scrollPageToId(p.scrollToId)
                      handleSend(p.value)
                    }}
                    className="rounded-full border border-[#D46FC8]/50 px-4 py-2 text-left font-body text-xs font-medium text-[#F0A6E4] transition-colors hover:bg-[#D46FC8]/10 hover:border-[#D46FC8]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {messages.map((m) => (
            <MessageBubble key={m.id} role={m.role} text={partsToText(m.parts)} />
          ))}

          {busy &&
            (() => {
              const toolLabel = activeToolLabel(messages)
              return toolLabel ? <StatusBubble label={toolLabel} /> : status === 'submitted' ? <TypingDots /> : null
            })()}
          {status === 'error' && (
            <MessageBubble
              role="assistant"
              text="Something went wrong on my end — try again in a moment, or reach a human at info@yele.design."
            />
          )}
        </div>

        {/* "More below" affordance — a bottom fade so cut-off content reads
            as continuing rather than ending abruptly, plus a bouncing
            chevron (click to jump to the latest message). Both hidden once
            updateShowMoreBelow (scroll position OR content-height changes)
            reports the user is already at the bottom. */}
        {showMoreBelow && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
              style={{ background: 'linear-gradient(to top, #16171C, transparent)' }}
            />
            <button
              type="button"
              onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })}
              aria-label="Scroll to latest message"
              className="absolute bottom-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full text-white/80 shadow-[0_4px_14px_rgba(0,0,0,0.4)] motion-safe:animate-bounce"
              style={{ backgroundColor: '#2A2A32' }}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col shrink-0 gap-2 border-t border-white/8 px-5 pt-3">
        <div className="flex flex-wrap gap-2">
          <QuickAction pink onClick={() => scrollPageToId(PRICING_SECTION_ID)}>Pricing</QuickAction>
          <QuickAction onClick={() => scrollPageToId(HOW_IT_WORKS_SECTION_ID)}>How it works</QuickAction>
          <QuickLink href="/services">Services</QuickLink>
          <QuickAction onClick={() => scrollPageToId(FAQ_SECTION_ID)}>FAQ</QuickAction>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickAction pink onClick={callUs}>Call us</QuickAction>
          <QuickAction onClick={() => handleSend('Book a call tomorrow')}>Book a call</QuickAction>
          <QuickAction onClick={() => scrollPageToId(CONTACT_SECTION_ID)}>Contact us</QuickAction>
          <QuickLink href="/start">Start for free</QuickLink>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend(input)
        }}
        className="flex shrink-0 items-center gap-2 px-5 py-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          disabled={busy}
          placeholder="Ask me anything…"
          className="flex-1 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 font-body text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#D46FC8]/60 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D46FC8] text-[#16161A] transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>
    </div>
  )
}

export default function YelebotWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[70]">
        <RobotLauncher open={open} onClick={() => setOpen((v) => !v)} />
      </div>
      {open && <ChatPanel onClose={() => setOpen(false)} />}
    </>
  )
}
