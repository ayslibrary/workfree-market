# ⚡ 빠른 시작 가이드

## 🎯 5분 안에 시작하기

### 1️⃣ 서버 시작 (30초)

```bash
cd search-crawler
pip install -r requirements.txt
python app.py
```

✅ 서버 실행: http://localhost:8000

---

### 2️⃣ 즉시 테스트 (1분)

**PowerShell에서:**

```powershell
.\test_schedule.ps1
```

**또는 Python에서:**

```bash
python test_schedule.py
```

---

### 3️⃣ 웹 UI에서 사용 (2분)

1. Next.js 개발 서버 시작:

```bash
npm run dev
```

2. 브라우저에서 접속:

http://localhost:3000/crawling

3. 키워드 입력 후 테스트!

---

## 📋 체크리스트

### ✅ 필수 설정

- [ ] Python 3.9+ 설치
- [ ] 의존성 설치 (`pip install -r requirements.txt`)
- [ ] `.env` 파일 생성 (아래 참고)

### ⭐ 권장 설정

- [ ] Resend API 키 발급
- [ ] Naver API 키 발급
- [ ] 테스트 이메일 확인

---

## 🔑 환경 변수 설정

### 최소 설정 (데모 모드)

`.env` 파일 생성 (빈 파일도 OK):

```env
# 데모 모드로 실행 (API 키 없이 테스트 가능)
```

### 실제 사용 설정

```env
# Resend API (필수 - 이메일 발송용)
RESEND_API_KEY=re_your_api_key_here

# Naver Search API (권장 - 실제 뉴스 검색용)
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

---

## 🧪 테스트 시나리오

### 시나리오 1: 즉시 검색 테스트

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

**예상 결과:** 5분 내 이메일 수신 (Excel 첨부)

---

### 시나리오 2: 스케줄 등록

```bash
curl -X POST http://localhost:8000/api/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "email": "your-email@example.com",
    "keywords": ["AI 투자", "스타트업"],
    "time": "09:00",
    "weekdays": [0,1,2,3,4],
    "max_results": 10,
    "engines": ["naver"]
  }'
```

**예상 결과:** 내일 오전 9시에 자동 발송

---

## 🎨 웹 UI 사용법

### 페이지 접속

http://localhost:3000/crawling

### 모드 선택

**1️⃣ 검색만 하기**
- 즉시 검색 후 이메일 발송
- 1회성 사용

**2️⃣ 검색 + 이메일 발송**
- 스케줄 등록
- 매일 자동 발송

### 설정 항목

1. **검색 키워드**: 최대 5개
2. **발송 시간**: 09:00 (오전 9시)
3. **발송 요일**: 월화수목금 선택
4. **결과 개수**: 5-20개 슬라이더

---

## 🚨 자주 묻는 질문

### Q1. API 키 없이 테스트 가능한가요?

**A:** 네! 데모 모드로 작동합니다.
- 검색: 데모 데이터 반환
- 이메일: 실제 발송 불가 (오류 발생)

실제 사용을 위해서는 **Resend API 키**가 필수입니다.

---

### Q2. 무료로 사용 가능한가요?

**A:** 네!

**무료 플랜:**
- Resend: 월 3,000통
- Naver API: 일 25,000회

개인 사용에 충분합니다!

---

### Q3. 서버 종료하면 스케줄이 사라지나요?

**A:** 아니요!

`schedules.db` 파일에 저장되어 서버 재시작 시 자동 로드됩니다.

---

### Q4. 스케줄이 실행되는지 확인하려면?

**A:** 로그를 확인하세요.

```bash
python app.py
```

터미널에 다음과 같이 표시됩니다:

```
[INFO] ✅ 스케줄러 시작됨
[INFO] 📬 브리핑 발송 시작: user@example.com
[INFO] ✅ 브리핑 발송 완료: 10개 결과
```

---

## 🎁 보너스 팁

### 💡 팁 1: API 문서 확인

http://localhost:8000/docs

FastAPI 자동 생성 문서에서 모든 API를 직접 테스트할 수 있습니다!

---

### 💡 팁 2: 다중 키워드 활용

```json
{
  "keywords": [
    "AI 투자",
    "스타트업 펀딩",
    "생성형 AI",
    "자동화 도구"
  ]
}
```

각 키워드별로 검색하여 통합 결과를 보냅니다.

---

### 💡 팁 3: 주말만 발송

```json
{
  "weekdays": [5, 6]
}
```

토요일(5), 일요일(6)만 발송합니다.

---

## 📚 더 알아보기

- 📘 [상세 가이드](./SCHEDULE_GUIDE.md)
- 🔧 [API 문서](http://localhost:8000/docs)
- 🐛 [문제 해결](./SCHEDULE_GUIDE.md#🐛-문제-해결)

---

## 🚀 다음 단계

### 1️⃣ API 키 발급

**Resend (이메일):**
1. https://resend.com 회원가입
2. API Keys 메뉴에서 키 생성
3. `.env` 파일에 추가

**Naver (뉴스 검색):**
1. https://developers.naver.com
2. 애플리케이션 등록
3. Client ID/Secret 발급
4. `.env` 파일에 추가

---

### 2️⃣ 배포하기

**Railway 배포 (추천):**

```bash
# Railway CLI 설치
npm install -g railway

# 로그인
railway login

# 배포
railway up
```

**환경 변수 설정:** Railway 대시보드에서 추가

---

### 3️⃣ 크레딧 시스템 연동

Firebase 연동하여 사용자별 크레딧 차감 구현 (예정)

---

**🎉 완료!**

이제 WorkFree 뉴스 자동발송 시스템을 사용할 준비가 되었습니다!

