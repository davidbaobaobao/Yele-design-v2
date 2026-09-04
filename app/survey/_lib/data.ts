// Kept for the existing DB column + downstream email/admin code that still
// reads it (app/api/survey/route.ts, app/api/survey/abandoned/route.ts) —
// step 4 no longer collects it (see InvolvementId below, which replaced it
// in that slot), so this is only ever populated on rows submitted before
// that change.
export type GoalId = 'statement' | 'sell' | 'both'
// ── Step 4 (legacy) — design-process involvement. No longer shown in the
// survey UI — the final step slot now asks preferred communication channel
// instead (see PreferredChannelId below). Kept for the same reason as
// GoalId above: existing DB rows + the completion email still read it.
export type InvolvementId = 'hands_on' | 'balanced' | 'hands_off'
// ── Final step — preferred communication channel ─────────────────────────
export type PreferredChannelId = 'email' | 'phone'
export type StyleId = 'minimalism' | 'swiss' | 'bento' | 'editorial' | 'luxury' | 'dark' | 'neobrutalism' | 'organic'
export type StyleRound = 1 | 2
// Stored shape in answers.styles — each style page (5, 6) only ever adds or
// removes its own round-suffixed key, e.g. "minimalism1" / "minimalism2",
// so a style picked on both pages is trivially detectable downstream (same
// StyleId, both suffixes present) without any merge/dedupe logic here.
export type StyleKey = `${StyleId}${StyleRound}`
export type ColorId = 'mono' | 'earth' | 'cool' | 'vibrant' | 'pastel' | 'moody' | 'green' | 'contrast'
export type EffectId =
  | 'flowy'
  | 'minimal'
  | 'scroll_animation'
  | 'realistic'
  | 'cinematic'
  | 'minimal3d'
  | '3dmain'
  | 'product'
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
  involvementLevel: InvolvementId | ''
  preferredChannel: PreferredChannelId | ''
  styles: StyleKey[]
  colors: ColorId[]
  effects: EffectId[]
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
  involvementLevel: '',
  preferredChannel: '',
  styles: [],
  colors: [],
  effects: [],
  business: '',
  sells: '',
  links: { website: '', googleBusiness: '', instagram: '', facebook: '', other: '' },
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

// ── Step 4 (legacy) — goal ───────────────────────────────────────────────
// No longer shown in the survey UI (see INVOLVEMENT_OPTIONS below, which
// took over step 4's slot) — kept only because goalLabel()/the `goal` DB
// column are still read by app/api/survey/route.ts and
// app/api/survey/abandoned/route.ts for rows submitted before that change.
export const GOAL_OPTIONS: { id: GoalId; title: string; description: string; image?: string }[] = [
  { id: 'statement', title: 'Artistic', description: 'Make a statement.', image: 'statement' },
  { id: 'sell', title: 'Classic', description: 'Professional — convert and sell.', image: 'sell' },
  { id: 'both', title: 'Both / middle ground', description: 'Beautiful and built to sell' },
]

// ── Step 4 — design-process involvement ───────────────────────────────────
export const INVOLVEMENT_OPTIONS: { id: InvolvementId; title: string; description: string }[] = [
  {
    id: 'hands_on',
    title: 'Hands-on',
    description: 'I want a say in the details. Weekly check-in calls, feedback at every step, and a voice in the design decisions.',
  },
  {
    id: 'balanced',
    title: 'Balanced',
    description: "Keep me in the loop by email and I'll weigh in on the key choices — but I trust your expertise for the rest.",
  },
  {
    id: 'hands_off',
    title: 'Hands-off',
    description: "I don't have much time. Run with it, check in occasionally, and I'll review the final result.",
  },
]

// ── Final step — preferred communication channel ─────────────────────────
export const CHANNEL_OPTIONS: { id: PreferredChannelId; title: string }[] = [
  { id: 'email', title: 'Email' },
  { id: 'phone', title: 'Phone' },
]

// ── Steps 5 & 6 — style, same 8 concepts shown twice ──────────────────────
// Page A (step 5) shows each style's "1" photo, page B (step 6) shows the
// SAME 8 styles again with their "2" photo — a second impression rather
// than 8 new concepts. Selections are stored per-round via styleKey() so a
// style picked on both pages is a detectable "strong preference" signal
// downstream. fileKey is the actual filename prefix under
// public/media/surveystyle/ — it matches `id` for every style except
// neobrutalism, whose uploaded assets are named "brutalism{n}". fallbackBg/
// fallbackText are used when an image is genuinely missing (see
// StyleImageCard) — colors chosen to evoke the style itself so the grid
// still reads correctly pre-upload.
export function styleKey(id: StyleId, round: StyleRound): StyleKey {
  return `${id}${round}`
}

export const STYLE_OPTIONS: { id: StyleId; label: string; fileKey: string; fallbackBg: string; fallbackText: string }[] = [
  { id: 'minimalism', label: 'Minimal & clean', fileKey: 'minimalism', fallbackBg: '#F7F6F3', fallbackText: '#16161A' },
  { id: 'swiss', label: 'Sleek & structured', fileKey: 'swiss', fallbackBg: '#E7E7E7', fallbackText: '#16161A' },
  { id: 'bento', label: 'Modern tiles', fileKey: 'bento', fallbackBg: '#D6E0E8', fallbackText: '#16161A' },
  { id: 'editorial', label: 'Magazine look', fileKey: 'editorial', fallbackBg: '#EDE6D6', fallbackText: '#16161A' },
  { id: 'luxury', label: 'High-end & elegant', fileKey: 'luxury', fallbackBg: '#1A1A1A', fallbackText: '#C9A96A' },
  { id: 'dark', label: 'Dark & cinematic', fileKey: 'dark', fallbackBg: '#0B0B10', fallbackText: '#FFFFFF' },
  { id: 'neobrutalism', label: 'Bold & raw', fileKey: 'brutalism', fallbackBg: '#F5E500', fallbackText: '#16161A' },
  { id: 'organic', label: 'Warm & handmade', fileKey: 'organic', fallbackBg: '#C9A66B', fallbackText: '#16161A' },
]

// ── Step 7 — colours, all 8 on one immersive page (image cards) ──────────
// filename is the exact uploaded file under public/media/surveycolors/ —
// these don't follow a `{id}.ext` pattern (uploaded ad hoc), so they're
// listed explicitly rather than probed at runtime. swatch is used by the
// completion email / anywhere a plain color chip is still wanted;
// fallbackBg/fallbackText are a separately-tuned pair for ColorImageCard's
// missing-image fallback specifically (a couple of the swatch arrays pair
// two light or two dark tones, which reads fine as a 2-3 stripe swatch but
// gives poor text-on-background contrast if reused directly as a solid
// fallback block).
export const COLOR_OPTIONS: { id: ColorId; label: string; filename: string; swatch: string[]; fallbackBg: string; fallbackText: string }[] = [
  { id: 'mono', label: 'Monochrome B&W', filename: 'monochrome.webp', swatch: ['#111111', '#FFFFFF'], fallbackBg: '#111111', fallbackText: '#FFFFFF' },
  { id: 'earth', label: 'Warm earth tones', filename: 'warm_earth.webp', swatch: ['#8B5E3C', '#C9A66B', '#E4D4B5'], fallbackBg: '#8B5E3C', fallbackText: '#F2E8D8' },
  { id: 'cool', label: 'Cool blues', filename: 'cool_blues.webp', swatch: ['#123C69', '#3E7CB1', '#AAD7D9'], fallbackBg: '#123C69', fallbackText: '#AAD7D9' },
  { id: 'vibrant', label: 'Vibrant & colourful', filename: 'vibrant.webp', swatch: ['#FF3B3B', '#FFD23B', '#3BB8FF', '#8B3BFF'], fallbackBg: '#3BB8FF', fallbackText: '#16161A' },
  { id: 'pastel', label: 'Pastel & soft', filename: 'pastel.webp', swatch: ['#FFD6E8', '#D6E8FF', '#E8FFD6'], fallbackBg: '#FFD6E8', fallbackText: '#16161A' },
  { id: 'moody', label: 'Dark & moody', filename: 'dark.webp', swatch: ['#0B0B10', '#2A2A35', '#4A4A5A'], fallbackBg: '#0B0B10', fallbackText: '#FFFFFF' },
  { id: 'green', label: 'Earthy greens', filename: 'earthy.webp', swatch: ['#3F4F32', '#6E8259', '#A9B99A'], fallbackBg: '#3F4F32', fallbackText: '#D9E4CE' },
  { id: 'contrast', label: 'Bold contrast', filename: 'bold.webp', swatch: ['#0B0B10', '#FFFFFF', '#FF3B3B'], fallbackBg: '#0B0B10', fallbackText: '#FFFFFF' },
]

// ── Steps 8 & 9 — site "effect"/feel, two pages of 4 video cards ─────────
// fileKey is the filename prefix under public/media/surveymedia/ —
// {fileKey}_hq.mp4 / {fileKey}_hq.webm / {fileKey}_poster.jpg. Fixed order
// matches the spec exactly: page A = first 4, page B = last 4.
export const EFFECT_OPTIONS: { id: EffectId; label: string; caption: string; fileKey: string }[] = [
  { id: 'flowy', label: 'Smooth loading', caption: 'Elements load smoothly as you scroll.', fileKey: 'flowy' },
  { id: 'minimal', label: 'Minimal & clean', caption: 'Few effects, simple and clean feeling.', fileKey: 'minimal' },
  { id: 'scroll_animation', label: 'Scroll animation', caption: 'Elements move as you scroll.', fileKey: 'scroll_animation' },
  { id: 'realistic', label: 'Ultra-realistic background', caption: 'Real, lifelike background video.', fileKey: 'realistic' },
  { id: 'cinematic', label: 'Cinematic', caption: 'Cinematic, artistic background video.', fileKey: 'cinematic' },
  { id: 'minimal3d', label: 'Minimal 3D', caption: 'Subtle 3D elements, calm background.', fileKey: 'minimal3d' },
  { id: '3dmain', label: '3D as main focus', caption: 'Bold 3D elements, cool motion.', fileKey: '3dmain' },
  { id: 'product', label: 'Product showcase', caption: 'Interactive product showcase on scroll.', fileKey: 'product' },
]

export const EFFECT_PAGE_1 = EFFECT_OPTIONS.slice(0, 4)
export const EFFECT_PAGE_2 = EFFECT_OPTIONS.slice(4, 8)

// ── Step 12 — hours presets ──────────────────────────────────────────────
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

// ── Step 13 — what changes often ────────────────────────────────────────
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

// ── Step 14 — functionality ─────────────────────────────────────────────
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

// Stable step identifiers — the survey's actual page.tsx switches on these
// instead of raw step numbers, so reordering/removing/merging steps is just
// editing this one array.
//
// THIS IS THE DEFINITIVE 6-step flow: contact -> channel -> about (business)
// -> links (online presence) -> style1 (designs) -> colors -> finish.
// Everything not in STEP_ORDER below (style2, effects1/effects2, plan, and
// the older legacy steps already gone before this — services, address+hours,
// uploads, update-often, functionality, involvement) is intentionally not
// collected anymore. Their SurveyAnswers fields + DB columns are left in
// place, unused, rather than deleted — api/survey/route.ts's completion
// email still has (harmless, dead) code paths for some of them, and ripping
// out the columns would need a migration for zero benefit. 'style1' kept
// its historical name even though there's no more 'style2' page to pair
// with — it's an internal id only, never shown to a visitor.
export type StepKey =
  | 'contact'
  | 'channel'
  | 'about'
  | 'links'
  | 'style1'
  | 'colors'

export const STEP_ORDER: StepKey[] = [
  'contact',
  'channel',
  'about',
  'links',
  'style1',
  'colors',
]

export const TOTAL_STEPS = STEP_ORDER.length

export function stepKeyAt(step: number): StepKey {
  return STEP_ORDER[step - 1]
}

const SPLIT_KEYS = new Set<StepKey>(['contact', 'about', 'links'])
const IMMERSIVE_KEYS = new Set<StepKey>(['style1', 'colors'])

export function stepMode(step: number): 'split' | 'full' {
  return SPLIT_KEYS.has(stepKeyAt(step)) ? 'split' : 'full'
}

export function isImmersiveStep(step: number): boolean {
  return IMMERSIVE_KEYS.has(stepKeyAt(step))
}

// ── Labels for email building ───────────────────────────────────────────
export function planLabel(id: string): string {
  return PLAN_OPTIONS.find((p) => p.id === id)?.title ?? id
}

export function goalLabel(id: string): string {
  return GOAL_OPTIONS.find((g) => g.id === id)?.title ?? id
}

export function involvementLabel(id: string): string {
  return INVOLVEMENT_OPTIONS.find((i) => i.id === id)?.title ?? id
}

export function channelLabel(id: string): string {
  return CHANNEL_OPTIONS.find((c) => c.id === id)?.title ?? id
}

// Keys are round-suffixed (e.g. "minimalism1"), so strip the trailing 1/2
// before looking up the label and annotate which page it was picked on.
export function styleLabels(keys: string[]): string[] {
  return keys.map((key) => {
    const round = key.slice(-1)
    const id = key.slice(0, -1)
    const label = STYLE_OPTIONS.find((s) => s.id === id)?.label ?? id
    return round === '1' || round === '2' ? `${label} (page ${round})` : label
  })
}

export function colorLabels(ids: string[]): string[] {
  return ids.map((id) => COLOR_OPTIONS.find((c) => c.id === id)?.label ?? id)
}

export function effectLabels(ids: string[]): string[] {
  return ids.map((id) => EFFECT_OPTIONS.find((e) => e.id === id)?.label ?? id)
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

// Everything is optional except this one gate (contact info). Every other
// step is freely skippable — their defaults are already save-safe empty
// values.
export function isStepValid(step: number, a: SurveyAnswers): boolean {
  switch (stepKeyAt(step)) {
    case 'contact': {
      const hasNameOrCompany = a.name.trim().length > 0 || a.company.trim().length > 0
      const hasPhone = a.phone.trim().length > 0
      const emailTrim = a.email.trim()
      const hasValidEmail = emailTrim.length > 0 && isEmailValid(emailTrim)
      const emailEnteredButInvalid = emailTrim.length > 0 && !hasValidEmail
      const hasContact = emailEnteredButInvalid && !hasPhone ? false : hasValidEmail || hasPhone
      return hasNameOrCompany && hasContact
    }
    default:
      return true
  }
}
