# 🗺️ WorkFree Market 개발 지도 (Development Map)

이 문서는 **현재 레포(`homepage.app`)가 “무엇을 쓰고”, “어디에 있고”, “어떻게 흐르는지”**를 한 번에 파악하기 위한 온보딩 지도입니다.  
(기준: 코드/설정 파일 실물 기반 + 일부 문서(README/TECH_ARCHITECTURE) 비교)

---

## 0) 한 줄 요약

- **메인 앱**: Next.js(App Router) + React + TypeScript + Tailwind 기반의 **풀스택(프론트 + Next API Routes) 웹앱**
- **데이터/인증**: **Firebase(Auth/Firestore/Storage)** + **Supabase(DB/RAG/로그/미들웨어 세션)**가 **혼용(이행기)** 상태
- **AI**: OpenAI(생성/임베딩) + (RAG: Supabase 벡터 테이블) + (Copilot: Pinecone 벡터 인덱스)
- **결제/메일**: Toss Payments 위젯 + Resend(환율 메일 발송)
- **같은 레포에 공존하는 별도 서비스**: Python(FastAPI/Streamlit) 프로젝트들 + C# VSTO(Outlook Add-in)

---

## 1) 레포 구성(“프로젝트”가 하나가 아님)

### 1.1 Next.js 메인 웹앱 (Node.js 런타임)
- **코드 루트**: `src/`
- **라우팅/페이지**: `src/app/**`
- **서버 엔드포인트(Next Route Handlers)**: `src/app/api/**`

### 1.2 Python 서브프로젝트들 (별도 실행/배포)
- **AI 화보 메이커(Streamlit)**: `ai-portrait-maker/`
- **이미지 파인더 API(FastAPI)**: `image-finder/`
- **검색 크롤러 API(Python 서버)**: `search-crawler/`

### 1.3 C# Outlook 자동화 키트(VSTO Add-in)
- **솔루션/프로젝트**: `WorkFree.AutoMailer.sln`, `WorkFree.AutoMailer/`

### 1.4 DB/운영 자료
- **Supabase SQL**: `supabase/*.sql`
- **운영/설정 가이드 문서 다수**: 루트의 `*_GUIDE.md`, `*_SETUP.md` 등

---

## 2) 실행/개발 명령어(로컬)

### 2.1 Next.js 앱
- **개발 서버**: `npm run dev` (Next dev)
- **빌드**: `npm run build`
- **프로덕션 실행**: `npm run start`
- **린트**: `npm run lint`

### 2.2 RAG/DB 유틸 스크립트(tsx)
- **Supabase 연결 테스트**: `npm run test:supabase`
- **임베딩 생성(knowledge.json → Supabase)**: `npm run embed`
- **Contextual 임베딩**: `npm run embed:contextual`
- **RAG 검색 테스트**: `npm run test:rag`
- **DB 쿼리 테스트**: `npm run test:db`
- **검색 디버그**: `npm run debug:search`

> 스크립트 소스: `scripts/*.ts` (실행은 `tsx` + `dotenv-cli`)

---

## 3) 기술 스택(“쓰고 있는 것들”)

### 3.1 Frontend/UI
- **Next.js**: `next` (App Router) + `next/image`, `next/link`, `next/navigation`
- **React**: `react`, `react-dom`
- **TypeScript**: `typescript`, `tsconfig.json` + 경로 별칭 `@/* -> src/*`
- **Styling**: Tailwind CSS v4 (PostCSS 플러그인: `postcss.config.mjs`)
- **Animation**: `framer-motion` (예: `src/components/animations/*`)
- **State**: `zustand` (`src/store/authStore.ts`)
- **Toast**: `react-hot-toast` (`src/components/ToastProvider.tsx`)

### 3.2 Backend(Next API) + 통합
- **AI(OpenAI)**: `openai`
  - 생성: 블로그/보고서/FRI 등 API 라우트에서 사용
  - 임베딩: RAG/코파일럿에서 `text-embedding-3-small`
- **RAG DB(Supabase)**: `@supabase/supabase-js`, `@supabase/ssr`
  - 벡터 테이블/로그 저장
  - 미들웨어에서 세션 확인
- **Firebase**: `firebase` (Auth/Firestore/Storage)
  - 사용자/크레딧/히스토리 등 “비즈니스 데이터”가 Firestore에 존재
- **Vector DB(Pinecone)**: `@pinecone-database/pinecone` (Co-pilot 문서 임베딩 저장/검색)
- **Payments(Toss)**: `@tosspayments/payment-widget-sdk` (`CheckoutClient.tsx`)
- **Email**:
  - `resend` (실 발송 라우트에서 사용)
  - `nodemailer` (의존성 존재 — 현재 코드에서는 제한적으로만 사용 흔적)

### 3.3 파일/문서 처리(도구 기능에 사용될 수 있는 라이브러리)
- `html2canvas`, `jspdf`, `jszip`, `mammoth`, `pptxgenjs`, `xlsx`, `pdf-parse`, `qrcode`
  - 예: QR ZIP 다운로드는 `jszip` + `qrcode` (`src/app/api/qr-generator/download/route.ts`)

---

## 4) 폴더별 “어디에 뭐가 있나”

### 4.1 라우팅(페이지)
- `src/app/page.tsx`: 메인 랜딩
- `src/app/tools/**`: 각 도구 UI (블로그, 보고서, 이미지, QR, 이메일, 환율, FRI 등)
- `src/app/my/**`: 마이페이지(대시보드/프로필/크레딧/히스토리 등)
- `src/app/admin/**`: 관리자 페이지(유저/크레딧/애널리틱스 등)
- `src/app/checkout/**`: 결제 UI

### 4.2 API(서버 라우트)
대표 예시(정확한 파일 기준):
- **블로그 생성**: `src/app/api/generate-blog/route.ts` (OpenAI)
- **보고서 생성**: `src/app/api/generate-report/route.ts` (OpenAI + (옵션) Naver 뉴스 검색)
- **이메일 템플릿 생성**: `src/app/api/email-template/generate/route.ts` *(현재는 mock 응답 중심)*
- **이미지 검색**: `src/app/api/image-finder/search/route.ts` (Unsplash/Pexels/Pixabay)
- **QR 생성**: `src/app/api/qr-generator/route.ts` (qrcode)
- **QR ZIP 다운로드**: `src/app/api/qr-generator/download/route.ts` (jszip + qrcode)
- **RAG 채팅**: `src/app/api/rag-chat/route.ts` (RAG + 로그 저장)
- **RAG 피드백**: `src/app/api/rag-feedback/route.ts`
- **환율 메일 발송(실제)**: `src/app/api/exchange-rate/send-real/route.ts` (Resend)

### 4.3 핵심 라이브러리/도메인 로직
- **Firebase 통합**: `src/lib/firebase.ts`
- **Supabase Auth 통합**: `src/lib/supabaseAuth.ts`
- **RAG(검색/답변)**: `src/lib/rag/supabaseRAG.ts`, `src/lib/rag/chatbot.ts`
- **Co-pilot(Pinecone RAG)**: `src/lib/copilot.ts`
- **크레딧(현 Firestore 기반)**: `src/lib/credits.ts` (+ `src/lib/creditSystem.ts` 존재)
- **이벤트/로그(현 Supabase 기반)**: `src/lib/analytics/eventLogger.ts`, `src/lib/analytics/chatLogger.ts`

---

## 5) “흐름”으로 보는 핵심 기능 지도

### 5.1 인증(Auth) — **현재 혼용(주의 포인트)**
- **클라이언트 훅**: `src/hooks/useAuth.ts`
  - `onAuthStateChange`, `getUserFromFirestore`를 `src/lib/firebase.ts`에서 가져옴 → **Firebase Auth + Firestore users** 기준
- **미들웨어 보호 라우팅**: `src/middleware.ts`
  - `@supabase/ssr`의 `createServerClient()`로 **Supabase 세션**을 확인하고 `/my`, `/tools`, `/admin` 등 보호
- **OAuth 콜백**: `src/app/auth/callback/route.ts`
  - Supabase `exchangeCodeForSession`으로 세션 교환 및 users 테이블 upsert
- **Supabase Auth SDK**: `src/lib/supabaseAuth.ts`
  - Supabase Auth 기반 회원가입/로그인/Google OAuth 함수 제공

> 결론: **“Firebase 중심 UX”와 “Supabase 세션 기반 보호”가 동시에 존재**합니다.  
> 실제 운영 시엔 “주 인증원(SSO) 1개”로 수렴하는 게 유지보수/버그 방지에 유리합니다.

### 5.2 크레딧(Credits)
- **FireStore users.credits + creditTransactions 기록**: `src/lib/credits.ts`
- 일부 도구 API에서 “크레딧 연동 TODO/임시 비활성화”가 보임  
  - 예: `src/app/api/qr-generator/route.ts`에서 `if (userId && false)`로 현재 비활성

### 5.3 분석/로그(Analytics)
- **로그인/클릭/페이지뷰**: `src/lib/analytics/eventLogger.ts` → Supabase 테이블(insert/rpc)
- **RAG 채팅 로그/피드백**: `src/app/api/rag-chat/route.ts` + `src/lib/analytics/chatLogger.ts`

### 5.4 RAG (WorkFree 지식 기반 Q&A)
- **지식 원본**: `src/lib/rag/knowledge.json`
- **임베딩 적재 스크립트**: `scripts/generate-embeddings.ts`, `scripts/embed-contextual.ts`
- **검색 로직**: `src/lib/rag/supabaseRAG.ts` (OpenAI 임베딩 + Supabase 테이블 조회 + 코사인 유사도)
- **답변 생성**: `src/lib/rag/chatbot.ts` (OpenAI chat.completions)
- **API**: `src/app/api/rag-chat/route.ts`, `src/app/api/rag-feedback/route.ts`

### 5.5 Co-pilot (업무 매뉴얼 업로드/검색 RAG)
- **Vector DB**: Pinecone
- **코어 라이브러리**: `src/lib/copilot.ts`
  - 문서 청킹 → 임베딩 → Pinecone upsert
  - 질문 임베딩 → Pinecone query → GPT 답변 생성

### 5.6 도구들(엔드유저 기능)
- **블로그 생성기**: OpenAI (저장: `src/lib/blogHistory.ts` → Firestore)
- **보고서 생성기**: OpenAI + (옵션) Naver 뉴스 API 검색
- **이미지 검색기**: Unsplash/Pexels/Pixabay 공식 API
- **QR 생성기**: qrcode + ZIP 다운로드(jszip)
- **환율 알리미**: 환율 수집 라우트 + 이메일 발송(Resend)
- **FRI 매뉴얼봇**: `src/app/api/frimanualbot/**` (OpenAI + 업로드/검색 등 보조 라우트 존재)

---

## 6) 환경 변수 체크리스트(핵심만)

### 6.1 공통(대부분의 기능에 영향)
- `OPENAI_API_KEY`

### 6.2 Supabase
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` *(RAG 적재/관리 스크립트에서 사용)*

### 6.3 Firebase
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### 6.4 Pinecone(Co-pilot)
- `PINECONE_API_KEY`
- `PINECONE_INDEX` *(옵션, 기본값 코드에 존재)*

### 6.5 Toss Payments
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`
- (서버 검증을 한다면) `TOSS_SECRET_KEY` *(README에 존재)*

### 6.6 Resend
- `RESEND_API_KEY`

### 6.7 외부 검색/이미지
- `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` (보고서 최신자료 검색 옵션)
- `UNSPLASH_ACCESS_KEY`, `PEXELS_API_KEY`, `PIXABAY_API_KEY` (이미지 검색)

---

## 7) 품질/빌드 주의사항(현재 설정 기준)

- `next.config.ts`에서 **TypeScript build error 무시**가 켜져 있음 (`ignoreBuildErrors: true`)  
  → 배포는 되지만, 타입 에러가 숨겨질 수 있어요.
- `eslint`는 **빌드 시 검사 활성화** 상태 (`ignoreDuringBuilds: false`)
- ESLint 설정: `eslint.config.mjs` (warn 중심 규칙 포함)

---

## 8) 문서와 코드 간 차이(알아두면 좋은 점)

- `TECH_ARCHITECTURE.md`, `PROJECT_STRUCTURE.md`는 “계획/확장” 내용이 섞여 있어 **현재 코드 실상과 일부 불일치**가 있을 수 있습니다.  
  예: 문서에는 Stripe/AWS S3/Cloudflare 등이 큰 비중으로 나오지만, 현재 코드에서 핵심 결제 플로우는 Toss 위젯 중심, 메일은 Resend 중심으로 보입니다.

---

## 9) 다음 액션(추천)

- **Auth 단일화 결정**: Firebase vs Supabase 중 “주 인증원”을 정하고, 미들웨어/클라이언트 훅/프로필 저장소를 그 기준으로 정리
- **Credits 저장소 단일화**: Firestore 기반(`credits.ts`)과 Supabase RPC 기반(`supabaseAuth.ts`의 credits 관련) 중 기준 확정
- **RAG 벡터 검색 최적화**: 현재 `supabaseRAG.ts`는 “전체 row를 가져와 클라이언트에서 유사도 계산” 구조 → 데이터가 커지면 성능 병목 가능


