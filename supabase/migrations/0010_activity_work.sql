-- Applied to project fltpijvfchuasbpuvkal as "activity_work".
-- Work done on a program activity: the answers a person wrote in the activity screen, and whether it is done.
-- One row per activity node. Answers are keyed by the position of the template section ("0", "1", ...) so they
-- do not depend on the language; custom activities use the single key "notes".
-- Work is shared by the team: any writer can edit any activity's work, like the activities themselves.
-- The table deliberately has NO user column, so it can never be used to identify who wrote on what.

-- Answers: an object of short keys and text values only, and a bounded size.
create function private.valid_answers(a jsonb) returns boolean
language sql immutable set search_path = '' as $$
  select jsonb_typeof(a) = 'object' and octet_length(a::text) <= 60000
    and not exists (select 1 from jsonb_each(a) e where jsonb_typeof(e.value) <> 'string' or length(e.value #>> '{}') > 4000 or length(e.key) > 64)
$$;
revoke all on function private.valid_answers(jsonb) from public, anon;
grant execute on function private.valid_answers(jsonb) to authenticated;

create table public.activity_work (
  node_id uuid primary key,
  business_id uuid not null,
  status text not null default 'in_progress' check (status in ('in_progress', 'done')),
  answers jsonb not null default '{}'::jsonb check (private.valid_answers(answers)),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  check ((status = 'done') = (completed_at is not null)),
  foreign key (node_id, business_id) references public.nodes(id, business_id) on delete cascade
);

alter table public.activity_work enable row level security;
revoke all on public.activity_work from anon;
revoke truncate, references, trigger on public.activity_work from authenticated;

create policy activity_work_select on public.activity_work for select to authenticated
  using (private.is_member(business_id));
create policy activity_work_insert on public.activity_work for insert to authenticated
  with check (private.has_role(business_id, array['owner','innovation_manager','contributor']::public.member_role[]));
create policy activity_work_update on public.activity_work for update to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager','contributor']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager','contributor']::public.member_role[]));
-- No delete policy: the row goes away with its activity node (on delete cascade).

-- The server owns the timestamps (the client clock and the client's values are never trusted), only activities
-- can carry work, and a row can never be moved to another node or business.
-- Runs as the caller (not security definer): reading the node is covered by the caller's own select policy.
create function private.guard_activity_work() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    if not exists (select 1 from public.nodes n where n.id = new.node_id and n.business_id = new.business_id and n.type = 'activity' and n.subtype = 'process') then
      raise exception 'not an activity';
    end if;
    new.started_at := now();
    new.updated_at := now();
    new.completed_at := case when new.status = 'done' then now() end;
  else
    new.node_id := old.node_id;
    new.business_id := old.business_id;
    new.started_at := old.started_at;
    new.updated_at := now();
    new.completed_at := case when new.status <> 'done' then null when old.status = 'done' then old.completed_at else now() end;
  end if;
  return new;
end $$;
revoke all on function private.guard_activity_work() from public, anon, authenticated;

create trigger activity_work_guard before insert or update on public.activity_work
  for each row execute function private.guard_activity_work();
