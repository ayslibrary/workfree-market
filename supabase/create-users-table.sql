-- ================================================
-- Supabase Users 테이블 생성
-- Firebase 완전 대체
-- ================================================

-- 1. users 테이블 생성
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text,
  photo_url text,
  role text default 'buyer' check (role in ('buyer', 'seller', 'admin')),
  credits int default 10,
  plan text default 'free' check (plan in ('free', 'starter', 'pro', 'business')),
  
  -- 게이미피케이션
  level int default 1,
  xp int default 0,
  time_saved_minutes int default 0,
  
  -- 메타데이터
  metadata jsonb default '{}'::jsonb,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. 인덱스
create index if not exists users_email_idx on users(email);
create index if not exists users_role_idx on users(role);

-- 3. RLS 설정
alter table users enable row level security;

-- 본인 데이터만 읽기 가능
create policy "Users can read own data"
  on users for select
  using (auth.uid()::text = id::text);

-- service_role은 모든 데이터 읽기/쓰기
create policy "Service role full access"
  on users for all
  using (auth.role() = 'service_role');

-- 4. 관리자 계정 추가 (임시 UUID)
insert into users (email, display_name, role, credits)
values ('ayoung1034@gmail.com', '아영 (관리자)', 'admin', 1000)
on conflict (email) do update
set role = 'admin', credits = 1000;

-- ================================================
-- 완료! 🎉
-- ================================================
-- 다음: Supabase Authentication 활성화





