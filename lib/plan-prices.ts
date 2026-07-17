// Single source of truth for plan monthly prices (EUR).

export const PLAN_PRICES = {
  starter:  { monthly: 99,  annualMonthly: 82.50,  annualTotal: 990  },
  pro:      { monthly: 169, annualMonthly: 140.83, annualTotal: 1690 },
  frontier: { monthly: 699, annualMonthly: 582.50, annualTotal: 6990 },
} as const
