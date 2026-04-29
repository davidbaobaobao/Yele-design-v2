-- showcase_projects table
create table if not exists showcase_projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  main_image text not null,
  additional_images jsonb default '[]',
  visible boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- RLS
alter table showcase_projects enable row level security;

create policy "Public read visible projects"
  on showcase_projects for select
  using (visible = true);

create policy "Admin full access"
  on showcase_projects for all
  using (auth.email() = 'info@yele.design');

-- testimonials policies (table assumed to exist)
create policy if not exists "Public read visible testimonials"
  on testimonials for select
  using (visible = true);

create policy if not exists "Admin full access testimonials"
  on testimonials for all
  using (auth.email() = 'info@yele.design');

-- faqs policies (table assumed to exist)
create policy if not exists "Public read visible faqs"
  on faqs for select
  using (visible = true);

create policy if not exists "Admin full access faqs"
  on faqs for all
  using (auth.email() = 'info@yele.design');
