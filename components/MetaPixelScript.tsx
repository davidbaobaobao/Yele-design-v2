'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { META_PIXEL_ID, hasMarketingConsent, CONSENT_UPDATED_EVENT } from '@/lib/metaPixel'

// Meta Pixel base code (fbq init + PageView) — mounted ONLY on /newwebsite
// (see that page), not in the root layout, since Google's own tag already
// runs everywhere else and this page must stay Meta-exclusive.
//
// Gated behind explicit "Marketing" cookie consent (components/
// CookieBanner.tsx) rather than the implied-consent-by-default pattern
// Google Ads/Clarity use in app/layout.tsx — fbq has no live consent-mode
// API to revoke effects after the fact once the base script has loaded and
// set cookies, so this simply doesn't mount until consent is granted, and
// starts the moment it is (via the CONSENT_UPDATED_EVENT the banner
// dispatches) without needing a reload.
export default function MetaPixelScript() {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    setConsented(hasMarketingConsent())
    const onUpdate = () => setConsented(hasMarketingConsent())
    window.addEventListener(CONSENT_UPDATED_EVENT, onUpdate)
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, onUpdate)
  }, [])

  if (!consented || !META_PIXEL_ID) return null

  return (
    <>
      <Script id="meta-pixel-newwebsite" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      {/* Standard Meta Pixel noscript fallback for JS-disabled browsers. */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- Meta's own tracking pixel, not a Next-optimizable image */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
