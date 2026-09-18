'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { META_PIXEL_ID, hasMarketingConsent, CONSENT_UPDATED_EVENT } from '@/lib/metaPixel'

// Meta Pixel base code (fbq init + PageView) — mounted SITE-WIDE (app/
// layout.tsx) for full-funnel attribution, regardless of which page/ad
// platform a visitor lands on. Google's own gtag (also in app/layout.tsx)
// keeps firing independently — the two don't interact.
//
// Gated behind "Marketing" cookie consent (components/CookieBanner.tsx),
// which defaults to GRANTED the moment hasMarketingConsent() finds no
// stored preference yet (opt-out model — see lib/metaPixel.ts) rather than
// waiting for an explicit click, so this mounts on a visitor's very first
// paint. Unlike Clarity/gtag's own default-granted pattern, though, fbq has
// no live consent-mode API to revoke effects after the fact once the base
// script has loaded and set cookies — an explicit "Reject" click unmounts
// this (no further PageViews/events from it), but whatever already fired
// before that point can't be retroactively undone. That's expected for
// this implied-consent model, not a bug.
export default function MetaPixelScript() {
  const [consented, setConsented] = useState(false)
  const pathname = usePathname()
  // The base script's own inline code below already fires one PageView the
  // instant it first mounts — this ref stops the pathname-effect from
  // firing a redundant SECOND PageView for that same initial route, while
  // still catching every later SPA route change (client-side nav has no
  // full page load of its own to trigger a fresh fbq PageView otherwise).
  const isFirstPathnameRef = useRef(true)

  useEffect(() => {
    setConsented(hasMarketingConsent())
    const onUpdate = () => setConsented(hasMarketingConsent())
    window.addEventListener(CONSENT_UPDATED_EVENT, onUpdate)
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, onUpdate)
  }, [])

  useEffect(() => {
    if (!consented) return
    if (isFirstPathnameRef.current) {
      isFirstPathnameRef.current = false
      return
    }
    if (typeof window.fbq === 'function') window.fbq('track', 'PageView')
  }, [pathname, consented])

  if (!consented || !META_PIXEL_ID) return null

  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
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
