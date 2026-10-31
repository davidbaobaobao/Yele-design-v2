// Shared lead submission for the /nuevoproyecto (Siguiente Nivel) landing.
// The three forms in DesktopLanding/MobileLanding call this from their
// onSubmit handlers — same backend (/api/lead), consent gating and Meta
// Lead-event dedup as components/letsbuild/BuildLeadForm.tsx, so this ad
// landing reports conversions identically to the rest of the funnel.
import { trackMetaLead, getMetaCookies, hasMarketingConsent } from '@/lib/metaPixel'
import { trackOnboardingFormSubmit } from '@/lib/gtag'

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface SiguienteLeadFields {
  name?: string
  email?: string
  phone?: string
  company?: string
  businessName?: string
  currentWebsite?: string
  needs?: string[]
  packageInterest?: string[]
  timeline?: string
}

// Best-effort: posts the lead and fires the Meta Lead event (+ gtag) when the
// minimum fields are valid. Returns true on a successful POST. Never throws —
// the UI flips to "Recibido ✓" optimistically regardless, so a network blip
// never traps the visitor, but a blank/invalid email sends nothing (no junk
// lead, no pixel fire).
export async function submitSiguienteNivelLead(fields: SiguienteLeadFields): Promise<boolean> {
  const name = (fields.name || '').trim()
  const email = (fields.email || '').trim()
  if (!name || !EMAIL_RE.test(email)) return false

  const eventId = uuid()
  const cookies = getMetaCookies()

  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone: fields.phone || '',
        company: fields.company || '',
        businessName: fields.businessName || '',
        currentWebsite: fields.currentWebsite || '',
        needs: fields.needs || [],
        packageInterest: fields.packageInterest || [],
        timeline: fields.timeline || '',
        eventId,
        source: 'google',
        leadSource: 'Siguiente Nivel (ES)',
        welcome: true,
        locale: 'es',
        fbc: cookies.fbc,
        fbp: cookies.fbp,
        marketingConsent: hasMarketingConsent(),
      }),
    })
    if (!res.ok) return false
    trackMetaLead(eventId, { email, phone: fields.phone, name })
    trackOnboardingFormSubmit(email)
    return true
  } catch {
    return false
  }
}
