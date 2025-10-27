# 💱 WorkFree 환율 자동 공유 시스템

매일 아침 선택한 통화의 환율을 전사원에게 자동으로 발송하는 시스템입니다.

## 🎯 주요 기능

- **실시간 환율 수집**: 한국은행 API 또는 무료 환율 API 활용
- **자동 이메일 발송**: 매일 정해진 시간에 전사원에게 발송
- **선택 가능한 통화**: 주요 통화 (USD, EUR, JPY, CNY 등) 선택
- **이전일 대비 변동률**: 상승/하락 표시 및 시각적 표시
- **예쁜 HTML 이메일**: 직관적인 테이블 형태로 구성
- **모바일 최적화**: 반응형 이메일 템플릿

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **환율 데이터**: ExchangeRate-API, 한국은행 API
- **이메일 발송**: SendGrid, AWS SES, Nodemailer
- **스케줄링**: Vercel Cron, AWS EventBridge

## 📋 설정 방법

### 1. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수들을 추가하세요:

```bash
# 환율 API 키
EXCHANGE_RATE_API_KEY=your_api_key_here

# 이메일 서비스 설정
SENDGRID_API_KEY=your_sendgrid_api_key
# 또는
AWS_SES_ACCESS_KEY_ID=your_aws_access_key
AWS_SES_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_SES_REGION=us-east-1

# 기본 URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. 환율 API 선택

#### 옵션 1: ExchangeRate-API (무료)
```typescript
// src/app/api/exchange-rate/real/route.ts
const response = await fetch(
  `https://api.exchangerate-api.com/v4/latest/KRW`
);
```

#### 옵션 2: 한국은행 API (정확한 데이터)
```typescript
// 한국은행 경제통계시스템 API 사용
const response = await fetch(
  `https://ecos.bok.or.kr/api/StatisticSearch/${process.env.BOK_API_KEY}/json/kr/1/1000/036Y001/DD/20240101/20241231`
);
```

#### 옵션 3: Fixer.io API (유료, 고품질)
```typescript
const response = await fetch(
  `http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_KEY}&base=EUR&symbols=${currencyString}`
);
```

### 3. 이메일 서비스 설정

#### SendGrid 사용
```typescript
// src/app/api/exchange-rate/send/route.ts
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: emails,
  from: 'noreply@yourcompany.com',
  subject: subject,
  html: htmlContent,
};

await sgMail.send(msg);
```

#### AWS SES 사용
```typescript
const AWS = require('aws-sdk');
const ses = new AWS.SES({
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION,
});

await ses.sendEmail({
  Destination: { ToAddresses: emails },
  Message: {
    Body: { Html: { Data: htmlContent } },
    Subject: { Data: subject },
  },
  Source: 'noreply@yourcompany.com',
}).promise();
```

### 4. 스케줄러 설정

#### Vercel Cron 사용
`vercel.json` 파일에 cron job 추가:

```json
{
  "crons": [
    {
      "path": "/api/exchange-rate/send",
      "schedule": "0 9 * * *"
    }
  ]
}
```

#### AWS EventBridge 사용
```typescript
// AWS EventBridge 규칙 생성
const eventBridge = new AWS.EventBridge();

await eventBridge.putRule({
  Name: 'exchange-rate-daily',
  ScheduleExpression: 'cron(0 9 * * *)', // 매일 오전 9시
  State: 'ENABLED'
}).promise();
```

## 🚀 사용 방법

### 1. 도구 페이지 접속
`/tools` 페이지에서 "환율 자동 공유" 도구를 클릭하세요.

### 2. 설정 구성
- **통화 선택**: 공유할 통화들을 선택하세요
- **이메일 목록**: 전사원 이메일을 한 줄에 하나씩 입력하세요
- **발송 시간**: 매일 발송할 시간을 설정하세요

### 3. 미리보기 확인
"미리보기 보기" 버튼을 클릭하여 환율 데이터를 확인하세요.

### 4. 자동화 설정 완료
"자동화 설정 완료" 버튼을 클릭하여 스케줄러를 활성화하세요.

## 📊 지원 통화

- 🇺🇸 USD (미국 달러)
- 🇪🇺 EUR (유로)
- 🇯🇵 JPY (일본 엔)
- 🇨🇳 CNY (중국 위안)
- 🇬🇧 GBP (영국 파운드)
- 🇦🇺 AUD (호주 달러)
- 🇨🇦 CAD (캐나다 달러)
- 🇨🇭 CHF (스위스 프랑)
- 🇭🇰 HKD (홍콩 달러)
- 🇸🇬 SGD (싱가포르 달러)

## 🎨 이메일 템플릿 특징

- **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화
- **시각적 표시**: 상승/하락을 색상과 아이콘으로 표시
- **깔끔한 레이아웃**: 직관적인 테이블 형태
- **브랜딩**: WorkFree 로고와 색상 테마 적용

## 🔧 커스터마이징

### 이메일 템플릿 수정
`src/app/api/exchange-rate/send/route.ts`의 `generateEmailTemplate` 함수를 수정하세요.

### 통화 추가
`src/app/tools/exchange-rate/page.tsx`의 `CURRENCIES` 배열에 새로운 통화를 추가하세요.

### 발송 시간 변경
스케줄러 설정에서 cron 표현식을 수정하세요.

## 🐛 문제 해결

### 환율 데이터가 표시되지 않는 경우
1. API 키가 올바르게 설정되었는지 확인
2. 네트워크 연결 상태 확인
3. API 사용량 제한 확인

### 이메일이 발송되지 않는 경우
1. 이메일 서비스 API 키 확인
2. 발신자 이메일 주소 인증 확인
3. 스팸 폴더 확인

### 스케줄러가 작동하지 않는 경우
1. cron 표현식 문법 확인
2. 서버 시간대 설정 확인
3. 로그 파일 확인

## 📈 향후 개선 계획

- [ ] 웹훅을 통한 실시간 알림
- [ ] 환율 변동 임계값 설정
- [ ] 다국어 지원
- [ ] 대시보드에서 설정 관리
- [ ] 이메일 발송 통계
- [ ] 모바일 앱 푸시 알림

## 📞 지원

문제가 발생하거나 기능 요청이 있으시면 WorkFree 팀에 문의하세요.

---

**WorkFree** - 업무 자동화의 새로운 기준
