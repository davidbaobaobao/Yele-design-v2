'use client'

import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { trackBookCall } from '@/lib/gtag'

// Same 30-min event as /schedule. Cal auto-detects the visitor's own
// timezone and shows slots in it — nothing to configure here for that.
const CAL_LINK = 'yeledesign/30min'

// Inline Cal.com booking widget for /received. Light theme to sit on the
// white page, brand pink accent, and the attendee's name/email prefilled
// from the lead form so they don't retype. Fires the same book_call
// conversion as the standalone /schedule page.
export default function ReceivedCalEmbed({ name = '', email = '' }: { name?: string; email?: string }) {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi()
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
    <Cal
      calLink={CAL_LINK}
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
      config={{
        theme: 'light',
        // Prefill so the booker skips re-entering their details.
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
      }}
    />
  )
}
