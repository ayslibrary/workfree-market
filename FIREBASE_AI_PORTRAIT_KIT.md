# 🎨 Firebase에 AI 화보 키트 데이터 추가하기

이 문서는 AI 화보 메이커 프롬프트 키트를 Firebase Firestore에 추가하는 방법을 설명합니다.

---

## 📋 사전 준비

1. Firebase Console 접속: https://console.firebase.google.com
2. WorkFree Market 프로젝트 선택
3. Firestore Database 메뉴로 이동

---

## 📂 컬렉션 구조

```
requests (collection)
  └─ ai-portrait-kit-2025 (document)
      ├─ title: "AI 화보 메이커 프롬프트 키트"
      ├─ job: "AI 프롬프트 엔지니어"
      ├─ tools: ["Gemini", "Imagen 3", "AI"]
      ├─ problem: "프로필 사진 스튜디오 촬영 비용 30만원 vs AI로 무료로 만들기"
      ├─ expectedFeature: "Gemini로 5분 만에 보그 커버 모델 되기"
      ├─ maker: "WorkFree Team"
      ├─ status: "출시완료"
      ├─ category: "ai-prompts"
      ├─ createdAt: Timestamp (자동)
      ├─ downloadUrl: "/downloads/ai-portrait-kit/"
      ├─ rating: 5.0
      ├─ downloads: 0
      └─ detailUrl: "/kits/ai-portrait"
```

---

## 🔧 Firebase Console에서 수동 추가

### Step 1: Firestore로 이동
1. Firebase Console에서 **Firestore Database** 클릭
2. **requests** 컬렉션 선택 (없으면 생성)

### Step 2: 새 문서 추가
1. **문서 추가** 버튼 클릭
2. 문서 ID: `ai-portrait-kit-2025` (또는 자동 생성)

### Step 3: 필드 입력

```javascript
// String 필드
title: "AI 화보 메이커 프롬프트 키트"
job: "AI 프롬프트 엔지니어"
problem: "스튜디오 촬영 30만원 vs AI로 5분 만에 무료로 프로필 사진 제작. Vogue, Chanel, LinkedIn 등 20가지 컨셉 프롬프트 제공"
expectedFeature: "Gemini로 5분 만에 보그 커버 모델 되기! 20개 컨셉 + 60개 예시 이미지 포함"
maker: "WorkFree Team"
status: "출시완료"
category: "ai-prompts"
downloadUrl: "/downloads/ai-portrait-kit/"
detailUrl: "/kits/ai-portrait"

// Array 필드
tools: ["Gemini", "Imagen 3", "AI 프롬프트", "이미지 생성"]

// Number 필드
rating: 5.0
downloads: 0

// Timestamp 필드
createdAt: [현재 시간으로 설정]
```

---

## 💻 코드로 추가 (선택사항)

Firebase Admin SDK나 클라이언트에서 다음 코드 실행:

```javascript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const addAIPortraitKit = async () => {
  try {
    const kitData = {
      title: "AI 화보 메이커 프롬프트 키트",
      job: "AI 프롬프트 엔지니어",
      tools: ["Gemini", "Imagen 3", "AI 프롬프트", "이미지 생성"],
      problem: "스튜디오 촬영 30만원 vs AI로 5분 만에 무료로 프로필 사진 제작. Vogue, Chanel, LinkedIn 등 20가지 컨셉 프롬프트 제공",
      expectedFeature: "Gemini로 5분 만에 보그 커버 모델 되기! 20개 컨셉 + 60개 예시 이미지 포함",
      maker: "WorkFree Team",
      status: "출시완료",
      category: "ai-prompts",
      downloadUrl: "/downloads/ai-portrait-kit/",
      detailUrl: "/kits/ai-portrait",
      rating: 5.0,
      downloads: 0,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'requests'), kitData);
    console.log('✅ 키트 추가 완료! Document ID:', docRef.id);
  } catch (error) {
    console.error('❌ 키트 추가 실패:', error);
  }
};

// 실행
addAIPortraitKit();
```

---

## 🎯 카테고리 필터 확인

키트 페이지(`/kits`)에서 **"AI 프롬프트"** 카테고리를 선택하면 이 키트가 표시됩니다.

카테고리 매핑:
- `ai-prompts` → 🤖 AI 프롬프트
- `microsoft` → 🏢 Microsoft Office
- `automation-tools` → ⚙️ 업무 자동화
- `cloud-collab` → ☁️ 클라우드 & 협업
- `marketing-design` → 🎨 마케팅 & 디자인

---

## 🧪 테스트

### 1. 로컬 테스트
```bash
npm run dev
```

1. http://localhost:3000/kits 접속
2. "AI 프롬프트" 카테고리 선택
3. AI 화보 메이커 키트가 표시되는지 확인

### 2. 상세 페이지 테스트
1. http://localhost:3000/kits/ai-portrait 직접 접속
2. 모든 섹션이 정상 표시되는지 확인
3. 다운로드 버튼 작동 확인

### 3. 메인 페이지 테스트
1. http://localhost:3000 접속
2. 프롬프트 키트 안내 섹션 확인
3. 링크 작동 확인

---

## 📊 다운로드 카운트 업데이트

다운로드가 발생할 때마다 `downloads` 필드를 증가시키려면:

```javascript
import { doc, updateDoc, increment } from 'firebase/firestore';

const incrementDownloads = async (kitId: string) => {
  const kitRef = doc(db, 'requests', kitId);
  await updateDoc(kitRef, {
    downloads: increment(1)
  });
};
```

---

## 🎁 베타 기간 설정

정식 출시 전까지는 무료로 제공됩니다.
가격 정보를 추가하려면:

```javascript
price: 0,              // 베타 기간 무료
originalPrice: 29900,  // 정식 가격
discount: 100,         // 100% 할인
```

---

## ✅ 체크리스트

### Firebase 설정
- [ ] Firestore에 `requests` 컬렉션 존재 확인
- [ ] AI 화보 키트 문서 추가
- [ ] 모든 필드 정확히 입력
- [ ] `status: "출시완료"` 설정
- [ ] `category: "ai-prompts"` 설정

### 파일 구조
- [x] `/public/downloads/ai-portrait-kit/` 폴더 생성
- [x] README.md 파일 추가
- [x] 20개 프롬프트 템플릿 파일 추가
- [x] CHEATSHEET.md 추가

### 페이지 확인
- [x] `/kits/ai-portrait` 상세 페이지 생성
- [x] `/kits` 메인 키트 페이지에 Featured 섹션 추가
- [x] 메인 홈페이지에 프롬프트 키트 안내 업데이트

### 테스트
- [ ] 로컬에서 페이지 로딩 확인
- [ ] 카테고리 필터 작동 확인
- [ ] 다운로드 버튼 작동 확인
- [ ] 모바일 반응형 확인
- [ ] 다크모드 확인

---

## 🚀 배포

모든 테스트 완료 후:

```bash
# 빌드
npm run build

# 배포 (Vercel 예시)
vercel --prod

# 또는 Git push (자동 배포 설정된 경우)
git add .
git commit -m "feat: Add AI Portrait Maker Prompt Kit"
git push origin main
```

---

## 📞 문제 해결

### Firebase 연결 안 됨
- `src/lib/firebase.ts` 설정 확인
- Firebase 프로젝트 API 키 확인
- 환경 변수 (.env.local) 확인

### 키트가 표시 안 됨
- Firestore 규칙 확인 (읽기 권한)
- `status: "출시완료"` 정확히 입력되었는지 확인
- 브라우저 콘솔에서 에러 확인

### 다운로드 안 됨
- `/public/downloads/ai-portrait-kit/` 경로 확인
- 파일들이 올바르게 있는지 확인
- 브라우저 개발자 도구에서 네트워크 탭 확인

---

**Made with ❤️ by WorkFree Market**

