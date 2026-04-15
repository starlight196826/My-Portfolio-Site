alter table public.projects
add column if not exists image_urls text[] not null default '{}';

update public.projects
set image_urls = case
  when coalesce(array_length(image_urls, 1), 0) > 0 then image_urls
  when coalesce(trim(image_url), '') <> '' then array[image_url]
  else '{}'
end
where image_urls is null
   or coalesce(array_length(image_urls, 1), 0) = 0;
