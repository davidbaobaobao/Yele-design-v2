'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'

const rows = [
  {
    es: 'Tiempo hasta tener la web',
    en: 'Time to get your website',
    yele: { es: '1 semana', en: '1 week' },
    agency: { es: '6–12 semanas', en: '6–12 weeks' },
    diy: { es: 'Semanas o meses', en: 'Weeks or months' },
  },
  {
    es: 'Coste',
    en: 'Cost',
    yele: { es: '$99 al mes', en: '$99/month' },
    agency: { es: '$3.000–$20.000', en: '$3,000–$20,000' },
    diy: { es: '$30-300/mes + tu tiempo', en: '$30-300/month + your time' },
  },
  {
    es: 'Mantenimiento incluido',
    en: 'Maintenance included',
    yele: true,
    agency: false,
    diy: { es: '✓ si sabes cómo', en: '✓ if you know how' },
  },
  {
    es: 'Diseño profesional',
    en: 'Professional design',
    yele: true,
    agency: true,
    diy: { es: 'Depende', en: 'Depends' },
  },
  {
    es: 'Sin conocimientos técnicos',
    en: 'No technical skills needed',
    yele: true,
    agency: true,
    diy: false,
  },
  {
    es: 'Cambios de contenido',
    en: 'Content updates',
    yele: { es: 'Instantáneo', en: 'Instant' },
    agency: { es: 'Presupuesto aparte', en: 'Extra budget' },
    diy: { es: 'Tú mismo', en: 'DIY' },
  },
  {
    es: 'Sin permanencia',
    en: 'No lock-in',
    yele: true,
    agency: false,
    diy: false,
  },
]

type CellValue = boolean | { es: string; en: string }

function YeleCell({ value }: { value: CellValue }) {
  const { t } = useLang()
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1 bg-[#34C759]/10 text-[#34C759] text-xs font-manrope font-medium px-2.5 py-1 rounded-full">
        <Check size={11} strokeWidth={2.5} aria-hidden="true" />
        {t('Sí', 'Yes')}
      </span>
    )
  }
  if (value === false) return <X size={16} className="text-[#6B7280] mx-auto" aria-label="No" />
  return (
    <span className="font-manrope text-sm font-bold text-[#1D1D1F]">
      {t(value.es, value.en)}
    </span>
  )
}

function OtherCell({ value }: { value: CellValue }) {
  const { t } = useLang()
  if (value === true) return <Check size={18} className="text-[#34C759] mx-auto" aria-label="Sí" />
  if (value === false) return <X size={18} className="text-[#6B7280] mx-auto" aria-label="No" />
  return (
    <span className="font-manrope text-sm text-[#6B7280]">
      {t(value.es, value.en)}
    </span>
  )
}

export default function TablaComparativa({
  headingLine1,
  headingLine2,
  agencyLabel,
  noBg,
}: {
  headingLine1?: string
  headingLine2?: string
  agencyLabel?: string
  noBg?: boolean
} = {}) {
  const { t } = useLang()

  return (
    <section className={`pt-10 md:pt-14 pb-24 md:pb-32 ${noBg ? '' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12"
        >
          <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-4">
            {headingLine1 ?? t('¿Por qué no una agencia', 'Why not an agency')}<br />
            {headingLine2 ?? t('o hacerlo tú mismo?', 'or DIY?')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
        >
        <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="bg-white text-left font-manrope text-sm text-[#6B7280] px-6 py-4 font-normal rounded-tl-2xl w-[40%]" />
                <th className="bg-[#1D1D1F] text-center px-4 py-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]" />
                    </span>
                    <span className="font-outfit font-semibold text-sm text-white">Yele</span>
                  </span>
                </th>
                <th className="bg-white text-center font-manrope text-sm text-[#6B7280] px-4 py-4 font-normal">
                  {agencyLabel ?? t('Agencia', 'Agency')}
                </th>
                <th className="bg-white text-center font-manrope text-sm text-[#6B7280] px-4 py-4 font-normal rounded-tr-2xl">
                  {t('Tú mismo (DIY)', 'You (DIY)')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={i}
                  className={`border-t border-black/[0.06] group ${i % 2 === 0 ? 'bg-[#F5F5F7]' : 'bg-white'}`}
                  whileHover="hover"
                >
                  <motion.td
                    className="px-6 py-4 font-manrope text-sm text-[#1D1D1F] relative"
                    variants={{ hover: { x: 4 } }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#1D1D1F] rounded-r"
                      variants={{ hover: { opacity: 1, scaleY: 1 } }}
                      initial={{ opacity: 0, scaleY: 0 }}
                      style={{ originY: 0.5 }}
                      transition={{ duration: 0.2 }}
                    />
                    {t(row.es, row.en)}
                  </motion.td>
                  <motion.td
                    className="px-4 py-4 text-center bg-[#1D1D1F]/[0.03]"
                    variants={{ hover: { backgroundColor: 'rgba(29,29,31,0.07)' } }}
                    transition={{ duration: 0.2 }}
                  >
                    <YeleCell value={row.yele as CellValue} />
                  </motion.td>
                  <td className="px-4 py-4 text-center">
                    <OtherCell value={row.agency as CellValue} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <OtherCell value={row.diy as CellValue} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile scroll hint */}
        <motion.div
          className="md:hidden flex items-center justify-center gap-2 mt-4"
          animate={{ x: [0, -7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" />
          </svg>
          <span className="font-manrope text-xs text-[#9CA3AF]">Desliza para explorar</span>
        </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
