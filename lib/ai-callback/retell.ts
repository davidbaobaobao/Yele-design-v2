// Builds the dynamic variables the Ava conversation-flow agent expects and
// fires the outbound call through Retell.
//
// Variables (see the Ava flow spec): lead_name, business, plan, plan_price,
// lead_email, state, opener, vm_intro, david_available.

export type CallbackLead = {
  id: string
  name: string
  email: string
  phone_e164: string
  business: string | null
  plan: 'launch' | 'business' | 'pro' | null
  state: string
}

const PLAN_LABEL: Record<string, string> = { launch: 'Launch', business: 'Business', pro: 'Pro' }
// Spoken prices — the agent never has to turn digits into words.
const PLAN_PRICE_WORDS: Record<string, string> = {
  launch: 'six ninety-nine',
  business: 'eleven ninety-nine',
  pro: 'from twenty-seven ninety-nine',
}

export function firstNameOf(name: string): string {
  const f = (name ?? '').trim().split(/\s+/)[0] ?? ''
  return f && f.length <= 30 ? f : 'there'
}

// Is David reachable for a warm transfer right now? Barcelona hours, env
// override "9-22". AI_CALLBACK_TRANSFER=off disables transfers entirely.
export function davidAvailableNow(now: Date = new Date()): boolean {
  if ((process.env.AI_CALLBACK_TRANSFER ?? 'on') === 'off') return false
  const [startStr, endStr] = (process.env.DAVID_TRANSFER_HOURS ?? '9-22').split('-')
  const start = Number(startStr), end = Number(endStr)
  const hour = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'Europe/Madrid' }).format(now)) % 24
  return hour >= start && hour < end
}

export function buildDynamicVariables(lead: CallbackLead): Record<string, string> {
  const first = firstNameOf(lead.name)
  const isCA = lead.state === 'CA'
  const business = lead.business?.trim() || 'your business'
  const plan = lead.plan ? PLAN_LABEL[lead.plan] : ''
  const opener = isCA
    ? `Hi, is this ${first}? This is Ava, the AI assistant at Yele website design. You just sent a request for a new website — do you have one minute?`
    : `Hi, is this ${first}? This is Ava, I'm calling from Yele website design. You just sent a request for a new website — do you have one minute?`
  return {
    lead_name: first,
    business,
    plan,
    plan_price: lead.plan ? PLAN_PRICE_WORDS[lead.plan] : '',
    lead_email: lead.email,
    state: lead.state || 'UNKNOWN',
    opener,
    vm_intro: isCA ? 'Ava, the AI assistant from Yele website design' : 'Ava from Yele website design',
    david_available: davidAvailableNow() ? 'true' : 'false',
  }
}

export type RetellCallResult = { ok: true; call_id: string } | { ok: false; status: number; error: string }

export async function createRetellCall(lead: CallbackLead): Promise<RetellCallResult> {
  const apiKey = process.env.RETELL_API_KEY
  const from = process.env.RETELL_FROM_NUMBER
  if (!apiKey || !from) return { ok: false, status: 0, error: 'RETELL_API_KEY / RETELL_FROM_NUMBER not set' }

  const body: Record<string, unknown> = {
    from_number: from,
    to_number: lead.phone_e164,
    retell_llm_dynamic_variables: buildDynamicVariables(lead),
    metadata: { lead_id: lead.id, source: 'letsbuild_ai_callback' },
  }
  if (process.env.RETELL_AGENT_ID) body.override_agent_id = process.env.RETELL_AGENT_ID

  const res = await fetch('https://api.retellai.com/v2/create-phone-call', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) return { ok: false, status: res.status, error: await res.text() }
  const json = await res.json()
  return { ok: true, call_id: String(json.call_id) }
}
