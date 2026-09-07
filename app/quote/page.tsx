import { redirect } from 'next/navigation'

// Retired — consolidated into /letsbuild (server redirect in next.config.mjs; this is the fallback).
export default function Page() {
  redirect('/letsbuild')
}
