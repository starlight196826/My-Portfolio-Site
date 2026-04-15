alter table public.projects
add column if not exists review_rating numeric(2, 1) not null default 3.3;

update public.projects
set review_rating = 3.3
where review_rating is null;
