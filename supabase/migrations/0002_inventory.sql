-- Applied to project fltpijvfchuasbpuvkal as "inventory_nodes_and_relationships".
-- nodes = the four entity types (person, resource, concept, activity); relationships = the fifth entity,
-- a first-class link between two nodes with a strength. "none" means "assessed, no relationship";
-- no row means "not assessed yet".

create type public.node_type as enum ('person','resource','concept','activity');
create type public.relationship_strength as enum ('none','weak','strong');
create type public.relationship_type as enum ('performs','uses','produces','owns','part_of','derived_from','targets','related_to');

create table public.nodes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type public.node_type not null,
  subtype text,
  title text not null check (char_length(title) between 1 and 200),
  description text check (char_length(description) <= 4000),
  status text not null default 'active',
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (id, business_id)
);
create index nodes_business_type_idx on public.nodes(business_id, type);

create table public.relationships (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  from_node uuid not null,
  to_node uuid not null,
  type public.relationship_type not null default 'related_to',
  strength public.relationship_strength not null default 'weak',
  note text check (char_length(note) <= 1000),
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (from_node <> to_node),
  unique (business_id, from_node, to_node, type),
  foreign key (from_node, business_id) references public.nodes(id, business_id) on delete cascade,
  foreign key (to_node, business_id) references public.nodes(id, business_id) on delete cascade
);
create index relationships_from_idx on public.relationships(from_node);
create index relationships_to_idx on public.relationships(to_node);

alter table public.nodes enable row level security;
alter table public.relationships enable row level security;

-- Everyone in the business can read. Owners and innovation managers can change anything;
-- contributors can add, and change only what they created.
create policy nodes_select on public.nodes for select to authenticated using (private.is_member(business_id));
create policy nodes_insert on public.nodes for insert to authenticated
  with check (private.has_role(business_id, array['owner','innovation_manager','contributor']::public.member_role[]) and created_by = (select auth.uid()));
create policy nodes_update on public.nodes for update to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[])
    or (created_by = (select auth.uid()) and private.has_role(business_id, array['contributor']::public.member_role[])))
  with check (private.has_role(business_id, array['owner','innovation_manager','contributor']::public.member_role[]));
create policy nodes_delete on public.nodes for delete to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[])
    or (created_by = (select auth.uid()) and private.has_role(business_id, array['contributor']::public.member_role[])));

create policy relationships_select on public.relationships for select to authenticated using (private.is_member(business_id));
create policy relationships_insert on public.relationships for insert to authenticated
  with check (private.has_role(business_id, array['owner','innovation_manager','contributor']::public.member_role[]) and created_by = (select auth.uid()));
create policy relationships_update on public.relationships for update to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[])
    or (created_by = (select auth.uid()) and private.has_role(business_id, array['contributor']::public.member_role[])))
  with check (private.has_role(business_id, array['owner','innovation_manager','contributor']::public.member_role[]));
create policy relationships_delete on public.relationships for delete to authenticated
  using (private.has_role(business_id, array['owner','innovation_manager']::public.member_role[])
    or (created_by = (select auth.uid()) and private.has_role(business_id, array['contributor']::public.member_role[])));
