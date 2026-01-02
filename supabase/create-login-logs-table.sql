-- ================================================
-- WorkFree 로그인 로그 테이블 생성 (Supabase)
-- Supabase SQL Editor에서 실행하세요
-- ================================================

create extension if not exists pgcrypto;

create table if not exists public.login_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  email text not null,
  login_type text not null, -- 'email' | 'google' | 'oauth'
  ip_address text,
  user_agent text,
  device_type text,
  browser text,
  os text,
  success boolean not null default false,
  error_message text,
  session_id text,
  created_at timestamp with time zone default now()
);

create index if not exists login_logs_created_at_idx on public.login_logs(created_at desc);
create index if not exists login_logs_email_idx on public.login_logs(email);
create index if not exists login_logs_user_id_idx on public.login_logs(user_id);

-- NOTE:
-- 현재 앱은 Supabase Auth를 사용하지 않고(= RLS로 admin/사용자 식별 불가) 클라이언트에서 anon key로 조회/삽입을 합니다.
-- 운영 보안을 강화하려면:
-- - 이 테이블 접근을 서버(Route Handler)로 옮기고 service_role로만 읽게 하거나,
-- - Supabase Auth로 전환 후 RLS 정책을 구성하세요.


