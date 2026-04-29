'use client'

import { useState } from 'react'
import { motion, AnimatePresence, type Transition } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'

export type FAQItem = {
  question: string
  answer: string
}

export default function FAQClient({ faqs }: { faqs: FAQItem[] }) {
  const { t } = useLang()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 md:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' } as Transition}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12"
        >
          <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
            FAQ
          </span>
          <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight">
            {t('Resolvemos tus dudas.', 'We answer your questions.')}
          </h2>
        </motion.div>

        <div className="flex flex-col divide-y divide-black/[0.06]">
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
                <span className="font-outfit font-medium text-base text-[#1D1D1F] group-hover:text-[#86868B] transition-colors pr-6">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.25 } as Transition}
                  className="flex-shrink-0"
                >
                  <Plus size={18} className="text-[#86868B]" />
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
                    <p className="font-manrope text-sm text-[#86868B] leading-relaxed pb-5">
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
