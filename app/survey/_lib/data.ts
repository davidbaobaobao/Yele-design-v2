export type GoalId = 'statement' | 'sell' | 'both'
export type StyleId = 'minimal' | 'bold' | 'elegant' | 'playful' | 'dark' | 'warm'
export type ColorId = 'mono' | 'earth' | 'cool' | 'vibrant' | 'pastel' | 'moody' | 'yele'

export interface SurveyAnswers {
  name: string
  company: string
  email: string
  phone: string
  goal: GoalId | ''
  styles: StyleId[]
  colors: ColorId[]
  business: string
  sells: string
}

export const EMPTY_ANSWERS: SurveyAnswers = {
  name: '',
  company: '',
  email: '',
  phone: '',
  goal: '',
  styles: [],
  colors: [],
  business: '',
  sells: '',
}

export const GOAL_OPTIONS: { id: GoalId; title: string; description: string }[] = [
  { id: 'statement', title: 'Make a statement', description: 'Bold, unforgettable, jaw-dropping' },
  { id: 'sell', title: 'Sell & convert', description: 'Classy, professional, straight to the point' },
  { id: 'both', title: 'Both / middle ground', description: 'Beautiful and built to sell' },
]

export const STYLE_OPTIONS: { id: StyleId; label: string; swatch: string[] }[] = [
  { id: 'minimal', label: 'Minimal & clean', swatch: ['#FFFFFF', '#E8E6E1', '#16161A'] },
  { id: 'bold', label: 'Bold & vibrant', swatch: ['#FF3B3B', '#FFD23B', '#3BB8FF'] },
  { id: 'elegant', label: 'Elegant & luxury', swatch: ['#16161A', '#C9A96A', '#F2F0EB'] },
  { id: 'playful', label: 'Playful & friendly', swatch: ['#FFD6E8', '#FFEB99', '#B8F2E6'] },
  { id: 'dark', label: 'Dark & modern', swatch: ['#0B0B10', '#2A2A35', '#D46FC8'] },
  { id: 'warm', label: 'Warm & organic', swatch: ['#C9A66B', '#8B5E3C', '#E4D4B5'] },
]

export const COLOR_OPTIONS: { id: ColorId; label: string; swatch: string[] }[] = [
  { id: 'mono', label: 'Monochrome B&W', swatch: ['#111111', '#FFFFFF'] },
  { id: 'earth', label: 'Warm earth tones', swatch: ['#8B5E3C', '#C9A66B', '#E4D4B5'] },
  { id: 'cool', label: 'Cool blues', swatch: ['#123C69', '#3E7CB1', '#AAD7D9'] },
  { id: 'vibrant', label: 'Vibrant & colourful', swatch: ['#FF3B3B', '#FFD23B', '#3BB8FF', '#8B3BFF'] },
  { id: 'pastel', label: 'Pastel & soft', swatch: ['#FFD6E8', '#D6E8FF', '#E8FFD6'] },
  { id: 'moody', label: 'Dark & moody', swatch: ['#0B0B10', '#2A2A35', '#4A4A5A'] },
  { id: 'yele', label: 'Let Yele decide', swatch: ['#D46FC8', '#7B8CDE'] },
]

export const TOTAL_STEPS = 7

export function goalLabel(id: string): string {
  return GOAL_OPTIONS.find((g) => g.id === id)?.title ?? id
}

export function styleLabels(ids: string[]): string[] {
  return ids.map((id) => STYLE_OPTIONS.find((s) => s.id === id)?.label ?? id)
}

export function colorLabels(ids: string[]): string[] {
  return ids.map((id) => COLOR_OPTIONS.find((c) => c.id === id)?.label ?? id)
}

export function isStepValid(step: number, a: SurveyAnswers): boolean {
  switch (step) {
    case 1:
      return a.name.trim().length > 0
    case 2: {
      const hasPhone = a.phone.trim().length > 0
      const emailTrim = a.email.trim()
      const hasValidEmail = emailTrim.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)
      const emailEnteredButInvalid = emailTrim.length > 0 && !hasValidEmail
      if (emailEnteredButInvalid && !hasPhone) return false
      return hasValidEmail || hasPhone
    }
    case 3:
      return a.goal !== ''
    default:
      return true
  }
}
