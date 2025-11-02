# 🚀 WorkFree 배포 가이드

## ✅ 배포 전 체크리스트

### 1. 빌드 테스트 완료
```bash
npm run build
```
✅ **완료** - 빌드 성공 (warnings만 있고 errors 없음)

---

## 📦 Vercel 배포 (권장)

### 방법 1: Vercel CLI로 배포 (빠름)

#### 1단계: Vercel CLI 설치
```bash
npm install -g vercel
```

#### 2단계: Vercel 로그인
```bash
vercel login
```

#### 3단계: 배포
```bash
# 프로덕션 배포
vercel --prod

# 또는 미리보기 배포
vercel
```

---

### 방법 2: Vercel 웹사이트에서 배포 (간편)

#### 1. Vercel 웹사이트 접속
https://vercel.com

#### 2. GitHub 연동
1. "New Project" 클릭
2. GitHub repository 선택
3. Import

#### 3. 프로젝트 설정
- **Framework Preset**: Next.js 자동 감지됨
- **Root Directory**: `.` (기본값)
- **Build Command**: `npm run build` (자동 설정됨)
- **Output Directory**: `.next` (자동 설정됨)

#### 4. 환경 변수 설정 ⚠️ **중요!**

Vercel 프로젝트 설정 > Environment Variables에서 다음을 추가:

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# OpenAI
OPENAI_API_KEY=

# Toss Payments
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=

# Resend (Email)
RESEND_API_KEY=

# 기타 (필요시)
NEXT_PUBLIC_SITE_URL=https://workfree.app
```

**💡 Tip:** 로컬의 `.env.local` 파일에서 복사하세요.

#### 5. 배포 시작
"Deploy" 버튼 클릭!

---

## 🌐 커스텀 도메인 설정

### Vercel에서 도메인 연결

1. Vercel 프로젝트 > Settings > Domains
2. 도메인 입력: `workfree.app`
3. DNS 설정 (도메인 제공업체에서):

```
# A Record
Type: A
Name: @
Value: 76.76.21.21

# CNAME Record  
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🔧 배포 후 확인 사항

### 1. 기본 기능 테스트
- [ ] 홈페이지 로딩
- [ ] 베타 신청 페이지 (/beta)
- [ ] 베타 미션 페이지 (/beta/missions)
- [ ] Firebase 연동 확인
- [ ] 이미지 로딩 확인

### 2. 베타 테스트 기능
- [ ] 모집 현황 배너 정상 작동
- [ ] Firebase에서 참가자 수 가져오기
- [ ] 크레딧 표시 확인
- [ ] 미션 진행 상황 저장

### 3. API 엔드포인트
- [ ] /api/generate-blog
- [ ] /api/generate-report
- [ ] /api/qr-generator
- [ ] /api/image-finder/search

---

## 🔐 환경 변수 설정 상세

### Firebase 설정
Firebase Console > 프로젝트 설정 > 일반 > 내 앱 > SDK 설정 및 구성

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### OpenAI API Key
https://platform.openai.com/api-keys

### Toss Payments
https://developers.tosspayments.com/

### Resend (Email)
https://resend.com/api-keys

---

## 📊 베타 테스트 날짜 설정 (중요!)

배포 전에 실제 베타 시작일로 업데이트하세요:

**파일:** `src/types/beta-onboarding.ts`

```typescript
export const BETA_CONFIG = {
  // 실제 날짜로 변경!
  BETA_START_DATE: new Date('2025-11-03'),      // 베타 시작일
  RECRUITMENT_END_DATE: new Date('2025-11-23'), // 3주 후
  BETA_END_DATE: new Date('2025-11-30'),        // 4주 후
};
```

---

## 🚨 트러블슈팅

### 빌드 에러 발생 시
```bash
# 캐시 삭제
rm -rf .next
npm run build
```

### 환경 변수가 적용 안 될 때
1. Vercel 대시보드에서 확인
2. `NEXT_PUBLIC_` 접두사 확인
3. 재배포: `vercel --prod --force`

### Firebase 연결 안 될 때
- Firebase 프로젝트에서 도메인 승인 필요
- Firebase Console > Authentication > Settings > Authorized domains
- `workfree.app` 추가

---

## 📈 배포 후 모니터링

### Vercel Analytics
- 자동으로 활성화됨
- 페이지 뷰, 성능 메트릭 확인

### Firebase Console
- 베타 테스터 수 실시간 모니터링
- `beta_testers` 컬렉션 확인

---

## 🎯 다음 단계

1. ✅ **배포 완료**
2. 🧪 **베타 테스트 시작** (Week 1-3)
3. 📊 **데이터 수집** (4주간)
4. 🚀 **정식 런칭**

---

## 📞 지원

배포 문제 발생 시:
- Vercel Support: https://vercel.com/support
- Next.js Discord: https://nextjs.org/discord

---

**배포 날짜**: 2025-11-02  
**버전**: v1.0 (베타 테스트)
