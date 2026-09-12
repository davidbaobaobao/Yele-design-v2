'use client'

import { useEffect, useState } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { trackBookCall } from '@/lib/gtag'

// Same 30-min event as /schedule. Cal auto-detects the visitor's own
// timezone and shows slots in it — nothing to configure here for that.
const CAL_LINK = 'yeledesign/30min'

// Inline Cal.com booking widget for /received. Light theme to sit on the
// white page, brand pink accent, and the attendee's name/email prefilled
// from the lead form so they don't retype. Fires the same book_call
// conversion as the standalone /schedule page.
//
// Mobile vs desktop:
//  - Desktop: boxed, fixed height (parent constrains it), scrolls inside.
//  - Mobile: no fixed height — the embed auto-resizes to its full content
//    height so every time slot is visible, and the PAGE scrolls (not the
//    widget), because there's nothing to scroll inside it.
export default function ReceivedCalEmbed({ name = '', email = '' }: { name?: string; email?: string }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi()
      // Warm the booking page (iframe + its assets) as early as possible so
      // the widget paints faster once React mounts it.
      cal('preload', { calLink: CAL_LINK })
      cal('ui', { theme: 'light', styles: { branding: { brandColor: '#D46FC8' } } })

      let fired = false
      cal('on', {
        action: 'bookingSuccessful',
        callback: e => {
          if (fired) return
          fired = true
          const booking = e.detail.data.booking as { attendees?: { email?: string }[] } | undefined
          trackBookCall(booking?.attendees?.[0]?.email)
        },
      })
    })()
  }, [])

  return (
    <>
      {/* Preconnect to Cal's origin so the TLS handshake is already done by
          the time the embed requests the booking iframe. */}
      <link rel="preconnect" href="https://app.cal.com" />
      <link rel="preconnect" href="https://cal.com" />
      <Cal
        calLink={CAL_LINK}
        // Mobile: width only → the embed auto-grows to full content height
        // and the page scrolls. Desktop: fill the fixed-height parent box.
        style={
          isMobile
            ? { width: '100%' }
            : { width: '100%', height: '100%', overflow: 'auto' }
        }
        config={{
          theme: 'light',
          // Prefill so the booker skips re-entering their details.
          ...(name ? { name } : {}),
          ...(email ? { email } : {}),
        }}
      />
    </>
  )
}
