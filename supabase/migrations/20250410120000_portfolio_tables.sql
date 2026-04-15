-- Schema aligned with src/lib/portfolioService.ts and src/hooks/usePortfolioData.ts
-- Run via Supabase CLI (supabase db push) or paste into SQL Editor.

create table if not exists public.profile (
  id integer primary key default 1,
  full_name text,
  bio text,
  email text,
  location text,
  years_of_experience integer,
  projects_completed integer,
  companies_worked integer,
  technologies_learned integer
);

create table if not exists public.work_experience (
  id text primary key,
  company text not null default '',
  role text not null default '',
  start_date text,
  end_date text,
  description text,
  is_current boolean default false,
  technologies text[]
);

create table if not exists public.projects (
  id text primary key,
  title text not null default '',
  description text,
  excerpt text,
  category text,
  live_url text,
  github_url text,
  image_url text,
  image_urls text[] not null default '{}',
  featured boolean default false,
  tags text[]
);

create table if not exists public.articles (
  id text primary key,
  slug text not null,
  title text not null default '',
  excerpt text,
  category text,
  content text,
  published_at text,
  read_time integer,
  cover_image_url text,
  tags text[]
);

create unique index if not exists articles_slug_unique on public.articles (slug);
