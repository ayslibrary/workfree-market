-- ================================================
-- WorkFree RAG 벡터 테이블 생성 스크립트
-- Supabase SQL Editor에서 실행하세요
-- ================================================

-- 1. pgvector 익스텐션 활성화
create extension if not exists vector;

-- 2. Knowledge base 테이블 생성
create table if not exists workfree_knowledge (
  id text primary key,
  content text not null,
  embedding vector(1536), -- text-embedding-3-small 차원
  metadata jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. 벡터 인덱스 생성 (코사인 유사도, HNSW 방식)
-- lists 값: 행 개수의 제곱근 (1000개 이하는 100)
create index if not exists workfree_knowledge_embedding_idx 
on workfree_knowledge 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- 4. 메타데이터 GIN 인덱스 (키워드 필터 고속화)
create index if not exists workfree_knowledge_metadata_idx 
on workfree_knowledge 
using gin (metadata);

-- 5. Full-text search 인덱스 (기본 검색)
create index if not exists workfree_knowledge_content_idx 
on workfree_knowledge 
using gin (to_tsvector('simple', content));

-- 6. 하이브리드 검색 함수 (벡터 + 키워드)
create or replace function hybrid_search(
  query_embedding vector(1536),
  match_count int default 5,
  filter_metadata jsonb default '{}'::jsonb
)
returns table (
  id text,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    wk.id,
    wk.content,
    wk.metadata,
    1 - (wk.embedding <=> query_embedding) as similarity
  from workfree_knowledge wk
  where 
    case 
      when filter_metadata = '{}'::jsonb then true
      else wk.metadata @> filter_metadata
    end
  order by wk.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 7. Row Level Security (RLS) 설정
alter table workfree_knowledge enable row level security;

-- 8. 읽기 권한 정책 (누구나 읽기 가능)
create policy "Allow public read access"
  on workfree_knowledge
  for select
  using (true);

-- 9. 쓰기 권한 정책 (service_role만 쓰기 가능)
create policy "Allow service role write access"
  on workfree_knowledge
  for all
  using (auth.role() = 'service_role');

-- ================================================
-- 완료! 🎉
-- ================================================
-- 다음 단계: Knowledge base JSON 작성

