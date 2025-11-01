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
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

### 5. Gmail 앱 비밀번호 생성
1. https://myaccount.google.com/security
2. "2단계 인증" 활성화
3. "앱 비밀번호" 검색
4. "메일" 선택 후 생성
5. 16자리 코드 복사

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
- Gmail 앱 비밀번호 재생성
- 2단계 인증 활성화 확인
- GMAIL_USER, GMAIL_APP_PASSWORD 확인

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

