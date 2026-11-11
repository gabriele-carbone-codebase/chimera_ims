-- Security scan fixes. Applied to project fltpijvfchuasbpuvkal as "security_fixes".
-- 1. Anonymity: a relationship that touches an anonymous idea never records its author (relationships.created_by would have
--    revealed who submitted the idea). Existing rows are cleaned too.
-- 2. Forged nodes: find_or_create_node (called by create_program) only creates and reuses person / resource / concept nodes and
--    never an idea / project / program; create_program caps the size of its payload.
-- 3. Clients cannot rewrite created_by, business_id or the endpoints of a relationship.

-- 1. Anonymous links. Security definer so it can read ideas whatever the caller's role; it only edits the row being written.
create function private.anonymize_relationship() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.ideas i where i.anonymous and i.node_id in (new.from_node, new.to_node)) then
    new.created_by := null;
  else
    new.created_by := coalesce(new.created_by, (select auth.uid()));
  end if;
  return new;
end $$;
revoke all on function private.anonymize_relationship() from public, anon, authenticated;
create trigger relationships_anonymize before insert on public.relationships for each row execute function private.anonymize_relationship();

update public.relationships r set created_by = null
where created_by is not null and exists (select 1 from public.ideas i where i.anonymous and i.node_id in (r.from_node, r.to_node));

-- The trigger runs before the policy check, so a link to an anonymous idea arrives with created_by null: accept that, and only that.
-- Consequence: a contributor cannot later edit such a link (relationships_update needs created_by = uid); owners and managers can.
drop policy relationships_insert on public.relationships;
create policy relationships_insert on public.relationships for insert to authenticated
  with check (private.has_role(business_id, array['owner','innovation_manager','contributor']::public.member_role[])
    and (created_by is null or created_by = (select auth.uid())));

-- 3. Relationship guard (same pattern as guard_node). Only client roles are restricted.
create function private.guard_relationship() returns trigger
language plpgsql set search_path = '' as $$
begin
  if current_user in ('authenticated', 'anon') then
    new.business_id := old.business_id;
    new.created_by := old.created_by;
    new.from_node := old.from_node;
    new.to_node := old.to_node;
  end if;
  return new;
end $$;
revoke all on function private.guard_relationship() from public, anon, authenticated;
create trigger relationships_guard before update on public.relationships for each row execute function private.guard_relationship();

-- 2. Nodes made on behalf of the caller.
create or replace function private.find_or_create_node(bid uuid, node_kind text, node_subtype text, node_title text, uid uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare nid uuid; k public.node_type;
begin
  if node_kind is null or node_kind not in ('person', 'resource', 'concept') then raise exception 'invalid node kind'; end if;
  if node_subtype in ('idea', 'project', 'program') then raise exception 'invalid node subtype'; end if;
  k := node_kind::public.node_type;
  select id into nid from public.nodes
  where business_id = bid and type = k and lower(title) = lower(node_title) and coalesce(subtype, '') not in ('idea', 'project', 'program') limit 1;
  if nid is null then
    insert into public.nodes (business_id, type, subtype, title, created_by) values (bid, k, node_subtype, node_title, uid) returning id into nid;
  end if;
  return nid;
end $$;

-- Returns the array if it is small enough.
create function private.capped(arr jsonb, max_len int) returns jsonb
language plpgsql immutable set search_path = '' as $$
begin
  if jsonb_typeof(arr) <> 'array' or jsonb_array_length(arr) > max_len then raise exception 'payload too large'; end if;
  return arr;
end $$;
revoke all on function private.capped(jsonb, int) from public, anon, authenticated;

create or replace function public.create_program(bid uuid, payload jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); pid uuid; aid uuid; act jsonb; it jsonb; item uuid; pos int := 0;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if not private.has_role(bid, array['owner','innovation_manager','contributor']::public.member_role[]) then raise exception 'not allowed'; end if;
  if coalesce(payload->>'name', '') = '' then raise exception 'name required'; end if;

  insert into public.nodes (business_id, type, subtype, title, description, created_by)
  values (bid, 'activity', 'program', payload->>'name', payload->>'description', uid) returning id into pid;
  insert into public.programs (node_id, business_id, template_key) values (pid, bid, nullif(payload->>'template', ''));

  for act in select * from jsonb_array_elements(private.capped(coalesce(payload->'activities', '[]'::jsonb), 30)) loop
    pos := pos + 1;
    insert into public.nodes (business_id, type, subtype, title, description, created_by)
    values (bid, 'activity', 'process', act->>'title', act->>'description', uid) returning id into aid;
    insert into public.relationships (business_id, from_node, to_node, type, strength, position, created_by)
    values (bid, aid, pid, 'part_of', 'strong', pos, uid);

    for it in select * from jsonb_array_elements(private.capped(coalesce(act->'performers', '[]'::jsonb), 20)) loop
      item := private.find_or_create_node(bid, 'person', it->>'subtype', it->>'title', uid);
      insert into public.relationships (business_id, from_node, to_node, type, strength, created_by)
      values (bid, item, aid, 'performs', 'strong', uid) on conflict do nothing;
    end loop;
    for it in select * from jsonb_array_elements(private.capped(coalesce(act->'uses', '[]'::jsonb), 20)) loop
      item := private.find_or_create_node(bid, 'resource', it->>'subtype', it->>'title', uid);
      insert into public.relationships (business_id, from_node, to_node, type, strength, created_by)
      values (bid, aid, item, 'uses', 'strong', uid) on conflict do nothing;
    end loop;
    for it in select * from jsonb_array_elements(private.capped(coalesce(act->'produces', '[]'::jsonb), 20)) loop
      item := private.find_or_create_node(bid, coalesce(it->>'type', 'concept'), it->>'subtype', it->>'title', uid);
      insert into public.relationships (business_id, from_node, to_node, type, strength, created_by)
      values (bid, aid, item, 'produces', 'strong', uid) on conflict do nothing;
    end loop;
  end loop;
  return pid;
end $$;
