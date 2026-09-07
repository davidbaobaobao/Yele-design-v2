import { redirect } from 'next/navigation'

// Consolidated — this landing now redirects to /letsbuild (also handled by a
// server redirect in next.config.mjs; this is the fallback).
export default function Page() {
  redirect('/letsbuild')
}
