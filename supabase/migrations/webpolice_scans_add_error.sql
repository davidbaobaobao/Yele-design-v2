-- Track failed / abandoned Web Police attempts for the daily report:
--  - errored scans store a short code ('protected', 'blocked', 'ai_failed')
--  - abandoned scans (visitor left mid-run) store 'abandoned'

alter table public.webpolice_scans
  add column if not exists error text;
