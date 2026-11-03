-- Applied to project fltpijvfchuasbpuvkal as "ideas_criteria_evaluations".
-- An idea is a concept node (subtype 'idea') plus a row in public.ideas for its workflow state.
-- Anonymous ideas are inserted ONLY through submit_idea(), which stores created_by = null,
-- so the author is genuinely unknown (nothing records who submitted it).

create type public.idea_status as enum ('submitted','in_evaluation','approved','rejected','on_hold');

create table public.ideas (
  node_id uuid primary key,
  business_id uuid not null,
  anonymous boolean not null default false,
  status public.idea_status not null default 'submitted',
  decided_by uuid references auth.users(id) on delete set null,
  decided_at timestamptz,
  decision_note text check (char_length(decision_note) <= 2000),
  unique (node_id, business_id),
  foreign key (node_id, business_id) references public.nodes(id, business_id) on delete cascade
);
create index ideas_business_status_idx on public.ideas(business_id, status);

-- Criteria library per business. Built-in criteria have a key (translated in the app); custom ones have a name.
create table public.criteria (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  key text,
  name text check (char_length(name) <= 120),
  description text check (char_length(description) <= 500),
  is_default boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  check (key is not null or name is not null),
  unique (business_id, key)
);

-- Criteria and weights chosen by the innovation manager for each single idea.
create table public.idea_criteria (
  idea_id uuid not null,
  business_id uuid not null,
  criterion_id uuid not null references public.criteria(id) on delete cascade,
  weight smallint not null default 3 check (weight between 1 and 5),
  primary key (idea_id, criterion_id),
  foreign key (idea_id, business_id) references public.ideas(node_id, business_id) on delete cascade
);

create table public.evaluations (
  idea_id uuid not null,
  business_id uuid not null,
  evaluator_id uuid not null references auth.users(id) on delete cascade,
  criterion_id uuid not null references public.criteria(id) on delete cascade,
  score smallint not null check (score between 1 and 5),
  comment text check (char_length(comment) <= 1000),
  updated_at timestamptz not null default now(),
  primary key (idea_id, evaluator_id, criterion_id),
  foreign key (idea_id, business_id) references public.ideas(node_id, business_id) on delete cascade
);

alter table public.ideas enable row level security;
alter table public.criteria enable row level security;
alter table public.idea_criteria enable row level security;
alter table public.evaluations enable row level security;

create policy ideas_select on public.ideas for select to authenticated using (private.is_member(business_id));
create policy ideas_update on public.ideas for update to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));

create policy criteria_select on public.criteria for select to authenticated using (private.is_member(business_id));
create policy criteria_insert on public.criteria for insert to authenticated
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));
create policy criteria_update on public.criteria for update to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));
create policy criteria_delete on public.criteria for delete to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));

create policy idea_criteria_select on public.idea_criteria for select to authenticated using (private.is_member(business_id));
create policy idea_criteria_insert on public.idea_criteria for insert to authenticated
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));
create policy idea_criteria_update on public.idea_criteria for update to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));
create policy idea_criteria_delete on public.idea_criteria for delete to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));

-- Owners and innovation managers see every score; an evaluator sees only their own (limits bias).
create policy evaluations_select on public.evaluations for select to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]) or evaluator_id = (select auth.uid()));
create policy evaluations_insert on public.evaluations for insert to authenticated
  with check (evaluator_id = (select auth.uid())
    and private.has_role(business_id, array['owner','innovation_manager','evaluator']::public.member_role[])
    and exists (select 1 from public.ideas i where i.node_id = idea_id and i.status = 'in_evaluation'));
create policy evaluations_update on public.evaluations for update to authenticated
  using (evaluator_id = (select auth.uid()))
  with check (evaluator_id = (select auth.uid())
    and exists (select 1 from public.ideas i where i.node_id = idea_id and i.status = 'in_evaluation'));
create policy evaluations_delete on public.evaluations for delete to authenticated
  using (evaluator_id = (select auth.uid()));

-- Default criteria for a business.
create function private.seed_criteria(bid uuid) returns void
language sql security definer set search_path = '' as $$
  insert into public.criteria (business_id, key, is_default)
  select bid, k, true from unnest(array['impact','feasibility','strategic_fit','cost']) as k
  on conflict (business_id, key) do nothing;
$$;
revoke all on function private.seed_criteria(uuid) from public, anon, authenticated;

select private.seed_criteria(id) from public.businesses;

create or replace function public.create_business(business_name text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); bid uuid;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  insert into public.businesses (name, created_by) values (business_name, uid) returning id into bid;
  insert into public.memberships (business_id, user_id, role) values (bid, uid, 'owner');
  perform private.seed_criteria(bid);
  return bid;
end $$;

-- Propose an idea. When anonymous, no author is stored at all.
create function public.submit_idea(bid uuid, idea_title text, idea_description text, is_anonymous boolean) returns uuid
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); nid uuid;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if not private.has_role(bid, array['owner','innovation_manager','evaluator','contributor']::public.member_role[]) then
    raise exception 'not allowed';
  end if;
  insert into public.nodes (business_id, type, subtype, title, description, created_by)
  values (bid, 'concept', 'idea', idea_title, idea_description, case when is_anonymous then null else uid end)
  returning id into nid;
  insert into public.ideas (node_id, business_id, anonymous) values (nid, bid, is_anonymous);
  return nid;
end $$;
revoke all on function public.submit_idea(uuid, text, text, boolean) from public, anon;
grant execute on function public.submit_idea(uuid, text, text, boolean) to authenticated;
