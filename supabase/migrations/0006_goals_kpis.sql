-- Applied to project fltpijvfchuasbpuvkal as "goals_kpis".
-- A KPI is a measure computed from CHIMERA data (ideas, projects, inventory) or entered by hand.
-- A goal is a target on a KPI, based on one of the four entity types, optionally tied to specific nodes.
-- kpi_snapshots keeps the history (one value per KPI per day).

create type public.kpi_metric as enum ('ideas_submitted','ideas_approved','projects_active','projects_shipped','inventory_count','idea_score_avg','manual');
create type public.kpi_period as enum ('all_time','month','quarter','year');
create type public.goal_direction as enum ('at_least','at_most');
create type public.goal_status as enum ('active','achieved','archived');

create table public.kpis (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 200),
  description text check (char_length(description) <= 1000),
  unit text check (char_length(unit) <= 30),
  metric public.kpi_metric not null,
  scope_type public.node_type,
  scope_subtype text,
  period public.kpi_period not null default 'all_time',
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (id, business_id)
);

create table public.kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  kpi_id uuid not null,
  business_id uuid not null,
  snap_date date not null default current_date,
  value numeric not null,
  recorded_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (kpi_id, snap_date),
  foreign key (kpi_id, business_id) references public.kpis(id, business_id) on delete cascade
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  description text check (char_length(description) <= 2000),
  based_on public.node_type not null,
  kpi_id uuid,
  target_value numeric not null,
  direction public.goal_direction not null default 'at_least',
  start_date date not null default current_date,
  due_date date,
  status public.goal_status not null default 'active',
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (id, business_id),
  foreign key (kpi_id, business_id) references public.kpis(id, business_id) on delete set null (kpi_id)
);

create table public.goal_nodes (
  goal_id uuid not null,
  node_id uuid not null,
  business_id uuid not null,
  primary key (goal_id, node_id),
  foreign key (goal_id, business_id) references public.goals(id, business_id) on delete cascade,
  foreign key (node_id, business_id) references public.nodes(id, business_id) on delete cascade
);

alter table public.kpis enable row level security;
alter table public.kpi_snapshots enable row level security;
alter table public.goals enable row level security;
alter table public.goal_nodes enable row level security;

create policy kpis_select on public.kpis for select to authenticated using (private.is_member(business_id));
create policy kpis_write on public.kpis for all to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));

create policy kpi_snapshots_select on public.kpi_snapshots for select to authenticated using (private.is_member(business_id));
create policy kpi_snapshots_insert on public.kpi_snapshots for insert to authenticated
  with check (private.has_role(business_id, array['owner','innovation_manager','contributor','evaluator']::public.member_role[]));
create policy kpi_snapshots_update on public.kpi_snapshots for update to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager','contributor','evaluator']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager','contributor','evaluator']::public.member_role[]));

create policy goals_select on public.goals for select to authenticated using (private.is_member(business_id));
create policy goals_write on public.goals for all to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));

create policy goal_nodes_select on public.goal_nodes for select to authenticated using (private.is_member(business_id));
create policy goal_nodes_write on public.goal_nodes for all to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));
