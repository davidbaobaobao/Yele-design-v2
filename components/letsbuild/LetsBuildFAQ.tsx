'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How much does a website cost?',
    a: 'Yele websites start at $599. Most small businesses will choose either our $599 Launch package or our $1,299 Business package. More advanced websites start from $2,299.',
  },
  {
    q: 'Is there a monthly fee?',
    a: 'Yes. Yele Care is $49/month and covers hosting, domain support, security, backups, maintenance, support, and small website updates.',
  },
  {
    q: 'Do I need to pay everything upfront?',
    a: 'No. You pay 50% when we begin. The remaining 50% is paid when the website is finished and approved for launch.',
  },
  {
    q: 'Is hosting included?',
    a: 'Yes. Hosting is included with Yele Care.',
  },
  {
    q: 'Is my domain included?',
    a: 'We can provide and manage a standard domain for your website when required. Premium or unusually expensive domains may cost extra.',
  },
  {
    q: 'Can customers book appointments through my website?',
    a: 'Yes. Basic calendar and booking integrations are included in the Launch package. More advanced scheduling, payments, reminders, or multi-staff booking systems are available with Business or Pro.',
  },
  {
    q: 'Is SEO included?',
    a: 'Every website includes an SEO foundation. This includes technical setup, page titles, descriptions, sitemap, indexing, mobile optimization, and analytics. Ongoing SEO campaigns are available separately.',
  },
  {
    q: 'Can you update my website later?',
    a: 'Yes. Small text and image changes are included with Yele Care. Larger changes, new functionality, new sections requiring significant design work, or complete redesigns are quoted separately.',
  },
  {
    q: 'Can you create images and videos?',
    a: 'We can create the visual assets needed for your website. Ongoing image, video, social, and advertising content can also be added as a monthly service.',
  },
  {
    q: 'Can you manage my advertising?',
    a: 'Yes. Yele can set up and manage Google Ads and Meta advertising campaigns. Advertising management and ad spend are separate from your website package.',
  },
  {
    q: 'Can you add AI to my website?',
    a: 'Yes. We can add AI chat, AI phone receptionists, lead automation, customer follow-up, and other AI-powered business tools.',
  },
]

export default function LetsBuildFAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted mb-3">FAQ</p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight mb-8">
          We answer your questions.
        </h2>

        <div className="divide-y divide-hairline border-t border-b border-hairline">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-body font-medium text-base md:text-lg text-ink">{item.q}</span>
                  {isOpen ? (
                    <Minus size={20} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <Plus size={20} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                  )}
                </button>
                {isOpen && (
                  <p className="font-body text-base text-muted leading-relaxed pb-5 -mt-1 max-w-2xl">
                    {item.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
