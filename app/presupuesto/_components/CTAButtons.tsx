'use client'

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

export const WA_LINK = 'https://wa.me/34655517760?text=Hola%2C%20vi%20vuestro%20anuncio%20y%20quiero%20presupuesto%20para%20mi%20web'

function track(event: string) {
  window.gtag?.('event', event)
}

export function WAButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track('whatsapp_click')}
    >
      {children}
    </a>
  )
}

export function RegistroButton({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track('registro_click')}
    >
      {children}
    </a>
  )
}
