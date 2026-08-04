export type GoalId = 'statement' | 'sell' | 'both'
export type StyleId = 'minimal' | 'bold' | 'elegant' | 'playful' | 'dark' | 'warm'
export type ColorId = 'mono' | 'earth' | 'cool' | 'vibrant' | 'pastel' | 'moody' | 'yele'
export type PlanId = 'starter' | 'pro' | 'frontier' | 'not_sure'
export type UpdateOftenId =
  | 'menu'
  | 'offers'
  | 'gallery'
  | 'services'
  | 'blog'
  | 'team'
  | 'events'
  | 'reviews'
  | 'nothing'
export type FunctionalityId =
  | 'contact_form'
  | 'custom_email'
  | 'booking'
  | 'payments'
  | 'blog'
  | 'ai_chat'
  | 'ai_phone'
  | 'marketing'
export type HoursPreset = 'weekdays' | 'all_week' | 'appointment'
export type HoursMode = 'preset' | 'custom' | 'google' | ''
export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface LinksAnswers {
  website: string
  googleBusiness: string
  instagram: string
  facebook: string
  yelp: string
  other: string
}

export interface ServiceRow {
  name: string
  price: string
}

export interface AddressAnswers {
  hasPhysical: boolean
  line1: string
  city: string
  state: string
  zip: string
}

export interface DayHours {
  closed: boolean
  open: string
  close: string
}

export interface HoursAnswers {
  mode: HoursMode
  preset: HoursPreset | ''
  custom: Record<DayKey, DayHours>
}

export interface SurveyAnswers {
  name: string
  company: string
  email: string
  phone: string
  planInterest: PlanId | ''
  goal: GoalId | ''
  styles: StyleId[]
  colors: ColorId[]
  business: string
  sells: string
  links: LinksAnswers
  noWebPresence: boolean
  services: ServiceRow[]
  servicesFromLinks: boolean
  address: AddressAnswers
  hours: HoursAnswers
  // Preset UpdateOftenId values, plus free-form "custom:<text>" entries from
  // the step 12 "Other — add your own" flow — string[] rather than
  // UpdateOftenId[] so those aren't a type error.
  updateOften: string[]
  functionality: FunctionalityId[]
  logoUrl: string
  photoUrls: string[]
  needsBranding: boolean
  usePhotosFromLinks: boolean
  noGoodPhotos: boolean
}

export const DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
export const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

function emptyDayHours(): DayHours {
  return { closed: false, open: '09:00', close: '17:00' }
}

export const EMPTY_ANSWERS: SurveyAnswers = {
  name: '',
  company: '',
  email: '',
  phone: '',
  planInterest: '',
  goal: '',
  styles: [],
  colors: [],
  business: '',
  sells: '',
  links: { website: '', googleBusiness: '', instagram: '', facebook: '', yelp: '', other: '' },
  noWebPresence: false,
  services: [],
  servicesFromLinks: false,
  address: { hasPhysical: true, line1: '', city: '', state: '', zip: '' },
  hours: {
    mode: '',
    preset: '',
    custom: {
      mon: emptyDayHours(),
      tue: emptyDayHours(),
      wed: emptyDayHours(),
      thu: emptyDayHours(),
      fri: emptyDayHours(),
      sat: { ...emptyDayHours(), closed: true },
      sun: { ...emptyDayHours(), closed: true },
    },
  },
  updateOften: [],
  functionality: [],
  logoUrl: '',
  photoUrls: [],
  needsBranding: false,
  usePhotosFromLinks: false,
  noGoodPhotos: false,
}

// ── Step 3 — plan interest ──────────────────────────────────────────────
export const PLAN_OPTIONS: { id: PlanId; title: string; price: string; description: string }[] = [
  { id: 'starter', title: 'Starter', price: '$99/mo', description: 'Website, SEO, custom email' },
  { id: 'pro', title: 'Pro', price: '$169/mo', description: 'Everything in Starter + branding, payments, bookings' },
  { id: 'frontier', title: 'Frontier', price: '$699/mo', description: 'Everything in Pro + marketing, Google Ads, AI tools' },
  { id: 'not_sure', title: 'Not sure yet', price: '', description: 'Show me everything — help me decide' },
]

// ── Step 4 — goal ────────────────────────────────────────────────────────
export const GOAL_OPTIONS: { id: GoalId; title: string; description: string }[] = [
  { id: 'statement', title: 'Make a statement', description: 'Bold, unforgettable, jaw-dropping' },
  { id: 'sell', title: 'Sell & convert', description: 'Classy, professional, straight to the point' },
  { id: 'both', title: 'Both / middle ground', description: 'Beautiful and built to sell' },
]

// ── Step 5 — style ───────────────────────────────────────────────────────
export const STYLE_OPTIONS: { id: StyleId; label: string; swatch: string[] }[] = [
  { id: 'minimal', label: 'Minimal & clean', swatch: ['#FFFFFF', '#E8E6E1', '#16161A'] },
  { id: 'bold', label: 'Bold & vibrant', swatch: ['#FF3B3B', '#FFD23B', '#3BB8FF'] },
  { id: 'elegant', label: 'Elegant & luxury', swatch: ['#16161A', '#C9A96A', '#F2F0EB'] },
  { id: 'playful', label: 'Playful & friendly', swatch: ['#FFD6E8', '#FFEB99', '#B8F2E6'] },
  { id: 'dark', label: 'Dark & modern', swatch: ['#0B0B10', '#2A2A35', '#D46FC8'] },
  { id: 'warm', label: 'Warm & organic', swatch: ['#C9A66B', '#8B5E3C', '#E4D4B5'] },
]

// ── Step 6 — colours ─────────────────────────────────────────────────────
export const COLOR_OPTIONS: { id: ColorId; label: string; swatch: string[] }[] = [
  { id: 'mono', label: 'Monochrome B&W', swatch: ['#111111', '#FFFFFF'] },
  { id: 'earth', label: 'Warm earth tones', swatch: ['#8B5E3C', '#C9A66B', '#E4D4B5'] },
  { id: 'cool', label: 'Cool blues', swatch: ['#123C69', '#3E7CB1', '#AAD7D9'] },
  { id: 'vibrant', label: 'Vibrant & colourful', swatch: ['#FF3B3B', '#FFD23B', '#3BB8FF', '#8B3BFF'] },
  { id: 'pastel', label: 'Pastel & soft', swatch: ['#FFD6E8', '#D6E8FF', '#E8FFD6'] },
  { id: 'moody', label: 'Dark & moody', swatch: ['#0B0B10', '#2A2A35', '#4A4A5A'] },
  { id: 'yele', label: 'Let Yele decide', swatch: ['#D46FC8', '#7B8CDE'] },
]

// ── Step 11 — hours presets ──────────────────────────────────────────────
export const HOURS_PRESETS: { id: HoursPreset; label: string }[] = [
  { id: 'weekdays', label: 'Mon–Fri 9–5' },
  { id: 'all_week', label: '7 days a week' },
  { id: 'appointment', label: 'By appointment only' },
]

export const US_STATES: { code: string; name: string }[] = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' }, { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' }, { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' }, { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' }, { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' }, { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' }, { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' }, { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
]

// ── Step 12 — what changes often ────────────────────────────────────────
export const UPDATE_OFTEN_OPTIONS: { id: UpdateOftenId; label: string }[] = [
  { id: 'menu', label: 'Menu / price list' },
  { id: 'offers', label: 'Offers & promotions' },
  { id: 'gallery', label: 'Photo gallery' },
  { id: 'services', label: 'Services' },
  { id: 'blog', label: 'Blog / news' },
  { id: 'team', label: 'Team members' },
  { id: 'events', label: 'Events / schedule' },
  { id: 'reviews', label: 'Customer reviews' },
  { id: 'nothing', label: 'Nothing — set it and forget it' },
]

// Free-form step 12 entries are stored inline in the same jsonb array as
// "custom:<text>" so no DB migration is needed — these helpers are the only
// place that prefix is encoded/decoded.
const CUSTOM_PREFIX = 'custom:'

export function isCustomUpdateEntry(value: string): boolean {
  return value.startsWith(CUSTOM_PREFIX)
}

export function customUpdateText(value: string): string {
  return value.slice(CUSTOM_PREFIX.length)
}

export function makeCustomUpdateEntry(text: string): string {
  return `${CUSTOM_PREFIX}${text}`
}

// ── Step 13 — functionality ─────────────────────────────────────────────
export const FUNCTIONALITY_OPTIONS: { id: FunctionalityId; label: string; minPlan: PlanId }[] = [
  { id: 'contact_form', label: 'Contact form', minPlan: 'starter' },
  { id: 'custom_email', label: 'Custom email (you@yourbusiness.com)', minPlan: 'starter' },
  { id: 'booking', label: 'Online booking / appointments', minPlan: 'pro' },
  { id: 'payments', label: 'Accept payments online', minPlan: 'pro' },
  { id: 'blog', label: 'Blog', minPlan: 'pro' },
  { id: 'ai_chat', label: 'AI chat assistant', minPlan: 'frontier' },
  { id: 'ai_phone', label: 'AI phone assistant', minPlan: 'frontier' },
  { id: 'marketing', label: 'Google Ads / marketing', minPlan: 'frontier' },
]

const PLAN_RANK: Record<Exclude<PlanId, 'not_sure'>, number> = { starter: 0, pro: 1, frontier: 2 }

export function getFeatureBadge(minPlan: PlanId, planInterest: PlanId | ''): string {
  const planLabel = minPlan === 'starter' ? 'Starter' : minPlan === 'pro' ? 'Pro' : 'Frontier'
  if (!planInterest || planInterest === 'not_sure') return planLabel
  if (PLAN_RANK[minPlan as Exclude<PlanId, 'not_sure'>] <= PLAN_RANK[planInterest as Exclude<PlanId, 'not_sure'>]) {
    return '✓ in your plan'
  }
  return 'Upgrade'
}

export const TOTAL_STEPS = 14

export const SPLIT_STEPS = new Set([1, 2, 7, 8, 9, 10, 11, 14])
export const FULL_STEPS = new Set([3, 4, 5, 6, 12, 13])

export function stepMode(step: number): 'split' | 'full' {
  return SPLIT_STEPS.has(step) ? 'split' : 'full'
}

// ── Labels for email building ───────────────────────────────────────────
export function planLabel(id: string): string {
  return PLAN_OPTIONS.find((p) => p.id === id)?.title ?? id
}

export function goalLabel(id: string): string {
  return GOAL_OPTIONS.find((g) => g.id === id)?.title ?? id
}

export function styleLabels(ids: string[]): string[] {
  return ids.map((id) => STYLE_OPTIONS.find((s) => s.id === id)?.label ?? id)
}

export function colorLabels(ids: string[]): string[] {
  return ids.map((id) => COLOR_OPTIONS.find((c) => c.id === id)?.label ?? id)
}

export function updateOftenLabels(ids: string[]): string[] {
  return ids.map((id) => {
    if (isCustomUpdateEntry(id)) return customUpdateText(id)
    return UPDATE_OFTEN_OPTIONS.find((u) => u.id === id)?.label ?? id
  })
}

export function functionalityLabels(ids: string[]): string[] {
  return ids.map((id) => FUNCTIONALITY_OPTIONS.find((f) => f.id === id)?.label ?? id)
}

// ── URL helpers (step 9) ────────────────────────────────────────────────
export function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function hasAnyLink(links: LinksAnswers): boolean {
  return Object.values(links).some((v) => v.trim().length > 0)
}

// Still used to decide whether steps 10/11 show their "skip, pull from my
// links" shortcut buttons — a UI convenience, not a validation gate (both
// steps are fully optional either way).
export function needsManualEntry(a: SurveyAnswers): boolean {
  return a.noWebPresence || !hasAnyLink(a.links)
}

export function isEmailValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

// Soft check for the step 9 URL fields' inline hint — deliberately loose
// (just "looks like a domain"), since these never block navigation.
export function isUrlLikelyValid(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return true
  const normalized = normalizeUrl(trimmed)
  try {
    const { hostname } = new URL(normalized)
    return hostname.includes('.') && !hostname.endsWith('.')
  } catch {
    return false
  }
}

// Everything is optional except these 3 gates. Steps 4-14 (goal, styles,
// colours, business, sells, links, services, address/hours, update-often,
// functionality, uploads) are all freely skippable — their defaults are
// already save-safe empty values.
export function isStepValid(step: number, a: SurveyAnswers): boolean {
  switch (step) {
    case 1:
      return a.name.trim().length > 0 || a.company.trim().length > 0
    case 2: {
      const hasPhone = a.phone.trim().length > 0
      const emailTrim = a.email.trim()
      const hasValidEmail = emailTrim.length > 0 && isEmailValid(emailTrim)
      const emailEnteredButInvalid = emailTrim.length > 0 && !hasValidEmail
      if (emailEnteredButInvalid && !hasPhone) return false
      return hasValidEmail || hasPhone
    }
    case 3:
      return a.planInterest !== ''
    default:
      return true
  }
}
