import ReceivedContent from '@/components/received/ReceivedContent'

export const metadata = {
  title: 'Bienvenido — Yele',
  robots: { index: false, follow: false },
}

// Igual que /es/received pero sin el calendario — solo pagos e instrucciones.
export default function Received2EsPage({
  searchParams,
}: {
  searchParams: { name?: string; email?: string; company?: string; plan?: string }
}) {
  return <ReceivedContent locale="es" searchParams={searchParams} hideCalendar />
}
