'use client'

import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'

// Default 30-min meeting — swap to "yeledesign/15min" here if a shorter
// slot is ever needed instead.
const CAL_LINK = 'yeledesign/30min'

export default function ScheduleClient() {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi()
      cal('ui', { theme: 'dark', styles: { branding: { brandColor: '#D46FC8' } } })
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
