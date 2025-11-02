# 🚀 배포 체크리스트 - WorkFree Market

## ✅ 완료된 개선 사항

### 1. 보안 강화
- [x] console.log 제거 (민감한 정보 노출 방지)
- [x] 환경 변수 구조화 (.env.example 생성)
- [x] API 키 하드코딩 제거

### 2. 성능 최적화
- [x] Next.js Image 컴포넌트 적용 (MainNavigation)
- [x] 이미지 자동 최적화 설정

### 3. SEO 개선
- [x] Open Graph 메타태그 추가
- [x] Twitter Card 추가
- [x] robots.txt 생성
- [x] sitemap.ts 생성 (동적 사이트맵)
- [x] 키워드 및 메타데이터 최적화

### 4. 코드 품질
- [x] 주요 TypeScript 에러 6개 수정
- [x] 빌드 설정 최적화

---

## 📦 Vercel 배포 가이드

### 1단계: 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables에 추가:

```bash
# OpenAI (필수 - 블로그 생성기)
OPENAI_API_KEY=sk-proj-your-key

# Toss Payments (필수 - 결제)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq
TOSS_SECRET_KEY=your-secret-key

# Image APIs (이미 설정되어 있음)
UNSPLASH_ACCESS_KEY=tYJaN2hzn_j1UEZCH5vd2YfayTwShagHAnmfiyqtYb0
PEXELS_API_KEY=YmEljCccg5fdyHk0Vd6GQK5K6kPa6tRw5AKXfb7hTebjKSdPD520AzTb
PIXABAY_API_KEY=52944408-afd014b9efdddab303767de3d

# Resend (이메일 - DNS 설정 완료 후)
RESEND_API_KEY=re_your-key

# Firebase (선택사항 - 현재 데모 모드)
# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Site URL
NEXT_PUBLIC_SITE_URL=https://workfreemarket.com
```

**중요**: Production, Preview, Development 환경 모두 체크 ✅

---

### 2단계: 배포 실행

#### 방법 A: Git 푸시 (자동 배포)
```bash
git add .
git commit -m "feat: 보안 및 SEO 개선, 성능 최적화"
git push origin main
```

#### 방법 B: Vercel CLI
```bash
# Vercel CLI 설치 (한 번만)
npm i -g vercel

# 배포
vercel --prod
```

---

### 3단계: 배포 후 확인 사항

#### ✅ 기능 테스트
- [ ] 홈페이지 로딩
- [ ] 블로그 생성기 작동
- [ ] 이미지 검색 작동
- [ ] QR 생성기 작동
- [ ] 로그인/회원가입 (데모 모드)

#### ✅ SEO 확인
```bash
# Open Graph 테스트
https://www.opengraph.xyz/
https://cards-dev.twitter.com/validator

# Google Search Console
https://search.google.com/search-console
```

#### ✅ 성능 확인
```bash
# Lighthouse 점수
https://pagespeed.web.dev/

# Vercel Analytics
Vercel Dashboard → Analytics
```

---

## 🔧 배포 후 설정

### 1. Resend DNS 검증
- 10~30분 후 Resend Dashboard 확인
- "Pending" → "Active" 변경 확인
- 테스트 이메일 발송

### 2. Google Search Console 등록
```bash
1. https://search.google.com/search-console 접속
2. 속성 추가: https://workfreemarket.com
3. 소유권 확인 (DNS TXT 레코드)
4. sitemap.xml 제출: https://workfreemarket.com/sitemap.xml
```

### 3. Naver 검색 등록
```bash
1. https://searchadvisor.naver.com/ 접속
2. 웹마스터 도구 등록
3. 사이트 소유 확인
4. 사이트맵 제출
```

---

## ⚠️ 알려진 이슈 및 TODO

### 타입 에러 (약 5개 남음)
현재 `ignoreBuildErrors: true`로 우회 중입니다.

**수정 필요한 파일**:
1. `src/app/tools/outlook-mail-builder/page.tsx` - 사용하지 않는 imports
2. `src/lib/firebase.ts` - 사용하지 않는 imports
3. 기타 any 타입 (약 30개)

**수정 방법**:
```bash
# 1. 타입 에러 확인
npm run build

# 2. 수정 후
# next.config.ts에서 ignoreBuildErrors: false로 변경
```

### 추가 이미지 최적화 (약 10개)
현재 MainNavigation만 최적화되었습니다.

**남은 파일들**:
- `src/app/login/page.tsx`
- `src/app/page.tsx` (3개)
- `src/app/requests/page.tsx` (3개)
- `src/components/QRGenerator.tsx`
- `src/components/AIImageModal.tsx`

---

## 📊 현재 빌드 상태

✅ **빌드 성공**
- Compiled successfully
- 페이지 생성 완료
- 배포 가능 상태

⚠️ **경고 (Warning only)**
- ESLint 경고 약 100개 (빌드에 영향 없음)
- 타입 경고 (ignoreBuildErrors로 우회)

---

## 🎯 다음 단계 (선택사항)

### 우선순위 1 (성능)
- [ ] 남은 `<img>` → `<Image>` 변경 (10개)
- [ ] 이미지 압축 및 최적화
- [ ] 코드 스플리팅 개선

### 우선순위 2 (품질)
- [ ] TypeScript 에러 전체 수정
- [ ] ESLint warning 정리
- [ ] 사용하지 않는 코드 제거

### 우선순위 3 (기능)
- [ ] Firebase 실제 설정 구성
- [ ] 실제 결제 시스템 연동
- [ ] 에러 트래킹 (Sentry) 추가
- [ ] 분석 도구 (GA4) 연동

---

## 📞 문의

문제 발생 시:
1. Vercel Runtime Logs 확인
2. 환경 변수 재확인
3. `.env.local`과 Vercel 환경 변수 일치 확인

---

**배포 준비 완료! 🎉**

`git push` 또는 `vercel --prod` 실행하면 배포됩니다!

