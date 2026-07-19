begin;

create table if not exists public.mbw_kamashastra_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  attraction text not null,
  compatibility integer not null check (compatibility between 0 and 100),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.mbw_kamashastra_results enable row level security;

do $$ begin
  create policy "own kamashastra results"
  on public.mbw_kamashastra_results
  for select to authenticated
  using (user_id = auth.uid());
exception when duplicate_object then null; end $$;

create or replace function public.mbw_create_game(
  p_game_type text,
  p_room_size integer
) returns public.mbw_games
language plpgsql security definer set search_path=public
as $$
declare v_game public.mbw_games;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_game_type not in ('LUDO','SEEP','SICBO') then raise exception 'INVALID_GAME'; end if;
  if p_room_size not in (2,4) then raise exception 'INVALID_ROOM_SIZE'; end if;

  insert into public.mbw_games(game_type,room_size,created_by,state)
  values(p_game_type,p_room_size,auth.uid(),jsonb_build_object('turn',0))
  returning * into v_game;

  insert into public.mbw_game_members(game_id,user_id,seat)
  values(v_game.id,auth.uid(),1);

  return v_game;
end $$;

create or replace function public.mbw_join_game(
  p_game_id uuid,
  p_seat integer
) returns public.mbw_games
language plpgsql security definer set search_path=public
as $$
declare v_game public.mbw_games;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_game from public.mbw_games where id=p_game_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;
  if v_game.status <> 'WAITING' then raise exception 'GAME_NOT_JOINABLE'; end if;
  if p_seat < 1 or p_seat > v_game.room_size then raise exception 'INVALID_SEAT'; end if;

  insert into public.mbw_game_members(game_id,user_id,seat)
  values(p_game_id,auth.uid(),p_seat);

  if (select count(*) from public.mbw_game_members where game_id=p_game_id) = v_game.room_size then
    update public.mbw_games set status='ACTIVE',updated_at=now()
    where id=p_game_id returning * into v_game;
  end if;

  return v_game;
end $$;

create or replace function public.mbw_commit_game_action(
  p_game_id uuid,
  p_revision bigint,
  p_action text,
  p_payload jsonb
) returns public.mbw_games
language plpgsql security definer set search_path=public
as $$
declare
  v_game public.mbw_games;
  v_hash text;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_game from public.mbw_games where id=p_game_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;
  if v_game.status <> 'ACTIVE' then raise exception 'GAME_NOT_ACTIVE'; end if;
  if not exists (
    select 1 from public.mbw_game_members
    where game_id=p_game_id and user_id=auth.uid()
  ) then raise exception 'GAME_ACCESS_DENIED'; end if;
  if p_revision <> v_game.revision + 1 then raise exception 'REVISION_CONFLICT'; end if;

  v_hash := encode(digest(
    p_game_id::text || ':' || p_revision::text || ':' ||
    p_action || ':' || coalesce(p_payload,'{}'::jsonb)::text || ':' ||
    gen_random_uuid()::text,
    'sha256'
  ), 'hex');

  insert into public.mbw_game_events(
    game_id,actor_id,revision,action,payload,server_random_hash
  ) values(
    p_game_id,auth.uid(),p_revision,left(p_action,80),
    coalesce(p_payload,'{}'::jsonb),v_hash
  );

  update public.mbw_games
  set revision=p_revision,
      state=state || jsonb_build_object(
        'lastAction',p_action,
        'lastPayload',coalesce(p_payload,'{}'::jsonb),
        'serverRandomHash',v_hash
      ),
      updated_at=now()
  where id=p_game_id
  returning * into v_game;

  return v_game;
end $$;

create or replace function public.mbw_add_coin_proof(
  p_image_path text,
  p_country text,
  p_year integer,
  p_mint text,
  p_condition text,
  p_identification jsonb
) returns public.mbw_coin_vault
language plpgsql security definer set search_path=public
as $$
declare v_coin public.mbw_coin_vault;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;

  insert into public.mbw_coin_vault(
    user_id,image_path,country,year,mint,condition,identification
  ) values(
    auth.uid(),p_image_path,left(p_country,80),p_year,
    left(p_mint,120),left(p_condition,80),
    coalesce(p_identification,'{}'::jsonb)
  )
  returning * into v_coin;

  return v_coin;
end $$;

create or replace function public.mbw_save_kamashastra_result(
  p_attraction text,
  p_compatibility integer,
  p_payload jsonb
) returns public.mbw_kamashastra_results
language plpgsql security definer set search_path=public
as $$
declare v_result public.mbw_kamashastra_results;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_compatibility < 0 or p_compatibility > 100 then
    raise exception 'INVALID_COMPATIBILITY';
  end if;

  insert into public.mbw_kamashastra_results(
    user_id,attraction,compatibility,payload
  ) values(
    auth.uid(),left(p_attraction,80),p_compatibility,
    coalesce(p_payload,'{}'::jsonb)
  )
  returning * into v_result;

  return v_result;
end $$;

grant execute on function public.mbw_create_game(text,integer) to authenticated;
grant execute on function public.mbw_join_game(uuid,integer) to authenticated;
grant execute on function public.mbw_commit_game_action(uuid,bigint,text,jsonb) to authenticated;
grant execute on function public.mbw_add_coin_proof(text,text,integer,text,text,jsonb) to authenticated;
grant execute on function public.mbw_save_kamashastra_result(text,integer,jsonb) to authenticated;

commit;
