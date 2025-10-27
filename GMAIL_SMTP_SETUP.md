# 📧 Gmail SMTP 설정 가이드

서울외국환중개 매매기준율 자동 발송 시스템을 위한 Gmail SMTP 설정 방법입니다.

## 🔧 Gmail 설정

### 1. **Gmail 2단계 인증 활성화**
1. [Google 계정 설정](https://myaccount.google.com/) 접속
2. **보안** → **2단계 인증** 활성화
3. 휴대폰 번호로 인증 완료

### 2. **앱 비밀번호 생성**
1. [Google 계정 설정](https://myaccount.google.com/) 접속
2. **보안** → **2단계 인증** → **앱 비밀번호**
3. **앱 선택**: "메일"
4. **기기 선택**: "기타(맞춤 이름)" → "WorkFree" 입력
5. **생성** 클릭하여 16자리 앱 비밀번호 복사

### 3. **환경 변수 설정**
`.env.local` 파일에 다음 내용 추가:

```bash
# Gmail SMTP 설정
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password

# 기본 URL (배포 시 자동 설정됨)
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

## 🚀 사용 방법

### **테스트 모드**
```bash
curl -X POST https://your-domain.vercel.app/api/exchange-rate/send-real \
  -H "Content-Type: application/json" \
  -d '{
    "currencies": ["USD", "EUR", "JPY"],
    "emails": ["test@example.com"],
    "testMode": true,
    "includeBokReference": true
  }'
```

### **실제 발송**
```bash
curl -X POST https://your-domain.vercel.app/api/exchange-rate/send-real \
  -H "Content-Type: application/json" \
  -d '{
    "currencies": ["USD", "EUR", "JPY"],
    "emails": ["user1@company.com", "user2@company.com"],
    "testMode": false,
    "includeBokReference": true
  }'
```

## 📊 제한사항

### **Gmail 제한**
- **일일 발송량**: 500개 이메일
- **시간당 발송량**: 100개 이메일
- **받는 사람 수**: 이메일당 최대 500명

### **권장사항**
- **소규모 회사** (50명 이하): Gmail SMTP 충분
- **중대규모 회사**: SendGrid, AWS SES 권장

## 🔍 문제 해결

### **인증 오류**
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**해결방법**: 앱 비밀번호를 올바르게 설정했는지 확인

### **발송 실패**
```
Error: Message failed to send
```
**해결방법**: 
1. Gmail 2단계 인증 활성화 확인
2. 앱 비밀번호 재생성
3. 일일 발송량 초과 여부 확인

### **환율 데이터 오류**
```
Error: 환율 데이터를 가져올 수 없습니다
```
**해결방법**: 
1. 서울외국환중개 API 상태 확인
2. 네트워크 연결 확인
3. 서버 로그 확인

## 🎯 실제 사용 예시

### **매일 아침 9시 자동 발송**
```javascript
// Vercel Cron 설정
// vercel.json
{
  "crons": [
    {
      "path": "/api/exchange-rate/send-real",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### **수동 발송**
```javascript
// 프론트엔드에서 호출
const response = await fetch('/api/exchange-rate/send-real', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    currencies: ['USD', 'EUR', 'JPY', 'CNY'],
    emails: ['finance@company.com', 'sales@company.com'],
    testMode: false,
    includeBokReference: true
  })
});
```

## 📈 모니터링

### **발송 로그 확인**
- Vercel 대시보드에서 함수 로그 확인
- 성공/실패 통계 모니터링
- 이메일 발송량 추적

### **알림 설정**
- 발송 실패 시 Slack/이메일 알림
- 일일 발송량 임계값 설정
- 오류 발생 시 즉시 알림

---

**WorkFree** - 완전 무료로 시작하는 환율 자동화 시스템 🚀
