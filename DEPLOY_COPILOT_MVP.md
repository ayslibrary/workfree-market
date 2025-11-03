# 🚀 Fri Manual Bot MVP 배포 가이드

## ✅ 완성된 기능 (지금 바로 배포 가능)

### 핵심 기능
- ✅ 문서 업로드 (PDF, DOCX, TXT, MD)
- ✅ RAG 기반 AI 답변 시스템  
- ✅ 실시간 스트리밍 응답
- ✅ 플로팅 챗봇 (모든 페이지에서 접근)
- ✅ 개인용 랜딩 페이지 (`/copilot`)
- ✅ 기업용 랜딩 페이지 (`/copilot/enterprise`)
- ✅ 메인 페이지 히어로 섹션

### 추가 기능 (라이브러리만 완성, UI 연동은 다음에)
- 📦 추천인 시스템 (lib/referral.ts)
- 📦 추천 대시보드 UI (my/referral)

---

## 📋 배포 전 체크리스트

### 1️⃣ 환경 변수 설정 (.env.local)

```bash
# ✅ 기존 변수 (이미 설정되어 있음)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
OPENAI_API_KEY=sk-...

# 🆕 새로 추가해야 할 변수
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=workfree-copilot
```

### 2️⃣ Pinecone 설정 (5분 소요)

1. **Pinecone 계정 생성**
   - https://www.pinecone.io/ 접속
   - 무료 계정 생성 (신용카드 불필요)

2. **인덱스 생성**
   ```
   Index Name: workfree-copilot
   Dimensions: 1536
   Metric: cosine
   Cloud Provider: AWS
   Region: us-east-1 (또는 가까운 지역)
   ```

3. **API Key 복사**
   - Dashboard → API Keys → Copy

4. **.env.local에 추가**
   ```bash
   PINECONE_API_KEY=pcsk_xxxxx
   PINECONE_INDEX=workfree-copilot
   ```

### 3️⃣ Vercel 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables에 추가:

```
PINECONE_API_KEY (Production + Preview + Development)
PINECONE_INDEX (Production + Preview + Development)
OPENAI_API_KEY (이미 있으면 재사용)
```

---

## 🚀 배포 명령어

### 로컬 테스트
```bash
# 패키지 설치 확인
npm install

# 로컬 실행
npm run dev

# 빌드 테스트
npm run build
```

### Vercel 배포
```bash
# Vercel CLI 사용
vercel --prod

# 또는 Git Push (자동 배포)
git add .
git commit -m "🚀 WorkFree Copilot MVP 배포"
git push origin main
```

---

## 🧪 배포 후 테스트

### 1. 문서 업로드 테스트
1. `/tools/frimanualbot` 접속
2. "문서 관리" 탭 선택
3. 테스트 PDF/DOCX 업로드
4. 업로드 완료 확인 (몇 초~1분 소요)

### 2. 챗봇 테스트
1. "채팅" 탭으로 이동
2. 업로드한 문서 관련 질문 입력
   - 예: "이 문서의 주요 내용은?"
3. AI 답변 확인 (스트리밍으로 표시됨)
4. 참고 문서 출처 확인

### 3. 플로팅 챗봇 테스트
1. 메인 페이지로 이동
2. 우측 하단 🤖 버튼 클릭
3. 챗봇 모달 열림 확인
4. 질문 입력 및 답변 확인

---

## 💰 예상 비용 (개인 사용자 기준)

### Pinecone
- **Starter (무료)**: 10만 벡터까지 무료
  - 약 10만 자 분량의 문서 (문서 10-20개)
  - 충분한 MVP 테스트 가능

### OpenAI API
- **임베딩**: $0.02 / 1M 토큰
  - 10만 자 문서 = 약 $0.003
- **GPT-4 Turbo**: $10 (입력) / $30 (출력) / 1M 토큰
  - 질문 100개 = 약 $1-2

**총 예상 비용: MVP 단계에서는 거의 무료 (월 $5 미만)**

---

## 🎯 배포 후 할 일

### Week 1: MVP 안정화
- [ ] 실사용자 피드백 수집
- [ ] 버그 수정
- [ ] 문서 업로드 속도 최적화

### Week 2: 추천인 시스템 완성
- [ ] 회원가입 페이지에 추천 코드 입력 추가
- [ ] 추천 보상 자동 지급 연동
- [ ] 카카오톡 공유 버튼 활성화

### Week 3: 입소문 마케팅
- [ ] 무료 체험 3회 → 5회
- [ ] 친구 초대 시 +10 크레딧
- [ ] 블로그 포스팅 & 커뮤니티 배포

### Week 4: 기업 영업
- [ ] 기업 데모 영상 제작
- [ ] ROI 계산기 고도화
- [ ] 첫 기업 고객 확보

---

## 📞 문제 해결

### Pinecone 연결 오류
```
Error: Pinecone client not initialized
```
**해결:** `.env.local`에 `PINECONE_API_KEY` 확인

### 문서 업로드 실패
```
Error: Failed to parse PDF
```
**해결:** PDF 버전 확인 (PDF 1.7 이상 권장)

### GPT-4 응답 없음
```
Error: OpenAI API key invalid
```
**해결:** `OPENAI_API_KEY` 재확인

---

## 🎉 배포 완료!

### 접속 URL
- **메인 페이지**: https://your-domain.com
- **Copilot 랜딩**: https://your-domain.com/copilot
- **기업용 랜딩**: https://your-domain.com/copilot/enterprise
- **내 챗봇**: https://your-domain.com/tools/my-copilot

### 테스트 계정
- 이메일: test@workfree.com
- 비밀번호: Test1234!

---

## 📊 성공 지표

### 첫 주 목표
- [ ] 문서 업로드 100건
- [ ] AI 질문 500개
- [ ] 가입자 50명

### 첫 달 목표
- [ ] MAU 500명
- [ ] 유료 전환 10명
- [ ] 기업 고객 2개사

---

**🚀 배포 성공하시고, 이따 봬요!**

질문 있으시면:
- Slack: #copilot-dev
- 이메일: dev@workfree.market

