import { Client as QStash } from '@upstash/qstash'

// QStash is multi-region and the SDK defaults to the EU endpoint
// (https://qstash.upstash.io). An account created in US East must talk to
// https://qstash-us-east-1.upstash.io or every request 404s with
// "user not found in this region". Set QSTASH_URL to the endpoint shown in
// the Upstash console; we pass it explicitly rather than relying on the SDK
// picking the env var up.
export const QSTASH_BASE_URL = process.env.QSTASH_URL || 'https://qstash.upstash.io'

export function qstashClient(): QStash {
  return new QStash({ token: process.env.QSTASH_TOKEN!, baseUrl: QSTASH_BASE_URL })
}
