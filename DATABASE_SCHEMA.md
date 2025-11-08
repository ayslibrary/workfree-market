# 🗄️ WorkFree 데이터베이스 스키마

## 전체 구조

```
Supabase (분석/로그):
├─ chat_logs (챗봇 대화)
├─ search_results (검색 결과)
├─ user_feedback (피드백)
└─ workfree_knowledge (RAG 벡터)

Firebase (비즈니스):
├─ users (사용자)
├─ tool_usage (툴 사용)
├─ credit_transactions (크레딧)
├─ beta_testers (베타 신청)
└─ conversions (전환 추적)
```

---

## 📊 Supabase 테이블

### 1. chat_logs (챗봇 대화 로그)
```sql
create table chat_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  session_id text,
  message text not null,
  answer text not null,
  confidence float,
  response_time_ms int,
  model text default 'gpt-3.5-turbo',
  sources jsonb, -- [{title, url}]
  related_tools jsonb,
  created_at timestamp with time zone default now()
);
```

### 2. search_results (검색 결과 상세)
```sql
create table search_results (
  id uuid primary key default gen_random_uuid(),
  chat_log_id uuid references chat_logs(id),
  query text not null,
  expanded_queries jsonb, -- ['원본', '확장1', '확장2']
  results jsonb not null, -- [{id, title, similarity}]
  result_count int,
  avg_similarity float,
  created_at timestamp with time zone default now()
);
```

### 3. user_feedback (피드백)
```sql
create table user_feedback (
  id uuid primary key default gen_random_uuid(),
  chat_log_id uuid references chat_logs(id),
  user_id text,
  helpful boolean not null,
  comment text,
  created_at timestamp with time zone default now()
);
```

---

## 🔥 Firebase 컬렉션

### 1. tool_usage (툴 사용 내역)
```typescript
{
  id: string,
  userId: string,
  toolId: string,
  toolName: string,
  creditsUsed: number,
  timeSaved: number, // 분 단위
  success: boolean,
  errorMessage?: string,
  metadata: {
    browser?: string,
    device?: string,
    referrer?: string
  },
  createdAt: Timestamp
}
```

### 2. user_actions (사용자 행동)
```typescript
{
  id: string,
  userId: string,
  action: 'page_view' | 'button_click' | 'tool_start' | 'tool_complete',
  page: string,
  element?: string,
  metadata: object,
  createdAt: Timestamp
}
```

### 3. conversions (전환 추적)
```typescript
{
  id: string,
  userId: string,
  conversionType: 'signup' | 'beta_join' | 'credit_purchase' | 'tool_use',
  source: string, // 'organic', 'ad', 'referral'
  value: number, // 금액 (크레딧 구매 시)
  metadata: object,
  createdAt: Timestamp
}
```

---

## 📈 관리자 대시보드 화면

### /admin/analytics

**1. RAG 성능**
- 총 대화 수
- 평균 응답 시간
- 평균 신뢰도
- 피드백 긍정률

**2. 인기 질문 Top 10**
- 질문 내용
- 빈도
- 평균 유사도

**3. 검색 실패 키워드**
- 유사도 30% 미만
- 결과 0개
→ Knowledge base 개선 포인트

**4. 툴 사용 통계**
- 툴별 사용 횟수
- 크레딧 소모량
- 절약 시간 총합

**5. 전환율 분석**
- 방문 → 가입
- 가입 → 툴 사용
- 무료 → 유료

---

## 🔍 데이터 확인 방법

### 1. Supabase 대시보드
- Table Editor → chat_logs 확인
- SQL Editor → 커스텀 쿼리

### 2. Firebase Console
- Firestore Database → 컬렉션 확인

### 3. WorkFree 관리자 페이지
- `/admin/analytics` 접속
- 실시간 차트 + 테이블

---

## 다음: 테이블 생성 SQL 실행

