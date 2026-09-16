-- Precomputed "seed" results for the Web Police showcase / random pool.
-- Seeded rows are permanent and carry the full result (incl. screenshot), so
-- the suggested chips and the random button never trigger an LLM call.

alter table public.webpolice_scans
  add column if not exists seed boolean not null default false;

create index if not exists webpolice_scans_seed_idx
  on public.webpolice_scans (url, locale, seed) where seed = true;
