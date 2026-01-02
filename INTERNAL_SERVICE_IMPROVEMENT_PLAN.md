# 🔧 WorkFree 내부 서비스 보완 계획

> **목표: 베타 런칭 전 서비스 안정성 및 품질 강화**

---

## 📋 목차

1. [현재 상태 분석](#1-현재-상태-분석)
2. [우선순위별 개선 계획](#2-우선순위별-개선-계획)
3. [주차별 실행 계획](#3-주차별-실행-계획)
4. [기술 부채 해소](#4-기술-부채-해소)
5. [체크리스트](#5-체크리스트)

---

## 1. 현재 상태 분석

### ✅ 완성된 기능

- [x] 7개 AI 도구 구현 (블로그, 보고서, 이미지, QR, 이메일, 환율, 챗봇)
- [x] 크레딧 시스템 (구매, 차감, 조회)
- [x] 결제 시스템 (Toss Payments)
- [x] Firebase Auth (로그인/회원가입)
- [x] Supabase 데이터베이스 (Analytics 테이블)
- [x] 커뮤니티 게시판
- [x] 베타 프로그램 페이지

### ⚠️ 보완 필요 영역

| 영역 | 현재 상태 | 위험도 | 우선순위 |
|------|-----------|--------|----------|
| **에러 핸들링** | 일부 API에만 있음 | 🔴 높음 | P0 |
| **Rate Limiting** | 없음 | 🔴 높음 | P0 |
| **로깅 시스템** | Console.log만 사용 | 🟡 중간 | P1 |
| **입력 검증** | 프론트엔드만 | 🔴 높음 | P0 |
| **API 응답 캐싱** | 없음 | 🟡 중간 | P1 |
| **DB 쿼리 최적화** | 미검증 | 🟡 중간 | P2 |
| **테스트 코드** | 없음 | 🟢 낮음 | P3 |
| **모니터링** | 없음 | 🟡 중간 | P1 |
| **백업 정책** | 없음 | 🟡 중간 | P2 |

---

## 2. 우선순위별 개선 계획

### 🔴 P0: 베타 런칭 전 필수 (1주차)

#### 2.1 에러 핸들링 통합

**문제점:**
- API 에러가 사용자에게 그대로 노출
- OpenAI API 실패 시 서비스 중단
- 결제 실패 처리 불완전

**해결책:**

```typescript
// lib/error-handler.ts (신규 생성)
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

export class APIError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthError extends AppError {
  constructor(message: string) {
    super(401, message);
  }
}

// API Route에서 사용
export async function POST(request: Request) {
  try {
    // 로직
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message }, { status: error.statusCode });
    }
    // 예상치 못한 에러는 로깅 후 일반 메시지
    await logError(error);
    return Response.json({ error: '서비스 오류가 발생했습니다.' }, { status: 500 });
  }
}
```

**실행 계획:**
1. `lib/error-handler.ts` 생성
2. 모든 API Route에 try-catch 추가
3. OpenAI API 호출 시 재시도 로직 (3회)
4. 사용자 친화적 에러 메시지 정의

---

#### 2.2 Rate Limiting 구현

**문제점:**
- 무제한 API 호출 가능 → OpenAI 비용 폭증 위험
- DDoS 공격에 취약
- 악의적 크레딧 소진 가능

**해결책:**

```typescript
// lib/rate-limit.ts (신규 생성)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Upstash Redis 사용 (무료 티어: 10,000 req/day)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// IP 기반 Rate Limit
export const rateLimitByIP = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10초에 10번
});

// 사용자 기반 Rate Limit
export const rateLimitByUser = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 h'), // 1시간에 50번
});

// API Route에서 사용
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success } = await rateLimitByIP.limit(ip);
  
  if (!success) {
    return Response.json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도하세요.' }, { status: 429 });
  }
  
  // 로직 계속
}
```

**실행 계획:**
1. Upstash Redis 무료 계정 생성
2. `@upstash/ratelimit` 패키지 설치
3. 모든 AI 도구 API에 Rate Limit 적용
4. 관리자 페이지에서 Rate Limit 모니터링

**Rate Limit 정책:**
| API | 제한 | 이유 |
|-----|------|------|
| 블로그 생성 | 5회/시간 | OpenAI 비용 높음 |
| 보고서 생성 | 3회/시간 | OpenAI 비용 매우 높음 |
| 이미지 검색 | 20회/시간 | 외부 API 제한 |
| QR 생성 | 50회/시간 | 비용 낮음 |
| 챗봇 | 10회/10초 | 남용 방지 |

---

#### 2.3 입력 검증 강화

**문제점:**
- 프론트엔드 검증만 있음 → 쉽게 우회 가능
- SQL Injection, XSS 공격 위험
- 파일 업로드 검증 부족

**해결책:**

```typescript
// lib/validation.ts (신규 생성)
import { z } from 'zod';

// Zod 스키마로 입력 검증
export const blogGeneratorSchema = z.object({
  topic: z.string().min(2).max(100),
  keywords: z.array(z.string()).max(5),
  tone: z.enum(['professional', 'casual', 'friendly']),
  length: z.number().min(300).max(3000),
});

export const imageSearchSchema = z.object({
  query: z.string().min(1).max(50),
  count: z.number().min(1).max(100),
});

// API Route에서 사용
export async function POST(request: Request) {
  const body = await request.json();
  
  // 검증 실패 시 자동으로 에러 던짐
  const validated = blogGeneratorSchema.parse(body);
  
  // validated 데이터로 로직 실행
}
```

**실행 계획:**
1. `zod` 패키지 설치
2. 각 API별 입력 스키마 정의
3. 모든 API Route에 검증 로직 추가
4. 파일 업로드 시 MIME 타입 검증

---

#### 2.4 크레딧 차감 원자성 보장

**문제점:**
- 크레딧 차감과 AI 도구 실행 사이에 실패 시 불일치
- 동시 요청 시 크레딧 중복 차감 가능

**해결책:**

```typescript
// lib/credits.ts (개선)
import { supabase } from './supabase';

export async function deductCredits(userId: string, amount: number) {
  // 트랜잭션으로 원자성 보장
  const { data, error } = await supabase.rpc('deduct_credits', {
    p_user_id: userId,
    p_amount: amount,
  });
  
  if (error || !data) {
    throw new APIError('크레딧이 부족하거나 차감에 실패했습니다.');
  }
  
  return data;
}

// Supabase Function (SQL)
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id TEXT,
  p_amount INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- 행 잠금으로 동시성 제어
  SELECT credits INTO current_credits
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  IF current_credits < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
  
  UPDATE user_credits
  SET credits = credits - p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

**실행 계획:**
1. Supabase에서 `deduct_credits` 함수 생성
2. 모든 AI 도구 API에서 함수 사용
3. 차감 실패 시 롤백 처리
4. 크레딧 변동 로그 테이블 추가

---

### 🟡 P1: 베타 기간 중 개선 (2-3주차)

#### 2.5 로깅 및 모니터링 시스템

**현재 문제:**
- `console.log`만 사용 → Vercel 로그 30일 후 삭제
- 에러 추적 어려움
- 성능 병목 파악 불가

**해결책: Sentry + Vercel Analytics**

```typescript
// lib/logger.ts (신규 생성)
import * as Sentry from '@sentry/nextjs';

export function logError(error: Error, context?: any) {
  Sentry.captureException(error, {
    extra: context,
  });
}

export function logInfo(message: string, data?: any) {
  console.log(`[INFO] ${message}`, data);
  // 프로덕션에서는 Sentry 또는 LogFlare로 전송
}

// API에서 사용
try {
  // 로직
} catch (error) {
  logError(error, { userId, action: 'generate-blog' });
  throw error;
}
```

**실행 계획:**
1. Sentry 무료 계정 생성 (월 5,000 에러까지 무료)
2. `@sentry/nextjs` 설치 및 설정
3. Vercel Analytics 활성화 (무료)
4. 주요 이벤트 추적 (결제, 크레딧 사용 등)

**모니터링 대시보드:**
- 일일 활성 사용자 (DAU)
- API 응답 시간 (P50, P95, P99)
- 에러율 (API별)
- 크레딧 사용량
- OpenAI API 비용

---

#### 2.6 API 응답 캐싱

**문제점:**
- 동일한 요청에도 매번 OpenAI API 호출 → 비용 낭비
- 환율, 이미지 검색 등은 캐싱 가능

**해결책:**

```typescript
// lib/cache.ts (신규 생성)
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCached<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  return data as T | null;
}

export async function setCache(key: string, value: any, ttl: number) {
  await redis.setex(key, ttl, JSON.stringify(value));
}

// 사용 예시 (환율 API)
export async function GET(request: Request) {
  const cacheKey = 'exchange-rate:' + new Date().toISOString().slice(0, 10);
  
  // 캐시 확인
  const cached = await getCached(cacheKey);
  if (cached) {
    return Response.json(cached);
  }
  
  // API 호출
  const data = await fetchExchangeRate();
  
  // 캐시 저장 (24시간)
  await setCache(cacheKey, data, 86400);
  
  return Response.json(data);
}
```

**캐싱 정책:**
| API | 캐시 시간 | 이유 |
|-----|----------|------|
| 환율 | 24시간 | 하루 1번 갱신으로 충분 |
| 이미지 검색 | 1시간 | 자주 바뀌지 않음 |
| 블로그 생성 | 캐시 안 함 | 개인화 콘텐츠 |
| FRI 챗봇 | 10분 | 동일 질문 많음 |

---

### 🟢 P2: 안정화 후 개선 (4주차 이후)

#### 2.7 데이터베이스 최적화

**문제점:**
- 인덱스 없음 → 쿼리 느림
- N+1 쿼리 문제
- 불필요한 조인

**해결책:**

```sql
-- 인덱스 추가
CREATE INDEX idx_chat_logs_user_created ON chat_logs(user_id, created_at DESC);
CREATE INDEX idx_user_credits_user ON user_credits(user_id);
CREATE INDEX idx_transactions_user_status ON transactions(user_id, status);

-- 자주 사용하는 쿼리를 뷰로 생성
CREATE VIEW user_activity_summary AS
SELECT 
  user_id,
  COUNT(*) as total_requests,
  SUM(credits_used) as total_credits_used,
  MAX(created_at) as last_active
FROM chat_logs
GROUP BY user_id;
```

**실행 계획:**
1. 현재 쿼리 분석 (Supabase Dashboard)
2. 느린 쿼리 찾기 (200ms 이상)
3. 적절한 인덱스 추가
4. 쿼리 결과 측정 및 비교

---

#### 2.8 테스트 코드 작성

**우선순위:**
1. 크레딧 시스템 (결제와 직결)
2. API Rate Limiting
3. 입력 검증

```typescript
// __tests__/lib/credits.test.ts (신규)
import { describe, it, expect } from 'vitest';
import { deductCredits } from '@/lib/credits';

describe('deductCredits', () => {
  it('should deduct credits successfully', async () => {
    const result = await deductCredits('test-user-1', 5);
    expect(result).toBe(true);
  });
  
  it('should fail when insufficient credits', async () => {
    await expect(
      deductCredits('test-user-2', 1000)
    ).rejects.toThrow('Insufficient credits');
  });
});
```

---

#### 2.9 백업 및 복구 정책

**Supabase 자동 백업:**
- 일일 백업 (무료 플랜: 7일 보관)
- 주간 백업 (수동, S3 저장)

**백업 대상:**
- 사용자 데이터 (Firebase)
- 크레딧 거래 내역 (Supabase)
- 챗봇 로그 (Supabase)

**복구 절차 문서 작성**

---

## 3. 주차별 실행 계획

### Week 1: 필수 보안 및 안정성 (P0)

| 일 | 작업 | 예상 시간 | 담당 |
|----|------|-----------|------|
| 월 | Rate Limiting 구현 (Upstash 설정) | 4시간 | 개발자 |
| 화 | 모든 API에 Rate Limit 적용 | 6시간 | 개발자 |
| 수 | 에러 핸들링 통합 | 6시간 | 개발자 |
| 목 | 입력 검증 (Zod) 추가 | 6시간 | 개발자 |
| 금 | 크레딧 차감 원자성 보장 | 4시간 | 개발자 |
| 토 | 테스트 및 버그 수정 | 4시간 | 개발자 |
| 일 | 휴식 | - | - |

**Week 1 목표:**
✅ Rate Limiting 100% 적용  
✅ 에러 핸들링 통합  
✅ 입력 검증 강화  
✅ 크레딧 시스템 안정화

---

### Week 2-3: 모니터링 및 최적화 (P1)

| 주 | 작업 | 예상 시간 |
|----|------|-----------|
| 2주 | Sentry 설정 및 로깅 시스템 | 8시간 |
| 2주 | API 캐싱 (Redis) 구현 | 8시간 |
| 2주 | Vercel Analytics 분석 | 4시간 |
| 3주 | 관리자 모니터링 대시보드 개선 | 8시간 |
| 3주 | DB 쿼리 최적화 | 6시간 |
| 3주 | 성능 테스트 및 튜닝 | 6시간 |

**Week 2-3 목표:**
✅ 로깅 시스템 구축  
✅ 주요 API 캐싱 적용  
✅ 관리자 대시보드 완성  
✅ API 응답 시간 50% 개선

---

### Week 4: 안정화 및 문서화 (P2)

| 작업 | 예상 시간 |
|------|-----------|
| 백업 정책 수립 및 테스트 | 4시간 |
| API 문서 작성 (Swagger/Postman) | 6시간 |
| 운영 매뉴얼 작성 | 4시간 |
| 보안 체크리스트 검토 | 4시간 |
| 부하 테스트 (100 동시 사용자) | 4시간 |

**Week 4 목표:**
✅ 백업/복구 절차 완성  
✅ API 문서 완성  
✅ 베타 런칭 준비 완료

---

## 4. 기술 부채 해소

### 4.1 환경 변수 정리

**문제:** `.env.local`에 너무 많은 변수

**해결:**
```env
# .env.local.example 생성
# Core
NEXT_PUBLIC_SITE_URL=
NODE_ENV=

# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Auth
NEXT_PUBLIC_FIREBASE_API_KEY=
# ... (나머지)

# AI
OPENAI_API_KEY=

# Payment
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=

# Cache & Rate Limit
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Monitoring
SENTRY_DSN=
```

---

### 4.2 타입 안정성 개선

**문제:** `any` 타입 남용

**해결:**
```typescript
// types/api.ts (신규)
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'deduct' | 'refund';
  createdAt: Date;
}

// 모든 API 응답을 APIResponse<T>로 통일
```

---

### 4.3 코드 중복 제거

**문제:** 각 AI 도구마다 비슷한 코드 반복

**해결:**
```typescript
// lib/ai-tool-handler.ts (신규)
export async function handleAIToolRequest({
  userId,
  credits,
  handler,
  cacheKey,
  cacheTTL,
}: {
  userId: string;
  credits: number;
  handler: () => Promise<any>;
  cacheKey?: string;
  cacheTTL?: number;
}) {
  // 1. Rate Limiting 체크
  // 2. 크레딧 확인
  // 3. 캐시 확인
  // 4. 핸들러 실행
  // 5. 크레딧 차감
  // 6. 결과 반환 및 캐싱
}

// 각 API에서 사용
export async function POST(request: Request) {
  return handleAIToolRequest({
    userId: 'user-1',
    credits: 3,
    handler: async () => {
      return await generateBlog(prompt);
    },
  });
}
```

---

## 5. 체크리스트

### 베타 런칭 전 필수 체크리스트

#### 보안
- [ ] Rate Limiting 모든 API 적용
- [ ] 입력 검증 (Zod) 적용
- [ ] SQL Injection 테스트 통과
- [ ] XSS 방어 확인
- [ ] HTTPS 강제 적용
- [ ] 환경 변수 암호화 (Vercel Secrets)

#### 안정성
- [ ] 에러 핸들링 100% 적용
- [ ] 크레딧 차감 원자성 보장
- [ ] OpenAI API 재시도 로직
- [ ] 결제 실패 처리 검증
- [ ] DB 백업 정책 수립

#### 성능
- [ ] 주요 API 응답 시간 < 2초
- [ ] 캐싱 적용 (환율, 이미지)
- [ ] DB 인덱스 추가
- [ ] Vercel Edge Function 고려

#### 모니터링
- [ ] Sentry 에러 추적
- [ ] Vercel Analytics 활성화
- [ ] 관리자 대시보드 완성
- [ ] 일일 리포트 자동화

#### 문서화
- [ ] API 문서 작성
- [ ] 운영 매뉴얼 작성
- [ ] 보안 정책 문서
- [ ] 장애 대응 절차

---

## 6. 예상 비용

### 무료 티어 활용

| 서비스 | 무료 한도 | 예상 사용량 (베타) | 비용 |
|--------|-----------|-------------------|------|
| **Upstash Redis** | 10,000 req/day | 5,000 req/day | 무료 |
| **Sentry** | 5,000 에러/월 | 1,000 에러/월 | 무료 |
| **Vercel Analytics** | 기본 | 베타 100명 | 무료 |
| **Supabase** | 500MB DB | 100MB | 무료 |
| **Firebase** | 1GB Storage | 200MB | 무료 |

**총 추가 비용: 0원** (베타 기간)

---

## 7. 성공 지표

### Week 1 종료 시
- ✅ Rate Limiting으로 API 비용 30% 절감
- ✅ 에러율 < 1%
- ✅ API 응답 시간 < 3초

### Week 2-3 종료 시
- ✅ 캐싱으로 OpenAI 비용 20% 절감
- ✅ 모든 에러 Sentry로 추적
- ✅ 관리자 대시보드에서 실시간 모니터링

### Week 4 종료 시 (베타 런칭)
- ✅ 베타 테스터 100명 서비스 안정적 제공
- ✅ Uptime 99.9%
- ✅ 평균 응답 시간 < 2초
- ✅ 0건의 크리티컬 버그

---

## 8. 다음 단계 (베타 이후)

1. **자동화 테스트** (Playwright E2E)
2. **CI/CD 파이프라인** (GitHub Actions)
3. **A/B 테스트 시스템**
4. **사용자 행동 분석** (Mixpanel)
5. **API v2** (GraphQL 고려)

---

**작성일:** 2025년 1월  
**작성자:** 개발팀  
**업데이트:** 주간 리뷰 후 수정

