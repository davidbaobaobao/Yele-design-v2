// Server-only Cal.com API v2 helpers for Yelebot's booking tools. Verified
// empirically against the live API (not just docs) before writing this —
// see the exact request/response shapes in the comments below each
// function. cal-api-version is version-locked PER ENDPOINT since Cal.com's
// versioning is per-route, not global; these two values are the ones
// confirmed working, not guesses.

const CAL_API_BASE = 'https://api.cal.com/v2'
const CAL_API_KEY = process.env.CAL_API_KEY
const CAL_EVENT_TYPE_ID = process.env.CAL_EVENT_TYPE_ID
const CAL_TIMEZONE = process.env.CAL_TIMEZONE || 'America/Los_Angeles'

// Returns the UTC offset (e.g. "-07:00") that `timeZone` observes on the day
// containing `date`, using Intl's own tz database rather than a hand-rolled
// DST table — so this stays correct across DST transitions without a date
// library dependency.
function utcOffsetFor(timeZone: string, date: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' }).formatToParts(date)
  const tzName = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+0'
  const match = tzName.match(/GMT([+-]\d+)(?::(\d+))?/)
  const hours = match ? parseInt(match[1], 10) : 0
  const minutes = match?.[2] ? parseInt(match[2], 10) : 0
  const sign = hours < 0 ? '-' : '+'
  return `${sign}${String(Math.abs(hours)).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

// Converts "the calendar day `dateISO` falls on, in `timeZone`" into a UTC
// start/end window. Naively using UTC day boundaries is wrong here — e.g. a
// UTC-day window for an LA date pulls in the previous LA evening's slots
// and misses the last few hours of the intended day (confirmed empirically:
// querying 2026-08-10T00:00:00Z..23:59:59Z against LA returned both
// 2026-08-09 evening AND 2026-08-10 slots).
function dayBoundsUTC(dateISO: string, timeZone: string): { startUTC: string; endUTC: string } {
  const datePart = dateISO.slice(0, 10)
  const offset = utcOffsetFor(timeZone, new Date(`${datePart}T12:00:00Z`))
  const startUTC = new Date(`${datePart}T00:00:00${offset}`).toISOString()
  const endUTC = new Date(`${datePart}T23:59:59${offset}`).toISOString()
  return { startUTC, endUTC }
}

export type AvailableSlotsResult = { slots: string[] } | { error: string }

// GET https://api.cal.com/v2/slots?eventTypeId=&start=&end=&timeZone=
// Headers: Authorization: Bearer <key>, cal-api-version: 2024-09-04
// Real response shape (verified live, matches Cal's docs):
//   { status: "success", data: { "<YYYY-MM-DD>": [{ start: "<ISO with
//     timeZone's own offset>" }, ...], ... } } — keyed by date, NOT a flat
//   array, and can include more than one date key if the window straddles
//   midnight in `timeZone`.
export async function getAvailableSlots({ dateISO }: { dateISO: string }): Promise<AvailableSlotsResult> {
  if (!CAL_API_KEY || !CAL_EVENT_TYPE_ID) {
    console.error('[cal] getAvailableSlots: missing CAL_API_KEY or CAL_EVENT_TYPE_ID')
    return { error: 'Cal.com is not configured.' }
  }

  try {
    const { startUTC, endUTC } = dayBoundsUTC(dateISO, CAL_TIMEZONE)
    const url = new URL(`${CAL_API_BASE}/slots`)
    url.searchParams.set('eventTypeId', CAL_EVENT_TYPE_ID)
    url.searchParams.set('start', startUTC)
    url.searchParams.set('end', endUTC)
    url.searchParams.set('timeZone', CAL_TIMEZONE)

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        'cal-api-version': '2024-09-04',
      },
    })
    const body = await res.json()
    console.log('[cal] GET /slots', { url: url.toString(), status: res.status, body })

    if (!res.ok) {
      return { error: `Cal.com slots error (${res.status}): ${JSON.stringify(body)}` }
    }

    const data: Record<string, { start?: string }[]> = body?.data ?? {}
    const slots = Object.values(data)
      .flat()
      .map((s) => s?.start)
      .filter((s): s is string => typeof s === 'string')
      .sort()

    return { slots }
  } catch (err) {
    console.error('[cal] getAvailableSlots error', err)
    return { error: 'Could not check availability right now.' }
  }
}

export type CreateBookingResult =
  | { success: true; startISO: string; bookingId: number; bookingUid: string; meetLink?: string }
  | { success: false; error: string }

// POST https://api.cal.com/v2/bookings
// Headers: Authorization: Bearer <key>, cal-api-version: 2024-08-13
// Body: { eventTypeId, start, attendee: { name, email, timeZone },
//          bookingFieldsResponses: { notes } }
// Real success response shape (verified live, HTTP 201):
//   { status: "success", data: { id, uid, start, end, duration, status,
//     meetingUrl, location, eventType: {...}, attendees: [...], ... } }
// `location`/`meetingUrl` is a Cal Video link (app.cal.com/video/<uid>) for
// this event type, NOT Google Meet — that's an event-type setting on Cal's
// side, not something this call controls.
// Real failure shape (verified live, HTTP 400 on double-booking a slot):
//   { status: "error", error: { code, message, details } }
export async function createBooking({
  startISO,
  name,
  email,
  notes,
}: {
  startISO: string
  name: string
  email: string
  notes?: string
}): Promise<CreateBookingResult> {
  if (!CAL_API_KEY || !CAL_EVENT_TYPE_ID) {
    console.error('[cal] createBooking: missing CAL_API_KEY or CAL_EVENT_TYPE_ID')
    return { success: false, error: 'Cal.com is not configured.' }
  }

  try {
    const res = await fetch(`${CAL_API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        'cal-api-version': '2024-08-13',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventTypeId: Number(CAL_EVENT_TYPE_ID),
        start: startISO,
        attendee: { name, email, timeZone: CAL_TIMEZONE },
        ...(notes ? { bookingFieldsResponses: { notes } } : {}),
      }),
    })
    const body = await res.json()
    console.log('[cal] POST /bookings', { status: res.status, body })

    if (!res.ok) {
      const message = body?.error?.message || `Cal.com booking error (${res.status})`
      return { success: false, error: message }
    }

    const d = body?.data ?? {}
    const location = typeof d.location === 'string' ? d.location : d.meetingUrl
    return {
      success: true,
      startISO: d.start ?? startISO,
      bookingId: d.id,
      bookingUid: d.uid,
      meetLink: typeof location === 'string' && location.startsWith('http') ? location : undefined,
    }
  } catch (err) {
    console.error('[cal] createBooking error', err)
    return { success: false, error: 'Could not complete the booking right now.' }
  }
}
