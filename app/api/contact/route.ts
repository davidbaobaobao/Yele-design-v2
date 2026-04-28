import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, negocio, mensaje } = body

    if (!nombre || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key || url === 'https://placeholder.supabase.co') {
      // Supabase not configured — log and return success so the form works in dev
      console.log('[contact form]', { nombre, email, negocio, mensaje })
      return NextResponse.json({ ok: true })
    }

    const supabase = createClient(url, key)
    const { error } = await supabase
      .from('contact_requests')
      .insert({ nombre, email, negocio, mensaje })

    if (error) {
      console.error('[contact form] supabase error', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
