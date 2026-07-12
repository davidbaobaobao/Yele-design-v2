// Single source of truth for plan monthly prices (EUR).

export const PLAN_PRICES = {
  starter:  { monthly: 49,  annualMonthly: 41.58, annualTotal: 499 },
  pro:      { monthly: 69,  annualMonthly: 58.25, annualTotal: 699 },
  enterprise: { monthly: 119, annualMonthly: 99.17, annualTotal: 1190 },
} as const
