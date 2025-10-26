# 🐰 WorkFree Image Finder API

합법적인 무료 이미지 검색 및 다운로드 API 서비스

## 🎯 특징

- ✅ **100% 합법**: Unsplash, Pexels, Pixabay 공식 API 사용
- 💼 **상업적 이용 가능**: 모든 이미지 상업적 사용 허가
- 📦 **자동 ZIP 다운로드**: 크레딧 정보 포함
- 🚀 **빠른 검색**: 멀티 소스 동시 검색
- 🎨 **고품질 이미지**: 프로페셔널 사진작가들의 작품

## 🛠️ 설치 방법

### 1. 의존성 설치

```bash
pip install -r requirements.txt
```

### 2. API 키 설정

`.env.example` 파일을 `.env`로 복사하고 API 키를 입력하세요:

```bash
cp .env.example .env
```

#### API 키 발급 가이드

**Unsplash** (추천!)
1. https://unsplash.com/developers 접속
2. 회원가입 후 "New Application" 클릭
3. Access Key 복사
4. 무료: 50 requests/hour

**Pexels**
1. https://www.pexels.com/api/ 접속
2. 회원가입 후 API Key 발급
3. 무료: 200 requests/hour

**Pixabay**
1. https://pixabay.com/api/docs/ 접속
2. 회원가입 후 API Key 발급
3. 무료: 5,000 requests/day

### 3. 서버 실행

```bash
# 개발 모드
uvicorn app:app --reload --port 8000

# 프로덕션 모드
uvicorn app:app --host 0.0.0.0 --port 8000
```

서버 실행 후 http://localhost:8000 에서 확인 가능

## 📡 API 엔드포인트

### 1. 이미지 검색

**POST** `/api/search`

```json
{
  "keyword": "강아지",
  "count": 20,
  "sources": ["unsplash", "pexels", "pixabay"],
  "orientation": "landscape"
}
```

**Response:**
```json
{
  "total": 20,
  "keyword": "강아지",
  "images": [
    {
      "id": "unsplash_abc123",
      "url": "https://...",
      "thumbnail_url": "https://...",
      "download_url": "https://...",
      "author": "John Doe",
      "author_url": "https://...",
      "source": "Unsplash",
      "license": "Unsplash License (무료, 상업적 이용 가능)",
      "width": 1920,
      "height": 1080
    }
  ]
}
```

### 2. ZIP 다운로드

**POST** `/api/download`

요청 형식은 `/api/search`와 동일하며, ZIP 파일로 응답합니다.

ZIP 파일 구조:
```
workfree_강아지_20250126_143000.zip
├── images/
│   ├── 강아지_001.jpg
│   ├── 강아지_002.jpg
│   └── ...
├── credits.txt (출처 및 라이선스 정보)
└── README.md (사용 가이드)
```

### 3. 헬스 체크

**GET** `/health`

API 키 설정 상태 확인

## 🚀 배포 가이드

### Render 배포 (무료)

1. Render.com 계정 생성
2. "New Web Service" 선택
3. GitHub 저장소 연결
4. 설정:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**: API 키 3개 입력

### Railway 배포

1. Railway.app 계정 생성
2. "New Project" → "Deploy from GitHub"
3. 환경 변수 설정 (API 키)
4. 자동 배포 완료

### Docker 배포

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t workfree-image-finder .
docker run -p 8000:8000 --env-file .env workfree-image-finder
```

## 🔧 개발 가이드

### 테스트

```bash
# API 테스트
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"keyword": "자연", "count": 10}'

# 헬스 체크
curl http://localhost:8000/health
```

### API 문서

서버 실행 후 자동 생성되는 문서:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## ⚖️ 라이선스 정보

모든 이미지는 다음 라이선스를 따릅니다:

- **Unsplash**: [Unsplash License](https://unsplash.com/license)
  - ✅ 무료 사용
  - ✅ 상업적 이용
  - ✅ 수정 가능
  - 💡 크레딧 권장 (필수 아님)

- **Pexels**: [Pexels License](https://www.pexels.com/license/)
  - ✅ 무료 사용
  - ✅ 상업적 이용
  - ✅ 수정 가능
  - 💡 크레딧 권장 (필수 아님)

- **Pixabay**: [Pixabay License](https://pixabay.com/service/license/)
  - ✅ 무료 사용
  - ✅ 상업적 이용
  - ✅ 수정 가능
  - 💡 크레딧 권장 (필수 아님)

## 🔗 WorkFree 통합

Next.js 프로젝트와 통합하려면:

1. API 서버를 별도 호스팅
2. Next.js API Route에서 프록시 설정
3. Frontend UI 컴포넌트 연결

자세한 내용은 메인 프로젝트의 `src/app/api/image-finder/` 참조

## 📞 지원

문제가 발생하면 이슈를 남겨주세요.

---

© 2025 WorkFree - 퇴근에 날개를 달다 🚀

