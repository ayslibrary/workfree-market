# 📅 WorkFree 뉴스 자동발송 스케줄러 가이드

## ✨ 새로운 기능

**정해진 시간에 자동으로 뉴스 브리핑 이메일 발송!**

- ✅ 매일 오전 8시 자동 발송
- ✅ 평일만 발송 (월-금)
- ✅ 키워드별 맞춤 뉴스 수집
- ✅ Excel 파일로 이메일 발송
- ✅ 스케줄 관리 (생성/조회/삭제)

---

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
cd search-crawler
pip install -r requirements.txt
```

### 2. 환경 변수 설정

`.env` 파일 생성:

```env
# Resend API (이메일 발송)
RESEND_API_KEY=re_your_api_key_here

# Naver Search API
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret
```

### 3. 서버 실행

```bash
python app.py
```

서버 주소: http://localhost:8000

---

## 📡 API 엔드포인트

### 1. 스케줄 생성

**POST** `/api/schedule`

```json
{
  "user_id": "user_123",
  "email": "user@example.com",
  "keywords": ["AI 투자", "스타트업 펀딩"],
  "time": "08:00",
  "weekdays": [0, 1, 2, 3, 4],
  "max_results": 10,
  "engines": ["naver"]
}
```

**응답 예시:**

```json
{
  "success": true,
  "job_id": "briefing_user_123",
  "user_id": "user_123",
  "email": "user@example.com",
  "keywords": ["AI 투자", "스타트업 펀딩"],
  "time": "08:00",
  "weekdays": [0, 1, 2, 3, 4],
  "next_run": "2025-11-03T08:00:00+09:00",
  "message": "스케줄이 등록되었습니다. 다음 실행: 2025-11-03 08:00:00+09:00"
}
```

---

### 2. 스케줄 조회

**GET** `/api/schedule/{user_id}`

```bash
curl http://localhost:8000/api/schedule/user_123
```

**응답:**

```json
{
  "job_id": "briefing_user_123",
  "user_id": "user_123",
  "name": "Briefing for user@example.com",
  "next_run": "2025-11-03T08:00:00+09:00",
  "trigger": "cron[day_of_week='0,1,2,3,4', hour='8', minute='0']"
}
```

---

### 3. 모든 스케줄 조회

**GET** `/api/schedules`

```bash
curl http://localhost:8000/api/schedules
```

---

### 4. 스케줄 삭제

**DELETE** `/api/schedule/{user_id}`

```bash
curl -X DELETE http://localhost:8000/api/schedule/user_123
```

---

### 5. 스케줄 일시정지

**POST** `/api/schedule/{user_id}/pause`

```bash
curl -X POST http://localhost:8000/api/schedule/user_123/pause
```

---

### 6. 스케줄 재개

**POST** `/api/schedule/{user_id}/resume`

```bash
curl -X POST http://localhost:8000/api/schedule/user_123/resume
```

---

## 🧪 테스트

### 테스트 스크립트 실행

```bash
python test_schedule.py
```

### 수동 테스트 (cURL)

#### 1. 헬스 체크

```bash
curl http://localhost:8000/health
```

#### 2. 스케줄 생성

```bash
curl -X POST http://localhost:8000/api/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "email": "your-email@example.com",
    "keywords": ["워크프리", "자동화"],
    "time": "09:00",
    "weekdays": [0,1,2,3,4],
    "max_results": 5,
    "engines": ["naver"]
  }'
```

#### 3. 즉시 이메일 발송 (테스트)

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

---

## 📊 요일 번호 매핑

| 번호 | 요일 |
|------|------|
| 0    | 월요일 |
| 1    | 화요일 |
| 2    | 수요일 |
| 3    | 목요일 |
| 4    | 금요일 |
| 5    | 토요일 |
| 6    | 일요일 |

**예시:**
- 평일만: `[0, 1, 2, 3, 4]`
- 주말만: `[5, 6]`
- 매일: `[0, 1, 2, 3, 4, 5, 6]`

---

## 🗄️ 데이터베이스

스케줄 정보는 `schedules.db` SQLite 파일에 저장됩니다.

**위치:** `search-crawler/schedules.db`

**자동 생성:** 첫 스케줄 등록 시 자동으로 생성됩니다.

---

## ⚙️ 프론트엔드 연동

### Next.js 페이지

파일: `src/app/crawling/page.tsx`

**접속:** http://localhost:3000/crawling

### 환경 변수 설정

`.env.local` 파일에 추가:

```env
NEXT_PUBLIC_CRAWLER_API_URL=http://localhost:8000
```

---

## 🔥 실사용 시나리오

### 시나리오 1: 마케터 김현우님

**설정:**
- 키워드: "AI 마케팅", "콘텐츠 자동화"
- 시간: 08:00
- 요일: 월-금
- 결과: 10개

**효과:**
- 매일 아침 8시에 최신 뉴스 수신
- Excel 파일로 정리된 정보
- 월-금만 발송 (주말 휴식)

---

### 시나리오 2: 투자자

**설정:**
- 키워드: "스타트업 펀딩", "시리즈A", "AI 투자"
- 시간: 09:00
- 요일: 월-일 (매일)
- 결과: 15개

**효과:**
- 투자 기회 놓치지 않음
- 주말에도 뉴스 체크

---

## 💰 크레딧 시스템 (예정)

현재는 크레딧 차감이 **비활성화** 상태입니다.

**향후 구현:**
- 검색 1회당 3C (3,000원) 차감
- Firebase 연동으로 사용자별 크레딧 관리
- 크레딧 부족 시 자동 알림

---

## 🚨 주의사항

1. **이메일 발송 제한**
   - Resend 무료 플랜: 월 3,000통
   - 과도한 발송은 계정 제재 위험

2. **크롤링 빈도**
   - 네이버 API 일일 제한: 25,000회
   - 권장: 하루 1-3회 발송

3. **타임존**
   - 기본: Asia/Seoul (KST, UTC+9)
   - 변경 필요 시 `scheduler.py` 수정

4. **서버 재시작**
   - 서버 재시작 시 스케줄 자동 로드
   - `schedules.db` 파일 보관 필수

---

## 🐛 문제 해결

### Q1. 스케줄이 실행되지 않아요

**확인 사항:**
1. 서버가 실행 중인지 확인
2. `schedules.db` 파일 존재 확인
3. 로그 확인: `[INFO] ✅ 스케줄러 시작됨`

---

### Q2. 이메일이 발송되지 않아요

**확인 사항:**
1. `RESEND_API_KEY` 환경 변수 설정
2. 발신 이메일 도메인 인증 (Resend 대시보드)
3. 수신 이메일 주소 유효성 확인
4. 스팸 폴더 확인

---

### Q3. 스케줄 조회 시 404 오류

**원인:** 해당 user_id로 등록된 스케줄이 없음

**해결:** 먼저 스케줄을 생성하세요

---

## 📦 배포 (Production)

### Railway 배포

1. `railway.json` 수정:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "uvicorn app:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. 환경 변수 설정 (Railway 대시보드):
   - `RESEND_API_KEY`
   - `NAVER_CLIENT_ID`
   - `NAVER_CLIENT_SECRET`

3. 배포 완료 후 URL 확인

4. Next.js 환경 변수 업데이트:
   ```env
   NEXT_PUBLIC_CRAWLER_API_URL=https://your-app.railway.app
   ```

---

## 🔗 관련 링크

- [Resend API 문서](https://resend.com/docs)
- [APScheduler 문서](https://apscheduler.readthedocs.io/)
- [Naver Search API](https://developers.naver.com/docs/serviceapi/search/news/news.md)
- [FastAPI 문서](https://fastapi.tiangolo.com/)

---

## 📝 변경 이력

### v2.0.0 (2025-11-02)
- ✅ 스케줄 자동발송 기능 추가
- ✅ 요일별 발송 설정
- ✅ 키워드 다중 등록
- ✅ 스케줄 일시정지/재개
- ✅ SQLite 스케줄 저장

### v1.0.0 (2025-10-30)
- ✅ 즉시 검색 및 이메일 발송
- ✅ 네이버/구글 뉴스 크롤링
- ✅ Excel 파일 생성

---

**🎉 구현 완료!**

이제 WorkFree Market에서 자동 뉴스 브리핑 서비스를 제공할 수 있습니다!

