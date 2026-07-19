begin;

create extension if not exists pgcrypto;
create extension if not exists cube;
create extension if not exists earthdistance;

do $$ begin create type public.mbw_role as enum ('USER','MBW','MODERATOR','OPERATOR'); exception when duplicate_object then null; end $$;
do $$ begin create type public.mbw_tier as enum ('111','222','333','444','555'); exception when duplicate_object then null; end $$;
do $$ begin create type public.mbw_entitlement_state as enum ('NONE','PENDING','ACTIVE','GRACE','ON_HOLD','PAUSED','EXPIRED','REVOKED','SOVEREIGN'); exception when duplicate_object then null; end $$;
do $$ begin create type public.mbw_report_state as enum ('OPEN','TRIAGED','ACTIONED','REJECTED','APPEALED','CLOSED'); exception when duplicate_object then null; end $$;

create table if not exists public.mbw_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 40),
  whatsapp_number text not null check (char_length(whatsapp_number) between 7 and 24),
  whatsapp_verified boolean not null default false,
  role public.mbw_role not null default 'USER',
  orientation text not null default 'TOP' check (orientation in ('TOP','VT/V/VB','BOTTOM')),
  badge text not null default 'BLACK' check (badge in ('BLACK','GOLDEN','MAROON')),
  birth_date date,
  age_verified boolean not null default false,
  profile_poster_path text,
  city text,
  country_code text,
  discoverable boolean not null default false,
  suspended boolean not null default false,
  deleted_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mbw_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier public.mbw_tier not null default '111',
  state public.mbw_entitlement_state not null default 'NONE',
  source text not null default 'NONE',
  product_id text,
  purchase_token_hash text unique,
  linked_purchase_token_hash text,
  order_id text,
  started_at timestamptz,
  expires_at timestamptz,
  grace_until timestamptz,
  auto_renewing boolean,
  raw_state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.mbw_legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  legal_version text not null,
  privacy_accepted boolean not null,
  terms_accepted boolean not null,
  consent_accepted boolean not null,
  age_18_confirmed boolean not null,
  accepted_at timestamptz not null default now(),
  unique(user_id, legal_version)
);

create table if not exists public.mbw_sovereign_allowlist (
  user_id uuid references auth.users(id) on delete cascade,
  device_hash text,
  enabled boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  check (user_id is not null or device_hash is not null),
  unique(user_id, device_hash)
);

create table if not exists public.mbw_blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table if not exists public.mbw_match_actions (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id) on delete cascade,
  target_id uuid not null references auth.users(id) on delete cascade,
  action text not null check(action in ('PASS','LIKE','SUPER_LIKE')),
  created_at timestamptz not null default now(),
  unique(actor_id, target_id)
);

create table if not exists public.mbw_matches (
  id uuid primary key default gen_random_uuid(),
  user_low uuid not null references auth.users(id) on delete cascade,
  user_high uuid not null references auth.users(id) on delete cascade,
  compatibility integer not null default 0 check(compatibility between 0 and 100),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(user_low, user_high),
  check(user_low < user_high)
);

create table if not exists public.mbw_messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.mbw_matches(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check(char_length(body) between 1 and 4000),
  media_path text,
  moderation_state text not null default 'PENDING',
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.mbw_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null,
  target_id text not null,
  reason text not null check(char_length(reason) between 3 and 120),
  detail text,
  state public.mbw_report_state not null default 'OPEN',
  priority integer not null default 0,
  assigned_to uuid references auth.users(id),
  resolution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mbw_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'POST' check(kind in ('POST','STORY','VIDEO')),
  body text,
  media_path text,
  expires_at timestamptz,
  moderation_state text not null default 'PENDING',
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.mbw_live_rooms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  room_name text not null unique,
  title text not null,
  state text not null default 'CREATED' check(state in ('CREATED','LIVE','ENDED','SUSPENDED')),
  recording_allowed boolean not null default false,
  moderation_state text not null default 'PENDING',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.mbw_travel_hosts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  mode text not null check(mode in ('LOCAL','OVERSEAS')),
  title text not null,
  city text not null,
  country_code text not null,
  latitude double precision,
  longitude double precision,
  capacity integer not null check(capacity between 1 and 5),
  identity_verified boolean not null default false,
  available boolean not null default false,
  moderation_state text not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mbw_travel_bookings (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.mbw_travel_hosts(id),
  guest_id uuid not null references auth.users(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  guests integer not null check(guests between 1 and 5),
  state text not null default 'REQUESTED' check(state in ('REQUESTED','ACCEPTED','REJECTED','CANCELLED','COMPLETED','DISPUTED')),
  cancellation_reason text,
  dispute_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check(end_date >= start_date)
);

create table if not exists public.mbw_products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  title text not null,
  description text,
  price_minor integer not null check(price_minor >= 0),
  currency text not null,
  inventory integer not null default 0 check(inventory >= 0),
  active boolean not null default false,
  tier_required public.mbw_tier not null default '111',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mbw_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  state text not null default 'CREATED' check(state in ('CREATED','PAYMENT_PENDING','PAID','FULFILLED','CANCELLED','REFUNDED','DISPUTED')),
  currency text not null,
  total_minor integer not null check(total_minor >= 0),
  shipping jsonb not null default '{}'::jsonb,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mbw_order_items (
  order_id uuid not null references public.mbw_orders(id) on delete cascade,
  product_id uuid not null references public.mbw_products(id),
  quantity integer not null check(quantity between 1 and 10),
  unit_price_minor integer not null check(unit_price_minor >= 0),
  primary key(order_id, product_id)
);

create table if not exists public.mbw_coin_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance bigint not null default 0 check(balance >= 0),
  last_daily_claim date,
  updated_at timestamptz not null default now()
);

create table if not exists public.mbw_coin_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount bigint not null,
  reason text not null,
  external_ref text,
  created_at timestamptz not null default now()
);

create table if not exists public.mbw_coin_vault (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_path text,
  country text,
  year integer,
  mint text,
  condition text,
  identification jsonb not null default '{}'::jsonb,
  proof_state text not null default 'UNVERIFIED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mbw_games (
  id uuid primary key default gen_random_uuid(),
  game_type text not null check(game_type in ('LUDO','SEEP','SICBO')),
  room_size integer not null check(room_size in (2,4)),
  state jsonb not null default '{}'::jsonb,
  revision bigint not null default 0,
  status text not null default 'WAITING' check(status in ('WAITING','ACTIVE','FINISHED','CANCELLED')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mbw_game_members (
  game_id uuid not null references public.mbw_games(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  seat integer not null,
  joined_at timestamptz not null default now(),
  primary key(game_id, user_id),
  unique(game_id, seat)
);

create table if not exists public.mbw_game_events (
  id bigserial primary key,
  game_id uuid not null references public.mbw_games(id) on delete cascade,
  actor_id uuid references auth.users(id),
  revision bigint not null,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  server_random_hash text,
  created_at timestamptz not null default now(),
  unique(game_id, revision)
);

create table if not exists public.mbw_media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  bucket text not null,
  path text not null,
  mime_type text,
  bytes bigint,
  checksum_sha256 text,
  scan_state text not null default 'PENDING',
  moderation_state text not null default 'PENDING',
  created_at timestamptz not null default now(),
  unique(bucket, path)
);

create table if not exists public.mbw_ai_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  template_id text,
  schema_version integer not null default 1,
  project jsonb not null,
  checksum_sha256 text not null,
  thumbnail_path text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mbw_reactions (
  post_id uuid not null references public.mbw_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction text not null check(reaction in ('LIKE','FIRE','CROWN','ACE')),
  created_at timestamptz not null default now(),
  primary key(post_id,user_id)
);

create table if not exists public.mbw_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.mbw_moderation_appeals (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.mbw_reports(id) on delete cascade,
  appellant_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check(char_length(reason) between 10 and 2000),
  state text not null default 'OPEN' check(state in ('OPEN','UPHELD','OVERTURNED','CLOSED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(report_id,appellant_id)
);

create table if not exists public.mbw_purchase_tokens (
  token_hash text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  order_id text,
  first_seen_at timestamptz not null default now(),
  last_verified_at timestamptz not null default now(),
  state jsonb not null default '{}'::jsonb
);

create table if not exists public.mbw_audit_events (
  id bigserial primary key,
  actor_id uuid,
  action text not null,
  object_type text,
  object_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.mbw_deletion_receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  request_id uuid not null unique,
  completed_at timestamptz not null default now(),
  processors jsonb not null default '{}'::jsonb,
  receipt_hash text not null
);

create table if not exists public.mbw_rate_limits (
  key text primary key,
  window_started_at timestamptz not null default now(),
  count integer not null default 0
);

create or replace function public.mbw_touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;

create or replace function public.mbw_bootstrap_profile(p_display_name text,p_whatsapp text,p_path text default 'FULL_MBW_APP') returns jsonb
language plpgsql security definer set search_path=public as $$
declare v_id uuid:=auth.uid(); v_profile public.mbw_profiles; v_ent public.mbw_entitlements;
begin
 if v_id is null then raise exception 'AUTH_REQUIRED'; end if;
 if char_length(trim(p_display_name))<2 then raise exception 'DISPLAY_NAME_REQUIRED'; end if;
 if char_length(regexp_replace(p_whatsapp,'[^0-9+]','','g'))<7 then raise exception 'WHATSAPP_REQUIRED'; end if;
 insert into public.mbw_profiles(id,display_name,whatsapp_number) values(v_id,upper(trim(p_display_name)),regexp_replace(p_whatsapp,'[^0-9+]','','g'))
 on conflict(id) do update set display_name=excluded.display_name,whatsapp_number=excluded.whatsapp_number,updated_at=now() returning * into v_profile;
 insert into public.mbw_entitlements(user_id) values(v_id) on conflict(user_id) do nothing;
 insert into public.mbw_coin_accounts(user_id) values(v_id) on conflict(user_id) do nothing;
 select * into v_ent from public.mbw_entitlements where user_id=v_id;
 insert into public.mbw_audit_events(actor_id,action,object_type,object_id,metadata) values(v_id,'PROFILE_BOOTSTRAP','PROFILE',v_id::text,jsonb_build_object('path',p_path));
 return jsonb_build_object('profile',to_jsonb(v_profile),'entitlement',to_jsonb(v_ent));
end $$;

create or replace function public.mbw_accept_legal(p_legal_version text,p_privacy boolean,p_terms boolean,p_consent boolean,p_age_18 boolean) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if not(p_privacy and p_terms and p_consent and p_age_18) then raise exception 'ALL_ACCEPTANCES_REQUIRED'; end if;
 insert into public.mbw_legal_acceptances(user_id,legal_version,privacy_accepted,terms_accepted,consent_accepted,age_18_confirmed)
 values(auth.uid(),p_legal_version,p_privacy,p_terms,p_consent,p_age_18)
 on conflict(user_id,legal_version) do update set privacy_accepted=excluded.privacy_accepted,terms_accepted=excluded.terms_accepted,consent_accepted=excluded.consent_accepted,age_18_confirmed=excluded.age_18_confirmed,accepted_at=now();
 return true;
end $$;

create or replace function public.mbw_discover_profiles(p_limit int default 25,p_offset int default 0) returns setof public.mbw_profiles
language sql stable security definer set search_path=public as $$
 select p.* from public.mbw_profiles p where p.id<>auth.uid() and p.role='MBW' and p.discoverable and not p.suspended and p.deleted_at is null
 and not exists(select 1 from public.mbw_blocks b where (b.blocker_id=auth.uid() and b.blocked_id=p.id) or (b.blocker_id=p.id and b.blocked_id=auth.uid()))
 order by p.last_seen_at desc nulls last,p.created_at desc limit greatest(1,least(p_limit,50)) offset greatest(0,p_offset);
$$;

create or replace function public.mbw_match_action(p_target uuid,p_action text) returns jsonb
language plpgsql security definer set search_path=public as $$
declare v_low uuid; v_high uuid; v_match public.mbw_matches;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_target=auth.uid() then raise exception 'SELF_TARGET'; end if;
 if p_action not in('PASS','LIKE','SUPER_LIKE') then raise exception 'BAD_ACTION'; end if;
 insert into public.mbw_match_actions(actor_id,target_id,action) values(auth.uid(),p_target,p_action)
 on conflict(actor_id,target_id) do update set action=excluded.action,created_at=now();
 if p_action in('LIKE','SUPER_LIKE') and exists(select 1 from public.mbw_match_actions where actor_id=p_target and target_id=auth.uid() and action in('LIKE','SUPER_LIKE')) then
  v_low:=least(auth.uid(),p_target); v_high:=greatest(auth.uid(),p_target);
  insert into public.mbw_matches(user_low,user_high,compatibility) values(v_low,v_high,75)
  on conflict(user_low,user_high) do update set active=true returning * into v_match;
  return jsonb_build_object('matched',true,'match',to_jsonb(v_match));
 end if;
 return jsonb_build_object('matched',false);
end $$;

create or replace function public.mbw_send_message(p_match uuid,p_body text) returns public.mbw_messages
language plpgsql security definer set search_path=public as $$
declare v_message public.mbw_messages;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if char_length(trim(p_body)) not between 1 and 4000 then raise exception 'INVALID_MESSAGE'; end if;
 if not exists(select 1 from public.mbw_matches m where m.id=p_match and m.active and auth.uid() in(m.user_low,m.user_high)) then raise exception 'MATCH_ACCESS_DENIED'; end if;
 insert into public.mbw_messages(match_id,sender_id,body) values(p_match,auth.uid(),trim(p_body)) returning * into v_message;
 return v_message;
end $$;

create or replace function public.mbw_block_user(p_target uuid) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 insert into public.mbw_blocks(blocker_id,blocked_id) values(auth.uid(),p_target) on conflict do nothing;
 update public.mbw_matches set active=false where auth.uid() in(user_low,user_high) and p_target in(user_low,user_high);
 return true;
end $$;

create or replace function public.mbw_create_report(p_target_type text,p_target_id text,p_reason text,p_detail text default null) returns uuid
language plpgsql security definer set search_path=public as $$
declare v_id uuid;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 insert into public.mbw_reports(reporter_id,target_type,target_id,reason,detail,priority)
 values(auth.uid(),p_target_type,p_target_id,trim(p_reason),p_detail,case when upper(p_reason)~'(CHILD|MINOR|EXPLOIT|THREAT|SUICIDE|VIOLENCE)' then 100 else 10 end)
 returning id into v_id; return v_id;
end $$;

create or replace function public.mbw_claim_daily_coins() returns jsonb
language plpgsql security definer set search_path=public as $$
declare v_account public.mbw_coin_accounts;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 insert into public.mbw_coin_accounts(user_id) values(auth.uid()) on conflict do nothing;
 select * into v_account from public.mbw_coin_accounts where user_id=auth.uid() for update;
 if v_account.last_daily_claim=current_date then raise exception 'ALREADY_CLAIMED'; end if;
 update public.mbw_coin_accounts set balance=balance+55,last_daily_claim=current_date,updated_at=now() where user_id=auth.uid() returning * into v_account;
 insert into public.mbw_coin_ledger(user_id,amount,reason) values(auth.uid(),55,'DAILY_5FIVE5');
 return to_jsonb(v_account);
end $$;

create or replace function public.mbw_nearby_profiles(p_lat double precision,p_lon double precision,p_radius_km double precision default 25)
returns table(id uuid,display_name text,city text,distance_km double precision)
language sql stable security definer set search_path=public as $$
 select p.id,p.display_name,p.city,earth_distance(ll_to_earth(p_lat,p_lon),ll_to_earth(h.latitude,h.longitude))/1000.0
 from public.mbw_profiles p join public.mbw_travel_hosts h on h.owner_id=p.id
 where p.role='MBW' and p.discoverable and p.deleted_at is null and h.latitude is not null and h.longitude is not null
 and earth_box(ll_to_earth(p_lat,p_lon),p_radius_km*1000) @> ll_to_earth(h.latitude,h.longitude)
 order by 4 asc limit 100;
$$;

create or replace function public.mbw_create_travel_booking(p_host uuid,p_start date,p_end date,p_guests int) returns public.mbw_travel_bookings
language plpgsql security definer set search_path=public as $$
declare v public.mbw_travel_bookings;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_end<p_start or p_guests not between 1 and 5 then raise exception 'INVALID_BOOKING'; end if;
 if not exists(select 1 from public.mbw_travel_hosts where id=p_host and available and identity_verified) then raise exception 'HOST_UNAVAILABLE'; end if;
 insert into public.mbw_travel_bookings(host_id,guest_id,start_date,end_date,guests) values(p_host,auth.uid(),p_start,p_end,p_guests) returning * into v; return v;
end $$;

create or replace function public.mbw_cancel_travel_booking(p_booking uuid,p_reason text) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 update public.mbw_travel_bookings set state='CANCELLED',cancellation_reason=left(p_reason,500),updated_at=now()
 where id=p_booking and guest_id=auth.uid() and state in('REQUESTED','ACCEPTED'); return found;
end $$;

create or replace function public.mbw_data_export() returns jsonb
language sql stable security definer set search_path=public as $$
 select jsonb_build_object(
 'profile',(select to_jsonb(p) from public.mbw_profiles p where id=auth.uid()),
 'entitlement',(select to_jsonb(e) from public.mbw_entitlements e where user_id=auth.uid()),
 'legal',(select coalesce(jsonb_agg(to_jsonb(l)),'[]'::jsonb) from public.mbw_legal_acceptances l where user_id=auth.uid()),
 'matches',(select coalesce(jsonb_agg(to_jsonb(m)),'[]'::jsonb) from public.mbw_matches m where auth.uid() in(m.user_low,m.user_high)),
 'posts',(select coalesce(jsonb_agg(to_jsonb(p)),'[]'::jsonb) from public.mbw_posts p where author_id=auth.uid()),
 'bookings',(select coalesce(jsonb_agg(to_jsonb(b)),'[]'::jsonb) from public.mbw_travel_bookings b where guest_id=auth.uid()),
 'orders',(select coalesce(jsonb_agg(to_jsonb(o)),'[]'::jsonb) from public.mbw_orders o where user_id=auth.uid()),
 'coinVault',(select coalesce(jsonb_agg(to_jsonb(c)),'[]'::jsonb) from public.mbw_coin_vault c where user_id=auth.uid()),
 'aiProjects',(select coalesce(jsonb_agg(to_jsonb(a)),'[]'::jsonb) from public.mbw_ai_projects a where owner_id=auth.uid() and deleted_at is null));
$$;

create or replace function public.mbw_create_post(p_kind text,p_body text,p_media_path text default null,p_expires_at timestamptz default null) returns public.mbw_posts
language plpgsql security definer set search_path=public as $$
declare v public.mbw_posts;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_kind not in('POST','STORY','VIDEO') then raise exception 'INVALID_POST_KIND'; end if;
 if coalesce(char_length(trim(p_body)),0)=0 and p_media_path is null then raise exception 'POST_CONTENT_REQUIRED'; end if;
 insert into public.mbw_posts(author_id,kind,body,media_path,expires_at,moderation_state)
 values(auth.uid(),p_kind,nullif(trim(p_body),''),p_media_path,p_expires_at,'PENDING') returning * into v;
 return v;
end $$;

create or replace function public.mbw_react_post(p_post uuid,p_reaction text) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_reaction not in('LIKE','FIRE','CROWN','ACE') then raise exception 'INVALID_REACTION'; end if;
 insert into public.mbw_reactions(post_id,user_id,reaction) values(p_post,auth.uid(),p_reaction)
 on conflict(post_id,user_id) do update set reaction=excluded.reaction,created_at=now(); return true;
end $$;

create or replace function public.mbw_create_travel_host(p_mode text,p_title text,p_city text,p_country text,p_lat double precision,p_lon double precision,p_capacity int) returns public.mbw_travel_hosts
language plpgsql security definer set search_path=public as $$
declare v public.mbw_travel_hosts;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_mode not in('LOCAL','OVERSEAS') or p_capacity not between 1 and 5 then raise exception 'INVALID_HOST'; end if;
 insert into public.mbw_travel_hosts(owner_id,mode,title,city,country_code,latitude,longitude,capacity)
 values(auth.uid(),p_mode,left(trim(p_title),120),left(trim(p_city),120),upper(left(trim(p_country),3)),p_lat,p_lon,p_capacity) returning * into v; return v;
end $$;

create or replace function public.mbw_set_host_availability(p_host uuid,p_available boolean) returns boolean
language plpgsql security definer set search_path=public as $$
begin
 update public.mbw_travel_hosts set available=p_available,updated_at=now() where id=p_host and owner_id=auth.uid() and identity_verified=true and moderation_state='APPROVED'; return found;
end $$;

create or replace function public.mbw_create_order(p_items jsonb,p_shipping jsonb) returns uuid
language plpgsql security definer set search_path=public as $$
declare v_order uuid:=gen_random_uuid();v_total integer:=0;v_item jsonb;v_product public.mbw_products;v_currency text:=null;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if jsonb_array_length(p_items)=0 then raise exception 'EMPTY_ORDER'; end if;
 for v_item in select * from jsonb_array_elements(p_items) loop
  select * into v_product from public.mbw_products where id=(v_item->>'product_id')::uuid and active for update;
  if not found then raise exception 'PRODUCT_UNAVAILABLE'; end if;
  if (v_item->>'quantity')::int not between 1 and least(10,v_product.inventory) then raise exception 'INVALID_QUANTITY'; end if;
  if v_currency is null then v_currency:=v_product.currency; elsif v_currency<>v_product.currency then raise exception 'MIXED_CURRENCY'; end if;
  v_total:=v_total+v_product.price_minor*(v_item->>'quantity')::int;
 end loop;
 insert into public.mbw_orders(id,user_id,state,currency,total_minor,shipping) values(v_order,auth.uid(),'PAYMENT_PENDING',v_currency,v_total,p_shipping);
 for v_item in select * from jsonb_array_elements(p_items) loop
  select * into v_product from public.mbw_products where id=(v_item->>'product_id')::uuid;
  insert into public.mbw_order_items(order_id,product_id,quantity,unit_price_minor) values(v_order,v_product.id,(v_item->>'quantity')::int,v_product.price_minor);
 end loop;
 return v_order;
end $$;

create or replace function public.mbw_save_coin(p_image_path text,p_country text,p_year int,p_mint text,p_condition text,p_identification jsonb) returns uuid
language plpgsql security definer set search_path=public as $$
declare v uuid;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 insert into public.mbw_coin_vault(user_id,image_path,country,year,mint,condition,identification)
 values(auth.uid(),p_image_path,left(p_country,120),p_year,left(p_mint,120),left(p_condition,120),coalesce(p_identification,'{}'::jsonb)) returning id into v; return v;
end $$;

create or replace function public.mbw_create_game(p_game_type text,p_room_size int) returns uuid
language plpgsql security definer set search_path=public as $$
declare v uuid;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_game_type not in('LUDO','SEEP','SICBO') or p_room_size not in(2,4) then raise exception 'INVALID_GAME'; end if;
 insert into public.mbw_games(game_type,room_size,created_by,state) values(p_game_type,p_room_size,auth.uid(),jsonb_build_object('players',jsonb_build_array(auth.uid()))) returning id into v;
 insert into public.mbw_game_members(game_id,user_id,seat) values(v,auth.uid(),1); return v;
end $$;

create or replace function public.mbw_join_game(p_game uuid) returns int
language plpgsql security definer set search_path=public as $$
declare v_size int;v_count int;v_seat int;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 select room_size into v_size from public.mbw_games where id=p_game and status='WAITING' for update;
 if not found then raise exception 'GAME_NOT_JOINABLE'; end if;
 select count(*) into v_count from public.mbw_game_members where game_id=p_game;
 if v_count>=v_size then raise exception 'ROOM_FULL'; end if;
 v_seat:=v_count+1;insert into public.mbw_game_members(game_id,user_id,seat) values(p_game,auth.uid(),v_seat) on conflict(game_id,user_id) do update set seat=excluded.seat;
 if v_seat=v_size then update public.mbw_games set status='ACTIVE',updated_at=now() where id=p_game; end if; return v_seat;
end $$;

create or replace function public.mbw_game_event(p_game uuid,p_expected_revision bigint,p_action text,p_payload jsonb,p_server_random_hash text default null) returns bigint
language plpgsql security definer set search_path=public as $$
declare v_revision bigint;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if not exists(select 1 from public.mbw_game_members where game_id=p_game and user_id=auth.uid()) then raise exception 'GAME_ACCESS_DENIED'; end if;
 update public.mbw_games set revision=revision+1,updated_at=now() where id=p_game and revision=p_expected_revision and status='ACTIVE' returning revision into v_revision;
 if not found then raise exception 'STALE_GAME_REVISION'; end if;
 insert into public.mbw_game_events(game_id,actor_id,revision,action,payload,server_random_hash) values(p_game,auth.uid(),v_revision,left(p_action,80),coalesce(p_payload,'{}'::jsonb),p_server_random_hash); return v_revision;
end $$;

create or replace function public.mbw_save_ai_project(p_id uuid,p_name text,p_template text,p_schema int,p_project jsonb,p_checksum text,p_thumbnail text default null) returns uuid
language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 insert into public.mbw_ai_projects(id,owner_id,name,template_id,schema_version,project,checksum_sha256,thumbnail_path)
 values(p_id,auth.uid(),left(p_name,120),p_template,p_schema,p_project,p_checksum,p_thumbnail)
 on conflict(id) do update set name=excluded.name,template_id=excluded.template_id,schema_version=excluded.schema_version,project=excluded.project,checksum_sha256=excluded.checksum_sha256,thumbnail_path=excluded.thumbnail_path,updated_at=now()
 where public.mbw_ai_projects.owner_id=auth.uid(); return p_id;
end $$;

create or replace function public.mbw_appeal_report(p_report uuid,p_reason text) returns uuid
language plpgsql security definer set search_path=public as $$
declare v uuid;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 insert into public.mbw_moderation_appeals(report_id,appellant_id,reason) values(p_report,auth.uid(),trim(p_reason))
 on conflict(report_id,appellant_id) do update set reason=excluded.reason,state='OPEN',updated_at=now() returning id into v; return v;
end $$;

revoke all on all tables in schema public from anon,authenticated;
grant select on public.mbw_profiles,public.mbw_entitlements,public.mbw_legal_acceptances,public.mbw_matches,public.mbw_messages,public.mbw_posts,public.mbw_reactions,public.mbw_notifications,public.mbw_moderation_appeals,public.mbw_live_rooms,public.mbw_travel_hosts,public.mbw_travel_bookings,public.mbw_products,public.mbw_orders,public.mbw_order_items,public.mbw_coin_accounts,public.mbw_coin_ledger,public.mbw_coin_vault,public.mbw_games,public.mbw_game_members,public.mbw_game_events,public.mbw_media_assets to authenticated;
grant select,insert,update on public.mbw_ai_projects to authenticated;
grant execute on function public.mbw_bootstrap_profile(text,text,text),public.mbw_accept_legal(text,boolean,boolean,boolean,boolean),public.mbw_discover_profiles(int,int),public.mbw_match_action(uuid,text),public.mbw_send_message(uuid,text),public.mbw_block_user(uuid),public.mbw_create_report(text,text,text,text),public.mbw_claim_daily_coins(),public.mbw_nearby_profiles(double precision,double precision,double precision),public.mbw_create_travel_booking(uuid,date,date,int),public.mbw_cancel_travel_booking(uuid,text),public.mbw_create_post(text,text,text,timestamptz),public.mbw_react_post(uuid,text),public.mbw_create_travel_host(text,text,text,text,double precision,double precision,int),public.mbw_set_host_availability(uuid,boolean),public.mbw_create_order(jsonb,jsonb),public.mbw_save_coin(text,text,int,text,text,jsonb),public.mbw_create_game(text,int),public.mbw_join_game(uuid),public.mbw_game_event(uuid,bigint,text,jsonb,text),public.mbw_save_ai_project(uuid,text,text,int,jsonb,text,text),public.mbw_appeal_report(uuid,text),public.mbw_data_export() to authenticated;

alter table public.mbw_profiles enable row level security;
alter table public.mbw_entitlements enable row level security;
alter table public.mbw_legal_acceptances enable row level security;
alter table public.mbw_sovereign_allowlist enable row level security;
alter table public.mbw_blocks enable row level security;
alter table public.mbw_match_actions enable row level security;
alter table public.mbw_matches enable row level security;
alter table public.mbw_messages enable row level security;
alter table public.mbw_reports enable row level security;
alter table public.mbw_reactions enable row level security;
alter table public.mbw_notifications enable row level security;
alter table public.mbw_moderation_appeals enable row level security;
alter table public.mbw_posts enable row level security;
alter table public.mbw_live_rooms enable row level security;
alter table public.mbw_travel_hosts enable row level security;
alter table public.mbw_travel_bookings enable row level security;
alter table public.mbw_products enable row level security;
alter table public.mbw_orders enable row level security;
alter table public.mbw_order_items enable row level security;
alter table public.mbw_coin_accounts enable row level security;
alter table public.mbw_coin_ledger enable row level security;
alter table public.mbw_coin_vault enable row level security;
alter table public.mbw_games enable row level security;
alter table public.mbw_game_members enable row level security;
alter table public.mbw_game_events enable row level security;
alter table public.mbw_media_assets enable row level security;
alter table public.mbw_ai_projects enable row level security;
alter table public.mbw_purchase_tokens enable row level security;
alter table public.mbw_audit_events enable row level security;
alter table public.mbw_deletion_receipts enable row level security;
alter table public.mbw_rate_limits enable row level security;

create policy "profile self or discoverable mbw" on public.mbw_profiles for select to authenticated using(id=auth.uid() or(role='MBW' and discoverable and not suspended and deleted_at is null));
create policy "own entitlement" on public.mbw_entitlements for select to authenticated using(user_id=auth.uid());
create policy "own legal" on public.mbw_legal_acceptances for select to authenticated using(user_id=auth.uid());
create policy "participant matches" on public.mbw_matches for select to authenticated using(auth.uid() in(user_low,user_high));
create policy "participant messages" on public.mbw_messages for select to authenticated using(exists(select 1 from public.mbw_matches m where m.id=match_id and auth.uid() in(m.user_low,m.user_high)));
create policy "visible reactions" on public.mbw_reactions for select to authenticated using(exists(select 1 from public.mbw_posts p where p.id=post_id and p.deleted_at is null));
create policy "own notifications" on public.mbw_notifications for select to authenticated using(user_id=auth.uid());
create policy "own appeals" on public.mbw_moderation_appeals for select to authenticated using(appellant_id=auth.uid());
create policy "visible posts" on public.mbw_posts for select to authenticated using(deleted_at is null and moderation_state in('APPROVED','PENDING'));
create policy "live rooms visible" on public.mbw_live_rooms for select to authenticated using(state in('CREATED','LIVE') and moderation_state<>'REJECTED');
create policy "verified hosts" on public.mbw_travel_hosts for select to authenticated using(identity_verified and available and moderation_state='APPROVED');
create policy "own bookings" on public.mbw_travel_bookings for select to authenticated using(guest_id=auth.uid() or exists(select 1 from public.mbw_travel_hosts h where h.id=host_id and h.owner_id=auth.uid()));
create policy "active products" on public.mbw_products for select to authenticated using(active);
create policy "own orders" on public.mbw_orders for select to authenticated using(user_id=auth.uid());
create policy "own order items" on public.mbw_order_items for select to authenticated using(exists(select 1 from public.mbw_orders o where o.id=order_id and o.user_id=auth.uid()));
create policy "own coin account" on public.mbw_coin_accounts for select to authenticated using(user_id=auth.uid());
create policy "own coin ledger" on public.mbw_coin_ledger for select to authenticated using(user_id=auth.uid());
create policy "own coin vault" on public.mbw_coin_vault for select to authenticated using(user_id=auth.uid());
create policy "game member view" on public.mbw_games for select to authenticated using(created_by=auth.uid() or exists(select 1 from public.mbw_game_members gm where gm.game_id=id and gm.user_id=auth.uid()));
create policy "own ai select" on public.mbw_ai_projects for select to authenticated using(owner_id=auth.uid() and deleted_at is null);
create policy "own ai insert" on public.mbw_ai_projects for insert to authenticated with check(owner_id=auth.uid());
create policy "own ai update" on public.mbw_ai_projects for update to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
('mbw-profile-media','mbw-profile-media',false,15728640,array['image/jpeg','image/png','image/webp']),
('mbw-social-media','mbw-social-media',false,104857600,array['image/jpeg','image/png','image/webp','video/mp4']),
('mbw-ai-projects','mbw-ai-projects',false,157286400,array['image/jpeg','image/png','application/json','application/octet-stream'])
on conflict(id) do nothing;

create policy "profile owner storage" on storage.objects for all to authenticated using(bucket_id='mbw-profile-media' and(storage.foldername(name))[1]=auth.uid()::text) with check(bucket_id='mbw-profile-media' and(storage.foldername(name))[1]=auth.uid()::text);
create policy "social owner storage" on storage.objects for all to authenticated using(bucket_id='mbw-social-media' and(storage.foldername(name))[1]=auth.uid()::text) with check(bucket_id='mbw-social-media' and(storage.foldername(name))[1]=auth.uid()::text);
create policy "ai owner storage" on storage.objects for all to authenticated using(bucket_id='mbw-ai-projects' and(storage.foldername(name))[1]=auth.uid()::text) with check(bucket_id='mbw-ai-projects' and(storage.foldername(name))[1]=auth.uid()::text);

alter publication supabase_realtime add table public.mbw_messages;
alter publication supabase_realtime add table public.mbw_matches;
alter publication supabase_realtime add table public.mbw_posts;
alter publication supabase_realtime add table public.mbw_live_rooms;
alter publication supabase_realtime add table public.mbw_game_events;

commit;
