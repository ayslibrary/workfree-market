# 🚀 WorkFree Image Finder 배포 가이드

## 📋 배포 체크리스트

### 1. API 키 발급 (필수)

배포 전에 다음 API 키들을 발급받아야 합니다:

#### ✅ Unsplash API (추천)
1. https://unsplash.com/developers 접속
2. 회원가입 후 "New Application" 클릭
3. 앱 정보 입력:
   - **Application name**: WorkFree Image Finder
   - **Description**: 합법적인 이미지 검색 및 다운로드 서비스
4. Access Key 복사
5. 무료: **50 requests/hour**

#### ✅ Pexels API
1. https://www.pexels.com/api/ 접속
2. 회원가입 후 "Your API Key" 클릭
3. API Key 복사
4. 무료: **200 requests/hour**

#### ✅ Pixabay API
1. https://pixabay.com/api/docs/ 접속
2. 회원가입 후 상단의 API Key 확인
3. 무료: **5,000 requests/day**

---

## 🎯 배포 방법

### 방법 1: Render (추천 - 무료)

#### Step 1: Render 계정 생성
- https://render.com 에서 GitHub 연동 회원가입

#### Step 2: 새 Web Service 생성
1. Dashboard → "New +" → "Web Service"
2. GitHub 저장소 연결
3. Root Directory: `image-finder`

#### Step 3: 설정
```yaml
Name: workfree-image-finder
Environment: Python 3
Region: Singapore (가장 가까운 지역)
Branch: main
Build Command: pip install -r requirements.txt
Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
```

#### Step 4: 환경 변수 설정
```
UNSPLASH_ACCESS_KEY=your_unsplash_key_here
PEXELS_API_KEY=your_pexels_key_here
PIXABAY_API_KEY=your_pixabay_key_here
```

#### Step 5: 배포
- "Create Web Service" 클릭
- 5-10분 후 배포 완료
- URL 복사: `https://workfree-image-finder.onrender.com`

---

### 방법 2: Railway

#### Step 1: Railway 계정 생성
- https://railway.app 에서 GitHub 연동 회원가입

#### Step 2: 프로젝트 생성
1. "New Project" → "Deploy from GitHub repo"
2. 저장소 선택
3. Root Directory: `image-finder` 설정

#### Step 3: 환경 변수 설정
Variables 탭에서 추가:
```
UNSPLASH_ACCESS_KEY=your_unsplash_key_here
PEXELS_API_KEY=your_pexels_key_here
PIXABAY_API_KEY=your_pixabay_key_here
```

#### Step 4: 자동 배포
- Push 시 자동 배포
- URL 확인: Settings → Domains

---

### 방법 3: Docker + 자체 서버

#### Step 1: Dockerfile 생성 (이미 포함)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Step 2: 환경 변수 파일
`.env` 파일 생성:
```bash
UNSPLASH_ACCESS_KEY=your_key
PEXELS_API_KEY=your_key
PIXABAY_API_KEY=your_key
```

#### Step 3: Docker 실행
```bash
# 빌드
docker build -t workfree-image-finder .

# 실행
docker run -d \
  -p 8000:8000 \
  --env-file .env \
  --name image-finder \
  workfree-image-finder

# 확인
curl http://localhost:8000/health
```

---

## 🔗 Next.js 프로젝트 연동

### Step 1: 환경 변수 설정

메인 프로젝트 루트의 `.env.local` 파일에 추가:

```bash
# Python 백엔드 API URL
IMAGE_FINDER_API_URL=https://workfree-image-finder.onrender.com
```

**로컬 개발:**
```bash
IMAGE_FINDER_API_URL=http://localhost:8000
```

### Step 2: Vercel 배포 시 환경 변수

Vercel Dashboard → Settings → Environment Variables:
```
KEY: IMAGE_FINDER_API_URL
VALUE: https://workfree-image-finder.onrender.com
```

### Step 3: 도구 페이지 링크 추가

`src/app/tools/page.tsx`에 추가:

```typescript
{
  id: 'image-finder',
  name: '합법 이미지 파인더',
  icon: '🐰',
  description: '저작권 안전한 고품질 이미지 자동 검색',
  href: '/tools/image-finder',
  available: true,
  creditCost: 2
}
```

---

## ✅ 배포 후 테스트

### 1. 헬스 체크
```bash
curl https://your-api-url.com/health
```

**응답 예시:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-26T...",
  "api_keys_configured": {
    "unsplash": true,
    "pexels": true,
    "pixabay": true
  }
}
```

### 2. 검색 테스트
```bash
curl -X POST https://your-api-url.com/api/search \
  -H "Content-Type: application/json" \
  -d '{"keyword":"자연","count":5}'
```

### 3. 웹 UI 테스트
1. https://your-workfree-url.com/tools/image-finder 접속
2. 로그인
3. 검색어 입력 후 검색
4. ZIP 다운로드 테스트

---

## 🐛 트러블슈팅

### API 키 오류
**증상:** "검색 결과가 없습니다"
**해결:**
1. 환경 변수 확인: `/health` 엔드포인트에서 `api_keys_configured` 확인
2. API 키 재발급 및 재설정
3. 서비스 재시작

### CORS 오류
**증상:** 브라우저 콘솔에 CORS 에러
**해결:**
```python
# app.py에서 allow_origins 수정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-workfree-domain.com"],  # 실제 도메인
    ...
)
```

### Rate Limit 초과
**증상:** "429 Too Many Requests"
**해결:**
1. Unsplash: 50 req/hour 제한 → 시간 대기 또는 유료 플랜
2. 캐싱 구현 (Redis)
3. 여러 API 키 로테이션

### Render 무료 플랜 슬립 모드
**증상:** 첫 요청이 느림 (15초+)
**해결:**
1. 유료 플랜 ($7/월)
2. Cron job으로 주기적 핑
3. Railway 사용 (더 빠른 콜드 스타트)

---

## 💰 비용 예상

### 무료 플랜 (개발/테스트)
- Render Free: **$0**
- API 사용: **$0**
- 총: **$0/월**

**제한사항:**
- 15분 미사용 시 슬립 모드
- 750시간/월 무료

### 프로덕션 (소규모)
- Render Starter: **$7/월**
- API 사용: **$0**
- 총: **$7/월**

### 프로덕션 (대규모)
- Railway Pro: **$5/월** (기본) + 사용량
- Unsplash Enterprise: **문의**
- 총: **$20-50/월**

---

## 📊 모니터링

### Render 대시보드
- Logs: 실시간 로그 확인
- Metrics: CPU/메모리 사용량
- Events: 배포 히스토리

### 추천 모니터링 도구
- **Sentry**: 에러 트래킹
- **Uptime Robot**: 서비스 다운타임 모니터링
- **Firebase Analytics**: 사용 패턴 분석

---

## 🔐 보안 체크리스트

- [ ] API 키를 환경 변수로만 관리 (코드에 하드코딩 금지)
- [ ] CORS를 실제 도메인으로만 제한
- [ ] Rate limiting 구현
- [ ] HTTPS 사용 (Render/Railway는 기본 제공)
- [ ] 사용자 인증 체크 (Next.js에서 처리)
- [ ] 로그에 민감 정보 미포함

---

## 📞 지원

문제 발생 시:
1. GitHub Issues 등록
2. 로그 첨부 (`/health` 응답 포함)
3. 재현 단계 상세 기술

---

© 2025 WorkFree - 퇴근에 날개를 달다 🚀

