-- Archive Web Police results for later study:
--  - the light TEXT result already lives in webpolice_scans.result (jsonb)
--  - the heavy SCREENSHOT goes to the `webpolice-shots` Storage bucket, and
--    this column keeps its public URL.

alter table public.webpolice_scans
  add column if not exists screenshot_url text;

insert into storage.buckets (id, name, public)
values ('webpolice-shots', 'webpolice-shots', true)
on conflict (id) do nothing;
