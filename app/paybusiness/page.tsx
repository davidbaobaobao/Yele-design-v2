import FinalPayLayout from '@/components/pay/FinalPayLayout'

export const metadata = {
  title: 'Go live — Business | Yele',
  robots: { index: false, follow: false },
}

export default function PayBusinessPage({
  searchParams,
}: {
  searchParams: { name?: string; email?: string; company?: string }
}) {
  return (
    <FinalPayLayout
      plan="business"
      payAmount="$599"
      careAmount="$49"
      name={searchParams.name?.trim() ?? ''}
      email={searchParams.email?.trim() ?? ''}
      company={searchParams.company?.trim() ?? ''}
    />
  )
}
