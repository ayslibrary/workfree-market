# 🚀 Search Crawler API 배포 가이드

## Railway 배포 단계

### 1. Railway 계정 준비
- https://railway.app
- GitHub 계정으로 로그인

### 2. 새 프로젝트 생성
```
New Project > Deploy from GitHub repo
```

### 3. 리포지토리 선택
- `workfree-market` 선택
- Root Directory: `search-crawler` 설정

### 4. 환경 변수 설정
Railway Dashboard > Variables 탭:

```bash
# Resend API (이메일 발송)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx

# Google Custom Search API (선택)
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id

# Naver Search API (선택)
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

### 5. Resend API 키 생성
1. https://resend.com/api-keys
2. "Create API Key" 클릭
3. Domain: `workfreemarket.com` 선택
4. Permissions: "Sending access" 선택
5. API 키 복사 (re_로 시작)

### 6. 배포 확인
```bash
# 배포 완료 후 URL 확인 (예: https://xxx.railway.app)
curl https://your-app.railway.app/health
```

## Vercel 환경 변수 설정

Vercel Dashboard > Settings > Environment Variables:

```bash
# Railway API URL
NEXT_PUBLIC_SEARCH_CRAWLER_API=https://your-app.railway.app
SEARCH_CRAWLER_API_URL=https://your-app.railway.app

# Cron Secret (랜덤 문자열)
CRON_SECRET=your-random-secret-string
```

## 배포 후 체크리스트

- [  ] Railway API 정상 작동 확인
- [ ] Vercel 환경 변수 설정 완료
- [ ] 프론트엔드 페이지 접속 가능
- [ ] 검색 기능 테스트
- [ ] 이메일 발송 테스트
- [ ] Cron Job 설정 완료

## 테스트 명령어

```bash
# API 헬스 체크
curl https://your-app.railway.app/health

# 검색 테스트
curl -X POST https://your-app.railway.app/api/search \
  -H "Content-Type: application/json" \
  -d '{"keyword":"test","engines":["google"],"max_results":5}'

# 이메일 발송 테스트
curl -X POST https://your-app.railway.app/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "keyword":"test",
    "recipient_email":"your@email.com",
    "engines":["google"],
    "max_results":5
  }'
```

## 문제 해결

### 502 Bad Gateway
- Railway 로그 확인
- 환경 변수 설정 확인
- requirements.txt 의존성 확인

### 이메일 발송 실패
- Resend API 키 확인
- DNS 설정 확인 (DKIM, SPF, MX)
- 발신자 도메인 인증 완료 확인
- RESEND_API_KEY 환경 변수 확인

### Cron Job 실행 안 됨
- CRON_SECRET 설정 확인
- Vercel Dashboard > Cron 탭 확인
- 로그 확인

## 비용

- **Railway Hobby Plan**: $5/month
  - 500시간 실행 시간
  - 충분한 메모리/CPU
  
- **Vercel Pro**: $20/month (Cron 포함)
  - 무료 플랜: Cron 불가
  - Pro 이상: Cron 사용 가능

## 다음 단계

1. 프론트엔드에서 테스트
2. Firebase 설정 저장 기능 추가
3. 사용자 대시보드 구현
4. 크레딧 시스템 연동

