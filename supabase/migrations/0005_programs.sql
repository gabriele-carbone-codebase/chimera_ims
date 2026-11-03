-- Applied to project fltpijvfchuasbpuvkal as "programs_templates".
-- A program is an activity node (subtype 'program') plus a row in public.programs.
-- Its activities are nodes linked with 'part_of' (ordered by relationships.position);
-- people, resources and outputs hang off each activity through performs / uses / produces relationships.
-- create_program() builds a whole program (from a methodology template or blank) in one transaction.
-- Template content lives in the app (so it can be translated); the app sends it as a JSON payload.

alter table public.relationships add column position smallint;

create table public.programs (
  node_id uuid primary key,
  business_id uuid not null,
  template_key text,
  created_at timestamptz not null default now(),
  unique (node_id, business_id),
  foreign key (node_id, business_id) references public.nodes(id, business_id) on delete cascade
);
alter table public.programs enable row level security;
create policy programs_select on public.programs for select to authenticated using (private.is_member(business_id));

-- Reuse an existing node with the same type and title, otherwise create it.
create function private.find_or_create_node(bid uuid, node_kind text, node_subtype text, node_title text, uid uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare nid uuid; k public.node_type := node_kind::public.node_type;
begin
  select id into nid from public.nodes where business_id = bid and type = k and lower(title) = lower(node_title) limit 1;
  if nid is null then
    insert into public.nodes (business_id, type, subtype, title, created_by) values (bid, k, node_subtype, node_title, uid) returning id into nid;
  end if;
  return nid;
end $$;
revoke all on function private.find_or_create_node(uuid, text, text, text, uuid) from public, anon, authenticated;

create function public.create_program(bid uuid, payload jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); pid uuid; aid uuid; act jsonb; it jsonb; item uuid; pos int := 0;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if not private.has_role(bid, array['owner','innovation_manager','contributor']::public.member_role[]) then raise exception 'not allowed'; end if;
  if coalesce(payload->>'name', '') = '' then raise exception 'name required'; end if;

  insert into public.nodes (business_id, type, subtype, title, description, created_by)
  values (bid, 'activity', 'program', payload->>'name', payload->>'description', uid) returning id into pid;
  insert into public.programs (node_id, business_id, template_key) values (pid, bid, nullif(payload->>'template', ''));

  for act in select * from jsonb_array_elements(coalesce(payload->'activities', '[]'::jsonb)) loop
    pos := pos + 1;
    insert into public.nodes (business_id, type, subtype, title, description, created_by)
    values (bid, 'activity', 'process', act->>'title', act->>'description', uid) returning id into aid;
    insert into public.relationships (business_id, from_node, to_node, type, strength, position, created_by)
    values (bid, aid, pid, 'part_of', 'strong', pos, uid);

    for it in select * from jsonb_array_elements(coalesce(act->'performers', '[]'::jsonb)) loop
      item := private.find_or_create_node(bid, 'person', it->>'subtype', it->>'title', uid);
      insert into public.relationships (business_id, from_node, to_node, type, strength, created_by)
      values (bid, item, aid, 'performs', 'strong', uid) on conflict do nothing;
    end loop;
    for it in select * from jsonb_array_elements(coalesce(act->'uses', '[]'::jsonb)) loop
      item := private.find_or_create_node(bid, 'resource', it->>'subtype', it->>'title', uid);
      insert into public.relationships (business_id, from_node, to_node, type, strength, created_by)
      values (bid, aid, item, 'uses', 'strong', uid) on conflict do nothing;
    end loop;
    for it in select * from jsonb_array_elements(coalesce(act->'produces', '[]'::jsonb)) loop
      item := private.find_or_create_node(bid, coalesce(it->>'type', 'concept'), it->>'subtype', it->>'title', uid);
      insert into public.relationships (business_id, from_node, to_node, type, strength, created_by)
      values (bid, aid, item, 'produces', 'strong', uid) on conflict do nothing;
    end loop;
  end loop;
  return pid;
end $$;
revoke all on function public.create_program(uuid, jsonb) from public, anon;
grant execute on function public.create_program(uuid, jsonb) to authenticated;
