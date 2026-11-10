-- Review fixes (code review of 0001..0007). Applied to project fltpijvfchuasbpuvkal as "hardening".
-- 1. Rows may only reference criteria / assumptions of their own business (composite foreign keys).
-- 2. Nodes: clients cannot rewrite business_id or created_by, cannot change or forge the type of idea / project / program nodes
--    (those are created by submit_idea, create_project and create_program only).
-- 3. A business always keeps at least one owner.
-- 4. Computed KPI snapshots are written by managers only (other roles cannot see every evaluation, so their numbers would be wrong).
-- 5. An evaluator who lost the role can no longer change scores.
-- 6. Split the "for all" write policies so each action has one permissive policy per role, and index business_id on child tables.

-- 1. Same-business references.
alter table public.criteria add constraint criteria_id_business_key unique (id, business_id);
alter table public.gate_criteria add constraint gate_criteria_id_business_key unique (id, business_id);

alter table public.idea_criteria drop constraint idea_criteria_criterion_id_fkey,
  add constraint idea_criteria_criterion_fkey foreign key (criterion_id, business_id) references public.criteria(id, business_id) on delete cascade;
alter table public.evaluations drop constraint evaluations_criterion_id_fkey,
  add constraint evaluations_criterion_fkey foreign key (criterion_id, business_id) references public.criteria(id, business_id) on delete cascade;
alter table public.project_gate_items drop constraint project_gate_items_criterion_id_fkey,
  add constraint project_gate_items_criterion_fkey foreign key (criterion_id, business_id) references public.gate_criteria(id, business_id) on delete cascade;
alter table public.strategy_decisions drop constraint strategy_decisions_assumption_id_fkey,
  add constraint strategy_decisions_assumption_fkey foreign key (assumption_id, business_id) references public.assumptions(id, business_id) on delete set null (assumption_id);

-- 2. Node guard. Only client roles are restricted: security definer functions and foreign key actions run as the table owner.
create function private.guard_node() returns trigger
language plpgsql set search_path = '' as $$
begin
  if current_user not in ('authenticated', 'anon') then return new; end if;
  if tg_op = 'INSERT' then
    if new.subtype in ('idea', 'project', 'program') then raise exception 'use the dedicated function to create this kind of node'; end if;
  else
    new.business_id := old.business_id;
    new.created_by := old.created_by;
    if (old.subtype in ('idea', 'project', 'program') or new.subtype in ('idea', 'project', 'program'))
       and (new.subtype is distinct from old.subtype or new.type <> old.type) then
      raise exception 'type and subtype of this node cannot change';
    end if;
  end if;
  return new;
end $$;
revoke all on function private.guard_node() from public, anon, authenticated;
create trigger nodes_guard before insert or update on public.nodes for each row execute function private.guard_node();

-- 3. Last owner.
create function private.keep_an_owner() returns trigger
language plpgsql set search_path = '' as $$
begin
  if old.role = 'owner' and (tg_op = 'DELETE' or new.role <> 'owner')
     and exists (select 1 from public.businesses b where b.id = old.business_id)
     and not exists (select 1 from public.memberships m where m.business_id = old.business_id and m.role = 'owner' and m.user_id <> old.user_id) then
    raise exception 'a business needs at least one owner';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;
revoke all on function private.keep_an_owner() from public, anon, authenticated;
create trigger memberships_keep_owner before update of role or delete on public.memberships for each row execute function private.keep_an_owner();

-- 4. KPI snapshots: managers only.
drop policy kpi_snapshots_insert on public.kpi_snapshots;
drop policy kpi_snapshots_update on public.kpi_snapshots;
create policy kpi_snapshots_insert on public.kpi_snapshots for insert to authenticated
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));
create policy kpi_snapshots_update on public.kpi_snapshots for update to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]))
  with check (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[]));

-- 5. Evaluations: updating needs the evaluating role too.
drop policy evaluations_update on public.evaluations;
create policy evaluations_update on public.evaluations for update to authenticated
  using (evaluator_id = (select auth.uid()))
  with check (evaluator_id = (select auth.uid())
    and private.has_role(business_id, array['owner','innovation_manager','evaluator']::public.member_role[])
    and exists (select 1 from public.ideas i where i.node_id = idea_id and i.status = 'in_evaluation'));

-- 6. One policy per action. Owners and innovation managers write; strategy content only while the strategy is a draft.
do $$
declare
  t text;
  who text := $c$private.has_role(business_id, array['owner','innovation_manager']::public.member_role[])$c$;
  draft text := $c$ and exists (select 1 from public.strategies s where s.id = strategy_id and s.status = 'draft')$c$;
  cond text;
begin
  foreach t in array array['kpis','goals','goal_nodes','field_settings','node_monitoring','assumptions','assumption_nodes','strategy_investments','strategy_decisions','strategy_assumptions'] loop
    cond := who || case when t like 'strategy\_%' then draft else '' end;
    execute format('drop policy %I on public.%I', t || '_write', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (%s)', t || '_insert', t, cond);
    execute format('create policy %I on public.%I for update to authenticated using (%s) with check (%s)', t || '_update', t, cond, cond);
    execute format('create policy %I on public.%I for delete to authenticated using (%s)', t || '_delete', t, cond);
  end loop;

  foreach t in array array['assumptions','assumption_nodes','assumption_reviews','goals','goal_nodes','kpis','kpi_snapshots','transitions','node_monitoring',
    'strategy_investments','strategy_decisions','strategy_assumptions','idea_criteria','evaluations','project_gate_items','gate_reviews','programs'] loop
    execute format('create index if not exists %I on public.%I (business_id)', t || '_business_idx', t);
  end loop;
end $$;
