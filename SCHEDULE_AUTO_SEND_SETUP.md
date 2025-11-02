# 📅 매일 자동 발송 기능 - 설정 가이드

## ✅ 구현 완료!

매일 자동 발송 기능이 완전히 구현되었습니다! 🎉

---

## 🚀 빠른 시작

### 1️⃣ 환경 변수 설정

#### 프론트엔드 (Next.js)

루트 디렉토리에 `.env.local` 파일 생성:

```env
# Search Crawler API URL
NEXT_PUBLIC_SEARCH_CRAWLER_API=http://localhost:8000

# 배포 후에는 실제 URL로 변경
# NEXT_PUBLIC_SEARCH_CRAWLER_API=https://your-crawler-api.railway.app
```

#### 백엔드 (FastAPI)

`search-crawler/.env` 파일 생성 (또는 기존 파일 사용):

```env
# Resend API (이메일 발송 - 필수)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx

# Naver Search API (네이버 뉴스 검색 - 필수)
NAVER_CLIENT_ID=your_naver_client_id_here
NAVER_CLIENT_SECRET=your_naver_client_secret_here

# Google Search API (선택사항)
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

---

### 2️⃣ 백엔드 서버 실행

```bash
# 의존성 설치
cd search-crawler
pip install -r requirements.txt

# 서버 실행 (8000번 포트)
python app.py
```

**✅ 서버 확인:**
- http://localhost:8000 - API 정보
- http://localhost:8000/health - 헬스 체크

---

### 3️⃣ 프론트엔드 서버 실행

```bash
# 루트 디렉토리에서
npm run dev
```

**✅ 페이지 접속:**
- http://localhost:3000/tools/search-crawler

---

## 🎯 사용 방법

### 웹 UI에서 설정하기

1. **로그인** (필수)
2. **검색 크롤러 페이지** 접속
3. **"⏰ 매일 자동 발송 설정"** 섹션 찾기
4. 다음 항목 입력:
   - 검색 키워드 (다중 입력 가능)
   - 발송 시간 (예: 08:00)
   - 발송 요일 (월~일 선택)
5. **"매일 자동 발송 설정하기"** 버튼 클릭

### API로 직접 설정하기

```bash
curl -X POST http://localhost:8000/api/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "your_user_id",
    "email": "your-email@example.com",
    "keywords": ["AI 투자", "스타트업"],
    "time": "08:00",
    "weekdays": [0,1,2,3,4],
    "max_results": 10,
    "engines": ["naver"]
  }'
```

---

## 📊 주요 기능

### ✅ 구현된 기능

1. **스케줄 생성** - 원하는 시간/요일에 자동 발송 설정
2. **다중 키워드** - 여러 검색어를 한 번에 설정
3. **요일 선택** - 평일만, 주말만, 매일 등 자유롭게 선택
4. **내 스케줄 관리** - 등록된 스케줄 확인/삭제
5. **서버 재시작 시 유지** - SQLite DB에 저장
6. **사용자 인증** - Firebase 로그인 연동

### 🔜 향후 추가 예정

1. **크레딧 시스템** - 스케줄 등록 시 크레딧 차감 (월 30C)
2. **일시정지/재개** - 휴가 등으로 일시적으로 중단
3. **발송 내역** - 과거 발송 기록 확인

---

## 🗂️ 파일 구조

### 프론트엔드
```
src/app/tools/search-crawler/
  └── page.tsx          # 검색 크롤러 + 스케줄 설정 UI
```

### 백엔드
```
search-crawler/
  ├── app.py           # FastAPI 메인 앱
  ├── scheduler.py     # 스케줄러 로직
  ├── schedules.db     # SQLite 스케줄 DB (자동 생성)
  └── requirements.txt # Python 의존성
```

---

## 🧪 테스트 방법

### 1. 즉시 발송 테스트 (스케줄 없이)

```bash
curl -X POST http://localhost:8000/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "워크프리",
    "recipient_email": "your-email@example.com",
    "engines": ["naver"],
    "max_results": 5
  }'
```

이메일이 도착하면 ✅ 기본 기능 정상

### 2. 스케줄 등록 테스트

웹 UI 또는 API로 스케줄 등록 후:

```bash
# 내 스케줄 조회
curl http://localhost:8000/api/schedule/your_user_id
```

응답 예시:
```json
{
  "job_id": "briefing_your_user_id",
  "user_id": "your_user_id",
  "name": "Briefing for your-email@example.com",
  "next_run": "2025-11-03T08:00:00+09:00",
  "trigger": "cron[day_of_week='0,1,2,3,4', hour='8', minute='0']"
}
```

### 3. 실제 발송 확인

- 테스트용으로 **1~2분 후** 시간 설정
- 설정 시간에 이메일이 도착하면 ✅ 자동 발송 정상

---

## 🚨 주의사항

### 1. 서버는 24/7 실행되어야 합니다

로컬 개발 환경에서는:
- PC를 끄면 스케줄이 작동하지 않음
- **프로덕션 배포 필요** (Railway, Render 등)

### 2. 이메일 발송 제한

- **Resend 무료 플랜**: 월 3,000통
- 매일 1회 발송 × 30일 = 월 30통
- 여유 있음! ✅

### 3. 네이버 API 제한

- **일일 제한**: 25,000회
- 매일 1~3회 발송 정도는 문제없음

### 4. 타임존

- 기본: **Asia/Seoul (KST, UTC+9)**
- 다른 타임존이 필요하면 `scheduler.py` 수정

---

## 🌐 배포 (Production)

### Railway 배포

1. Railway 프로젝트 생성
2. `search-crawler` 폴더를 Git에 푸시
3. Railway 환경 변수 설정:
   - `RESEND_API_KEY`
   - `NAVER_CLIENT_ID`
   - `NAVER_CLIENT_SECRET`
4. 배포 완료 후 URL 확인
5. `.env.local` 업데이트:
   ```env
   NEXT_PUBLIC_SEARCH_CRAWLER_API=https://your-app.railway.app
   ```

---

## 📝 API 엔드포인트

| 메소드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/schedule` | 스케줄 생성 |
| GET | `/api/schedule/{user_id}` | 스케줄 조회 |
| DELETE | `/api/schedule/{user_id}` | 스케줄 삭제 |
| POST | `/api/schedule/{user_id}/pause` | 일시정지 |
| POST | `/api/schedule/{user_id}/resume` | 재개 |
| GET | `/api/schedules` | 전체 스케줄 목록 |
| POST | `/api/email` | 즉시 발송 |

---

## 💡 FAQ

### Q1. 스케줄이 실행되지 않아요

**확인 사항:**
1. 백엔드 서버가 실행 중인가?
2. `schedules.db` 파일이 생성되었나?
3. 로그에 `✅ 스케줄러 시작됨` 메시지가 보이나?

### Q2. 이메일이 도착하지 않아요

**확인 사항:**
1. `RESEND_API_KEY`가 올바른가?
2. Resend 대시보드에서 도메인 인증 완료했나?
3. **스팸 폴더** 확인
4. 수신 이메일 주소가 정확한가?

### Q3. 크레딧은 언제 구현되나요?

현재는 크레딧 체크 없이 자유롭게 사용 가능합니다.
향후 Firebase/Supabase와 연동하여 구현 예정입니다.

---

## 🎉 완료!

이제 WorkFree Market에서 매일 자동 뉴스 브리핑 서비스를 제공할 수 있습니다!

**구현된 파일:**
- ✅ `src/app/tools/search-crawler/page.tsx` - UI 완성
- ✅ `search-crawler/app.py` - API 완성
- ✅ `search-crawler/scheduler.py` - 스케줄러 완성

**다음 단계:**
1. 백엔드 서버 배포 (Railway/Render)
2. 크레딧 시스템 연동
3. 실제 사용자 테스트

---

**만든 이:** WorkFree Market Team
**문의:** support@workfreemarket.com

