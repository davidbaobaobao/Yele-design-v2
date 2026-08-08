'use client'

import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { trackBookCall } from '@/lib/gtag'

// Default 30-min meeting — swap to "yeledesign/15min" here if a shorter
// slot is ever needed instead.
const CAL_LINK = 'yeledesign/30min'

export default function ScheduleClient() {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi()
      cal('ui', { theme: 'dark', styles: { branding: { brandColor: '#D46FC8' } } })

      // book_call conversion — fires on the embed's own booking-confirmed
      // event, not a button click or time-slot selection. Using the
      // deprecated `bookingSuccessful` (not `bookingSuccessfulV2`)
      // deliberately: V2 deliberately strips attendee data down to just
      // booking metadata, while this one still carries the raw `booking`
      // object with the attendee's email for Enhanced Conversions.
      let fired = false
      cal('on', {
        action: 'bookingSuccessful',
        callback: e => {
          // TEMP: confirms the real path to the attendee email for this
          // Cal embed version — check the browser console on a real test
          // booking, adjust the `booking` cast below if needed, then
          // delete this log.
          console.log('[cal] bookingSuccessful payload:', e.detail)
          if (fired) return
          fired = true
          // e.detail.data.booking is typed `unknown` by @calcom/embed-core
          // itself (it's the raw Cal.com booking object, not narrowed) —
          // shape confirmed against lib/cal.ts's own createBooking()
          // response (attendees: [{ email, ... }]).
          const booking = e.detail.data.booking as { attendees?: { email?: string }[] } | undefined
          trackBookCall(booking?.attendees?.[0]?.email)
        },
      })
    })()
  }, [])

  return (
    <main className="min-h-screen bg-[#0D0E12] text-white flex flex-col">
      <div className="px-6 pt-16 pb-6 text-center md:pt-20">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Let&apos;s talk — book a call</h1>
        <p className="mt-3 font-body text-sm text-white/60 md:text-base">
          Pick a time that works for you — 30 minutes, no pressure.
        </p>
      </div>
      <Cal
        calLink={CAL_LINK}
        style={{ width: '100%', height: '100%', overflow: 'scroll' }}
        config={{ theme: 'dark' }}
      />
    </main>
  )
}
