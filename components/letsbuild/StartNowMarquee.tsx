'use client'

import { TextGradient } from '@/components/ui/text-gradient'

// Clickable scrolling "START NOW *" band — same seamless-loop marquee trick as
// the index ContactForm (hero-marquee-track / marqueeLeft in globals.css).
// Clicking anywhere on it scrolls the visitor up to the hero lead form.
function MarqueeRun() {
  return (
    <div className="flex items-center shrink-0">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center shrink-0">
          <span className="font-display font-bold text-white whitespace-nowrap text-[clamp(2.5rem,6vw,5rem)]">
            START NOW
          </span>
          <TextGradient as="span" className="font-display font-bold mx-6 md:mx-10 text-[clamp(2.5rem,6vw,5rem)]">
            *
          </TextGradient>
        </div>
      ))}
    </div>
  )
}

export default function StartNowMarquee() {
  const goToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  return (
    <button
      type="button"
      onClick={goToForm}
      aria-label="Start now — go to the form"
      className="group block w-full overflow-hidden py-10 md:py-14 cursor-pointer border-y border-white/10 transition-opacity hover:opacity-90"
      style={{ backgroundColor: '#0D0E12' }}
    >
      <div className="hero-marquee-track flex items-center" style={{ width: 'max-content' }}>
        <MarqueeRun />
        <MarqueeRun />
      </div>
    </button>
  )
}
