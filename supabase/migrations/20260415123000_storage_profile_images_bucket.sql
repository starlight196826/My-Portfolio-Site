-- Profile photos uploaded from Admin (anon key). Fixes Storage RLS: "new row violates row-level security policy".
-- Apply in Supabase SQL Editor or: supabase db push

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-images',
  'profile-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read profile-images" on storage.objects;
create policy "Public read profile-images"
on storage.objects for select
to public
using (bucket_id = 'profile-images');

drop policy if exists "Allow insert profile-images" on storage.objects;
create policy "Allow insert profile-images"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'profile-images');

drop policy if exists "Allow update profile-images" on storage.objects;
create policy "Allow update profile-images"
on storage.objects for update
to anon, authenticated
using (bucket_id = 'profile-images')
with check (bucket_id = 'profile-images');

drop policy if exists "Allow delete profile-images" on storage.objects;
create policy "Allow delete profile-images"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'profile-images');
