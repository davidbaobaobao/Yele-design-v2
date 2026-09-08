// Called from /api/lead right after the discovery_leads insert. Normalises the
// phone, resolves state/timezone, stores the ai_callbacks row and schedules the
// QStash job that will dial via /api/ai-callback/fire after the delay.
//
// Never throws — a scheduling failure must not turn the form submit into an error.

import { createClient } from '@supabase/supabase-js'
import { qstashClient, QSTASH_BASE_URL } from './qstash'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { lookupArea } from './areacodes'

export const DEFAULT_DELAY_SECONDS = Number(process.env.AI_CALLBACK_DELAY_SECONDS ?? 300) // 5 min

// AI_CALLBACK_TEST_NUMBERS: comma-separated E.164 numbers (e.g. "+34655517760")
// that may be dialled even though they are not US — for testing only. Retell
// must have international calling enabled for a non-US test number to connect.
export function testNumbers(): Set<string> {
  return new Set((process.env.AI_CALLBACK_TEST_NUMBERS ?? '').split(',').map(s => s.trim()).filter(Boolean))
}

export function isTestNumber(e164: string): boolean {
  return testNumbers().has(e164)
}

// Returns E.164 only for a VALID US (or Puerto Rico) number — anything else
// (Spanish numbers, typos, too few digits, invalid area codes) → null → no call.
// Test numbers from AI_CALLBACK_TEST_NUMBERS are the one exception.
export function normaliseUsPhone(raw: string | null | undefined): string | null {
  if (!raw) return null
  const str = String(raw).trim()
  // Test allowlist: accept any valid number that is explicitly listed.
  const asIntl = parsePhoneNumberFromString(str)
  if (asIntl?.isValid() && isTestNumber(asIntl.number)) return asIntl.number

  const pn = parsePhoneNumberFromString(str, 'US')
  if (!pn || !pn.isValid()) return null
  if (pn.country !== 'US' && pn.country !== 'PR') return null
  return pn.number // E.164
}

export function planFromPackageInterest(packageInterest: unknown): 'launch' | 'business' | 'pro' | null {
  if (!Array.isArray(packageInterest) || packageInterest.length !== 1) return null
  const p = String(packageInterest[0])
  if (/^Launch/i.test(p)) return 'launch'
  if (/^Business/i.test(p)) return 'business'
  if (/^Pro/i.test(p)) return 'pro'
  return null
}

export type ScheduleInput = {
  name: string
  email: string
  phone: string | null | undefined
  business: string | null
  plan: 'launch' | 'business' | 'pro' | null
  leadSource: string | null
  discoveryLeadId: string | null
  consentText: string
  consentIp: string | null
}

export async function scheduleAiCallback(input: ScheduleInput): Promise<{ scheduled: boolean; reason?: string; id?: string }> {
  try {
    if ((process.env.AI_CALLBACK_ENABLED ?? 'false') !== 'true') return { scheduled: false, reason: 'disabled' }

    const phone_e164 = normaliseUsPhone(input.phone)
    if (!phone_e164) return { scheduled: false, reason: 'no valid US phone' }

    const isTest = isTestNumber(phone_e164)
    // Test numbers: no area-code lookup; treat as Spain so the window check
    // runs against Europe/Madrid and the CA disclosure branch is off.
    const area = isTest
      ? { state: 'TEST', tz: 'Europe/Madrid', dialable: true }
      : lookupArea(phone_e164)
    if (!area.dialable) return { scheduled: false, reason: 'non-geographic number' }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yele.design'
    const qstashToken = process.env.QSTASH_TOKEN
    if (!qstashToken) return { scheduled: false, reason: 'QSTASH_TOKEN not set' }

    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Dedupe: same phone submitted twice within 24h → don't dial twice.
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    const { data: dup } = await supabaseAdmin
      .from('ai_callbacks')
      .select('id')
      .eq('phone_e164', phone_e164)
      .gte('created_at', since)
      .limit(1)
    if (dup && dup.length) return { scheduled: false, reason: 'duplicate within 24h' }

    const { data: row, error } = await supabaseAdmin
      .from('ai_callbacks')
      .insert({
        discovery_lead_id: input.discoveryLeadId,
        name: input.name,
        email: input.email,
        phone_e164,
        business: input.business,
        plan: input.plan,
        state: area.state,
        tz: area.tz,
        lead_source: input.leadSource,
        consent_at: new Date().toISOString(),
        consent_ip: input.consentIp,
        consent_text: input.consentText,
        status: 'scheduled',
        scheduled_for: new Date(Date.now() + DEFAULT_DELAY_SECONDS * 1000).toISOString(),
      })
      .select('id')
      .single()
    if (error || !row) return { scheduled: false, reason: `db: ${error?.message}` }

    // Publish the delayed job. If this fails the row must NOT stay 'scheduled'
    // — an orphan row with no QStash message looks like a pending call that
    // will never fire. Mark it 'error' with the reason so it is visible in the
    // table (and in /api/ai-callback/debug).
    try {
      const qstash = qstashClient()
      const published = await qstash.publishJSON({
        url: `${baseUrl}/api/ai-callback/fire`,
        body: { lead_id: row.id },
        delay: DEFAULT_DELAY_SECONDS,
        retries: 3,
        deduplicationId: `ai-callback-${row.id}`,
      })
      const messageId = Array.isArray(published) ? published[0]?.messageId : published?.messageId
      await supabaseAdmin.from('ai_callbacks').update({ qstash_message_id: messageId ?? null }).eq('id', row.id)
      return { scheduled: true, id: row.id }
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      console.error('[ai-callback] qstash publish failed', reason, 'baseUrl', QSTASH_BASE_URL)
      await supabaseAdmin
        .from('ai_callbacks')
        .update({ status: 'error', last_error: `qstash publish (${QSTASH_BASE_URL}): ${reason}`.slice(0, 500) })
        .eq('id', row.id)
      return { scheduled: false, reason: `qstash publish: ${reason}` }
    }
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    console.error('[ai-callback] schedule error', reason)
    return { scheduled: false, reason: `exception: ${reason}` }
  }
}
