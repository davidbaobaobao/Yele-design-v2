'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const FAQS: { q: string; a: string; link?: { label: string; href: string } }[] = [
  {
    q: 'How much does a website cost?',
    a: 'Yele websites start at $699. Most small businesses will choose either our $699 Launch package or our $1,199 Business package. More advanced websites start from $2,799.',
  },
  {
    q: 'Is there a monthly fee?',
    a: 'Yes. Yele Care is $49/month and covers hosting, domain support, security, backups, maintenance, support, and small website updates.',
  },
  {
    q: 'Is Yele Care compulsory?',
    a: 'No — but we highly recommend it. Yele Care includes a full design refresh every year, so you get a renewed website annually and everything keeps working — hosted, secure, backed up, monitored and up to date. You can host and manage the site yourself, but with Yele Care you never have to worry about the technical side.',
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
    a: 'Yes. With Business, customers can automatically choose and confirm a time in a synchronized calendar. With Launch, your site has direct automatic action buttons to call you or fill in a form. More advanced scheduling, payments, reminders, or multi-staff booking is available with Business or Pro.',
  },
  {
    q: 'Is SEO included?',
    a: 'Every website includes an SEO foundation. This includes technical setup, page titles, descriptions, sitemap, indexing, mobile optimization, and analytics.',
  },
  {
    q: 'Can you update my website later with my content?',
    a: 'Yes — anytime. You can upload your content directly yourself, or we can do it for you. It’s included with Yele Care.',
  },
  {
    q: 'Can you create images and videos?',
    a: 'We create the visual assets needed for your website as part of the build. Ongoing image and video content in the future isn’t included and is an added cost.',
    link: { label: 'See more in our services', href: 'https://yele.design/services' },
  },
  {
    q: 'Can you manage my advertising?',
    a: 'Yes. Yele can set up and manage Google Ads and Meta advertising campaigns. Advertising management and ad spend are separate from your website package.',
    link: { label: 'See more in our services', href: 'https://yele.design/services' },
  },
  {
    q: 'Can you add AI to my website?',
    a: 'Yes. We can add AI chat, AI phone receptionists, lead automation, customer follow-up, and other AI-powered business tools.',
    link: { label: 'See more in our services', href: 'https://yele.design/services' },
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
                  <div className="pb-5 -mt-1 max-w-2xl">
                    <p className="font-body text-base text-muted leading-relaxed">{item.a}</p>
                    {item.link && (
                      <a
                        href={item.link.href}
                        className="inline-flex items-center gap-1 mt-2 font-body text-sm font-medium text-[#D46FC8] underline underline-offset-4 hover:text-[#DE85D2] transition-colors"
                      >
                        {item.link.label} →
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
