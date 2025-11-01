# 🔍 WorkFree Search Crawler API

구글/네이버 검색어 자동 검색 & 이메일 발송 서비스

## ✨ 주요 기능

- ✅ 구글/네이버 동시 검색
- ✅ Top 10 검색 결과 수집
- ✅ CSV 파일 자동 생성
- ✅ 이메일 자동 발송
- ✅ RESTful API

## 🚀 로컬 실행

```bash
# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
# .env 파일 수정

# 서버 실행
python app.py
```

서버 실행 후: http://localhost:8000

## 📡 API 엔드포인트

### 1. 검색만 실행
```bash
POST /api/search
{
  "keyword": "워크프리",
  "engines": ["google", "naver"],
  "max_results": 10
}
```

### 2. 검색 + 이메일 발송
```bash
POST /api/email
{
  "keyword": "워크프리",
  "recipient_email": "user@example.com",
  "engines": ["google", "naver"],
  "max_results": 10
}
```

### 3. 헬스 체크
```bash
GET /health
```

## 🔧 환경 변수

| 변수명 | 설명 | 필수 |
|--------|------|------|
| GMAIL_USER | Gmail 계정 | ✅ |
| GMAIL_APP_PASSWORD | Gmail 앱 비밀번호 | ✅ |

## 📦 배포 (Railway)

1. Railway 계정 생성
2. New Project > Deploy from GitHub
3. 환경 변수 설정
4. 자동 배포 완료

## 🧪 테스트

```bash
# API 테스트
curl http://localhost:8000/health

# 검색 테스트
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"keyword":"test","engines":["google"],"max_results":5}'
```

## 📝 주의사항

- 과도한 크롤링은 IP 차단 위험
- 검색 간격 권장: 최소 1분
- Gmail 일일 발송 제한: 500통

## 🔗 관련 링크

- [WorkFree Market](https://workfreemarket.com)
- [Gmail SMTP 설정](https://support.google.com/mail/answer/185833)

