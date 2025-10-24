# 🚀 WorkFree Beta Mission 100 개발 계획

## 📋 Sequential Thinking 기반 개발 로드맵

---

## 🎯 Phase 1: 베타 시스템 기반 구축 (1-2주)

### Step 1: 데이터 구조 설계
**목표**: 베타테스터 및 미션 데이터를 저장할 구조 설계

#### 필요한 Collections (Firebase Firestore)

1. **beta_testers** (베타테스터 정보)
```typescript
{
  id: string;                    // 사용자 ID
  betaNumber: number;            // 베타테스터 번호 (1~100)
  joinedAt: Timestamp;           // 참여 일시
  totalCreditsEarned: number;    // 획득한 총 크레딧
  timeSaved: number;             // 절약한 시간 (분)
  completedMissions: string[];   // 완료한 미션 ID 배열
  isCompleted: boolean;          // 전체 미션 완료 여부
  vipEligible: boolean;          // VIP 자격 여부
}
```

2. **missions** (미션 정의)
```typescript
{
  id: string;                    // 미션 ID
  order: number;                 // 순서 (1~10)
  title: string;                 // 미션 제목
  description: string;           // 미션 설명
  rewardCredits: number;         // 보상 크레딧
  timeSaved: number;             // 절약 시간 (분)
  icon: string;                  // 아이콘
  actionType: string;            // 액션 타입 (signup, use_blog, write_review 등)
  isActive: boolean;             // 활성화 여부
}
```

3. **mission_completions** (미션 완료 기록)
```typescript
{
  id: string;
  userId: string;
  missionId: string;
  completedAt: Timestamp;
  creditsAwarded: number;
  proof?: string;                // 증빙 (후기 링크 등)
}
```

4. **social_shares** (SNS 공유 기록)
```typescript
{
  id: string;
  userId: string;
  platform: 'twitter' | 'facebook' | 'kakao' | 'blog';
  sharedAt: Timestamp;
  creditsAwarded: number;
}
```

---

### Step 2: 타입 정의 및 유틸리티 함수
**목표**: TypeScript 타입 정의 및 공통 함수 작성

**파일**: `src/types/beta.ts`
**파일**: `src/lib/beta/missions.ts`
**파일**: `src/lib/beta/rewards.ts`

---

### Step 3: 베타 랜딩 페이지
**목표**: 100명 한정 모집 페이지

**경로**: `/beta`

**주요 요소**:
- 🎯 "베타테스터 100인 한정" 헤더
- 📊 실시간 신청자 카운터 (예: 87/100)
- 💎 특별 혜택 리스트
  - 10,000 크레딧 무료 제공
  - 정식 런칭 시 VIP 등급
  - 평생 할인 혜택
- 🔥 긴박감 조성: "남은 자리 13개!"
- ✅ 베타 신청 버튼 (로그인 필요)

---

### Step 4: 미션 대시보드
**목표**: 사용자의 미션 진행 상황 표시

**경로**: `/beta/dashboard`

**주요 요소**:
- 🏅 베타테스터 번호 뱃지 (예: #47)
- 📊 전체 진행률 프로그레스 바
- 📝 10개 미션 체크리스트
  - ✅ 완료된 미션 (초록색)
  - 🔓 진행 가능 미션 (파란색)
  - 🔒 잠긴 미션 (회색)
- 💰 누적 크레딧 표시
- ⏱️ 절약한 시간 표시 (실시간)
- 🎁 완주 보상 안내

---

### Step 5: 미션 시스템 구현
**목표**: 미션 완료 감지 및 보상 지급

**10대 미션 구성**:

| 순서 | 미션 | 보상 크레딧 | 절약 시간 | 액션 타입 |
|-----|------|------------|----------|----------|
| 1 | ✅ 회원가입 완료 | 100 | - | signup |
| 2 | 🎨 AI 초상화 생성 | 200 | 30분 | use_portrait |
| 3 | ✍️ AI 블로그 생성 | 200 | 30분 | use_blog |
| 4 | 📝 후기 작성 (서비스 1개) | 300 | - | write_review |
| 5 | 💬 커뮤니티 게시글 작성 | 200 | - | post_community |
| 6 | 🔧 자동화 도구 사용 | 300 | 60분 | use_automation |
| 7 | 📝 후기 작성 (서비스 2개째) | 400 | - | write_review_2 |
| 8 | 📢 SNS 공유 (1회) | 500 | - | social_share |
| 9 | 📝 전체 서비스 후기 | 500 | - | final_review |
| 10 | 🎉 베타 테스트 설문 완료 | 500 | - | survey |

**완주 보상**: 10,000 크레딧 + VIP 등급

---

## 🎨 Phase 2: UI/UX 강화 (3-4주)

### Step 6: 시간 절약 카운터
**목표**: 시각적으로 절약한 시간 강조

**위치**: 대시보드 상단

**디자인**:
```
┌─────────────────────────────────┐
│   ⏱️ 당신이 절약한 시간          │
│                                 │
│      2시간 37분                 │
│                                 │
│   💼 야근 시간을 줄였어요!       │
└─────────────────────────────────┘
```

---

### Step 7: 후기 작성 시스템
**목표**: 미션 4, 7, 9 완료를 위한 후기 폼

**경로**: `/beta/review`

**요소**:
- ⭐ 별점 (1~5)
- 📝 후기 텍스트 (최소 50자)
- 🏷️ 사용한 서비스 선택
- 📸 스크린샷 첨부 (선택)
- ✅ 제출 시 즉시 크레딧 지급

---

### Step 8: SNS 공유 시스템
**목표**: 미션 8 완료 및 바이럴 마케팅

**위치**: 대시보드, 서비스 사용 후

**공유 버튼**:
- 🐦 트위터
- 📘 페이스북
- 💬 카카오톡
- 📝 블로그 (URL 입력)

**공유 문구 자동 생성**:
```
"WorkFree 베타테스터로 참여 중! 지금까지 2시간 절약했어요 ⏱️
#WorkFree #자동화 #시간절약"
```

**보상**: 플랫폼당 1회 500 크레딧 (총 4회 가능)

---

### Step 9: 베타 설문조사
**목표**: 미션 10 완료 및 피드백 수집

**경로**: `/beta/survey`

**질문 항목** (10문항):
1. 가장 유용했던 기능은?
2. 개선이 필요한 부분은?
3. 추가되었으면 하는 기능은?
4. UI/UX 만족도는?
5. 추천 의향은? (NPS)
6. 직무는?
7. 하루 평균 사용 시간은?
8. 가격 적정성은?
9. 경쟁 서비스와 비교하면?
10. 자유 의견

**보상**: 완료 시 500 크레딧

---

## 🔥 Phase 3: 참여 유도 & 리텐션 (5-6주)

### Step 10: 베타테스터 랭킹
**목표**: 경쟁 요소 추가

**경로**: `/beta/ranking`

**요소**:
- 🏆 Top 10 베타테스터
- 📊 절약 시간 순위
- 💰 크레딧 획득 순위
- 🎖️ 미션 완료 속도 순위
- 🎁 1등 특별 보상

---

### Step 11: 푸시 알림 시스템
**목표**: 리마인드 및 재방문 유도

**알림 타이밍**:
- 미션 완료 시 → "축하합니다! 200 크레딧 획득!"
- 3일 미접속 시 → "아직 3개 미션이 남았어요!"
- 완주 임박 시 → "1개만 더! 10,000 크레딧이 기다립니다!"
- 새 기능 출시 → "새로운 자동화 기능이 추가되었어요"

**채널**:
- 브라우저 푸시 알림
- 이메일 (선택)
- 카카오톡 알림톡 (선택)

---

### Step 12: 베타 완주 인증서
**목표**: 성취감 극대화

**경로**: `/beta/certificate`

**요소**:
```
┌─────────────────────────────────────┐
│                                     │
│      🏆 베타 테스터 인증서           │
│                                     │
│   성함: 홍길동 (#47)                 │
│   완료일: 2025년 10월 30일           │
│                                     │
│   ✅ 10개 미션 전체 완료              │
│   ⏱️ 총 절약 시간: 5시간 20분        │
│   💰 획득 크레딧: 13,800            │
│                                     │
│   🎁 VIP 등급 부여                   │
│                                     │
│   [다운로드] [SNS 공유]              │
└─────────────────────────────────────┘
```

---

## 📊 Phase 4: 데이터 & 분석 (진행 중 지속)

### Step 13: Analytics 대시보드
**목표**: 베타 진행 상황 모니터링

**경로**: `/admin/beta-analytics`

**주요 지표**:
- 📊 총 베타테스터 수
- ✅ 미션별 완료율
- ⏱️ 평균 완료 소요 시간
- 💰 지급된 총 크레딧
- 📈 일일 활성 사용자 (DAU)
- 🔄 리텐션율 (D1, D7, D30)
- 📝 후기 작성률
- 📢 SNS 공유율

---

### Step 14: 피드백 수집 자동화
**목표**: 후기 및 설문 데이터 정리

**기능**:
- 후기 자동 수집 → CSV 다운로드
- 설문 응답 자동 분석 → 차트 생성
- 버그 리포트 모음
- 개선 요청 우선순위화

---

## 🛠️ 기술 스택 & 구현 방법

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (애니메이션)

### Backend
- Firebase Firestore (데이터베이스)
- Firebase Auth (인증)
- Firebase Cloud Functions (자동화)

### Analytics
- Firebase Analytics
- Google Analytics 4

### Notification
- Firebase Cloud Messaging (푸시)
- SendGrid (이메일)
- 카카오 비즈메시지 (알림톡)

---

## 📅 개발 일정

### Week 1-2: Phase 1 (기반)
- ✅ 데이터 구조 설계
- ✅ 타입 정의
- ✅ 베타 랜딩 페이지
- ✅ 미션 대시보드
- ✅ 미션 시스템

### Week 3-4: Phase 2 (강화)
- ⏳ 시간 절약 카운터
- ⏳ 후기 작성 시스템
- ⏳ SNS 공유 시스템
- ⏳ 베타 설문조사

### Week 5-6: Phase 3 (참여 유도)
- ⏳ 베타테스터 랭킹
- ⏳ 푸시 알림 시스템
- ⏳ 완주 인증서

### Ongoing: Phase 4 (분석)
- ⏳ Analytics 대시보드
- ⏳ 피드백 수집

---

## 🎯 핵심 목표

1. **100명 베타테스터 모집**: 한정판 느낌으로 희소성 자극
2. **70% 완주율**: 10개 미션 중 7개 이상 완료
3. **평균 30개 후기**: 실질적 피드백 수집
4. **50% 공유율**: 바이럴 마케팅 효과
5. **정식 런칭 준비**: 베타 피드백 반영한 완성도

---

## 💡 다음 액션

**지금 바로 시작할 것**:
1. 데이터 구조 설계 (`src/types/beta.ts`)
2. 베타 랜딩 페이지 (`src/app/beta/page.tsx`)
3. 미션 목록 정의 (Firestore에 초기 데이터 입력)

---

**준비되셨나요? 바로 시작합시다! 🚀**

