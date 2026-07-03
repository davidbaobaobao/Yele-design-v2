import { Suspense } from 'react'
import GraciasClient from './GraciasClient'

export const dynamic = 'force-dynamic'

export default function GraciasPage() {
  return (
    <Suspense>
      <GraciasClient />
    </Suspense>
  )
}
