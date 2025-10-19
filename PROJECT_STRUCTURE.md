# 📁 WorkFree Market 프로젝트 구조

> 전체 파일 및 폴더 구조와 각 파일의 역할 설명

---

## 🌳 디렉토리 구조

```
workfree-market/
├── 📁 public/                      # 정적 파일 (이미지, 아이콘 등)
│   ├── logo.svg
│   ├── favicon.ico
│   └── og-image.png
│
├── 📁 src/
│   ├── 📁 app/                     # Next.js 15 App Router
│   │   ├── 📁 (auth)/              # 인증 관련 페이지 그룹
│   │   │   ├── 📁 login/
│   │   │   │   └── page.tsx        # 로그인 페이지
│   │   │   ├── 📁 signup/
│   │   │   │   └── page.tsx        # 회원가입 페이지
│   │   │   └── 📁 reset-password/
│   │   │       └── page.tsx        # 비밀번호 재설정
│   │   │
│   │   ├── 📁 kits/                # 자동화 키트 관련
│   │   │   ├── page.tsx            # 키트 목록 페이지
│   │   │   ├── 📁 [id]/
│   │   │   │   ├── page.tsx        # 키트 상세 페이지
│   │   │   │   └── loading.tsx     # 로딩 UI
│   │   │   ├── 📁 category/
│   │   │   │   └── 📁 [slug]/
│   │   │   │       └── page.tsx    # 카테고리별 키트
│   │   │   └── 📁 search/
│   │   │       └── page.tsx        # 검색 결과
│   │   │
│   │   ├── 📁 seller/              # 판매자 전용
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── page.tsx        # 판매자 대시보드
│   │   │   ├── 📁 upload/
│   │   │   │   └── page.tsx        # 키트 업로드
│   │   │   ├── 📁 sales/
│   │   │   │   └── page.tsx        # 판매 내역
│   │   │   └── 📁 payouts/
│   │   │       └── page.tsx        # 정산 내역
│   │   │
│   │   ├── 📁 my/                  # 마이페이지
│   │   │   ├── 📁 purchases/
│   │   │   │   └── page.tsx        # 구매 내역
│   │   │   ├── 📁 downloads/
│   │   │   │   └── page.tsx        # 다운로드 내역
│   │   │   ├── 📁 reviews/
│   │   │   │   └── page.tsx        # 작성한 리뷰
│   │   │   └── 📁 settings/
│   │   │       └── page.tsx        # 계정 설정
│   │   │
│   │   ├── 📁 payment/             # 결제 관련
│   │   │   ├── 📁 checkout/
│   │   │   │   └── page.tsx        # 결제 페이지
│   │   │   ├── 📁 success/
│   │   │   │   └── page.tsx        # 결제 성공
│   │   │   └── 📁 fail/
│   │   │       └── page.tsx        # 결제 실패
│   │   │
│   │   ├── 📁 admin/               # 관리자 전용
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── page.tsx        # 관리자 대시보드
│   │   │   ├── 📁 approval/
│   │   │   │   └── page.tsx        # 키트 검수
│   │   │   └── 📁 users/
│   │   │       └── page.tsx        # 사용자 관리
│   │   │
│   │   ├── 📁 api/                 # API Routes (서버리스 함수)
│   │   │   ├── 📁 auth/
│   │   │   │   ├── 📁 [...nextauth]/
│   │   │   │   │   └── route.ts    # NextAuth 핸들러
│   │   │   │   └── 📁 register/
│   │   │   │       └── route.ts    # 회원가입 API
│   │   │   │
│   │   │   ├── 📁 kits/
│   │   │   │   ├── route.ts        # GET /api/kits
│   │   │   │   ├── 📁 [id]/
│   │   │   │   │   └── route.ts    # GET/PUT/DELETE /api/kits/:id
│   │   │   │   ├── 📁 upload/
│   │   │   │   │   └── route.ts    # POST /api/kits/upload
│   │   │   │   └── 📁 search/
│   │   │   │       └── route.ts    # GET /api/kits/search
│   │   │   │
│   │   │   ├── 📁 payment/
│   │   │   │   ├── 📁 create/
│   │   │   │   │   └── route.ts    # POST /api/payment/create
│   │   │   │   ├── 📁 confirm/
│   │   │   │   │   └── route.ts    # POST /api/payment/confirm
│   │   │   │   └── 📁 stripe/
│   │   │   │       └── route.ts    # Stripe 결제
│   │   │   │
│   │   │   ├── 📁 download/
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── route.ts    # GET /api/download/:id
│   │   │   │
│   │   │   ├── 📁 reviews/
│   │   │   │   └── route.ts        # POST /api/reviews
│   │   │   │
│   │   │   └── 📁 webhooks/
│   │   │       ├── 📁 stripe/
│   │   │       │   └── route.ts    # Stripe Webhook
│   │   │       └── 📁 toss/
│   │   │           └── route.ts    # Toss Webhook
│   │   │
│   │   ├── layout.tsx              # 루트 레이아웃
│   │   ├── page.tsx                # 메인 랜딩 페이지 ✅
│   │   ├── globals.css             # 글로벌 스타일 ✅
│   │   ├── error.tsx               # 에러 페이지
│   │   ├── not-found.tsx           # 404 페이지
│   │   └── loading.tsx             # 글로벌 로딩 UI
│   │
│   ├── 📁 components/              # 재사용 가능한 컴포넌트
│   │   ├── 📁 ui/                  # 기본 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── 📁 kit/                 # 키트 관련 컴포넌트
│   │   │   ├── KitCard.tsx         # 키트 카드
│   │   │   ├── KitGrid.tsx         # 키트 그리드
│   │   │   ├── KitFilter.tsx       # 필터링
│   │   │   ├── KitDetail.tsx       # 상세 정보
│   │   │   └── CodePreview.tsx     # 코드 미리보기
│   │   │
│   │   ├── 📁 payment/             # 결제 관련
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── StripeCheckout.tsx
│   │   │   └── TossCheckout.tsx
│   │   │
│   │   ├── 📁 seller/              # 판매자 컴포넌트
│   │   │   ├── UploadForm.tsx
│   │   │   ├── SalesChart.tsx
│   │   │   └── PayoutTable.tsx
│   │   │
│   │   ├── 📁 review/              # 리뷰 컴포넌트
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   └── StarRating.tsx
│   │   │
│   │   ├── 📁 layout/              # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   └── 📁 common/              # 공통 컴포넌트
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── Pagination.tsx
│   │       └── SearchBar.tsx
│   │
│   ├── 📁 lib/                     # 유틸리티 및 헬퍼 함수
│   │   ├── firebase.ts             # Firebase 설정
│   │   ├── supabase.ts             # Supabase 클라이언트
│   │   ├── stripe.ts               # Stripe 헬퍼
│   │   ├── toss.ts                 # Toss Payments 헬퍼
│   │   ├── s3.ts                   # AWS S3 헬퍼
│   │   ├── security.ts             # 보안 관련 (바이러스 스캔)
│   │   ├── email.ts                # 이메일 발송
│   │   ├── notion.ts               # Notion API
│   │   └── utils.ts                # 범용 유틸리티
│   │
│   ├── 📁 hooks/                   # 커스텀 React Hooks
│   │   ├── useAuth.ts              # 인증 상태 관리
│   │   ├── useKits.ts              # 키트 데이터
│   │   ├── usePayment.ts           # 결제 처리
│   │   ├── useDownload.ts          # 다운로드 관리
│   │   └── useToast.ts             # 토스트 알림
│   │
│   ├── 📁 store/                   # 상태 관리 (Zustand)
│   │   ├── authStore.ts            # 인증 상태
│   │   ├── cartStore.ts            # 장바구니
│   │   └── uiStore.ts              # UI 상태 (모달, 사이드바 등)
│   │
│   ├── 📁 types/                   # TypeScript 타입 정의
│   │   ├── user.ts
│   │   ├── kit.ts
│   │   ├── transaction.ts
│   │   ├── review.ts
│   │   └── index.ts
│   │
│   ├── 📁 styles/                  # 추가 스타일 파일
│   │   └── markdown.css            # 마크다운 스타일
│   │
│   └── 📁 utils/                   # 헬퍼 함수
│       ├── format.ts               # 포맷팅 (날짜, 금액 등)
│       ├── validation.ts           # 유효성 검사
│       └── constants.ts            # 상수 정의
│
├── 📁 prisma/                      # Prisma ORM (선택사항)
│   └── schema.prisma               # 데이터베이스 스키마
│
├── 📁 tests/                       # 테스트 파일
│   ├── 📁 unit/
│   ├── 📁 integration/
│   └── 📁 e2e/
│
├── 📁 scripts/                     # 유틸리티 스크립트
│   ├── seed.ts                     # 데이터베이스 시드
│   └── migrate.ts                  # 마이그레이션
│
├── 📄 .gitignore                   # Git 제외 파일
├── 📄 .eslintrc.json              # ESLint 설정
├── 📄 next.config.ts              # Next.js 설정 ✅
├── 📄 tailwind.config.ts          # Tailwind 설정
├── 📄 tsconfig.json               # TypeScript 설정 ✅
├── 📄 package.json                # 의존성 관리 ✅
├── 📄 README.md                   # 프로젝트 소개 ✅
├── 📄 TECH_ARCHITECTURE.md        # 기술 아키텍처 문서 ✅
├── 📄 ENV_SETUP.md                # 환경 변수 설정 가이드 ✅
└── 📄 PROJECT_STRUCTURE.md        # 프로젝트 구조 (현재 파일) ✅
```

---

## 📋 주요 파일 상세 설명

### 1. 랜딩 페이지 (`src/app/page.tsx`) ✅

현재 완성된 메인 페이지입니다.

**포함 섹션:**
- Hero 섹션 (메인 배너)
- 작동 방식 (3단계)
- 인기 자동화 키트
- 판매자 되기
- 실제 사용자 리뷰
- CTA 섹션
- Footer

---

### 2. API Routes 구조

#### 키트 관련 API
```typescript
// src/app/api/kits/route.ts
// GET: 키트 목록 조회
// POST: 새 키트 업로드 (판매자 전용)

// src/app/api/kits/[id]/route.ts
// GET: 특정 키트 상세 조회
// PUT: 키트 정보 수정
// DELETE: 키트 삭제

// src/app/api/kits/search/route.ts
// GET: 키트 검색 (쿼리 파라미터)
```

#### 결제 API
```typescript
// src/app/api/payment/create/route.ts
export async function POST(request: Request) {
  const { kitId, userId } = await request.json();
  
  // 1. 키트 정보 조회
  const kit = await getKit(kitId);
  
  // 2. 결제 생성 (Stripe/Toss)
  const payment = await createPayment(kit.price, kit.seller_id);
  
  return Response.json({ paymentId: payment.id });
}
```

#### 다운로드 API
```typescript
// src/app/api/download/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  
  // 구매 확인
  const hasPurchased = await checkPurchase(session.user.id, params.id);
  
  if (!hasPurchased) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  // S3 임시 다운로드 URL 생성
  const downloadUrl = await generateDownloadUrl(params.id);
  
  return Response.json({ url: downloadUrl });
}
```

---

### 3. 컴포넌트 예시

#### KitCard.tsx
```typescript
// src/components/kit/KitCard.tsx
interface KitCardProps {
  id: string;
  title: string;
  price: number;
  rating: number;
  downloadCount: number;
  category: string;
  previewImage: string;
}

export function KitCard({ 
  id, title, price, rating, downloadCount, category, previewImage 
}: KitCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
      <img src={previewImage} alt={title} className="w-full h-48 object-cover rounded-xl mb-4" />
      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{category}</span>
      <h3 className="text-xl font-bold mt-3">{title}</h3>
      <div className="flex items-center justify-between mt-4">
        <span className="text-2xl font-bold">₩{price.toLocaleString()}</span>
        <span className="text-yellow-500">★ {rating}</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">{downloadCount}회 다운로드</p>
      <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
        구매하기
      </button>
    </div>
  );
}
```

---

### 4. 타입 정의

#### types/kit.ts
```typescript
export interface Kit {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: KitCategory;
  tags: string[];
  preview_images: string[];
  file_url: string;
  download_count: number;
  rating: number;
  review_count: number;
  is_approved: boolean;
  created_at: Date;
  updated_at: Date;
}

export type KitCategory = 
  | '메일자동화'
  | '엑셀자동화'
  | '데이터분석'
  | 'Apps Script'
  | '웹스크래핑'
  | '기타';

export interface KitSearchParams {
  query?: string;
  category?: KitCategory;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'latest' | 'popular' | 'rating' | 'price';
  page?: number;
  limit?: number;
}
```

#### types/user.ts
```typescript
export type UserRole = 'buyer' | 'seller' | 'admin';

export type SellerLevel = 'standard' | 'verified' | 'top-creator';

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: UserRole;
  seller_level?: SellerLevel;
  seller_stripe_account?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SellerStats {
  total_sales: number;
  total_revenue: number;
  total_kits: number;
  average_rating: number;
  total_downloads: number;
}
```

---

### 5. Hooks 사용 예시

#### useAuth.ts
```typescript
// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function useAuth() {
  const { user, setUser, clearUser } = useAuthStore();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          display_name: firebaseUser.displayName!,
        });
      } else {
        clearUser();
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  return { user, isAuthenticated: !!user };
}
```

---

## 🎯 개발 우선순위

### Phase 1: MVP (현재 완료) ✅
- [x] 랜딩 페이지
- [x] 프로젝트 문서화
- [x] 기술 스택 정의

### Phase 2: 핵심 기능 (다음 단계)
1. **인증 시스템** (`src/app/(auth)/`)
   - 로그인/회원가입 페이지
   - Firebase Auth 연동
   - 소셜 로그인

2. **키트 시스템** (`src/app/kits/`)
   - 키트 목록 페이지
   - 키트 상세 페이지
   - 검색 및 필터링

3. **결제 시스템** (`src/app/api/payment/`)
   - Stripe/Toss 연동
   - 결제 페이지
   - 성공/실패 처리

### Phase 3: 판매자 기능
1. **판매자 대시보드** (`src/app/seller/`)
   - 키트 업로드 폼
   - 판매 통계
   - 정산 내역

2. **파일 관리** (`src/lib/s3.ts`)
   - S3 업로드
   - 다운로드 URL 생성
   - 보안 검사

### Phase 4: 커뮤니티
1. **리뷰 시스템** (`src/app/api/reviews/`)
   - 리뷰 작성
   - 평점 계산
   - 베스트 리뷰

2. **관리자 기능** (`src/app/admin/`)
   - 키트 검수
   - 사용자 관리
   - 통계 대시보드

---

## 📝 파일 명명 규칙

### 컴포넌트
- PascalCase: `KitCard.tsx`, `PaymentForm.tsx`
- 폴더명은 kebab-case: `code-preview/`

### API Routes
- kebab-case: `create-payment/`, `check-purchase/`
- HTTP 메서드별 함수명: `GET`, `POST`, `PUT`, `DELETE`

### 유틸리티
- camelCase: `formatPrice()`, `validateEmail()`
- 파일명은 kebab-case: `format-utils.ts`

### 타입
- PascalCase for interfaces: `User`, `Kit`, `Transaction`
- camelCase for types: `kitCategory`, `userRole`

---

## 🔍 코드 예시 위치

각 기능별 참고 코드 위치:

| 기능 | 파일 위치 |
|------|-----------|
| 랜딩 페이지 UI | `src/app/page.tsx` ✅ |
| 결제 생성 | `src/lib/stripe.ts` (예정) |
| 파일 업로드 | `src/lib/s3.ts` (예정) |
| 인증 로직 | `src/hooks/useAuth.ts` (예정) |
| 키트 카드 | `src/components/kit/KitCard.tsx` (예정) |

---

## 📞 문의

프로젝트 구조 관련 문의: dev@workfreemarket.com





