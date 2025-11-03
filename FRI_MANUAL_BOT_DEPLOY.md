# 🐶🤖 Fri Manual Bot - 최종 배포 가이드

## 🎉 완성된 기능

### 핵심 기능
- ✅ **로그인 불필요** - 익명 ID로 즉시 사용 가능
- ✅ **문서 업로드** - TXT, MD 파일 드래그 앤 드롭
- ✅ **⚡ 빠른 지식 추가** - 텍스트로 바로 입력 (NEW!)
- ✅ **RAG 기반 AI 답변** - Pinecone + OpenAI GPT-4
- ✅ **플로팅 챗봇** - 모든 페이지에서 접근 (우측 하단 🐶)
- ✅ **브라우저 저장** - localStorage로 문서 목록 관리

### 페이지 구조
```
/frimanualbot                  - 개인용 랜딩 페이지
/frimanualbot/enterprise       - 기업용 랜딩 페이지
/tools/frimanualbot            - 메인 챗봇 UI
```

---

## 🚀 배포 전 체크리스트

### ✅ 완료된 것
- [x] 린트 체크 (에러 없음)
- [x] 빌드 테스트 (성공)
- [x] Pinecone 설정
- [x] OpenAI API 키 설정
- [x] 로컬 테스트

---

## 📋 환경 변수 (.env.local)

```bash
# Pinecone 설정
PINECONE_API_KEY=pcsk_2SFWsT_8eFEPziN6CmvYzgFy2ceDQSs5npJ61bWbH9qaiR7qinXFqcyJ4dQ4qyBzhqULZi
PINECONE_INDEX=workfree-copilot

# OpenAI 설정
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Firebase (기존 설정)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... 기타 Firebase 설정 ...
```

---

## 🌐 Vercel 배포

### 1️⃣ 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables:

```
PINECONE_API_KEY        (모든 환경)
PINECONE_INDEX          (모든 환경)
OPENAI_API_KEY          (모든 환경)
```

### 2️⃣ Git Push

```bash
git add .
git commit -m "🐶🤖 Fri Manual Bot MVP 배포 - 로그인 불필요, 빠른 지식 추가 기능"
git push origin main
```

Vercel이 자동으로 배포합니다!

---

## 🧪 배포 후 테스트

### 1. 빠른 지식 추가 테스트
```
https://your-domain.com/tools/frimanualbot
```

1. "문서 관리" 탭 클릭
2. **⚡ 빠른 지식 추가** (초록색 박스)
3. 제목: `연차 규정`
4. 내용: `1년차는 15일, 3년차는 16일입니다.`
5. "⚡ 빠르게 추가" 클릭
6. 성공! ✅

### 2. 파일 업로드 테스트
1. `.txt` 파일 준비
2. 드래그 앤 드롭
3. 업로드 완료!

### 3. 채팅 테스트
1. "채팅" 탭으로 이동
2. 질문: "연차는 몇 일인가요?"
3. AI 답변: "1년차는 15일, 3년차는 16일입니다." ✅

### 4. 플로팅 챗봇 테스트
1. 메인 페이지로 이동
2. 우측 하단 🐶 버튼 클릭
3. 질문하기
4. 답변 확인!

---

## 📊 완성된 파일 목록

### 핵심 코드
- `src/lib/copilot.ts` - RAG 시스템
- `src/lib/anonymousUser.ts` - 익명 사용자 관리
- `src/lib/referral.ts` - 추천인 시스템 (미래)

### API
- `src/app/api/frimanualbot/upload/route.ts` - 문서 업로드
- `src/app/api/frimanualbot/simple-chat/route.ts` - 챗봇 답변

### UI
- `src/app/tools/frimanualbot/page.tsx` - 메인 챗봇 UI
- `src/components/FloatingCopilot.tsx` - 플로팅 챗봇
- `src/app/frimanualbot/page.tsx` - 개인용 랜딩
- `src/app/frimanualbot/enterprise/page.tsx` - 기업용 랜딩

---

## 🎯 주요 기능 설명

### ⚡ 빠른 지식 추가 (NEW!)

**사용 예시:**
```
제목: 휴가신청 링크
내용: https://groupware.company.com/leave
```

```
제목: 경조사 규정
내용:
- 결혼: 5일
- 출산: 10일
- 부모 사망: 5일
```

**장점:**
- 파일 없이 바로 입력
- 링크, 짧은 메모도 OK
- 즉시 AI가 학습

---

## 💰 예상 비용

### OpenAI API
- **임베딩**: $0.02 / 1M 토큰
  - 10만 자 문서 = 약 $0.003
- **GPT-4 답변**: $10 (입력) / $30 (출력) / 1M 토큰
  - 질문 100개 = 약 $1-2

### Pinecone
- **Starter (무료)**: 10만 벡터
  - 약 10만 자 분량 (문서 10-20개)

**월 예상 비용: $5-10 (MVP 단계)**

---

## 🎨 브랜딩

### 서비스명
**Fri Manual Bot** 🐶🤖

### 슬로건
- "매뉴얼 검색 30분 → 2분"
- "프리가 매뉴얼을 다 외웠어요!"
- "로그인 없이 바로 시작"

### 특징
- WorkFree 마스코트 Fri 활용
- 친근한 강아지 이미지
- 완전 무료 (익명 사용)

---

## 📱 마케팅 메시지

```
🐶 Fri Manual Bot 출시!

매뉴얼 찾느라 30분?
이제 AI에게 물어보면 2분 안에 답변!

✨ 특별 기능:
⚡ 빠른 지식 추가 - 텍스트만 쳐도 AI가 학습
📁 파일 업로드 - TXT, MD 지원
💬 플로팅 챗봇 - 어디서든 접근
🔓 로그인 불필요 - 바로 시작!

👉 https://your-domain.com/frimanualbot
```

---

## 🐛 알려진 제한사항

### 현재 버전 (MVP)
- TXT, MD 파일만 지원 (PDF, DOCX는 향후 추가)
- 스트리밍 답변 비활성화 (안정성 우선)
- 브라우저 저장 (쿠키 삭제 시 데이터 손실)

### 향후 추가 예정
- [ ] PDF, DOCX 파일 지원
- [ ] 스트리밍 답변 (타이핑 효과)
- [ ] 음성 입력 (Whisper)
- [ ] 대화 기록 저장
- [ ] 추천인 시스템 완성

---

## 🎉 배포 완료!

### 접속 URL
```
https://your-domain.com/frimanualbot
```

### 테스트 시나리오
1. "바로 시작하기" 클릭
2. "문서 관리" → 빠른 지식 추가
3. 제목: "연차", 내용: "15일"
4. "채팅" → 질문: "연차는?"
5. AI 답변: "15일입니다" ✅

---

**배포 성공! 집 잘 가세요! 🎉**

다음에 개발 이어서:
- PDF 파싱 추가
- 스트리밍 답변 수정
- 추천인 시스템 완성
- 크레딧 연동

**모두 정리되어 있으니 언제든 이어서 하시면 됩니다! 😊**

