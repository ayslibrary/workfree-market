# 🔍 검색 크롤러 서비스 설정 가이드

## 1️⃣ Railway에 API 배포

### 단계 1: Railway 계정 생성
1. https://railway.app 접속
2. GitHub 계정으로 로그인

### 단계 2: 프로젝트 배포
```bash
# Railway CLI 설치 (선택)
npm install -g @railway/cli

# 또는 웹에서 직접:
# 1. New Project
# 2. Deploy from GitHub repo
# 3. workfree-market 선택
# 4. Root Directory: /search-crawler
```

### 단계 3: 환경 변수 설정
Railway 대시보드에서 Variables 탭:

```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### Gmail 앱 비밀번호 생성
1. Google 계정 > 보안
2. 2단계 인증 활성화
3. 앱 비밀번호 생성
4. 16자리 비밀번호 복사

## 2️⃣ Vercel 환경 변수 설정

Vercel 대시보드 > Settings > Environment Variables:

```
NEXT_PUBLIC_SEARCH_CRAWLER_API=https://your-app.railway.app
```

## 3️⃣ Cron Job 설정 (매일 자동 검색)

### vercel.json에 추가
```json
{
  "crons": [
    {
      "path": "/api/cron/search-crawler",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### API 라우트 생성
`src/app/api/cron/search-crawler/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Vercel Cron Secret 검증
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Firebase에서 활성화된 사용자 검색 설정 가져오기
    // 각 사용자에 대해 검색 실행
    // Railway API 호출
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

## 4️⃣ Firebase 데이터 구조

### Collection: searchCrawlerSettings
```javascript
{
  userId: "user123",
  keyword: "워크프리",
  email: "user@example.com",
  engines: ["google", "naver"],
  maxResults: 10,
  schedule: "daily",  // daily, weekly
  time: "09:00",
  active: true,
  createdAt: timestamp,
  lastRun: timestamp
}
```

## 5️⃣ 테스트

### 로컬 테스트
```bash
cd search-crawler
python app.py

# 다른 터미널에서
python test_api.py
```

### 배포 후 테스트
```bash
curl https://your-app.railway.app/health
```

### 프론트엔드 테스트
```
http://localhost:3000/tools/search-crawler
```

## 6️⃣ 크레딧 시스템 연동

### 크레딧 차감 로직
- 검색 1회 = 1 크레딧
- 이메일 발송 = 추가 1 크레딧
- 매일 자동 검색 = 월 30 크레딧

### Firebase Functions (선택)
```javascript
exports.deductCredits = functions.https.onCall(async (data, context) => {
  const { userId, amount } = data;
  // 크레딧 차감 로직
});
```

## 7️⃣ 주의사항

### 크롤링 제한
- 구글: 초당 1회 이하 권장
- 네이버: IP 차단 위험
- User-Agent 설정 필수

### Gmail 제한
- 하루 500통 제한
- 스팸 신고 주의

### 비용
- Railway: 월 5달러 (Hobby Plan)
- Vercel Cron: 무료 (100,000 실행/월)

## 8️⃣ 다음 단계

- [ ] Firebase 연동
- [ ] Cron Job 구현
- [ ] 크레딧 시스템 연동
- [ ] 사용자 대시보드
- [ ] 검색 이력 저장
- [ ] 알림톡 연동 (선택)

## 🔗 참고 링크

- [Railway 문서](https://docs.railway.app)
- [Vercel Cron](https://vercel.com/docs/cron-jobs)
- [Gmail SMTP](https://support.google.com/mail/answer/185833)

