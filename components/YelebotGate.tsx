'use client'

import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

// dynamic + ssr:false so the widget's module (including its ai-sdk useChat
// setup) is only ever fetched/executed for routes that actually render it —
// not just visually hidden on the excluded ones.
const YelebotWidget = dynamic(() => import('@/components/YelebotWidget'), { ssr: false })

// Explicitly scoped to just these two routes — everywhere else (including
// /websites, another lead-gen landing page) keeps the widget.
const EXCLUDED_ROUTES = ['/received', '/start']

export default function YelebotGate() {
  const pathname = usePathname()
  if (EXCLUDED_ROUTES.includes(pathname)) return null
  return <YelebotWidget />
}
