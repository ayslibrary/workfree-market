# 🏗️ WorkFree Market 기술 아키텍처

> 실무 자동화 키트 거래소의 전체 시스템 설계 문서

---

## 📐 시스템 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                        사용자 (브라우저)                      │
│                 구매자 / 판매자 / 관리자                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    CDN (Cloudflare)                          │
│              • DDoS 방어  • SSL/TLS  • 캐싱                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 Frontend (Next.js 15)                        │
│  • App Router  • Server Components  • API Routes           │
└───────┬──────────────────────────┬─────────────────────────┘
        │                          │
        ▼                          ▼
┌──────────────────┐      ┌──────────────────────┐
│  Firebase Auth   │      │   Supabase DB        │
│  • 소셜 로그인   │      │   • 사용자 정보      │
│  • 이메일 인증   │      │   • 키트 메타데이터  │
└──────────────────┘      │   • 거래 내역        │
                          │   • 리뷰/평점        │
                          └──────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  결제 처리   │  파일 관리   │  검수 시스템 │  알림 시스템   │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       ▼              ▼              ▼                ▼
┌─────────────┐ ┌──────────┐ ┌─────────────┐ ┌──────────────┐
│   Stripe    │ │  AWS S3  │ │ VirusTotal  │ │   Zapier     │
│   Toss Pay  │ │CloudFront│ │     API     │ │Power Automate│
└─────────────┘ └──────────┘ └─────────────┘ └──────────────┘
```

---

## 🔧 기술 스택 상세

### 1. Frontend Stack

#### Core Framework
```typescript
// Next.js 15 with App Router
- Server Components (기본 렌더링)
- Client Components (상호작용)
- API Routes (서버리스 엔드포인트)
- ISR (Incremental Static Regeneration) for 상품 페이지
```

#### UI Library & Styling
```typescript
- Tailwind CSS 4: 유틸리티 기반 스타일
- Framer Motion: 애니메이션 (선택사항)
- Radix UI: 접근성 높은 컴포넌트
- React Icons: 아이콘 라이브러리
```

#### State Management
```typescript
- Zustand: 글로벌 상태 관리 (장바구니, 사용자 정보)
- React Query: 서버 상태 관리 및 캐싱
- Context API: 테마, 로케일 관리
```

---

### 2. 인증 시스템 (Firebase Auth)

#### 구현 방식
```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

#### 지원 로그인 방식
- 🔵 Google OAuth
- 💬 Kakao OAuth
- 🟢 Naver OAuth
- 📧 이메일/비밀번호
- 📱 전화번호 (SMS 인증)

#### 권한 관리
```typescript
// types/user.ts
type UserRole = 'buyer' | 'seller' | 'admin';

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  sellerLevel?: 'standard' | 'verified' | 'top-creator';
  createdAt: Date;
}
```

---

### 3. 데이터베이스 (Supabase)

#### 테이블 구조

##### `kits` (자동화 키트)
```sql
CREATE TABLE kits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category VARCHAR(50),
  tags TEXT[],
  preview_images TEXT[],
  file_url TEXT NOT NULL,
  download_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kits_category ON kits(category);
CREATE INDEX idx_kits_seller ON kits(seller_id);
CREATE INDEX idx_kits_rating ON kits(rating DESC);
```

##### `transactions` (거래 내역)
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES users(id),
  kit_id UUID REFERENCES kits(id),
  amount INTEGER NOT NULL,
  payment_method VARCHAR(50),
  payment_id VARCHAR(200),
  status VARCHAR(20) DEFAULT 'pending',
  downloaded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_kit ON transactions(kit_id);
```

##### `reviews` (리뷰)
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id),
  kit_id UUID REFERENCES kits(id),
  buyer_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_kit ON reviews(kit_id);
```

##### `seller_payouts` (판매자 정산)
```sql
CREATE TABLE seller_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES users(id),
  amount INTEGER NOT NULL,
  transaction_count INTEGER,
  period_start DATE,
  period_end DATE,
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 4. 결제 시스템

#### Stripe Connect 구조

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// 판매자 계정 생성
export async function createSellerAccount(userId: string, email: string) {
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'KR',
    email: email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
  
  return account.id;
}

// 결제 생성 (수수료 자동 계산)
export async function createPayment(
  amount: number,
  sellerId: string,
  platformFee: number = 0.25 // 25% 수수료
) {
  const applicationFee = Math.round(amount * platformFee);
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'krw',
    application_fee_amount: applicationFee,
    transfer_data: {
      destination: sellerId, // 판매자 Stripe 계정
    },
  });
  
  return paymentIntent;
}
```

#### Toss Payments 통합

```typescript
// lib/toss.ts
export async function initTossPayment(orderId: string, amount: number) {
  const response = await fetch('https://api.tosspayments.com/v1/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderId,
      amount,
      orderName: '자동화 키트 구매',
      successUrl: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
      failUrl: `${process.env.NEXT_PUBLIC_URL}/payment/fail`,
    }),
  });
  
  return await response.json();
}
```

---

### 5. 파일 저장 및 다운로드 (AWS S3)

#### S3 버킷 구조
```
workfree-market-files/
├── kits/
│   ├── {kit_id}/
│   │   ├── main.zip (암호화된 키트 파일)
│   │   ├── preview.png
│   │   └── metadata.json
├── previews/
│   └── {kit_id}/
│       └── code-snippet.txt
└── licenses/
    └── default-license.txt
```

#### 파일 업로드
```typescript
// lib/s3.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadKit(
  kitId: string,
  file: File,
  sellerId: string
) {
  const key = `kits/${kitId}/main.zip`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ServerSideEncryption: 'AES256',
    Metadata: {
      sellerId: sellerId,
      uploadedAt: new Date().toISOString(),
    },
  });
  
  await s3Client.send(command);
  return key;
}
```

#### 임시 다운로드 URL 생성
```typescript
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export async function generateDownloadUrl(
  kitId: string,
  userId: string,
  expiresIn: number = 3600 // 1시간
) {
  // 구매 확인
  const hasPurchased = await checkPurchase(userId, kitId);
  if (!hasPurchased) {
    throw new Error('Unauthorized');
  }
  
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `kits/${kitId}/main.zip`,
  });
  
  const url = await getSignedUrl(s3Client, command, { expiresIn });
  
  // 다운로드 로그 기록
  await logDownload(userId, kitId);
  
  return url;
}
```

---

### 6. 자동 검수 시스템

#### VirusTotal API 연동
```typescript
// lib/security.ts
export async function scanFile(fileBuffer: Buffer): Promise<ScanResult> {
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]));
  
  const response = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    headers: {
      'x-apikey': process.env.VIRUSTOTAL_API_KEY!,
    },
    body: formData,
  });
  
  const data = await response.json();
  const analysisId = data.data.id;
  
  // 스캔 결과 대기
  await new Promise(resolve => setTimeout(resolve, 30000)); // 30초
  
  const analysisResponse = await fetch(
    `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
    {
      headers: { 'x-apikey': process.env.VIRUSTOTAL_API_KEY! },
    }
  );
  
  const analysis = await analysisResponse.json();
  
  return {
    isSafe: analysis.data.attributes.stats.malicious === 0,
    detections: analysis.data.attributes.stats.malicious,
    scanDate: new Date(),
  };
}
```

#### 자동 검수 워크플로우
```typescript
// app/api/kits/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const sellerId = formData.get('sellerId') as string;
  
  // 1. 파일 스캔
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const scanResult = await scanFile(fileBuffer);
  
  if (!scanResult.isSafe) {
    return Response.json({ error: '악성 코드가 감지되었습니다.' }, { status: 400 });
  }
  
  // 2. 라이선스 삽입
  const kitWithLicense = await insertLicense(fileBuffer);
  
  // 3. S3 업로드
  const kitId = crypto.randomUUID();
  await uploadKit(kitId, new File([kitWithLicense], file.name), sellerId);
  
  // 4. DB에 키트 정보 저장 (승인 대기 상태)
  const { data, error } = await supabase
    .from('kits')
    .insert({
      id: kitId,
      seller_id: sellerId,
      title: formData.get('title'),
      description: formData.get('description'),
      price: parseInt(formData.get('price') as string),
      is_approved: false, // 관리자 승인 필요
    });
  
  // 5. 관리자에게 알림 전송
  await notifyAdmin(kitId);
  
  return Response.json({ success: true, kitId });
}
```

---

### 7. 코드 미리보기 (Monaco Editor)

```typescript
// components/CodePreview.tsx
'use client';

import Editor from '@monaco-editor/react';

interface CodePreviewProps {
  code: string;
  language: 'python' | 'javascript' | 'vba';
}

export function CodePreview({ code, language }: CodePreviewProps) {
  return (
    <Editor
      height="400px"
      language={language}
      value={code}
      theme="vs-dark"
      options={{
        readOnly: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
      }}
    />
  );
}
```

---

### 8. 자동 이메일 시스템

#### Zapier 워크플로우 예시

```yaml
# 구매 완료 시
Trigger: Supabase - New Row in 'transactions'
Actions:
  1. Gmail - Send Email
     To: {{ buyer_email }}
     Subject: "[WorkFree Market] 구매가 완료되었습니다"
     Body: |
       안녕하세요 {{ buyer_name }}님,
       
       {{ kit_title }} 구매가 완료되었습니다.
       아래 링크에서 다운로드하실 수 있습니다.
       
       다운로드: {{ download_url }}
       (링크는 24시간 동안 유효합니다)

# 판매자 정산 시
Trigger: Schedule - Monthly (매월 1일)
Actions:
  1. Supabase - Query Rows
     Table: transactions
     Filter: created_at >= last_month
     
  2. Stripe - Create Payout
     Amount: {{ calculated_amount }}
     Destination: {{ seller_stripe_account }}
     
  3. Gmail - Send Email
     To: {{ seller_email }}
     Subject: "[WorkFree Market] 월간 정산 완료"
```

#### Power Automate 대안

```typescript
// lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendPurchaseEmail(
  buyerEmail: string,
  kitTitle: string,
  downloadUrl: string
) {
  await transporter.sendMail({
    from: '"WorkFree Market" <noreply@workfreemarket.com>',
    to: buyerEmail,
    subject: `[WorkFree Market] ${kitTitle} 구매 완료`,
    html: `
      <h2>구매가 완료되었습니다!</h2>
      <p>자동화 키트를 다운로드하실 수 있습니다.</p>
      <a href="${downloadUrl}" style="display: inline-block; padding: 12px 24px; background: #9333ea; color: white; text-decoration: none; border-radius: 8px;">
        다운로드하기
      </a>
      <p style="color: #666; font-size: 12px;">* 링크는 24시간 동안 유효합니다.</p>
    `,
  });
}
```

---

## 🔐 보안 체크리스트

### 파일 보안
- [x] VirusTotal API 자동 스캔
- [x] S3 서버 측 암호화 (AES-256)
- [x] 구매자별 임시 다운로드 URL (1시간 만료)
- [x] 파일 내 라이선스 자동 삽입
- [x] 업로드 파일 크기 제한 (최대 100MB)

### 결제 보안
- [x] PCI-DSS 준수 (Stripe/Toss 사용)
- [x] 결제 정보 저장 금지
- [x] HTTPS 강제 적용
- [x] CSRF 토큰 검증

### 데이터 보안
- [x] Supabase Row Level Security (RLS)
- [x] API 요청 Rate Limiting
- [x] 환경변수 암호화 (Vercel Secrets)
- [x] 정기 백업 (일 1회)

---

## 📊 모니터링 & 분석

### 필수 지표

```typescript
// 대시보드에 표시할 KPI
interface Metrics {
  // 비즈니스 지표
  totalRevenue: number;
  dailyActiveUsers: number;
  conversionRate: number;
  averageOrderValue: number;
  
  // 판매자 지표
  totalKits: number;
  approvalRate: number;
  averageRating: number;
  
  // 시스템 지표
  apiLatency: number;
  downloadSpeed: number;
  errorRate: number;
}
```

### 추천 도구
- **Google Analytics 4**: 사용자 행동 분석
- **Sentry**: 에러 트래킹
- **Vercel Analytics**: 성능 모니터링
- **Stripe Dashboard**: 결제 분석

---

## 🚀 배포 전략

### 환경 구성

```bash
# .env.local (개발환경)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...

# Production (Vercel 환경변수)
NEXT_PUBLIC_SITE_URL=https://workfreemarket.com
STRIPE_SECRET_KEY=sk_live_...
AWS_ACCESS_KEY_ID=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### CI/CD 파이프라인

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📝 API 엔드포인트 설계

### Public API

```typescript
// GET /api/kits - 키트 목록 조회
// GET /api/kits/[id] - 키트 상세 조회
// GET /api/kits/search?q=메일자동화 - 검색
// GET /api/kits/category/[category] - 카테고리별 조회

// POST /api/kits - 키트 업로드 (판매자 전용)
// PUT /api/kits/[id] - 키트 수정
// DELETE /api/kits/[id] - 키트 삭제

// POST /api/payment/create - 결제 생성
// POST /api/payment/confirm - 결제 확인
// GET /api/download/[id] - 다운로드 URL 생성

// POST /api/reviews - 리뷰 작성
// GET /api/reviews/[kitId] - 키트 리뷰 조회
```

---

## 💡 성능 최적화

### Next.js 최적화
- **App Router**: 서버 컴포넌트로 초기 로딩 속도 개선
- **ISR**: 상품 페이지 5분마다 재생성
- **Image Optimization**: next/image로 자동 최적화
- **Code Splitting**: 동적 import로 번들 크기 축소

### 데이터베이스 최적화
- 인덱스 설정 (category, rating, created_at)
- Connection Pooling (Supabase 기본 제공)
- 쿼리 캐싱 (React Query)

### CDN & 캐싱
- CloudFront로 정적 파일 배포
- Redis로 핫 데이터 캐싱
- Stale-While-Revalidate 전략

---

## 📞 문의 및 지원

기술 문서 관련 문의: tech@workfreemarket.com


