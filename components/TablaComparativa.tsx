'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'

const rows = [
  {
    es: 'Tiempo hasta tener la web',
    en: 'Time to get your website',
    yele: { es: '3–5 días', en: '3–5 days' },
    agency: { es: '6–12 semanas', en: '6–12 weeks' },
    diy: { es: 'Semanas o meses', en: 'Weeks or months' },
  },
  {
    es: 'Precio mensual',
    en: 'Monthly cost',
    yele: { es: 'Desde €29', en: 'From €29' },
    agency: { es: '€1.000–€6.000 (proyecto)', en: '€1,000–€6,000 (project)' },
    diy: { es: 'Tiempo tuyo', en: 'Your time' },
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
    diy: true,
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
  if (value === false) return <X size={16} className="text-[#86868B] mx-auto" aria-label="No" />
  return (
    <span className="font-manrope text-sm font-bold text-white">
      {t(value.es, value.en)}
    </span>
  )
}

function OtherCell({ value }: { value: CellValue }) {
  const { t } = useLang()
  if (value === true) return <Check size={18} className="text-[#34C759] mx-auto" aria-label="Sí" />
  if (value === false) return <X size={18} className="text-[#86868B] mx-auto" aria-label="No" />
  return (
    <span className="font-manrope text-sm text-[#86868B]">
      {t(value.es, value.en)}
    </span>
  )
}

export default function TablaComparativa() {
  const { t } = useLang()

  return (
    <section className="py-24 md:py-32 bg-[#F5F5F7]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12"
        >
          <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
            {t('Comparativa', 'Comparison')}
          </span>
          <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-4">
            {t('¿Por qué no una agencia', 'Why not an agency')}<br />
            {t('o hacerlo tú mismo?', 'or DIY?')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="overflow-x-auto rounded-2xl border border-black/[0.06]"
        >
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="bg-white text-left font-manrope text-sm text-[#86868B] px-6 py-4 font-normal rounded-tl-2xl w-[40%]" />
                <th className="bg-[#1D1D1F] text-center px-4 py-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]" />
                    </span>
                    <span className="font-outfit font-semibold text-sm text-white">Yele</span>
                  </span>
                </th>
                <th className="bg-white text-center font-manrope text-sm text-[#86868B] px-4 py-4 font-normal">
                  {t('Agencia', 'Agency')}
                </th>
                <th className="bg-white text-center font-manrope text-sm text-[#86868B] px-4 py-4 font-normal rounded-tr-2xl">
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
        </motion.div>

      </div>
    </section>
  )
}
