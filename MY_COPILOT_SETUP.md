# 🤖 나만의 AI 업무 비서 설정 가이드

## 📋 개요

**Fri Manual Bot**은 사용자가 자신의 업무 매뉴얼을 업로드하고, AI 챗봇에게 질문하여 즉시 답변을 받을 수 있는 프리미엄 서비스입니다.

### 핵심 기능
- ✅ PDF, DOCX, TXT, MD 파일 업로드
- ✅ RAG (Retrieval-Augmented Generation) 기반 정확한 답변
- ✅ 실시간 스트리밍 응답
- ✅ 문서 출처 자동 표시
- ✅ 무제한 문서 업로드 (프리미엄)

---

## 🚀 빠른 시작

### 1단계: Pinecone 설정

Pinecone은 벡터 데이터베이스로, 문서를 임베딩 벡터로 저장합니다.

1. **계정 생성**
   - https://www.pinecone.io/ 접속
   - 무료 계정 생성 (10만 벡터까지 무료)

2. **인덱스 생성**
   ```
   Index Name: workfree-copilot
   Dimensions: 1536 (OpenAI text-embedding-3-small)
   Metric: cosine
   Region: 가장 가까운 지역 선택
   ```

3. **API 키 복사**
   - Dashboard → API Keys → API Key 복사

### 2단계: 환경 변수 설정

`.env.local` 파일에 추가:

```bash
# Pinecone 설정
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX=workfree-copilot

# OpenAI 설정 (이미 있으면 재사용)
OPENAI_API_KEY=your_openai_api_key_here
```

### 3단계: 패키지 설치 확인

```bash
npm install
```

필요한 패키지:
- `@pinecone-database/pinecone` - 벡터 DB
- `langchain` - RAG 프레임워크
- `@langchain/openai` - OpenAI 통합
- `pdf-parse` - PDF 파싱
- `mammoth` - DOCX 파싱

### 4단계: 서버 시작

```bash
npm run dev
```

접속: http://localhost:3000/tools/my-copilot

---

## 📖 사용 방법

### 1. 문서 업로드

1. `/tools/my-copilot` 페이지 접속
2. "문서 관리" 탭 선택
3. 파일을 드래그 앤 드롭 or 클릭하여 업로드
4. 업로드 완료 시 자동으로 임베딩 처리됨

**지원 파일:**
- PDF (.pdf)
- Word 문서 (.docx)
- 텍스트 파일 (.txt)
- 마크다운 (.md)

### 2. AI에게 질문하기

1. "채팅" 탭으로 이동
2. 입력창에 질문 입력
   - 예: "휴가 신청은 어떻게 하나요?"
   - 예: "견적서 양식 알려줘"
   - 예: "보고서 작성 절차는?"
3. AI가 업로드한 문서에서 관련 내용을 찾아 답변
4. 답변 하단에 참고 문서 표시

---

## 🔧 기술 구조

### 아키텍처

```
사용자 문서 업로드
    ↓
파일 파싱 (PDF/DOCX → 텍스트)
    ↓
청크 분할 (1000자씩, 200자 오버랩)
    ↓
OpenAI Embeddings (벡터화)
    ↓
Pinecone 저장
    ↓
사용자 질문 → 벡터 검색 (유사도 상위 5개)
    ↓
GPT-4에 컨텍스트 + 질문 전달
    ↓
스트리밍 답변 생성
```

### API 엔드포인트

#### 1. 문서 업로드
```typescript
POST /api/copilot/upload

Body (FormData):
  - file: File
  - userId: string
  - companyId?: string

Response:
  - documentId: string
  - fileName: string
  - chunksCount: number
  - contentLength: number
```

#### 2. 챗봇 질문
```typescript
POST /api/copilot/chat

Body (JSON):
  - query: string
  - userId: string
  - companyId?: string

Response: SSE (Server-Sent Events) 스트림
  - data: { content: string }
  - data: { sources: Array<{fileName, score}> }
  - data: [DONE]
```

---

## 💰 비용 구조

### OpenAI API 비용 (예상)

**임베딩:**
- 모델: `text-embedding-3-small`
- 가격: $0.02 / 1M 토큰
- 예시: 10만 자 문서 → 약 $0.003

**GPT-4 답변:**
- 모델: `gpt-4-turbo-preview`
- 가격: 입력 $10 / 1M 토큰, 출력 $30 / 1M 토큰
- 예시: 질문 100개 → 약 $1-2

**총 비용 (개인 사용자 기준):**
- 문서 10개 (100만 자) + 질문 1000개/월 = **$10-20/월**

### Pinecone 비용

- **Starter (무료):** 10만 벡터 (약 10만 자 분량)
- **Standard:** $70/월 (500만 벡터)

---

## 🎨 UI/UX 특징

### 탭 구조
1. **채팅 탭**: 카카오톡 스타일의 깔끔한 채팅 UI
2. **문서 관리 탭**: 업로드된 문서 목록, 삭제 기능

### 사용자 경험
- ✅ 드래그 앤 드롭 업로드
- ✅ 실시간 스트리밍 답변 (타이핑 효과)
- ✅ 참고 문서 출처 자동 표시
- ✅ 모바일 반응형 디자인

---

## 🔐 보안 및 데이터 격리

### 사용자별 데이터 격리

```typescript
// Pinecone 메타데이터 필터링
{
  companyId: userId // 개인 사용자는 userId를 companyId로 사용
}
```

- 각 사용자의 문서는 자신만 접근 가능
- 벡터 검색 시 자동으로 필터링됨

---

## 📊 프리미엄 기능 (향후 개발)

### 무료 vs 프리미엄

| 기능 | 무료 | 프리미엄 |
|------|------|----------|
| 문서 업로드 | 3개 | 무제한 |
| 질문 횟수 | 10개/일 | 무제한 |
| 음성 입력 | ❌ | ✅ |
| 대화 기록 | ❌ | ✅ |
| 워크플로 추천 | ❌ | ✅ |

### 크레딧 시스템 연동

```typescript
// 질문당 크레딧 차감
질문 1회 = 5 크레딧
문서 업로드 1회 = 10 크레딧
```

---

## 🐛 트러블슈팅

### 문제: 업로드 실패

**원인:**
- Pinecone API 키 오류
- 파일 형식 미지원
- 파일 크기 너무 큼

**해결:**
1. `.env.local` 확인
2. 지원 포맷인지 확인 (PDF, DOCX, TXT, MD)
3. 파일 크기 10MB 이하로 조정

### 문제: 답변이 "관련 내용을 찾을 수 없습니다"

**원인:**
- 업로드한 문서에 해당 내용이 없음
- 질문이 너무 모호함

**해결:**
1. 더 구체적인 질문으로 재시도
2. 관련 문서를 추가 업로드
3. 키워드를 포함하여 질문

### 문제: 스트리밍이 느림

**원인:**
- 네트워크 연결 불안정
- OpenAI API 응답 지연

**해결:**
1. 네트워크 확인
2. GPT-4 대신 GPT-3.5 사용 (속도 우선)

---

## 🚀 다음 단계

### MVP 완료 후 추가 기능

1. **음성 입력** (Whisper API)
   - 마이크 버튼으로 음성 녹음
   - 자동으로 텍스트 변환

2. **대화 기록**
   - Firebase에 대화 저장
   - 과거 대화 불러오기

3. **워크플로 추천**
   - 자주 묻는 질문 패턴 분석
   - 자동화 워크플로 제안

4. **FAQ 자동 생성**
   - 반복 질문 감지
   - 관리자 승인 후 FAQ 등록

5. **팀 공유 기능**
   - 회사 계정으로 전환
   - 팀원 모두가 같은 문서 접근

---

## 📞 문의

질문이나 제안 사항이 있으시면:
- 이메일: support@workfree.market
- 디스코드: WorkFree 커뮤니티

---

**🎉 완성! 이제 매뉴얼 검색 스트레스에서 해방되세요!**

