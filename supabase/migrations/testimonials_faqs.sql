-- testimonials table
create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  author text not null,
  role text not null,
  text text not null,
  visible boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table testimonials enable row level security;

create policy "Public read visible testimonials"
  on testimonials for select
  using (visible = true);

create policy "Admin full access testimonials"
  on testimonials for all
  using (auth.email() = 'info@yele.design');

-- faqs table
create table if not exists faqs (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  answer text not null,
  visible boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table faqs enable row level security;

create policy "Public read visible faqs"
  on faqs for select
  using (visible = true);

create policy "Admin full access faqs"
  on faqs for all
  using (auth.email() = 'info@yele.design');
