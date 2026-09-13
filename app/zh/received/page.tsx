import ReceivedContent from '@/components/received/ReceivedContent'

export const metadata = {
  title: '欢迎 — Yele',
  robots: { index: false, follow: false },
}

export default function ReceivedZhPage({
  searchParams,
}: {
  searchParams: { name?: string; email?: string; company?: string; plan?: string }
}) {
  return <ReceivedContent locale="zh" searchParams={searchParams} />
}
