import FinalPayLayout from '@/components/pay/FinalPayLayout'

export const metadata = {
  title: 'Go live — Launch | Yele',
  robots: { index: false, follow: false },
}

export default function PayLaunchPage({
  searchParams,
}: {
  searchParams: { name?: string; email?: string; company?: string }
}) {
  return (
    <FinalPayLayout
      plan="launch"
      payAmount="$349"
      careAmount="$49"
      name={searchParams.name?.trim() ?? ''}
      email={searchParams.email?.trim() ?? ''}
      company={searchParams.company?.trim() ?? ''}
    />
  )
}
