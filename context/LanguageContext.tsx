'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Lang = 'es' | 'en' | 'zh'

interface LanguageContextType {
  lang: Lang
  toggleLang: () => void
  // Optional 3rd arg is Chinese; when missing, zh falls back to English.
  t: (es: string, en: string, zh?: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'es',
  toggleLang: () => {},
  t: (es) => es,
})

export function LanguageProvider({ children, initialLang = 'es' }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  // Toggle only flips ES↔EN (used on the ES/EN homepages); ZH pages don't toggle.
  const toggleLang = () => setLang(l => (l === 'es' ? 'en' : 'es'))
  const t = (es: string, en: string, zh?: string) => (lang === 'zh' ? (zh ?? en) : lang === 'es' ? es : en)

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
