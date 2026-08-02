'use client'

import { useState } from 'react'
import { motion, AnimatePresence, type Transition } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'

export type FAQItem = {
  question: string
  answer: string
}

// `dark` is a distinct, explicit opt-in — NOT the default for `noBg` — so
// the 8 vertical landing pages that render this via <FAQClient faqs={...}/>
// directly (no props) keep their original light bg-base/ink treatment
// untouched. Only the homepage passes `dark`.
export default function FAQClient({
  faqs,
  noBg,
  dark,
}: {
  faqs: FAQItem[]
  noBg?: boolean
  dark?: boolean
}) {
  const { t } = useLang()
  const [open, setOpen] = useState<number | null>(null)

  const primaryText = dark ? 'text-bone' : 'text-ink'
  const secondaryText = dark ? 'text-bone/60' : 'text-muted'
  const hoverText = dark ? 'group-hover:text-bone/70' : 'group-hover:text-muted'
  const divider = dark ? 'divide-hairlineDark' : 'divide-black/[0.06]'

  return (
    <section
      id="faq"
      data-nav-dark={dark || undefined}
      className={`py-24 md:py-32 scroll-mt-24 ${dark ? '' : noBg ? '' : 'bg-base'}`}
      style={dark ? { backgroundColor: '#0D0E12' } : undefined}
    >
      <div className="max-w-3xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' } as Transition}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12"
        >
          <span className={`font-body text-xs tracking-[0.15em] uppercase ${secondaryText} mb-4 block`}>
            FAQ
          </span>
          <h2 className={`font-display font-semibold text-4xl md:text-5xl ${primaryText} tracking-tight`}>
            {t('Resolvemos tus dudas.', 'We answer your questions.')}
          </h2>
        </motion.div>

        <div className={`flex flex-col divide-y ${divider}`}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' } as Transition}
              viewport={{ once: true, margin: '-80px' }}
            >
              <button
                className="w-full flex items-center justify-between py-5 text-left cursor-pointer focus-visible:outline-none group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className={`font-display font-medium text-base ${primaryText} ${hoverText} transition-colors pr-6`}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.25 } as Transition}
                  className="flex-shrink-0"
                >
                  <Plus size={18} className={secondaryText} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' } as Transition}
                    className="overflow-hidden"
                  >
                    <p className={`font-body text-sm ${secondaryText} leading-relaxed pb-5`}>
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
