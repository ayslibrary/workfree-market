# 🎯 AI 블로그 자동 생성 서비스 설정 가이드

## 📦 필요한 패키지 설치

터미널에서 다음 명령을 실행하세요:

```bash
npm install openai jspdf
```

또는

```bash
yarn add openai jspdf
```

### 패키지 설명
- **openai**: OpenAI GPT API를 호출하기 위한 공식 라이브러리
- **jspdf**: PDF 파일 생성을 위한 라이브러리

---

## 🔑 OpenAI API 키 설정

### 1. OpenAI API 키 발급받기

1. [OpenAI Platform](https://platform.openai.com) 접속
2. 로그인 또는 회원가입
3. 우측 상단 프로필 → **API keys** 클릭
4. **Create new secret key** 클릭
5. 생성된 키를 복사 (⚠️ 한 번만 표시되므로 반드시 저장!)

### 2. 환경 변수 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

⚠️ **주의사항**:
- `.env.local` 파일은 절대 Git에 커밋하지 마세요!
- `.gitignore`에 `.env.local`이 포함되어 있는지 확인하세요.

### 3. .env.local 예시

```env
# OpenAI API Key
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 💰 OpenAI API 사용 비용

### GPT-4o-mini 모델 (권장)
- **입력**: $0.15 / 1M 토큰
- **출력**: $0.60 / 1M 토큰
- **평균 블로그 글 1개 생성 비용**: 약 $0.01~0.03

### 예상 비용 계산
- 블로그 글 100개 생성 시: 약 $1~3
- 블로그 글 1000개 생성 시: 약 $10~30

### 크레딧 충전
1. [OpenAI Billing](https://platform.openai.com/account/billing/overview) 접속
2. **Add payment method** 클릭
3. 신용카드 정보 입력
4. 원하는 금액 충전 (최소 $5)

---

## 🚀 서비스 실행

### 1. 개발 서버 실행

```bash
npm run dev
```

### 2. 블로그 생성기 접속

브라우저에서 다음 URL로 접속:
```
http://localhost:3000/tools/blog-generator
```

### 3. 테스트

1. 키워드 입력 (예: "ChatGPT", "블로그 마케팅")
2. 선택적으로 참고 자료 입력
3. "블로그 글 생성하기" 버튼 클릭
4. 생성된 글을 TXT/PDF로 다운로드

---

## ✅ 체크리스트

설정이 완료되었는지 확인하세요:

- [ ] `openai` 패키지 설치 완료
- [ ] `jspdf` 패키지 설치 완료
- [ ] OpenAI API 키 발급 완료
- [ ] `.env.local` 파일 생성 및 API 키 입력 완료
- [ ] 개발 서버 실행 확인
- [ ] 블로그 생성 테스트 완료

---

## 🔧 트러블슈팅

### API 키 오류
```
Error: The specified token is not valid
```
**해결방법**: `.env.local` 파일의 API 키를 다시 확인하세요.

### 사용량 초과 오류
```
Error: insufficient_quota
```
**해결방법**: OpenAI 계정에 크레딧을 충전하세요.

### 모듈 없음 오류
```
Module not found: Can't resolve 'openai'
```
**해결방법**: 
```bash
npm install openai jspdf
npm run dev
```

### PDF 생성 오류 (한글 깨짐)
**현재 상태**: jsPDF 기본 폰트는 한글을 완벽히 지원하지 않습니다.
**해결방법**: 한글이 포함된 PDF는 일부 글자가 표시되지 않을 수 있습니다. TXT 파일 다운로드를 권장합니다.

---

## 📚 참고 자료

- [OpenAI API 문서](https://platform.openai.com/docs)
- [GPT-4o-mini 모델 정보](https://platform.openai.com/docs/models/gpt-4o-mini)
- [OpenAI 가격 정보](https://openai.com/pricing)
- [jsPDF 문서](https://github.com/parallax/jsPDF)

---

## 🎓 사용 팁

### 더 나은 블로그 글 생성을 위한 팁

1. **구체적인 키워드 사용**
   - ❌ "마케팅"
   - ✅ "SNS 마케팅 전략 2024"

2. **참고 자료 활용**
   - 특정 통계나 데이터를 포함하고 싶다면 참고 자료에 입력

3. **재생성**
   - 마음에 들지 않으면 다시 생성해보세요 (같은 키워드라도 다른 결과 생성)

4. **편집 활용**
   - 생성된 글을 복사해서 원하는 에디터에서 추가 편집

---

## 💡 향후 개선 계획

- [ ] 한글 폰트 지원 PDF 생성
- [ ] 블로그 글 스타일 선택 (공식적/캐주얼/전문적)
- [ ] 길이 조절 (짧게/보통/길게)
- [ ] 생성 기록 저장
- [ ] 즐겨찾기 기능
- [ ] 일괄 생성 (여러 키워드 한 번에)

---

**문제가 발생하면 이슈를 등록해주세요!** 🙏

