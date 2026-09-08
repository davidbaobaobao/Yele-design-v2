// Legal calling window for the AI callback, evaluated in the LEAD's local time.
//
// Federal TCPA: 8:00–21:00 local. We use 9:00–20:00 (stricter than any state
// hour rule — e.g. Florida's 8–20), no Sundays, no US federal holidays
// (several states — LA, RI, UT, AL, MS, SD… — restrict Sunday/holiday calls,
// so one rule covers all of them). Saturday is allowed.
//
// UNKNOWN timezone (area code not mapped): the instant must be inside the
// window in BOTH Eastern and Pacific, i.e. effectively 12:00–20:00 ET.

export const WINDOW_START_HOUR = Number(process.env.AI_CALLBACK_WINDOW_START ?? 9)   // inclusive
export const WINDOW_END_HOUR = Number(process.env.AI_CALLBACK_WINDOW_END ?? 20)      // exclusive
const RESCHEDULE_MINUTE = 5 // fire at HH:05 so a few leads don't all dial at 9:00:00

type LocalParts = { y: number; m: number; d: number; h: number; min: number; wd: number } // wd: 0=Sun

function localParts(tz: string, date: Date): LocalParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', weekday: 'short',
  }).formatToParts(date)
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  const wdMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return {
    y: Number(get('year')), m: Number(get('month')), d: Number(get('day')),
    h: Number(get('hour')) % 24, min: Number(get('minute')), wd: wdMap[get('weekday')] ?? 1,
  }
}

// Offset (ms) of tz relative to UTC at the given instant.
function tzOffsetMs(tz: string, date: Date): number {
  const p = localParts(tz, date)
  const asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min)
  const truncated = Math.floor(date.getTime() / 60000) * 60000
  return asUtc - truncated
}

// Local wall-clock (y,m,d,h,min) in tz → UTC epoch ms.
function localToUtc(tz: string, y: number, m: number, d: number, h: number, min: number): number {
  const guess = Date.UTC(y, m - 1, d, h, min)
  const off1 = tzOffsetMs(tz, new Date(guess))
  const t1 = guess - off1
  const off2 = tzOffsetMs(tz, new Date(t1)) // re-check across a DST boundary
  return guess - off2
}

function nthWeekdayOfMonth(y: number, m: number, weekday: number, n: number): number {
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay()
  return 1 + ((weekday - first + 7) % 7) + (n - 1) * 7
}
function lastWeekdayOfMonth(y: number, m: number, weekday: number): number {
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const lastWd = new Date(Date.UTC(y, m - 1, lastDay)).getUTCDay()
  return lastDay - ((lastWd - weekday + 7) % 7)
}
// Fixed-date holidays observed on Friday/Monday when they fall on a weekend.
function observed(y: number, m: number, d: number): [number, number] {
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  const dt = new Date(Date.UTC(y, m - 1, d + (wd === 6 ? -1 : wd === 0 ? 1 : 0)))
  return [dt.getUTCMonth() + 1, dt.getUTCDate()]
}

export function isUsFederalHoliday(y: number, m: number, d: number): boolean {
  const fixed: [number, number][] = [
    observed(y, 1, 1),    // New Year's Day
    observed(y, 6, 19),   // Juneteenth
    observed(y, 7, 4),    // Independence Day
    observed(y, 11, 11),  // Veterans Day
    observed(y, 12, 25),  // Christmas
  ]
  const floating: [number, number][] = [
    [1, nthWeekdayOfMonth(y, 1, 1, 3)],   // MLK — 3rd Mon Jan
    [2, nthWeekdayOfMonth(y, 2, 1, 3)],   // Presidents — 3rd Mon Feb
    [5, lastWeekdayOfMonth(y, 5, 1)],     // Memorial — last Mon May
    [9, nthWeekdayOfMonth(y, 9, 1, 1)],   // Labor — 1st Mon Sep
    [10, nthWeekdayOfMonth(y, 10, 1, 2)], // Columbus — 2nd Mon Oct
    [11, nthWeekdayOfMonth(y, 11, 4, 4)], // Thanksgiving — 4th Thu Nov
  ]
  return [...fixed, ...floating].some(([hm, hd]) => hm === m && hd === d)
}

function insideWindowIn(tz: string, at: Date): boolean {
  const p = localParts(tz, at)
  if (p.wd === 0) return false
  if (isUsFederalHoliday(p.y, p.m, p.d)) return false
  return p.h >= WINDOW_START_HOUR && p.h < WINDOW_END_HOUR
}

export function isInsideCallingWindow(tz: string | null | undefined, at: Date = new Date()): boolean {
  if (!tz || tz === 'UNKNOWN') {
    return insideWindowIn('America/New_York', at) && insideWindowIn('America/Los_Angeles', at)
  }
  return insideWindowIn(tz, at)
}

// Next instant (UTC ms) at WINDOW_START:05 local on the next allowed day.
export function nextCallingWindowStart(tz: string | null | undefined, from: Date = new Date()): number {
  const zone = !tz || tz === 'UNKNOWN' ? 'America/Los_Angeles' : tz // PT 9:05 is 12:05 ET → inside both
  const p = localParts(zone, from)
  for (let i = 0; i < 14; i++) {
    const day = new Date(Date.UTC(p.y, p.m - 1, p.d + i))
    const y = day.getUTCFullYear(), m = day.getUTCMonth() + 1, d = day.getUTCDate()
    const wd = day.getUTCDay()
    if (wd === 0 || isUsFederalHoliday(y, m, d)) continue
    const candidate = localToUtc(zone, y, m, d, WINDOW_START_HOUR, RESCHEDULE_MINUTE)
    if (candidate > from.getTime()) return candidate
  }
  return from.getTime() + 24 * 3600 * 1000
}

// Seconds to wait before it is legal to dial (0 if now is fine).
export function secondsUntilCallable(tz: string | null | undefined, from: Date = new Date()): number {
  if (isInsideCallingWindow(tz, from)) return 0
  return Math.max(60, Math.ceil((nextCallingWindowStart(tz, from) - from.getTime()) / 1000))
}
