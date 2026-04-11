alter table public.profile add column if not exists hero_roles jsonb default '[]'::jsonb;
