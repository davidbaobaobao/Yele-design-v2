'use client'

import Script from 'next/script'

export default function ClarityScript() {
  // TODO GDPR: cambiar `true` por el estado de consentimiento del CookieBanner
  // cuando queramos cumplir GDPR. Cambiar `true` por `hasConsent`.
  const clarityEnabled = true
  if (!clarityEnabled) return null

  return (
    <Script id="ms-clarity" strategy="lazyOnload">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "xhor841289");
      `}
    </Script>
  )
}
