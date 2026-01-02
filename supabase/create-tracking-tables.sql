-- ================================================
-- WorkFree Tracking 테이블 생성 (Supabase)
-- page_views / click_events
-- Supabase SQL Editor에서 실행하세요
-- ================================================

create extension if not exists pgcrypto;

-- 1) page_views
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  session_id text not null,
  page_url text not null,
  page_title text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  device_type text,
  browser text,
  os text,
  duration_seconds int,
  created_at timestamp with time zone default now()
);

create index if not exists page_views_created_at_idx on public.page_views(created_at desc);
create index if not exists page_views_user_id_idx on public.page_views(user_id);
create index if not exists page_views_session_id_idx on public.page_views(session_id);

-- 2) click_events
create table if not exists public.click_events (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  session_id text not null,
  event_type text not null,
  element_id text,
  element_text text,
  element_type text,
  page_url text not null,
  page_title text,
  referrer text,
  banner_id text,
  banner_name text,
  campaign_id text,
  click_position_x int,
  click_position_y int,
  scroll_depth int,
  time_on_page int,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists click_events_created_at_idx on public.click_events(created_at desc);
create index if not exists click_events_user_id_idx on public.click_events(user_id);
create index if not exists click_events_session_id_idx on public.click_events(session_id);
create index if not exists click_events_event_type_idx on public.click_events(event_type);

-- NOTE:
-- 현재 앱은 anon key로 클라이언트에서 insert를 수행합니다.
-- 운영 보안을 강화하려면 서버(Route Handler)에서만 수집하거나 RLS 정책을 설계하세요.


