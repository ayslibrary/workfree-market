# 🚀 Vercel 배포 가이드

## ✅ Git 커밋 완료!

변경사항이 성공적으로 GitHub에 푸시되었습니다:
- Repository: `https://github.com/ayslibrary/workfree-market.git`
- Branch: `main`
- 최신 커밋: "feat: AI 화보 갤러리 페이지 추가"

---

## 🌐 Vercel 배포 방법 (2가지)

### 방법 1: Vercel 웹사이트에서 배포 (추천 ⭐)

**가장 쉽고 안정적인 방법입니다!**

#### 1단계: Vercel 웹사이트 접속
```
https://vercel.com
```

#### 2단계: GitHub로 로그인
- "Sign Up" 또는 "Log In" 클릭
- "Continue with GitHub" 선택
- GitHub 계정으로 로그인

#### 3단계: 새 프로젝트 Import
1. Dashboard에서 **"Add New..."** → **"Project"** 클릭
2. "Import Git Repository" 섹션에서 GitHub 연결
3. `workfree-market` 저장소 찾기
4. **"Import"** 버튼 클릭

#### 4단계: 프로젝트 설정
- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (자동)
- **Output Directory**: `.next` (자동)
- **Environment Variables**: (Firebase 설정이 있다면 추가)

#### 5단계: Deploy!
- **"Deploy"** 버튼 클릭
- 2-3분 후 배포 완료! 🎉

#### 배포 완료 후
- 자동으로 생성된 URL: `https://workfree-market-xxx.vercel.app`
- 커스텀 도메인 연결 가능
- **GitHub에 push할 때마다 자동 배포됨!**

---

### 방법 2: Vercel CLI로 배포 (고급)

**CLI 오류가 있어서 현재는 방법 1을 추천합니다.**

만약 나중에 CLI로 배포하고 싶다면:

#### 1단계: Vercel 웹사이트에서 토큰 생성
1. https://vercel.com/account/tokens
2. "Create Token" 클릭
3. 토큰 복사

#### 2단계: PowerShell에서 환경 변수 설정
```powershell
$env:VERCEL_TOKEN="여기에_토큰_붙여넣기"
```

#### 3단계: 배포
```powershell
vercel --prod --token $env:VERCEL_TOKEN
```

---

## 🔥 자동 배포 설정 (추천!)

Vercel과 GitHub를 연결하면:
- ✅ `main` 브랜치에 push → 자동으로 프로덕션 배포
- ✅ Pull Request 생성 → 자동으로 프리뷰 배포
- ✅ 배포 상태 GitHub에 표시
- ✅ 롤백 기능 (이전 버전으로 즉시 복구)

---

## 📋 배포 전 체크리스트

- [x] Git 커밋 완료
- [x] GitHub에 push 완료
- [ ] Vercel 계정 생성/로그인
- [ ] GitHub 저장소 Import
- [ ] 배포 완료
- [ ] 배포된 URL 확인

---

## 🌍 배포 후 확인사항

### 1. 새로운 갤러리 페이지 테스트
```
https://your-domain.vercel.app/gallery
```

### 2. 주요 기능 확인
- ✅ 20가지 AI 화보 스타일 표시
- ✅ 카테고리 필터링 작동
- ✅ 카드 클릭 시 모달 팝업
- ✅ "이렇게 만들기" 버튼 작동
- ✅ 반응형 디자인 (모바일/태블릿)

### 3. 메인 페이지 확인
```
https://your-domain.vercel.app
```
- "AI 화보 갤러리 보기" 버튼이 제대로 보이는지 확인

---

## 🔧 환경 변수 설정 (선택사항)

만약 Firebase를 사용 중이라면 Vercel에서 환경 변수를 설정해야 합니다:

1. Vercel Dashboard → 프로젝트 선택
2. "Settings" → "Environment Variables"
3. 다음 변수들 추가:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

---

## 🎉 배포 완료 후

### 배포된 사이트 URL:
```
https://workfree-market-xxx.vercel.app
```

### 갤러리 페이지 직접 링크:
```
https://workfree-market-xxx.vercel.app/gallery
```

### 커스텀 도메인 연결하기:
1. Vercel Dashboard → 프로젝트 → "Settings" → "Domains"
2. 도메인 입력 (예: `workfree.com`)
3. DNS 설정 안내에 따라 설정
4. 10분 후 SSL 인증서 자동 발급 완료!

---

## 📱 공유하기

배포가 완료되면 다음과 같이 공유할 수 있습니다:

```
🎨 AI 화보 갤러리가 오픈했습니다!

5분 만에 프로급 화보 제작
20가지 스타일 | 무제한 재촬영

👉 https://your-domain.vercel.app/gallery

#AI화보 #프로필사진 #LinkedInProfile
```

---

## 🆘 문제 해결

### 배포가 실패하는 경우:
1. Vercel Dashboard에서 "Deployment" 로그 확인
2. Build Error 메시지 확인
3. 환경 변수 설정 확인

### 페이지가 로드되지 않는 경우:
1. 브라우저 캐시 삭제 (Ctrl + Shift + R)
2. Vercel Dashboard에서 "Redeploy" 클릭

### Firebase 오류가 나는 경우:
1. 환경 변수가 올바르게 설정되었는지 확인
2. Firebase 프로젝트에서 도메인이 승인되었는지 확인

---

## 🎯 다음 단계

배포가 완료되면:
1. ✅ URL을 명함/프로필에 추가
2. ✅ SNS에 공유
3. ✅ Google Analytics 설정
4. ✅ SEO 최적화 (meta tags)
5. ✅ 실제 AI 생성 이미지 업로드

---

**지금 바로 Vercel 웹사이트로 가서 배포하세요!** 🚀

👉 https://vercel.com

