-- Applied to project fltpijvfchuasbpuvkal as "field_assumptions_strategy".
-- Innovation field: every node is a known artifact; node_monitoring marks the monitored ones;
-- field_settings holds the owner's estimate of the real field (to show coverage).
-- Assumptions are checkable (status, evidence, trigger, review schedule) and reviewed on a schedule.
-- Strategies are versioned (draft, active, archived). A strategy holds investments per activity
-- (amount + unit; investment above zero = the activity is used), explicit "not used" decisions with
-- their assumption, and the assumptions it rests on (status_at_link is the baseline used to measure drift).
-- Activating a draft archives the current strategy and records an innovation transition.

create type public.assumption_status as enum ('unverified','valid','invalid');
create type public.strategy_status as enum ('draft','active','archived');

create table public.field_settings (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  estimated_total int check (estimated_total >= 0),
  notes text check (char_length(notes) <= 4000),
  updated_at timestamptz not null default now()
);

create table public.node_monitoring (
  node_id uuid primary key,
  business_id uuid not null,
  owner_id uuid references auth.users(id) on delete set null,
  review_every_days int not null default 180 check (review_every_days > 0),
  next_review date not null default (current_date + 180),
  last_reviewed_at timestamptz,
  foreign key (node_id, business_id) references public.nodes(id, business_id) on delete cascade
);

create table public.assumptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  statement text not null check (char_length(statement) between 1 and 1000),
  status public.assumption_status not null default 'unverified',
  evidence text check (char_length(evidence) <= 2000),
  trigger_text text check (char_length(trigger_text) <= 1000),
  review_every_days int not null default 90 check (review_every_days > 0),
  next_review date not null default (current_date + 90),
  last_reviewed_at timestamptz,
  accepted_risk boolean not null default false,
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (id, business_id)
);

create table public.assumption_nodes (
  assumption_id uuid not null,
  node_id uuid not null,
  business_id uuid not null,
  primary key (assumption_id, node_id),
  foreign key (assumption_id, business_id) references public.assumptions(id, business_id) on delete cascade,
  foreign key (node_id, business_id) references public.nodes(id, business_id) on delete cascade
);

create table public.assumption_reviews (
  id uuid primary key default gen_random_uuid(),
  assumption_id uuid not null,
  business_id uuid not null,
  status public.assumption_status not null,
  note text check (char_length(note) <= 2000),
  reviewed_by uuid default auth.uid() references auth.users(id) on delete set null,
  reviewed_at timestamptz not null default now(),
  foreign key (assumption_id, business_id) references public.assumptions(id, business_id) on delete cascade
);

create table public.strategies (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  version int not null,
  title text not null check (char_length(title) between 1 and 200),
  summary text check (char_length(summary) <= 8000),
  status public.strategy_status not null default 'draft',
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  activated_at timestamptz,
  unique (business_id, version),
  unique (id, business_id)
);
create unique index strategies_one_active_idx on public.strategies(business_id) where status = 'active';
create unique index strategies_one_draft_idx on public.strategies(business_id) where status = 'draft';

create table public.strategy_investments (
  strategy_id uuid not null,
  activity_id uuid not null,
  business_id uuid not null,
  amount numeric not null default 0 check (amount >= 0),
  unit text not null default 'hours' check (unit in ('hours','money','days')),
  effectiveness numeric,
  primary key (strategy_id, activity_id),
  foreign key (strategy_id, business_id) references public.strategies(id, business_id) on delete cascade,
  foreign key (activity_id, business_id) references public.nodes(id, business_id) on delete cascade
);

create table public.strategy_decisions (
  strategy_id uuid not null,
  node_id uuid not null,
  business_id uuid not null,
  assumption_id uuid references public.assumptions(id) on delete set null,
  note text check (char_length(note) <= 1000),
  primary key (strategy_id, node_id),
  foreign key (strategy_id, business_id) references public.strategies(id, business_id) on delete cascade,
  foreign key (node_id, business_id) references public.nodes(id, business_id) on delete cascade
);

create table public.strategy_assumptions (
  strategy_id uuid not null,
  assumption_id uuid not null,
  business_id uuid not null,
  status_at_link public.assumption_status not null,
  primary key (strategy_id, assumption_id),
  foreign key (strategy_id, business_id) references public.strategies(id, business_id) on delete cascade,
  foreign key (assumption_id, business_id) references public.assumptions(id, business_id) on delete cascade
);

create table public.transitions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  from_strategy uuid references public.strategies(id) on delete set null,
  to_strategy uuid references public.strategies(id) on delete set null,
  reason text check (char_length(reason) <= 2000),
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.field_settings enable row level security;
alter table public.node_monitoring enable row level security;
alter table public.assumptions enable row level security;
alter table public.assumption_nodes enable row level security;
alter table public.assumption_reviews enable row level security;
alter table public.strategies enable row level security;
alter table public.strategy_investments enable row level security;
alter table public.strategy_decisions enable row level security;
alter table public.strategy_assumptions enable row level security;
alter table public.transitions enable row level security;

-- Everyone in the business reads; owners and innovation managers write.
create policy field_settings_select on public.field_settings for select to authenticated using (private.is_member(business_id));
create policy field_settings_write on public.field_settings for all to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));

create policy node_monitoring_select on public.node_monitoring for select to authenticated using (private.is_member(business_id));
create policy node_monitoring_write on public.node_monitoring for all to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));

create policy assumptions_select on public.assumptions for select to authenticated using (private.is_member(business_id));
create policy assumptions_write on public.assumptions for all to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));

create policy assumption_nodes_select on public.assumption_nodes for select to authenticated using (private.is_member(business_id));
create policy assumption_nodes_write on public.assumption_nodes for all to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));

create policy assumption_reviews_select on public.assumption_reviews for select to authenticated using (private.is_member(business_id));

create policy strategies_select on public.strategies for select to authenticated using (private.is_member(business_id));
create policy strategies_update on public.strategies for update to authenticated
  using (status = 'draft' and private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (status = 'draft' and private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));
create policy strategies_delete on public.strategies for delete to authenticated
  using (status = 'draft' and private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));

-- The content of a strategy can only change while it is a draft.
create policy strategy_investments_select on public.strategy_investments for select to authenticated using (private.is_member(business_id));
create policy strategy_investments_write on public.strategy_investments for all to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]) and exists (select 1 from public.strategies s where s.id = strategy_id and s.status = 'draft'))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]) and exists (select 1 from public.strategies s where s.id = strategy_id and s.status = 'draft'));

create policy strategy_decisions_select on public.strategy_decisions for select to authenticated using (private.is_member(business_id));
create policy strategy_decisions_write on public.strategy_decisions for all to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]) and exists (select 1 from public.strategies s where s.id = strategy_id and s.status = 'draft'))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]) and exists (select 1 from public.strategies s where s.id = strategy_id and s.status = 'draft'));

create policy strategy_assumptions_select on public.strategy_assumptions for select to authenticated using (private.is_member(business_id));
create policy strategy_assumptions_write on public.strategy_assumptions for all to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]) and exists (select 1 from public.strategies s where s.id = strategy_id and s.status = 'draft'))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]) and exists (select 1 from public.strategies s where s.id = strategy_id and s.status = 'draft'));

create policy transitions_select on public.transitions for select to authenticated using (private.is_member(business_id));

-- New draft, copied from the active strategy (or the latest one).
create function public.create_strategy_draft(bid uuid, strategy_title text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); src uuid; v int; sid uuid;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if not private.has_role(bid, array['owner','innovation_manager']::public.member_role[]) then raise exception 'not allowed'; end if;
  if exists (select 1 from public.strategies where business_id = bid and status = 'draft') then raise exception 'a draft already exists'; end if;
  select coalesce(max(version), 0) + 1 into v from public.strategies where business_id = bid;
  select id into src from public.strategies where business_id = bid and status = 'active';
  if src is null then select id into src from public.strategies where business_id = bid order by version desc limit 1; end if;
  insert into public.strategies (business_id, version, title, summary, status, created_by)
  values (bid, v, strategy_title, (select summary from public.strategies where id = src), 'draft', uid) returning id into sid;
  if src is not null then
    insert into public.strategy_investments (strategy_id, activity_id, business_id, amount, unit, effectiveness)
      select sid, activity_id, business_id, amount, unit, effectiveness from public.strategy_investments where strategy_id = src;
    insert into public.strategy_decisions (strategy_id, node_id, business_id, assumption_id, note)
      select sid, node_id, business_id, assumption_id, note from public.strategy_decisions where strategy_id = src;
    insert into public.strategy_assumptions (strategy_id, assumption_id, business_id, status_at_link)
      select sid, sa.assumption_id, sa.business_id, a.status from public.strategy_assumptions sa join public.assumptions a on a.id = sa.assumption_id where sa.strategy_id = src;
  end if;
  return sid;
end $$;

-- Make a draft the active strategy. The previous one is archived and a transition is recorded.
create function public.activate_strategy(sid uuid, transition_reason text) returns void
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); s public.strategies; prev uuid;
begin
  select * into s from public.strategies where id = sid for update;
  if not found then raise exception 'strategy not found'; end if;
  if not private.has_role(s.business_id, array['owner','innovation_manager']::public.member_role[]) then raise exception 'not allowed'; end if;
  if s.status <> 'draft' then raise exception 'only a draft can be activated'; end if;
  select id into prev from public.strategies where business_id = s.business_id and status = 'active';
  if prev is not null then update public.strategies set status = 'archived' where id = prev; end if;
  update public.strategies set status = 'active', activated_at = now() where id = sid;
  update public.strategy_assumptions sa set status_at_link = a.status from public.assumptions a where sa.strategy_id = sid and a.id = sa.assumption_id;
  insert into public.transitions (business_id, from_strategy, to_strategy, reason, created_by) values (s.business_id, prev, sid, transition_reason, uid);
end $$;

-- Record a scheduled (or ad-hoc) review of an assumption and schedule the next one.
create function public.review_assumption(aid uuid, new_status public.assumption_status, review_note text, risk_accepted boolean default false) returns void
language plpgsql security definer set search_path = '' as $$
declare a public.assumptions;
begin
  select * into a from public.assumptions where id = aid for update;
  if not found then raise exception 'assumption not found'; end if;
  if not private.has_role(a.business_id, array['owner','innovation_manager']::public.member_role[]) then raise exception 'not allowed'; end if;
  update public.assumptions
    set status = new_status, last_reviewed_at = now(), next_review = current_date + review_every_days,
        accepted_risk = (new_status = 'invalid' and risk_accepted)
    where id = aid;
  insert into public.assumption_reviews (assumption_id, business_id, status, note, reviewed_by) values (aid, a.business_id, new_status, review_note, (select auth.uid()));
end $$;

revoke all on function public.create_strategy_draft(uuid, text), public.activate_strategy(uuid, text), public.review_assumption(uuid, public.assumption_status, text, boolean) from public, anon;
grant execute on function public.create_strategy_draft(uuid, text), public.activate_strategy(uuid, text), public.review_assumption(uuid, public.assumption_status, text, boolean) to authenticated;

-- Dismissed (read) notifications, per user.
create table public.notification_dismissals (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  key text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, business_id, key)
);
alter table public.notification_dismissals enable row level security;
create policy dismissals_select on public.notification_dismissals for select to authenticated using (user_id = (select auth.uid()));
create policy dismissals_insert on public.notification_dismissals for insert to authenticated
  with check (user_id = (select auth.uid()) and private.is_member(business_id));
create policy dismissals_delete on public.notification_dismissals for delete to authenticated using (user_id = (select auth.uid()));
