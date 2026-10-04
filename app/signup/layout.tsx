import type { Metadata } from 'next'

// Private paid sign-up flow — not a content page, keep out of the index.
export const metadata: Metadata = { robots: { index: false, follow: true } }

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
