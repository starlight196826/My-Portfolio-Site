-- Portfolio site uses NEXT_PUBLIC_SUPABASE_ANON_KEY in the browser for reads + admin saves.
-- If Row Level Security is on with no policies, SELECT/INSERT return 0 rows or errors — data looks "missing".
-- This migration ensures these tables are readable/writable with the anon key for this demo portfolio.

grant usage on schema public to anon, authenticated, service_role;

alter table if exists public.profile disable row level security;
alter table if exists public.work_experience disable row level security;
alter table if exists public.projects disable row level security;
alter table if exists public.articles disable row level security;
alter table if exists public.skills disable row level security;
alter table if exists public.testimonials disable row level security;

grant select, insert, update, delete on table public.profile to anon, authenticated;
grant select, insert, update, delete on table public.work_experience to anon, authenticated;
grant select, insert, update, delete on table public.projects to anon, authenticated;
grant select, insert, update, delete on table public.articles to anon, authenticated;
grant select, insert, update, delete on table public.skills to anon, authenticated;
grant select, insert, update, delete on table public.testimonials to anon, authenticated;
