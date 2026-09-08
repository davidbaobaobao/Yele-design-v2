import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const INTERNAL = [process.env.STUDIO_EMAIL ?? 'info@yele.design', process.env.OWNER_EMAIL ?? 'davidbaobaobao@gmail.com']

async function notify(email: string) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey || !email) return
  try {
    const resend = new Resend(resendKey)
    await resend.emails.send({
      from: 'Yele <noreply@yele.design>',
      to: INTERNAL,
      subject: `Unsubscribe request — ${email}`,
      text: `Please do not contact this person by email any more.\n\nEmail: ${email}\n\n(Automated from the unsubscribe link.)`,
    })
  } catch (err) {
    console.error('[unsubscribe] notify failed', err)
  }
}

const PAGE = (email: string) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Unsubscribed — Yele</title></head>
<body style="margin:0; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; background:#f4f4f5;">
  <div style="max-width:520px; margin:64px auto; background:#fff; border-radius:16px; padding:40px; text-align:center; box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <h1 style="font-size:24px; color:#16161A; margin:0 0 10px;">You&rsquo;ve been unsubscribed</h1>
    <p style="font-size:16px; color:#6B6B72; line-height:1.6; margin:0;">${email ? `We won&rsquo;t send any more emails to <strong>${email}</strong>.` : 'Your request has been received.'} If this was a mistake, just reply to any previous email and we&rsquo;ll help.</p>
  </div>
</body></html>`

export async function GET(request: Request) {
  const email = (new URL(request.url).searchParams.get('email') || '').trim().toLowerCase()
  await notify(email)
  return new Response(PAGE(email), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

// One-click unsubscribe (RFC 8058) — Gmail/Apple POST here when the user taps
// the header "Unsubscribe" link.
export async function POST(request: Request) {
  let email = (new URL(request.url).searchParams.get('email') || '').trim().toLowerCase()
  if (!email) {
    try {
      const form = await request.formData()
      email = String(form.get('email') || '').trim().toLowerCase()
    } catch {
      /* no body */
    }
  }
  await notify(email)
  return new Response('OK', { status: 200 })
}
