import ReceivedContent from '@/components/received/ReceivedContent'

export const metadata = {
  title: 'Bienvenido — Yele',
  robots: { index: false, follow: false },
}

export default function ReceivedEsPage({
  searchParams,
}: {
  searchParams: { name?: string; email?: string; company?: string; plan?: string }
}) {
  return <ReceivedContent locale="es" searchParams={searchParams} />
}
