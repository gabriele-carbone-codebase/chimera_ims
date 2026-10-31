-- Applied to project fltpijvfchuasbpuvkal as "foundation_profiles_businesses_memberships".
-- Every later table must carry business_id and use private.is_member / private.has_role in its policies.

create type public.member_role as enum ('owner','innovation_manager','evaluator','contributor','viewer');
create type public.expertise_level as enum ('business_owner','technician','specialist','manager');
create type public.app_language as enum ('en','it');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  language public.app_language not null default 'en',
  created_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.memberships (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'contributor',
  expertise_level public.expertise_level,
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);
create index memberships_user_idx on public.memberships(user_id);

-- Helpers live in a private schema so they are not exposed as API endpoints.
create schema private;
grant usage on schema private to authenticated;

create function private.is_member(bid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.memberships m where m.business_id = bid and m.user_id = (select auth.uid()));
$$;

create function private.has_role(bid uuid, roles public.member_role[]) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.memberships m where m.business_id = bid and m.user_id = (select auth.uid()) and m.role = any(roles));
$$;

create function private.shares_business(uid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.memberships a join public.memberships b on a.business_id = b.business_id
    where a.user_id = (select auth.uid()) and b.user_id = uid
  );
$$;

revoke all on function private.is_member(uuid), private.has_role(uuid, public.member_role[]), private.shares_business(uuid) from public, anon;
grant execute on function private.is_member(uuid), private.has_role(uuid, public.member_role[]), private.shares_business(uuid) to authenticated;

-- Profile is created automatically at sign-up.
create function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.memberships enable row level security;

create policy profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()) or private.shares_business(id));
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy businesses_select on public.businesses for select to authenticated using (private.is_member(id));
create policy businesses_update on public.businesses for update to authenticated
  using (private.has_role(id, array['owner']::public.member_role[]))
  with check (private.has_role(id, array['owner']::public.member_role[]));
create policy businesses_delete on public.businesses for delete to authenticated
  using (private.has_role(id, array['owner']::public.member_role[]));

create policy memberships_select on public.memberships for select to authenticated using (private.is_member(business_id));
create policy memberships_insert on public.memberships for insert to authenticated
  with check (private.has_role(business_id, array['owner']::public.member_role[]));
create policy memberships_update on public.memberships for update to authenticated
  using (private.has_role(business_id, array['owner']::public.member_role[]))
  with check (private.has_role(business_id, array['owner']::public.member_role[]));
create policy memberships_delete on public.memberships for delete to authenticated
  using (private.has_role(business_id, array['owner']::public.member_role[]));

-- Creating a business also makes the caller its owner.
create function public.create_business(business_name text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); bid uuid;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  insert into public.businesses (name, created_by) values (business_name, uid) returning id into bid;
  insert into public.memberships (business_id, user_id, role) values (bid, uid, 'owner');
  return bid;
end $$;

-- A member sets their own expertise level (kept separate from role).
create function public.set_expertise(bid uuid, level public.expertise_level) returns void
language sql security definer set search_path = '' as $$
  update public.memberships set expertise_level = level where business_id = bid and user_id = (select auth.uid());
$$;

revoke all on function public.create_business(text), public.set_expertise(uuid, public.expertise_level) from public, anon;
grant execute on function public.create_business(text), public.set_expertise(uuid, public.expertise_level) to authenticated;
