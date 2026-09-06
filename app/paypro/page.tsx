import FinalPayLayout from '@/components/pay/FinalPayLayout'

export const metadata = {
  title: 'Go live — Pro | Yele',
  robots: { index: false, follow: false },
}

export default function PayProPage({
  searchParams,
}: {
  searchParams: { name?: string; email?: string; company?: string }
}) {
  return (
    <FinalPayLayout
      plan="pro"
      payAmount="$1,399"
      careAmount="$99"
      name={searchParams.name?.trim() ?? ''}
      email={searchParams.email?.trim() ?? ''}
      company={searchParams.company?.trim() ?? ''}
    />
  )
}
