-- Public bucket for project screenshots (client uploads use anon key from NEXT_PUBLIC_SUPABASE_ANON_KEY).
-- Apply in Supabase SQL Editor or: supabase db push

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Read thumbnails in the portfolio (public URLs)
drop policy if exists "Public read project-images" on storage.objects;
create policy "Public read project-images"
on storage.objects for select
to public
using (bucket_id = 'project-images');

-- Upload from admin (browser uses anon or authenticated JWT)
drop policy if exists "Allow insert project-images" on storage.objects;
create policy "Allow insert project-images"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'project-images');

-- Upsert/replace same path
drop policy if exists "Allow update project-images" on storage.objects;
create policy "Allow update project-images"
on storage.objects for update
to anon, authenticated
using (bucket_id = 'project-images')
with check (bucket_id = 'project-images');

-- Optional: delete old files when re-saving (if you add deletes later)
drop policy if exists "Allow delete project-images" on storage.objects;
create policy "Allow delete project-images"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'project-images');
