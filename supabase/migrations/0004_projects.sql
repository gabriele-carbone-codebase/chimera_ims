-- Applied to project fltpijvfchuasbpuvkal as "projects_gates".
-- A project is an activity node (subtype 'project') plus a row in public.projects for its stage.
-- Stage only moves through review_gate(), which checks the gate's exit criteria.
-- Passing the last gate ships the project: a product or service (resource node) is created and
-- linked back to the project with a 'derived_from' relationship.

create type public.project_stage as enum ('define','build','test','shipped');
create type public.project_status as enum ('active','on_hold','stopped');
create type public.gate_decision as enum ('go','hold','stop');

create table public.projects (
  node_id uuid primary key,
  business_id uuid not null,
  stage public.project_stage not null default 'define',
  status public.project_status not null default 'active',
  source_idea_id uuid,
  product_id uuid,
  unique (node_id, business_id),
  foreign key (node_id, business_id) references public.nodes(id, business_id) on delete cascade,
  foreign key (source_idea_id, business_id) references public.nodes(id, business_id) on delete set null (source_idea_id),
  foreign key (product_id, business_id) references public.nodes(id, business_id) on delete set null (product_id)
);
create index projects_business_stage_idx on public.projects(business_id, stage);

-- Exit criteria for each gate (the gate that leaves from_stage). Built-in ones have a key; custom ones a name.
create table public.gate_criteria (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  from_stage public.project_stage not null check (from_stage <> 'shipped'),
  key text,
  name text check (char_length(name) <= 200),
  position smallint not null default 0,
  created_at timestamptz not null default now(),
  check (key is not null or name is not null),
  unique (business_id, from_stage, key)
);

-- A row means "this exit criterion is met for this project".
create table public.project_gate_items (
  project_id uuid not null,
  business_id uuid not null,
  criterion_id uuid not null references public.gate_criteria(id) on delete cascade,
  updated_by uuid default auth.uid() references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (project_id, criterion_id),
  foreign key (project_id, business_id) references public.projects(node_id, business_id) on delete cascade
);

create table public.gate_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  business_id uuid not null,
  from_stage public.project_stage not null,
  to_stage public.project_stage,
  decision public.gate_decision not null,
  note text check (char_length(note) <= 2000),
  decided_by uuid references auth.users(id) on delete set null,
  decided_at timestamptz not null default now(),
  foreign key (project_id, business_id) references public.projects(node_id, business_id) on delete cascade
);
create index gate_reviews_project_idx on public.gate_reviews(project_id);

alter table public.projects enable row level security;
alter table public.gate_criteria enable row level security;
alter table public.project_gate_items enable row level security;
alter table public.gate_reviews enable row level security;

create policy projects_select on public.projects for select to authenticated using (private.is_member(business_id));
create policy gate_criteria_select on public.gate_criteria for select to authenticated using (private.is_member(business_id));
create policy gate_criteria_insert on public.gate_criteria for insert to authenticated
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));
create policy gate_criteria_update on public.gate_criteria for update to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));
create policy gate_criteria_delete on public.gate_criteria for delete to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));

create policy gate_items_select on public.project_gate_items for select to authenticated using (private.is_member(business_id));
create policy gate_items_insert on public.project_gate_items for insert to authenticated
  with check (private.has_role(business_id, array['owner','innovation_manager','contributor']::public.member_role[]) and updated_by = (select auth.uid()));
create policy gate_items_delete on public.project_gate_items for delete to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager','contributor']::public.member_role[]));

create policy gate_reviews_select on public.gate_reviews for select to authenticated using (private.is_member(business_id));

create function private.seed_gate_criteria(bid uuid) returns void
language sql security definer set search_path = '' as $$
  insert into public.gate_criteria (business_id, from_stage, key, position)
  select bid, s::public.project_stage, k, p from (values
    ('define','problem_clear',1), ('define','team_assigned',2), ('define','budget_defined',3),
    ('build','prototype_ready',1), ('build','risks_assessed',2),
    ('test','validated_users',1), ('test','launch_ready',2)
  ) as v(s, k, p)
  on conflict (business_id, from_stage, key) do nothing;
$$;
revoke all on function private.seed_gate_criteria(uuid) from public, anon, authenticated;
select private.seed_gate_criteria(id) from public.businesses;

create or replace function public.create_business(business_name text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); bid uuid;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  insert into public.businesses (name, created_by) values (business_name, uid) returning id into bid;
  insert into public.memberships (business_id, user_id, role) values (bid, uid, 'owner');
  perform private.seed_criteria(bid);
  perform private.seed_gate_criteria(bid);
  return bid;
end $$;

-- Create a project, optionally from an approved idea.
create function public.create_project(bid uuid, project_title text, project_description text, from_idea uuid default null) returns uuid
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); nid uuid;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if not private.has_role(bid, array['owner','innovation_manager','contributor']::public.member_role[]) then raise exception 'not allowed'; end if;
  if from_idea is not null then
    if not exists (select 1 from public.ideas i where i.node_id = from_idea and i.business_id = bid and i.status = 'approved') then
      raise exception 'idea is not approved';
    end if;
    if exists (select 1 from public.projects p where p.source_idea_id = from_idea) then raise exception 'idea already has a project'; end if;
  end if;
  insert into public.nodes (business_id, type, subtype, title, description, created_by)
  values (bid, 'activity', 'project', project_title, project_description, uid) returning id into nid;
  insert into public.projects (node_id, business_id, source_idea_id) values (nid, bid, from_idea);
  if from_idea is not null then
    insert into public.relationships (business_id, from_node, to_node, type, strength, created_by)
    values (bid, nid, from_idea, 'derived_from', 'strong', uid);
  end if;
  return nid;
end $$;

-- Decide a gate review. 'go' needs every exit criterion of the current stage to be met.
create function public.review_gate(pid uuid, gate_choice public.gate_decision, review_note text, ship_as text default 'product') returns void
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); p public.projects; n public.nodes; nxt public.project_stage; unmet int; prod uuid;
begin
  select * into p from public.projects where node_id = pid for update;
  if not found then raise exception 'project not found'; end if;
  if not private.has_role(p.business_id, array['owner','innovation_manager']::public.member_role[]) then raise exception 'not allowed'; end if;
  if p.stage = 'shipped' or p.status = 'stopped' then raise exception 'project is closed'; end if;

  if gate_choice = 'go' then
    select count(*) into unmet from public.gate_criteria c
      where c.business_id = p.business_id and c.from_stage = p.stage
        and not exists (select 1 from public.project_gate_items i where i.project_id = pid and i.criterion_id = c.id);
    if unmet > 0 then raise exception 'exit criteria not met'; end if;
    nxt := case p.stage when 'define' then 'build' when 'build' then 'test' else 'shipped' end;
    if nxt = 'shipped' then
      if ship_as not in ('product','service') then raise exception 'invalid ship_as'; end if;
      select * into n from public.nodes where id = pid;
      insert into public.nodes (business_id, type, subtype, title, description, created_by)
      values (p.business_id, 'resource', ship_as, n.title, n.description, uid) returning id into prod;
      insert into public.relationships (business_id, from_node, to_node, type, strength, created_by)
      values (p.business_id, prod, pid, 'derived_from', 'strong', uid);
      update public.projects set stage = nxt, status = 'active', product_id = prod where node_id = pid;
    else
      update public.projects set stage = nxt, status = 'active' where node_id = pid;
    end if;
    insert into public.gate_reviews (project_id, business_id, from_stage, to_stage, decision, note, decided_by)
    values (pid, p.business_id, p.stage, nxt, 'go', review_note, uid);
  else
    update public.projects set status = case gate_choice when 'hold' then 'on_hold'::public.project_status else 'stopped'::public.project_status end where node_id = pid;
    insert into public.gate_reviews (project_id, business_id, from_stage, to_stage, decision, note, decided_by)
    values (pid, p.business_id, p.stage, null, gate_choice, review_note, uid);
  end if;
end $$;

-- Resume a project that was put on hold or stopped.
create function public.resume_project(pid uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare p public.projects;
begin
  select * into p from public.projects where node_id = pid for update;
  if not found then raise exception 'project not found'; end if;
  if not private.has_role(p.business_id, array['owner','innovation_manager']::public.member_role[]) then raise exception 'not allowed'; end if;
  if p.stage = 'shipped' then raise exception 'project is closed'; end if;
  update public.projects set status = 'active' where node_id = pid;
end $$;

revoke all on function public.create_project(uuid, text, text, uuid), public.review_gate(uuid, public.gate_decision, text, text), public.resume_project(uuid) from public, anon;
grant execute on function public.create_project(uuid, text, text, uuid), public.review_gate(uuid, public.gate_decision, text, text), public.resume_project(uuid) to authenticated;
