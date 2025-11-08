# 📊 Step 2: 벡터 테이블 생성

## 🎯 목표
Supabase에 RAG용 벡터 테이블과 검색 함수를 생성합니다.

---

## 📝 실행 방법

### 1️⃣ Supabase SQL Editor 열기

1. 브라우저에서 Supabase 대시보드 열기
2. 왼쪽 메뉴에서 **"SQL Editor"** 클릭 (⚡ 번개 아이콘)
3. **"New query"** 버튼 클릭

### 2️⃣ SQL 스크립트 복사

VS Code에서 `supabase/setup-vector-table.sql` 파일을 열고:
- **Ctrl + A** (전체 선택)
- **Ctrl + C** (복사)

### 3️⃣ SQL 실행

1. Supabase SQL Editor에 **붙여넣기** (Ctrl + V)
2. 오른쪽 하단 **"Run"** 버튼 클릭 (또는 Ctrl + Enter)
3. ⏱️ 5-10초 대기

### 4️⃣ 성공 확인

**"Success. No rows returned"** 메시지가 나오면 성공! ✅

---

## 🔍 생성되는 것들:

1. ✅ `workfree_knowledge` 테이블
2. ✅ 벡터 인덱스 (코사인 유사도)
3. ✅ 메타데이터 GIN 인덱스
4. ✅ Full-text search 인덱스
5. ✅ `hybrid_search()` 함수
6. ✅ RLS (Row Level Security) 설정

---

## ⚠️ 에러 발생 시:

### "extension vector does not exist"
→ Supabase 무료 플랜에서는 pgvector가 기본 제공됩니다.
→ 프로젝트가 완전히 생성되지 않았을 수 있습니다. 1-2분 후 재시도.

### "permission denied"
→ service_role 키를 사용하고 있는지 확인

---

## ✅ 완료 후:

테이블이 생성되었는지 확인:
1. 왼쪽 메뉴 **"Table Editor"** 클릭
2. `workfree_knowledge` 테이블이 보이면 성공!

**완료되면 알려주세요!** 
다음 단계(Knowledge base 작성)로 넘어가겠습니다.

