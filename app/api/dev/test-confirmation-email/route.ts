import { Resend } from 'resend'
import { clientConfirmationEmail } from '@/lib/emails/confirmation'

export const dynamic = 'force-dynamic'

// One-off tester for the client "payment received" email. Guarded: only sends
// to a small allowlist of internal test addresses, so it can't be abused to
// spam arbitrary recipients. Hit e.g.
//   /api/dev/test-confirmation-email?to=yeletester@gmail.com&name=Final&plan=Launch
const ALLOWED = new Set([
  'yeletester@gmail.com',
  'davidbaobaobao@gmail.com',
  'info@yele.design',
])

export async function GET(request: Request) {
  const url = new URL(request.url)
  const to = (url.searchParams.get('to') || 'yeletester@gmail.com').trim().toLowerCase()
  const firstName = (url.searchParams.get('name') || 'Final').trim()
  const planLabel = (url.searchParams.get('plan') || 'Launch').trim()

  if (!ALLOWED.has(to)) {
    return Response.json({ error: 'Recipient not allowed for testing' }, { status: 400 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return Response.json({ error: 'RESEND_API_KEY not set' }, { status: 500 })
  }

  try {
    const resend = new Resend(resendKey)
    const { subject, html, text } = clientConfirmationEmail({ firstName, planLabel })
    const result = await resend.emails.send({
      from: 'Yele <noreply@yele.design>',
      to: [to],
      subject,
      html,
      text,
    })
    return Response.json({ ok: true, to, id: result.data?.id ?? null })
  } catch (err) {
    console.error('[test-confirmation-email] error', err)
    return Response.json({ error: 'Send failed' }, { status: 500 })
  }
}
