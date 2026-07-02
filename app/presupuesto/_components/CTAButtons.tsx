'use client'

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

export const WA_LINK = 'https://wa.me/34655517760?text=Hola%21%20Me%20interesar%C3%ADa%20que%20me%20explicaras%20m%C3%A1s%20sobre%20Yele%20y%20vuestras%20paginas%20webs'

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
