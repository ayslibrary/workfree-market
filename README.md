# 🚀 WorkFree - 직장인 AI 자동화 SaaS

> **"클릭 한 번으로 업무 3시간 단축"**  
> 설치 없이 웹에서 바로 사용하는 AI 도구 플랫폼

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

---

## 🎯 프로젝트 개요

**WorkFree**는 직장인들이 반복적인 업무를 AI로 자동화하여  
**하루 2-3시간을 절약**할 수 있도록 돕는 웹 기반 SaaS 플랫폼입니다.

### 핵심 특징
- ⚡ **즉시 사용**: 설치 없이 웹 브라우저에서 바로 시작
- 🇰🇷 **한글 완벽 지원**: 한국 직장인 업무 문화 맞춤
- 💰 **사용한 만큼만 결제**: 크레딧 건당 결제 (1C = 1,000원)
- 🎮 **게이미피케이션**: 레벨업, 미션, 시간 은행

---

## 🛠️ 제공 도구 (현재 7개)

| 도구 | 시간 절약 | 가격 | 타겟 | 상태 |
|------|-----------|------|------|------|
| 📝 **블로그 생성기** | 1시간 → 10분 | 3C | 마케터 | ✅ 구현됨 |
| 📊 **보고서 생성기** | 2시간 → 15분 | 5C | 기획자 | ✅ 구현됨 |
| 🖼️ **이미지 검색** | 30분 → 3분 | 1C | 디자이너 | ✅ 구현됨 |
| 📱 **QR 생성기** | 1시간 → 5분 | 2C | 마케팅 | ✅ 구현됨 |
| 📧 **이메일 템플릿** | 30분 → 5분 | 1C | 영업 | ✅ 구현됨 |
| 💱 **환율 알리미** | 매일 10분 | 2C | 무역 | ✅ 구현됨 |
| 🤖 **FRI 매뉴얼봇** | 20분 → 2분 | 1C | 전 직군 | ✅ 구현됨 |

💡 **월 40시간 절약 = 5일치 업무 단축**

---

## 🚀 빠른 시작

### 로컬 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 열기
http://localhost:3000
```

### 환경 변수 설정

`.env.local` 파일 생성:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# Toss Payments
NEXT_PUBLIC_TOSS_CLIENT_KEY=your_toss_client_key
TOSS_SECRET_KEY=your_toss_secret_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket

# Email (Resend)
RESEND_API_KEY=your_resend_key
```

---

## 💰 가격 정책

### 크레딧 패키지

| 패키지 | 가격 | 크레딧 | 보너스 | 1C당 가격 |
|--------|------|--------|--------|-----------|
| 스타터 | 10,000원 | 10C | - | 1,000원 |
| 베이직 | 30,000원 | 35C | +5C | 857원 |
| 프로 | 50,000원 | 60C | +10C | 833원 |
| 프리미엄 | 100,000원 | 130C | +30C | 769원 |

### 월간 구독 (출시 예정)

- **프리미엄**: 29,900원/월 (40C/월 + 프리미엄 기능)
- **팀**: 99,000원/월 (10명, 200C 공유)
- **엔터프라이즈**: 맞춤 견적 (100명 이상)

---

## 🎮 게이미피케이션

- **레벨 시스템**: 사용량에 따라 레벨업 (Bronze → Silver → Gold → Platinum)
- **시간 은행**: 절약한 시간을 크레딧으로 전환 (10시간 = 1C)
- **미션**: 일일/주간 퀘스트 완료 시 보상 크레딧
- **추천 프로그램**: 친구 초대 시 양측 2C 적립
- **업적 시스템**: 특정 마일스톤 달성 시 뱃지 획득

---

## 🧪 베타 프로그램 (진행 중)

**지금 가입하면:**
✅ 무료 크레딧 10C 제공  
✅ 첫 결제 50% 할인  
✅ 평생 얼리어답터 뱃지  
✅ 신규 기능 우선 체험  
✅ 피드백 반영 시 추가 보상

**베타 테스터 모집 목표: 100명**

[베타 신청하기 →](https://workfree.vercel.app/beta)

---

## 🔧 기술 스택

### Frontend
- **Next.js 15** - App Router 기반 React 프레임워크
- **React 19** - 최신 React 기능 활용
- **TypeScript** - 타입 안정성
- **Tailwind CSS 4** - 유틸리티 기반 스타일링
- **Framer Motion** - 애니메이션

### Backend & Database
- **Supabase** - PostgreSQL 데이터베이스, Auth, RLS
- **Firebase** - 파일 스토리지, 실시간 DB
- **Vercel** - 서버리스 API Routes
- **OpenAI API** - GPT-4 기반 AI 콘텐츠 생성

### Payment & Email
- **Toss Payments** - 국내 간편결제
- **Resend** - 트랜잭션 이메일 발송

### Infrastructure
- **Vercel** - 호스팅 및 배포
- **AWS S3** - 파일 저장 (예정)
- **Cloudflare** - CDN 및 DDoS 방어 (예정)

---

## 📂 프로젝트 구조

```
workfree-market/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── tools/            # 각 AI 도구 페이지
│   │   ├── api/              # API Routes
│   │   ├── checkout/         # 결제 페이지
│   │   ├── my/               # 마이페이지
│   │   └── beta/             # 베타 프로그램
│   ├── components/           # 재사용 컴포넌트
│   ├── lib/                  # 유틸리티 및 헬퍼
│   ├── hooks/                # 커스텀 React Hooks
│   └── types/                # TypeScript 타입
├── supabase/                 # 데이터베이스 스키마
├── public/                   # 정적 파일
└── scripts/                  # 유틸리티 스크립트
```

---

## 📊 현황 및 로드맵

### ✅ 완료된 기능 (MVP)

- [x] 7개 AI 도구 구현
- [x] 크레딧 시스템 구축
- [x] 결제 시스템 통합 (Toss Payments)
- [x] 사용자 인증 (Firebase Auth)
- [x] 커뮤니티 게시판
- [x] 피드백 시스템
- [x] Analytics 대시보드

### 🔄 진행 중

- [ ] 베타 테스터 100명 모집
- [ ] 사용자 피드백 수집 및 개선
- [ ] 게이미피케이션 시스템 고도화
- [ ] 성능 최적화

### 📅 향후 계획

**Phase 2 (1-3개월)**
- [ ] 월간 구독 모델 출시
- [ ] 팀 협업 기능
- [ ] 모바일 최적화
- [ ] 추가 AI 도구 (5개)

**Phase 3 (4-6개월)**
- [ ] B2B 기업용 플랜
- [ ] API 제공 (외부 연동)
- [ ] 템플릿 마켓플레이스
- [ ] 다국어 지원 (영어, 일본어)

**Phase 4 (7-12개월)**
- [ ] 자체 Fine-tuned AI 모델
- [ ] 브라우저 확장 프로그램
- [ ] Slack/MS Teams 연동
- [ ] 시리즈A 투자 유치

---

## 🔐 보안 및 개인정보

- **데이터 암호화**: 모든 민감 데이터는 암호화 저장
- **RLS (Row Level Security)**: Supabase RLS로 데이터 접근 제어
- **HTTPS**: 모든 통신은 SSL/TLS로 암호화
- **개인정보 처리방침**: GDPR 및 개인정보보호법 준수
- **결제 정보 미저장**: PCI-DSS 준수 (Toss 사용)

---

## 🤝 기여 및 피드백

### 베타 테스터로 참여하기

1. [베타 신청 페이지](https://workfree.vercel.app/beta)에서 가입
2. 무료 크레딧으로 도구 테스트
3. 피드백 설문 작성 (추가 크레딧 보상)
4. 커뮤니티에서 의견 공유

### 버그 리포트 및 기능 제안

- 📧 Email: contact@workfree.com
- 💬 오픈채팅: [직장인 자동화 커뮤니티]
- 🐛 버그 리포트: GitHub Issues (비공개)
- 💡 기능 제안: [요청 페이지](https://workfree.vercel.app/request)

---

## 📈 주요 지표 (업데이트 예정)

- **총 가입자**: - 명
- **베타 테스터**: - 명
- **누적 사용 시간 절약**: - 시간
- **평균 만족도 (NPS)**: - 점
- **월 활성 사용자 (MAU)**: - 명

---

## 🏆 수상 및 인증

- [ ] 예비창업패키지 선정 (신청 예정)
- [ ] K-Startup 지원 (예정)
- [ ] 벤처기업 인증 (예정)

---

## 📞 문의

- **일반 문의**: contact@workfree.com
- **기업 제휴**: partnership@workfree.com
- **미디어 문의**: press@workfree.com
- **영업시간**: 평일 10:00 - 18:00 (주말 및 공휴일 휴무)

---

## 📄 법적 고지

이 프로젝트는 비공개 프로젝트입니다.  
모든 권리는 WorkFree에게 있습니다.

- [이용약관](https://workfree.vercel.app/terms)
- [개인정보처리방침](https://workfree.vercel.app/privacy)
- [환불정책](https://workfree.vercel.app/refund)

---

## 🌟 후원 및 지원

WorkFree는 다음 기관의 지원을 받고 있습니다:

- 예비창업패키지 (신청 예정)
- K-Startup (예정)

---

**Made with ❤️ for 대한민국 직장인들**

> "일 안 하고도 일하는 사람들의 비밀도구"
