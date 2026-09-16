-- Web Police scan log: powers the per-session email digest, the abuse rate
-- limits and the 24h result cache.

create table if not exists public.webpolice_scans (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  session_id  text,
  url         text not null,
  host        text not null,
  locale      text not null default 'en',
  quality     int,
  verdict     text,
  mode        text,
  cached      boolean not null default false,
  ip_hash     text not null,
  country     text,
  user_agent  text,
  referer     text,
  result      jsonb,
  reported_at timestamptz
);

create index if not exists webpolice_scans_created_idx  on public.webpolice_scans (created_at desc);
create index if not exists webpolice_scans_ip_idx       on public.webpolice_scans (ip_hash, created_at desc);
create index if not exists webpolice_scans_session_idx  on public.webpolice_scans (session_id, reported_at);
create index if not exists webpolice_scans_cache_idx    on public.webpolice_scans (url, locale, created_at desc);

-- Server-side only: the service-role key bypasses RLS, everyone else sees nothing.
alter table public.webpolice_scans enable row level security;
