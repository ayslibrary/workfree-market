# 🚀 Supabase RAG 설정 가이드

## ✅ Step 1 완료: 패키지 설치
- `@supabase/supabase-js` 설치 완료

---

## 📝 Step 2: 환경변수 설정

### 1. `.env.local` 파일 수정

프로젝트 루트의 `.env.local` 파일을 열고 아래 내용을 **추가**하세요:

```bash
# Supabase RAG 설정
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# 기존 OpenAI 키는 그대로 유지
# OPENAI_API_KEY=이미_있을_것
```

### 2. 값 채우기

Supabase 대시보드(https://supabase.com/dashboard)에서:

1. **Settings** → **API** 클릭
2. 아래 값들을 복사해서 위 파일에 붙여넣기:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_KEY`

---

## ⚠️ 중요 사항

- **`service_role` 키는 절대 GitHub에 커밋하지 마세요!**
- `.env.local`은 이미 `.gitignore`에 포함되어 있습니다.

---

## 🧪 다음 단계

환경변수 설정이 완료되면 알려주세요!
테스트 연결 스크립트를 실행하겠습니다.

