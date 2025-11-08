-- ================================================
-- WorkFree Analytics 테이블 생성
-- Supabase SQL Editor에서 실행하세요
-- ================================================

-- 1. 챗봇 대화 로그
create table if not exists chat_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  session_id text,
  message text not null,
  answer text not null,
  confidence float,
  response_time_ms int,
  model text default 'gpt-3.5-turbo',
  sources jsonb,
  related_tools jsonb,
  created_at timestamp with time zone default now()
);

-- 인덱스
create index if not exists chat_logs_user_id_idx on chat_logs(user_id);
create index if not exists chat_logs_created_at_idx on chat_logs(created_at desc);
create index if not exists chat_logs_session_id_idx on chat_logs(session_id);

-- 2. 검색 결과 상세
create table if not exists search_results (
  id uuid primary key default gen_random_uuid(),
  chat_log_id uuid references chat_logs(id) on delete cascade,
  query text not null,
  expanded_queries jsonb,
  results jsonb not null,
  result_count int,
  avg_similarity float,
  created_at timestamp with time zone default now()
);

-- 인덱스
create index if not exists search_results_chat_log_id_idx on search_results(chat_log_id);
create index if not exists search_results_avg_similarity_idx on search_results(avg_similarity);

-- 3. 사용자 피드백
create table if not exists user_feedback (
  id uuid primary key default gen_random_uuid(),
  chat_log_id uuid references chat_logs(id) on delete cascade,
  user_id text,
  helpful boolean not null,
  comment text,
  created_at timestamp with time zone default now()
);

-- 인덱스
create index if not exists user_feedback_chat_log_id_idx on user_feedback(chat_log_id);
create index if not exists user_feedback_helpful_idx on user_feedback(helpful);

-- 4. RLS 설정 (보안)
alter table chat_logs enable row level security;
alter table search_results enable row level security;
alter table user_feedback enable row level security;

-- 읽기 권한 (인증된 사용자만)
create policy "Authenticated users can read chat_logs"
  on chat_logs for select
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

create policy "Authenticated users can read search_results"
  on search_results for select
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

create policy "Authenticated users can read feedback"
  on user_feedback for select
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- 쓰기 권한 (service_role만)
create policy "Service role can write chat_logs"
  on chat_logs for insert
  using (auth.role() = 'service_role');

create policy "Service role can write search_results"
  on search_results for insert
  using (auth.role() = 'service_role');

create policy "Service role can write feedback"
  on user_feedback for insert
  using (auth.role() = 'service_role');

-- ================================================
-- 분석용 뷰 생성
-- ================================================

-- 인기 질문 Top 10
create or replace view popular_questions as
select 
  message as question,
  count(*) as frequency,
  avg(confidence) as avg_confidence,
  max(created_at) as last_asked
from chat_logs
group by message
order by frequency desc
limit 10;

-- 검색 실패 키워드 (낮은 유사도)
create or replace view low_similarity_searches as
select 
  cl.message,
  sr.avg_similarity,
  sr.result_count,
  cl.created_at
from chat_logs cl
join search_results sr on sr.chat_log_id = cl.id
where sr.avg_similarity < 0.4 or sr.result_count = 0
order by cl.created_at desc
limit 20;

-- 피드백 통계
create or replace view feedback_stats as
select 
  date_trunc('day', created_at) as date,
  count(*) as total_feedback,
  sum(case when helpful then 1 else 0 end) as positive,
  sum(case when not helpful then 1 else 0 end) as negative,
  round(avg(case when helpful then 1.0 else 0.0 end) * 100, 1) as positive_rate
from user_feedback
group by date_trunc('day', created_at)
order by date desc;

-- ================================================
-- 완료! 🎉
-- ================================================

