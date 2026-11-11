-- Applied to project fltpijvfchuasbpuvkal as "activity_work_tags".
-- Tags on the fields of an activity: for each field (same keys as activity_work.answers), a list of references to
-- inventory entities ("n:<node id>") or relationships ("r:<relationship id>").
-- References are plain ids, not foreign keys: the app only shows ids that exist in the viewer's own business,
-- so an id from another business shows nothing. Like the answers, tags carry no user column.

-- Same checks as 0010, written so that a non-object value can never reach jsonb_each.
create or replace function private.valid_answers(a jsonb) returns boolean
language sql immutable set search_path = '' as $$
  select case when jsonb_typeof(a) = 'object' then
    octet_length(a::text) <= 60000
    and not exists (select 1 from jsonb_each(a) e where jsonb_typeof(e.value) <> 'string' or length(e.value #>> '{}') > 4000 or length(e.key) > 64)
  else false end
$$;

create function private.valid_tags(t jsonb) returns boolean
language sql immutable set search_path = '' as $$
  select case when jsonb_typeof(t) = 'object' then
    octet_length(t::text) <= 30000
    and not exists (
      select 1 from jsonb_each(t) e
      where length(e.key) > 64
        or case when jsonb_typeof(e.value) = 'array' then
             jsonb_array_length(e.value) > 40
             or exists (select 1 from jsonb_array_elements(e.value) x
                        where jsonb_typeof(x) <> 'string' or (x #>> '{}') !~ '^[nr]:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
           else true end)
  else false end
$$;
revoke all on function private.valid_tags(jsonb) from public, anon;
grant execute on function private.valid_tags(jsonb) to authenticated;

alter table public.activity_work add column tags jsonb not null default '{}'::jsonb check (private.valid_tags(tags));
