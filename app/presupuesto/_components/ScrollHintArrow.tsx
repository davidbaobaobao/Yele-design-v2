'use client'

export default function ScrollHintArrow() {
  function scrollToCards() {
    document.getElementById('showcase-cards')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex justify-center pt-6">
      <button
        id="scroll-hint-arrow"
        onClick={scrollToCards}
        aria-label="Ir a ejemplos de webs"
        className="animate-bounce cursor-pointer bg-transparent border-0 p-0"
      >
        <div className="w-11 h-11 rounded-full border border-ink/20 bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16161A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>
    </div>
  )
}
