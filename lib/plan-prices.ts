// Single source of truth for plan monthly prices (EUR).
// Annual = monthly × 12 × 0.8 (20% off).
// Note: Stripe annual for Starter is priced at 299 EUR (slightly different from 278.40).

export const PLAN_PRICES = {
  starter:  { monthly: 29,  annualMonthly: 23.20, annualTotal: 278.40 },
  pro:      { monthly: 49,  annualMonthly: 39.20, annualTotal: 470.40 },
  business: { monthly: 99,  annualMonthly: 79.20, annualTotal: 950.40 },
} as const
