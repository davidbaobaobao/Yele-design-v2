# AI callback (Retell "Ava") — how it works

/letsbuild form submit → `POST /api/lead` → `scheduleAiCallback()` (lib/ai-callback/schedule.ts)
  1. phone → E.164 (US/PR only), area code → `state` + `tz` (areacodes.ts), toll-free rejected
  2. dedupe: same phone in last 24 h → skip
  3. insert `ai_callbacks` row (status `scheduled`, consent text/ip/time stored)
  4. QStash `publishJSON` → `POST /api/ai-callback/fire` with `delay = AI_CALLBACK_DELAY_SECONDS` (300)

T+5 min → `POST /api/ai-callback/fire` (QStash-signed)
  - `AI_CALLBACK_ENABLED !== 'true'` → skipped
  - `paid` (Stripe webhook set it) or `do_not_call` → skipped_paid / dnc
  - outside legal window (calling-window.ts: 9–20 lead-local, no Sun, no US federal holidays;
    UNKNOWN tz = must be inside in both ET and PT) → re-publish at next 9:05 local, max 3 reschedules
  - else → Retell `create-phone-call` with dynamic variables (retell.ts) → status `calling`

Retell `call_analyzed` → `POST /api/ai-callback/retell-webhook` (Retell-signed)
  - writes post-call analysis fields to `ai_callbacks`
  - emails the lead the promised details (+ link back to /received with their plan)
  - emails David a brief ([URGENT] if paying_now / payment_issue / wants_human)

Stripe `checkout.session.completed` (flow build_first_payment) → marks matching scheduled row `skipped_paid`.

## One-time setup
- Run `supabase/migrations/ai_callbacks.sql` in the Supabase SQL editor.
- Vercel env: see `.env.ai-callback.example`.
- Retell → Agent → Webhook URL: `https://yele.design/api/ai-callback/retell-webhook`, event `call_analyzed` (+ `call_ended` optional).
- Retell post-call analysis field names must match: reached, paying_now, payment_issue, website_goal,
  has_existing_site, plan_interest, questions_asked, callback_window, confirmed_email, wants_human,
  transferred, do_not_call, wrong_number, open_questions, sentiment.
- QStash: create a token + copy both signing keys (console.upstash.com → QStash).

## Testing
- Set `AI_CALLBACK_DELAY_SECONDS=60` in Preview, submit the /letsbuild form with your own US test number.
- Watch the row: scheduled → calling → called. Check QStash console for the delivery + response body.
- `AI_CALLBACK_ENABLED=false` stops all dialing instantly (jobs still fire, they just skip).
