# 🔥 Firebase 빠른 설정 가이드

> 5분 안에 Firebase Authentication 설정 완료하기

---

## 1️⃣ Firebase 프로젝트 생성

### Step 1: Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com/) 방문
2. "프로젝트 추가" 클릭

### Step 2: 프로젝트 정보 입력
```
프로젝트 이름: workfree-market (원하는 이름)
```

### Step 3: Google Analytics (선택사항)
- 지금은 비활성화해도 됩니다 (나중에 추가 가능)

---

## 2️⃣ 웹 앱 추가

### Step 1: 프로젝트 설정
1. 프로젝트 개요 → ⚙️ (톱니바퀴) 클릭
2. "프로젝트 설정" 선택

### Step 2: 웹 앱 등록
1. 아래로 스크롤 → "앱" 섹션
2. 웹 아이콘 `</>` 클릭
3. 앱 닉네임 입력: `WorkFree Market Web`
4. "앱 등록" 클릭

### Step 3: Firebase SDK 설정 복사
화면에 나타나는 설정 정보를 복사합니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "workfree-market.firebaseapp.com",
  projectId: "workfree-market",
  storageBucket: "workfree-market.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 3️⃣ Authentication 활성화

### Step 1: Authentication 메뉴
1. 왼쪽 메뉴에서 "Authentication" 클릭
2. "시작하기" 버튼 클릭

### Step 2: 로그인 방법 설정

#### Google 로그인 활성화
1. "Sign-in method" 탭 클릭
2. "Google" 선택
3. 토글 활성화
4. 프로젝트 지원 이메일 선택
5. "저장" 클릭

#### 이메일/비밀번호 활성화
1. "Sign-in method" 탭에서
2. "이메일/비밀번호" 선택
3. 토글 활성화 (이메일 링크는 비활성화)
4. "저장" 클릭

---

## 4️⃣ 환경 변수 설정

### Step 1: .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
# Windows
type nul > .env.local

# Mac/Linux
touch .env.local
```

### Step 2: Firebase 설정 추가
위에서 복사한 Firebase 설정을 아래 형식으로 입력:

```env
# Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=workfree-market.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=workfree-market
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=workfree-market.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

⚠️ **주의**: `NEXT_PUBLIC_FIREBASE_API_KEY` 앞에 `NEXT_PUBLIC_`을 꼭 붙여주세요!

---

## 5️⃣ 승인된 도메인 설정

### Step 1: Authentication → Settings
1. "Authorized domains" 탭 클릭

### Step 2: localhost 확인
기본적으로 `localhost`는 이미 추가되어 있습니다.

나중에 배포 시:
- `workfreemarket.com` 추가
- `www.workfreemarket.com` 추가

---

## 6️⃣ 개발 서버 재시작

환경 변수를 적용하려면 서버를 재시작해야 합니다:

```bash
# Ctrl+C로 현재 서버 중지 후

npm run dev
```

---

## ✅ 테스트하기

### 1. 로그인 페이지 접속
```
http://localhost:3001/login
```

### 2. 회원가입 테스트
```
http://localhost:3001/signup
```

### 3. 테스트 계정 만들기
- 이메일: `test@example.com`
- 비밀번호: `test123456`
- 이름: `테스트 사용자`

### 4. Google 로그인 테스트
"Google로 계속하기" 버튼 클릭

---

## 🐛 문제 해결

### 에러: "Firebase: Error (auth/invalid-api-key)"

**원인**: 환경 변수가 제대로 설정되지 않음

**해결**:
1. `.env.local` 파일 위치 확인 (프로젝트 루트)
2. 환경 변수 이름 확인 (`NEXT_PUBLIC_` 접두사 필요)
3. 개발 서버 재시작

### 에러: "auth/unauthorized-domain"

**원인**: 현재 도메인이 Firebase에서 승인되지 않음

**해결**:
1. Firebase Console → Authentication → Settings
2. Authorized domains에 도메인 추가

### Google 로그인 팝업이 안 열림

**원인**: 팝업 차단 설정

**해결**:
1. 브라우저 팝업 차단 해제
2. 또는 `signInWithRedirect` 사용 (코드 수정 필요)

---

## 📊 Firebase Console에서 확인하기

### 사용자 목록 보기
1. Authentication → Users 탭
2. 회원가입한 사용자 목록 확인

### 로그인 통계
1. Authentication → Usage 탭
2. 로그인 성공/실패 통계 확인

---

## 🎯 다음 단계

인증 시스템이 완료되면:

### 1. Firestore 데이터베이스 추가
사용자 추가 정보 저장 (role, sellerLevel 등)

### 2. 보안 규칙 설정
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### 3. 프로필 페이지 구현
- 사용자 정보 수정
- 프로필 사진 업로드
- 판매자 전환

---

## 💡 유용한 링크

- [Firebase Authentication 문서](https://firebase.google.com/docs/auth/web/start)
- [Firebase Console](https://console.firebase.google.com/)
- [Next.js 환경 변수 가이드](https://nextjs.org/docs/basic-features/environment-variables)

---

## 📞 도움이 필요하신가요?

문제가 해결되지 않으면:
1. `ENV_SETUP.md` 파일 참고
2. Firebase 공식 문서 확인
3. GitHub Issues 검색

---

**축하합니다! 🎉**
Firebase Authentication 설정이 완료되었습니다!





