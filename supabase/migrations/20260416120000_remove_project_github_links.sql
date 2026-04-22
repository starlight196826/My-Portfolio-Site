-- Remove all stored GitHub links from projects
update public.projects
set github_url = null
where github_url is not null
  and btrim(github_url) <> '';
