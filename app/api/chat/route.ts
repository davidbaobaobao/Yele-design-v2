import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from 'ai'
import { groq } from '@ai-sdk/groq'
import { YELE_SYSTEM_PROMPT } from '@/lib/yeleSystemPrompt'

export const maxDuration = 30

const MAX_MESSAGES = 30
const MAX_CHARS = 500
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 25

// In-memory per-IP request log — resets on cold start/redeploy, which is
// fine here: the goal is blocking casual spam/abuse, not a hard security
// guarantee (that would need a shared store like Redis/Supabase).
const requestLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  recent.push(now)
  requestLog.set(ip, recent)
  return recent.length > RATE_LIMIT_MAX
}

// Cheap keyword check so off-topic chatter (weather, trivia, jokes) gets a
// low token cap — keeps those replies short/cheap while Yele-related
// questions still get room for a full answer. The system prompt is what
// actually enforces the redirect; this only controls response length.
const RELATED_KEYWORDS = [
  'website', 'web', 'yele', 'price', 'pricing', 'plan', 'cost', 'design',
  'seo', 'build', 'business', 'ads', 'content', 'domain', 'maintenance',
  'book', 'quiz', 'hosting', 'email', 'branding', 'marketing', 'subscription',
  'site', 'app', 'chatbot', 'chat', 'automation', 'booking', 'payment', 'logo',
  'template', 'agency', 'freelanc', 'client', 'google', 'convert', 'lead',
]

function isRelatedTopic(text: string): boolean {
  const lower = text.toLowerCase()
  return RELATED_KEYWORDS.some((k) => lower.includes(k))
}

function lastUserText(messages: UIMessage[]): string {
  const last = [...messages].reverse().find((m) => m.role === 'user')
  if (!last) return ''
  return last.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join(' ')
}

// Short-circuit replies (rate limit / length caps) never touch the model —
// still returned as a proper UI message stream so useChat renders them like
// any other assistant message.
function cannedResponse(text: string): Response {
  const stream = createUIMessageStream({
    execute({ writer }) {
      writer.write({ type: 'text-start', id: 'canned' })
      writer.write({ type: 'text-delta', id: 'canned', delta: text })
      writer.write({ type: 'text-end', id: 'canned' })
    },
  })
  return createUIMessageStreamResponse({ stream })
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (isRateLimited(ip)) {
    return cannedResponse(
      "You've hit the limit for now — book a call at yele.design/schedule or email info@yele.design and we'll help you directly."
    )
  }

  if (messages.length > MAX_MESSAGES) {
    return cannedResponse(
      "This conversation's gotten pretty long — for anything more in-depth, book a call at yele.design/schedule or email info@yele.design."
    )
  }

  const latestUserText = lastUserText(messages)
  if (latestUserText.length > MAX_CHARS) {
    return cannedResponse(
      "Let's keep it short — or book a call at yele.design/schedule / email info@yele.design for the longer version."
    )
  }

  const maxTokens = isRelatedTopic(latestUserText) ? 512 : 160

  try {
    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      instructions: YELE_SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      temperature: 0.4,
      maxOutputTokens: maxTokens,
    })
    return result.toUIMessageStreamResponse()
  } catch (err) {
    console.error('[chat] error', err)
    return cannedResponse(
      "Something went wrong on my end — try again in a moment, or reach a human at info@yele.design."
    )
  }
}
