-- Pivot GazExpress : suppression des vendeurs + commandes en base + admin.
-- À appliquer sur le projet gaz-express (via MCP apply_migration ou le SQL Editor).

-- 1. Rôles : 'user' | 'admin' (plus de 'vendor').
alter table public.profiles drop constraint if exists profiles_role_check;
update public.profiles set role = 'user' where role not in ('user', 'admin');
alter table public.profiles
  add constraint profiles_role_check check (role in ('user', 'admin'));

-- 2. Fonction utilitaire : l'appelant est-il admin ? (SECURITY DEFINER pour
--    contourner la RLS de profiles sans récursion). N'expose que le statut
--    admin de l'appelant lui-même.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 3. Table des commandes.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_name text,
  client_whatsapp text,
  brand_id text,
  brand_name text,
  kg numeric,
  type text check (type in ('echange', 'neuf')),
  address_label text,
  address_details text,
  address_lat float8,
  address_lng float8,
  payment_id text,
  product_price integer not null,
  delivery_fee integer not null default 0,
  total integer not null,
  distance_km numeric,
  status text not null default 'en_attente'
    check (status in ('en_attente', 'acceptee', 'en_route', 'livree', 'annulee')),
  rating integer check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

alter table public.orders enable row level security;

drop policy if exists orders_insert_own on public.orders;
create policy orders_insert_own on public.orders
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists orders_select_own_or_admin on public.orders;
create policy orders_select_own_or_admin on public.orders
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists orders_update_own_or_admin on public.orders;
create policy orders_update_own_or_admin on public.orders
  for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- 4. Nettoyage vendeur (plus utilisé).
drop table if exists public.vendor_details cascade;
delete from storage.buckets where id = 'cip';

-- 5. Désigner l'administrateur (le compte doit s'être inscrit au moins une fois).
update public.profiles set role = 'admin' where email = 'thee40775@gmail.com';
