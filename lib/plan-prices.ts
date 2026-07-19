// Single source of truth for plan monthly prices.

export const PLAN_PRICES = {
  starter:  { monthly: 49,  annualMonthly: 40.83,  annualTotal: 490  },
  pro:      { monthly: 79,  annualMonthly: 65.83,  annualTotal: 790  },
  frontier: { monthly: 599, annualMonthly: 499.17, annualTotal: 5990 },
} as const

export const PLAN_PRICES_USD = {
  starter:  { monthly: 99  },
  pro:      { monthly: 169 },
  frontier: { monthly: 699 },
} as const
