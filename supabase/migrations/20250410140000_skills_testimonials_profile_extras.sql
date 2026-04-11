-- Skills & testimonials (frontend sections previously only in portfolioData / localStorage)
-- Profile extras: hero title, photo URL, resume, social links

create table if not exists public.skills (
  id text primary key,
  name text not null default '',
  category text not null default 'Frontend',
  proficiency integer default 0
);

create table if not exists public.testimonials (
  id text primary key,
  name text not null default '',
  role text,
  company text,
  quote text,
  avatar text
);

alter table public.profile add column if not exists title text;
alter table public.profile add column if not exists profile_image_url text;
alter table public.profile add column if not exists resume_url text;
alter table public.profile add column if not exists social_links jsonb;
