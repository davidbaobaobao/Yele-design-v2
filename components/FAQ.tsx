'use client'

import { useState } from 'react'
import { motion, AnimatePresence, type Transition } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'

const faqs = [
  {
    es: {
      q: '¿Cuánto tarda en estar lista mi web?',
      a: 'Entre 3 y 5 días laborables desde que recibimos tu formulario completo. Es el tiempo real, no marketing.',
    },
    en: {
      q: 'How long does it take to get my website?',
      a: 'Between 3 and 5 working days from when we receive your completed form. That\'s the real time, not marketing speak.',
    },
  },
  {
    es: {
      q: '¿Puedo pedir cambios una vez esté publicada?',
      a: 'Sí. Los cambios de contenido (textos, fotos, precios, horarios...) los hacemos en 24–48h en todos los planes.',
    },
    en: {
      q: 'Can I request changes after launch?',
      a: 'Yes. Content changes (text, photos, prices, hours...) are done within 24–48h on all plans.',
    },
  },
  {
    es: {
      q: '¿Qué pasa si quiero cancelar?',
      a: 'Sin permanencia. Avisas con 30 días de antelación y listo. No hay penalizaciones ni letras pequeñas.',
    },
    en: {
      q: 'What if I want to cancel?',
      a: 'No lock-in. Give us 30 days\' notice and that\'s it. No penalties, no fine print.',
    },
  },
  {
    es: {
      q: '¿Están incluidos el hosting y el dominio?',
      a: 'Sí. Hosting gestionado, dominio (.com o .es), certificado SSL y copias de seguridad diarias están incluidos en todos los planes.',
    },
    en: {
      q: 'Are hosting and domain included?',
      a: 'Yes. Managed hosting, domain (.com or .es), SSL certificate and daily backups are included in all plans.',
    },
  },
  {
    es: {
      q: '¿Necesito saber de tecnología para gestionar mi web?',
      a: 'No. Te damos acceso a un panel sencillo donde puedes cambiar textos e imágenes tú mismo, sin tocar ninguna línea de código.',
    },
    en: {
      q: 'Do I need tech knowledge to manage my website?',
      a: 'No. We give you access to a simple panel where you can change text and images yourself, without touching a single line of code.',
    },
  },
  {
    es: {
      q: '¿Y si necesito algo muy específico?',
      a: 'Consúltanos. Si está fuera de los planes estándar, te preparamos un presupuesto a medida sin compromiso.',
    },
    en: {
      q: 'What if I need something very specific?',
      a: 'Just ask. If it\'s outside the standard plans, we\'ll put together a custom quote with no commitment.',
    },
  },
]

export default function FAQ() {
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
                  {t(faq.es.q, faq.en.q)}
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
                      {t(faq.es.a, faq.en.a)}
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
