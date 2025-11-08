# 📊 Step 3: Analytics 테이블 생성

## 🎯 Supabase SQL Editor에서 실행

### 1️⃣ Supabase 대시보드 접속
- https://supabase.com/dashboard
- workfree-market 프로젝트 클릭

### 2️⃣ SQL Editor 열기
- 왼쪽 메뉴 **"SQL Editor"** 클릭
- **"New query"** 클릭

### 3️⃣ SQL 복사 & 실행

VS Code에서 `supabase/create-analytics-tables.sql` 파일을 열고:
- **Ctrl + A** (전체 선택)
- **Ctrl + C** (복사)
- Supabase에 붙여넣기
- **Run** 클릭 ▶️

---

## ✅ 생성되는 것:

### 테이블 3개:
1. `chat_logs` - 챗봇 대화 로그
2. `search_results` - 검색 결과 상세
3. `user_feedback` - 피드백

### 뷰 3개:
1. `popular_questions` - 인기 질문 Top 10
2. `low_similarity_searches` - 검색 실패 키워드
3. `feedback_stats` - 피드백 통계

---

## 🧪 실행 후 확인:

### 1. Table Editor에서 확인
- 왼쪽 메뉴 **"Table Editor"** 클릭
- `chat_logs`, `search_results`, `user_feedback` 테이블 확인

### 2. 데이터가 쌓이는지 확인
- WorkFree 챗봇 사용 후
- Table Editor → chat_logs에 데이터 생김!

---

## 📈 관리자 대시보드 접속:

테이블 생성 후:
```
http://localhost:3000/admin/analytics
```

실시간 통계 확인 가능!

---

**SQL 실행 완료 후 "완료"라고 알려주세요!** 🚀

