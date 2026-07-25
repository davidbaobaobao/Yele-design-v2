import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

// useReducedMotion() reads matchMedia on the client's first paint, which can
// diverge from the server's render (always false) when the OS has "reduce
// motion" on — causing a hydration mismatch. Forcing false until after
// mount guarantees the first client render always matches the server;
// the real value only takes effect once hydration is already done.
export function useHydratedReducedMotion() {
  const prefers = useReducedMotion()
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated ? prefers : false
}
