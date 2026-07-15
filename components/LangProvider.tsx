'use client'

import { LanguageProvider } from '@/context/LanguageContext'

export function EnLangProvider({ children }: { children: React.ReactNode }) {
  return <LanguageProvider initialLang="en">{children}</LanguageProvider>
}

export function EsLangProvider({ children }: { children: React.ReactNode }) {
  return <LanguageProvider initialLang="es">{children}</LanguageProvider>
}
