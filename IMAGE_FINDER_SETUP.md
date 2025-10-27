 # 🐰 WorkFree Image Finder - 완전 설치 가이드

## 📦 프로젝트 구조

```
homepage.app/
├── image-finder/              # Python FastAPI 백엔드
│   ├── app.py                # 메인 API 서버
│   ├── requirements.txt      # Python 패키지
│   ├── README.md            # 백엔드 문서
│   ├── DEPLOY_GUIDE.md      # 배포 가이드
│   ├── test_api.py          # 테스트 스크립트
│   └── .env.example         # 환경 변수 템플릿
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── image-finder/     # Next.js API Routes
│   │   │       ├── search/route.ts
│   │   │       └── download/route.ts
│   │   └── tools/
│   │       └── image-finder/     # 프론트엔드 페이지
│   │           └── page.tsx
│   ├── lib/
│   │   └── creditSystem.ts      # 크레딧 로직 (기존)
│   └── types/
│       └── credit.ts            # 타입 정의 (업데이트됨)
└── IMAGE_FINDER_SETUP.md         # 이 파일
```

---

## 🚀 빠른 시작

### 1️⃣ Python 백엔드 실행 (로컬)

```bash
# 1. image-finder 디렉토리로 이동
cd image-finder

# 2. 가상환경 생성 (선택사항이지만 권장)
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# 3. 패키지 설치
pip install -r requirements.txt

# 4. 환경 변수 설정
copy .env.example .env  # Windows
# 또는
cp .env.example .env    # Mac/Linux

# .env 파일을 열어서 API 키 입력
# (API 키 발급 방법은 아래 참조)

# 5. 서버 실행
uvicorn app:app --reload --port 8000

# ✅ http://localhost:8000 에서 실행 중!
```

### 2️⃣ Next.js 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성 또는 수정:

```bash
# 로컬 개발용
IMAGE_FINDER_API_URL=http://localhost:8000
```

### 3️⃣ Next.js 개발 서버 실행

```bash
# 프로젝트 루트로 돌아가기
cd ..

# Next.js 서버 실행 (이미 실행 중이면 재시작)
npm run dev
```

### 4️⃣ 접속

브라우저에서 http://localhost:3000/tools/image-finder 접속!

---

## 🔑 API 키 발급 가이드

### Unsplash (추천 - 고품질 사진)

1. https://unsplash.com/developers 접속
2. 회원가입 (GitHub 연동 가능)
3. **"New Application"** 클릭
4. 정보 입력:
   ```
   Application name: WorkFree Dev
   Description: 이미지 검색 개발용
   ```
5. **Access Key** 복사 → `.env` 파일에 붙여넣기

**제한:** 50 requests/hour (개발용으로 충분)

### Pexels (다양한 카테고리)

1. https://www.pexels.com/api/ 접속
2. 회원가입
3. **"Your API Key"** 메뉴 클릭
4. API Key 복사 → `.env` 파일에 붙여넣기

**제한:** 200 requests/hour

### Pixabay (대용량)

1. https://pixabay.com/api/docs/ 접속
2. 회원가입
3. 상단에 표시된 **API Key** 복사
4. `.env` 파일에 붙여넣기

**제한:** 5,000 requests/day

---

## ✅ 테스트

### 방법 1: 테스트 스크립트

```bash
cd image-finder
python test_api.py
```

**예상 출력:**
```
✅ API 서버 연결 성공
🔍 헬스 체크 테스트...
✅ 성공

🔍 이미지 검색 테스트...
검색 결과: 5장
✅ 성공

📦 ZIP 다운로드 테스트...
✅ ZIP 파일 저장 완료: test_download.zip
```

### 방법 2: curl 명령어

```bash
# 헬스 체크
curl http://localhost:8000/health

# 이미지 검색
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"keyword":"강아지","count":5}'
```

### 방법 3: 웹 UI

1. http://localhost:3000/login 에서 로그인
2. http://localhost:3000/tools/image-finder 접속
3. 검색어 입력 (예: "자연")
4. "🚀 이미지 검색 시작" 클릭
5. 결과 확인 후 ZIP 다운로드

---

## 🎨 기능 확인

### ✅ 구현된 기능

- [x] Python FastAPI 백엔드
- [x] Unsplash/Pexels/Pixabay API 통합
- [x] Next.js API Route (프록시)
- [x] 프론트엔드 UI (WorkFree 브랜드)
- [x] 크레딧 시스템 연동
- [x] 시간 절약 통계 기록
- [x] ZIP 파일 다운로드
- [x] 크레딧 정보 자동 포함
- [x] 로그인 체크
- [x] 크레딧 부족 경고

### 🎯 크레딧 시스템

- **사용 비용:** 2 크레딧/검색
- **시간 절약:** 30분/검색
- **절감 금액:** ₩15,000/검색
- **베타 테스터:** 10 크레딧 무료 지급

---

## 🚀 프로덕션 배포

자세한 내용은 `image-finder/DEPLOY_GUIDE.md` 참조

### 간단 요약

**1. Python 백엔드 배포 (Render 추천)**
- https://render.com 에서 무료 배포
- 환경 변수에 API 키 3개 입력
- URL 생성: `https://workfree-image-finder.onrender.com`

**2. Next.js 환경 변수 업데이트**
```bash
# Vercel Dashboard → Environment Variables
IMAGE_FINDER_API_URL=https://workfree-image-finder.onrender.com
```

**3. Vercel 재배포**
```bash
git add .
git commit -m "Add Image Finder feature"
git push
```

---

## 🔧 문제 해결

### Python 서버가 실행되지 않아요
```bash
# 패키지 재설치
pip install --upgrade -r requirements.txt

# 포트 충돌 시 다른 포트 사용
uvicorn app:app --reload --port 8001
```

### API 키 오류
```bash
# 헬스 체크로 API 키 설정 확인
curl http://localhost:8000/health

# api_keys_configured가 모두 false면 .env 파일 확인
```

### Next.js에서 API 호출 실패
```bash
# 1. Python 서버 실행 중인지 확인
# http://localhost:8000 접속 가능한지 체크

# 2. .env.local 파일 확인
# IMAGE_FINDER_API_URL=http://localhost:8000

# 3. Next.js 재시작
# Ctrl+C 후 npm run dev
```

### 크레딧이 차감되지 않아요
- Firebase 설정 확인
- 사용자 로그인 상태 확인
- 브라우저 콘솔에서 에러 메시지 확인

---

## 📊 사용 통계

### 예상 성능
- **검색 속도:** 2-5초
- **다운로드 속도:** 10-30초 (이미지 수에 따라)
- **동시 사용자:** 10-50명 (무료 플랜)

### API 제한
| 소스 | 무료 한도 | 충분한 사용자 수 |
|------|-----------|------------------|
| Unsplash | 50/hour | ~25명/시간 |
| Pexels | 200/hour | ~100명/시간 |
| Pixabay | 5,000/day | ~2,500명/일 |

**💡 Tip:** 3개 API를 모두 활성화하면 더 많은 이미지 제공 가능!

---

## 🎯 다음 단계

### 선택적 개선사항

1. **캐싱 추가** (Redis)
   - 같은 검색어 반복 시 빠른 응답
   - API 호출 절약

2. **이미지 미리보기**
   - 검색 전 소스별 샘플 표시
   - 사용자 선호도 학습

3. **배치 다운로드**
   - 여러 검색어 한번에 처리
   - 대량 작업 지원

4. **AI 태그 추천**
   - 검색어 자동 완성
   - 관련 키워드 제안

---

## 📞 지원 및 문의

- **GitHub Issues**: 버그 리포트
- **Email**: support@workfree.com
- **Discord**: WorkFree 커뮤니티

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

**이미지 라이선스:**
- Unsplash, Pexels, Pixabay 모두 상업적 이용 가능
- 자세한 내용은 각 서비스의 라이선스 참조

---

## 🎉 완료!

이제 WorkFree에 합법적인 이미지 파인더가 통합되었습니다!

**주요 성과:**
- ✅ 법적으로 안전한 이미지 소스
- ✅ 사용자 친화적인 UI
- ✅ 크레딧 시스템 완전 연동
- ✅ 프로덕션 배포 준비 완료

**다음 작업:**
```bash
# 로컬 테스트
cd image-finder
uvicorn app:app --reload

# 다른 터미널에서
cd ..
npm run dev

# 브라우저 접속
http://localhost:3000/tools/image-finder
```

퇴근에 날개를 달다! 🐰🚀

---

© 2025 WorkFree

