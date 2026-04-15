-- Base64 / huge text in profile_image_url can exceed PostgREST transfer time and cause
-- "canceling statement due to statement timeout". Keep only normal URLs.
update public.profile
set profile_image_url = null
where profile_image_url is not null
  and (
    profile_image_url ilike 'data:%'
    or length(profile_image_url) > 50000
  );
