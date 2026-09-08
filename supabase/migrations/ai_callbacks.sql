-- AI callback queue for /letsbuild leads (Retell outbound, fired via QStash).
create table if not exists public.ai_callbacks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  discovery_lead_id uuid,
  name text not null,
  email text not null,
  phone_e164 text not null,
  business text,
  plan text check (plan in ('launch','business','pro')),
  state text,                       -- CA, TX … or UNKNOWN (from area code)
  tz text,                          -- IANA zone from area code
  lead_source text,
  -- TCPA evidence
  consent_at timestamptz,
  consent_ip text,
  consent_text text,
  -- scheduling / state machine
  status text not null default 'scheduled',
    -- scheduled | calling | called | skipped_paid | skipped | dnc | wrong_number | error
  scheduled_for timestamptz,
  call_attempts int not null default 0,
  reschedules int not null default 0,
  paid boolean not null default false,
  paid_at timestamptz,
  retell_call_id text,
  last_error text,
  -- post-call analysis (from Retell call_analyzed)
  reached boolean,
  paying_now boolean,
  payment_issue boolean,
  website_goal text,
  has_existing_site text,
  plan_interest text,
  questions_asked text,
  callback_window text,
  confirmed_email text,
  wants_human boolean,
  transferred boolean,
  do_not_call boolean not null default false,
  wrong_number boolean,
  open_questions text,
  sentiment text,
  call_summary text,
  transcript text,
  recording_url text,
  call_duration_ms int
);
create index if not exists ai_callbacks_status_idx on public.ai_callbacks (status, scheduled_for);
create index if not exists ai_callbacks_phone_idx on public.ai_callbacks (phone_e164, created_at desc);
create index if not exists ai_callbacks_email_idx on public.ai_callbacks (lower(email), created_at desc);
alter table public.ai_callbacks enable row level security; -- service role only; no anon policies on purpose
