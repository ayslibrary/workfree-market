# 🔑 API 키 설정 가이드

검색 크롤러 서비스를 사용하기 위한 API 키 설정 방법입니다.

## 📋 목차
1. [Google Custom Search API](#1-google-custom-search-api)
2. [Naver Search API](#2-naver-search-api)
3. [Gmail SMTP 설정](#3-gmail-smtp-설정)
4. [환경 변수 설정](#4-환경-변수-설정)

---

## 1. Google Custom Search API

### 📊 무료 할당량
- **하루 100회** 검색 무료
- 유료: $5/1000 requests

### 🔧 설정 방법

#### Step 1: Google Cloud Console 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **새 프로젝트 만들기** 클릭
3. 프로젝트 이름 입력 (예: "WorkFree Search")

#### Step 2: Custom Search API 활성화
1. 좌측 메뉴 → **API 및 서비스** → **라이브러리**
2. "Custom Search API" 검색
3. **Custom Search API** 클릭 → **사용** 버튼 클릭

#### Step 3: API 키 생성
1. 좌측 메뉴 → **API 및 서비스** → **사용자 인증 정보**
2. **+ 사용자 인증 정보 만들기** → **API 키** 선택
3. API 키가 생성됨 → **복사**하여 저장
4. (선택) **키 제한** 클릭하여 보안 강화
   - API 제한 → "Custom Search API"만 선택 권장

#### Step 4: 검색 엔진 ID 생성
1. [Programmable Search Engine](https://programmablesearchengine.google.com/) 접속
2. **시작하기** 또는 **Add** 클릭
3. 설정:
   ```
   검색할 사이트: 전체 웹 검색 (선택)
   검색 엔진 이름: WorkFree Search
   ```
4. **만들기** 클릭
5. **제어판** → **기본사항** → **검색 엔진 ID** 복사

#### ✅ 얻어야 할 값
```
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_SEARCH_ENGINE_ID=a1b2c3d4e5f6g7h8i9
```

---

## 2. Naver Search API

### 📊 무료 할당량
- **하루 25,000회** 검색 무료
- 초당 10회 제한

### 🔧 설정 방법

#### Step 1: 네이버 개발자 센터 가입
1. [네이버 개발자 센터](https://developers.naver.com/) 접속
2. 네이버 계정으로 로그인
3. 우측 상단 → **Application** → **애플리케이션 등록** 클릭

#### Step 2: 애플리케이션 등록
1. **애플리케이션 이름**: WorkFree Search (자유롭게 입력)
2. **사용 API**:
   - ✅ **검색 (Search)** 선택
   - 웹 검색 선택
3. **비로그인 오픈 API 서비스 환경**:
   - ✅ WEB 설정
   - URL: `http://localhost:8000` (개발용)
   - URL: `https://your-domain.com` (배포용)
4. **등록하기** 클릭

#### Step 3: 인증 정보 확인
1. **내 애플리케이션** → 방금 만든 앱 클릭
2. **Client ID** 복사
3. **Client Secret** 복사

#### ✅ 얻어야 할 값
```
NAVER_CLIENT_ID=YOUR_CLIENT_ID_HERE
NAVER_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
```

---

## 3. Gmail SMTP 설정

이메일 자동 발송을 위한 Gmail 설정입니다.

### 🔧 설정 방법

#### Step 1: Google 계정 2단계 인증 활성화
1. [Google 계정 보안](https://myaccount.google.com/security) 접속
2. **2단계 인증** 클릭 → 설정 진행

#### Step 2: 앱 비밀번호 생성
1. [앱 비밀번호](https://myaccount.google.com/apppasswords) 접속
2. **앱 선택**: 메일
3. **기기 선택**: 기타 (맞춤 이름)
4. 이름 입력: "WorkFree Crawler"
5. **생성** 클릭
6. **16자리 비밀번호** 복사 (공백 제거)

#### ✅ 얻어야 할 값
```
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

⚠️ **주의**: 일반 Gmail 비밀번호가 아닌 **앱 비밀번호**를 사용해야 합니다!

---

## 4. 환경 변수 설정

### 로컬 개발 환경 (Railway/서버)

#### Step 1: .env 파일 생성
```bash
cd search-crawler
cp env.example .env
```

#### Step 2: .env 파일 편집
```bash
# search-crawler/.env

# Gmail SMTP 설정
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Google Custom Search API
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
GOOGLE_SEARCH_ENGINE_ID=a1b2c3d4e5f6g7h8i9

# Naver Search API
NAVER_CLIENT_ID=YOUR_CLIENT_ID
NAVER_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

#### Step 3: 서버 재시작
```bash
python app.py
```

---

### Railway 배포 환경

#### Railway 대시보드에서 설정
1. Railway 프로젝트 → **Variables** 탭
2. **New Variable** 클릭하여 각각 추가:

```
GMAIL_USER = your_email@gmail.com
GMAIL_APP_PASSWORD = your_app_password
GOOGLE_API_KEY = AIzaSyXXXXXXXXXXXXXXXXXXXX
GOOGLE_SEARCH_ENGINE_ID = a1b2c3d4e5f6g7h8i9
NAVER_CLIENT_ID = YOUR_CLIENT_ID
NAVER_CLIENT_SECRET = YOUR_CLIENT_SECRET
```

3. **Save** 후 자동으로 재배포됨

---

### Vercel 환경 (프론트엔드)

#### Vercel 대시보드에서 설정
1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. 다음 변수들 추가:

```
NEXT_PUBLIC_SEARCH_CRAWLER_API = https://your-railway-api-url.railway.app
SEARCH_CRAWLER_API_URL = https://your-railway-api-url.railway.app
CRON_SECRET = your_random_secret_string
```

3. **Save** → 재배포

---

## 🧪 테스트

### 1. Health Check
```bash
curl http://localhost:8000/health
```

**응답 예시:**
```json
{
  "status": "healthy",
  "gmail_configured": true,
  "timestamp": "2025-11-01T17:00:00"
}
```

### 2. 검색 테스트
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"keyword":"AI","engines":["google","naver"],"max_results":5}'
```

### 3. 이메일 발송 테스트
```bash
curl -X POST http://localhost:8000/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "keyword":"AI",
    "recipient_email":"your@email.com",
    "engines":["google","naver"],
    "max_results":10
  }'
```

---

## 💡 팁 & 문제 해결

### API 키가 작동하지 않을 때

#### Google API
- ✅ Custom Search API가 활성화되어 있는지 확인
- ✅ API 키 제한 설정 확인
- ✅ 검색 엔진 ID가 올바른지 확인
- ✅ 일일 할당량 (100회) 초과 여부 확인

#### Naver API
- ✅ Client ID/Secret 복사 시 공백 제거
- ✅ 서비스 URL에 현재 도메인 추가
- ✅ "웹 검색" API가 선택되어 있는지 확인

#### Gmail SMTP
- ✅ 2단계 인증이 활성화되어 있는지 확인
- ✅ "앱 비밀번호"를 사용 (일반 비밀번호 X)
- ✅ 16자리 비밀번호에서 공백 제거

---

## 📊 API 사용량 모니터링

### Google Custom Search
- [Google Cloud Console - API 대시보드](https://console.cloud.google.com/apis/dashboard)
- 일일 사용량 및 오류 확인

### Naver Search
- [네이버 개발자 센터 - 내 애플리케이션](https://developers.naver.com/apps/#/list)
- 일일 호출 통계 확인

---

## 🔒 보안 권장사항

1. ✅ `.env` 파일은 절대 Git에 커밋하지 마세요
2. ✅ API 키는 환경 변수로만 관리
3. ✅ 프로덕션 환경에서는 API 키 제한 설정
4. ✅ Railway/Vercel 환경 변수는 대시보드에서만 관리
5. ✅ 정기적으로 사용량 모니터링

---

## 📞 문의

API 키 설정 중 문제가 발생하면:
1. 에러 메시지 확인
2. Health Check 엔드포인트로 상태 확인
3. API 대시보드에서 할당량 확인

---

**🎉 설정 완료 후 검색 크롤러를 사용해보세요!**

데모 모드(API 키 없이)도 작동하니 먼저 테스트해볼 수 있습니다.

