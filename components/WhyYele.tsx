'use client'
import { useRef } from 'react'
import { useLang } from '@/context/LanguageContext'

const cards = [
  {
    icon: '⚡',
    es: { title: 'Lista en 5 días', description: 'De cero a online en menos de una semana. Sin esperas de meses ni reuniones interminables.' },
    en: { title: 'Ready in 5 days', description: 'From zero to online in less than a week. No months of waiting.' },
  },
  {
    icon: '📍',
    es: { title: 'SEO local incluido', description: 'Apareces cuando te buscan cerca. Schema markup, Google Business y keywords locales. Todo incluido.' },
    en: { title: 'Local SEO included', description: 'Show up when people search nearby. Schema, Google Business, local keywords. All included.' },
  },
  {
    icon: '📱',
    es: { title: 'Mobile-first', description: 'El 80% de tus clientes te ven desde el móvil. Rápida, ligera y perfecta en cualquier pantalla.' },
    en: { title: 'Mobile-first', description: '80% of your clients find you on mobile. Fast, light and perfect on any screen.' },
  },
  {
    icon: '🔧',
    es: { title: 'Siempre online', description: 'Hosting, SSL y actualizaciones incluidas. Tu web siempre operativa. Sin extras, sin sorpresas.' },
    en: { title: 'Always online', description: 'Hosting, SSL and updates included. Your site always live. No extras, no surprises.' },
  },
  {
    icon: '🎛️',
    es: { title: 'Tú controlas el contenido', description: 'Cambia textos, fotos y precios desde tu panel. Sin tocar código. Los cambios aparecen en 60 segundos.' },
    en: { title: 'You control the content', description: 'Update text, photos and prices from your panel. No code. Changes live in 60 seconds.' },
  },
]

export default function WhyYele() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { t } = useLang()

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <p className="text-[#86868B] text-sm uppercase tracking-widest mb-3">
          {t('Por qué Yele', 'Why Yele')}
        </p>
        <h2 className="text-5xl font-['Outfit'] font-semibold text-[#1D1D1F] leading-tight">
          {t('Todo lo que necesitas.', 'Everything you need.')}<br />
          {t('Nada que no necesitas.', "Nothing you don't.")}
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-scroll overflow-y-hidden
                   scroll-smooth snap-x snap-mandatory
                   pl-8 pr-[calc(100vw-300px-32px)]
                   md:pl-[80px] md:pr-[calc(100vw-3*320px-2*24px-80px)]
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]
                   [scrollbar-width:none]"
      >
        {cards.map((card) => (
          <div
            key={card.es.title}
            className="flex-shrink-0 w-[300px] md:w-[320px] snap-start
                       bg-[#F5F5F7] rounded-3xl p-8 flex flex-col gap-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center
                            justify-center text-2xl shadow-sm">
              {card.icon}
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-['Outfit'] font-semibold text-[#1D1D1F]">
                {t(card.es.title, card.en.title)}
              </h3>
              <p className="text-[#86868B] font-['Instrument_Sans'] text-base leading-relaxed">
                {t(card.es.description, card.en.description)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
