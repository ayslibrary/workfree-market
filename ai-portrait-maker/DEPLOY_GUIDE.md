# 🚀 AI 화보 메이커 배포 가이드

## 📋 배포 체크리스트

### ✅ Phase 1: Google AI API Key 발급 (3분)

1. **Google AI Studio 접속**
   - URL: https://aistudio.google.com/app/apikey
   - Google 계정으로 로그인

2. **API Key 생성**
   ```
   1. "Get API key" 버튼 클릭
   2. "Create API key in new project" 선택
   3. API Key 복사 (예: AIzaSyC...)
   ```

3. **API Key 저장**
   - 안전한 곳에 복사해두기
   - 절대 GitHub에 올리지 말 것!

---

### ✅ Phase 2: 로컬 테스트 (5분)

#### 1. 환경 설정

```bash
# ai-portrait-maker 폴더로 이동
cd ai-portrait-maker

# Python 가상환경 생성 (선택사항)
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# 패키지 설치
pip install -r requirements.txt
```

#### 2. API Key 설정

**방법 1: 환경변수 (추천)**
```bash
# Windows PowerShell
$env:GOOGLE_API_KEY="your_api_key_here"

# Mac/Linux
export GOOGLE_API_KEY="your_api_key_here"
```

**방법 2: .streamlit/secrets.toml 파일 생성**
```bash
# ai-portrait-maker 폴더에서
mkdir .streamlit
echo 'GOOGLE_API_KEY = "your_api_key_here"' > .streamlit/secrets.toml
```

#### 3. 앱 실행

```bash
streamlit run app.py
```

브라우저에서 자동으로 열림 (http://localhost:8501)

#### 4. 테스트

1. 테스트 이미지 준비 (인물 사진)
2. 앱에서 업로드
3. 스타일 선택
4. "AI 화보 생성하기" 클릭
5. 결과 확인

---

### ✅ Phase 3: Streamlit Cloud 배포 (10분)

#### 1. Streamlit Cloud 가입

1. https://streamlit.io/cloud 접속
2. "Sign up" → GitHub 계정 연동
3. 이메일 인증

#### 2. 앱 배포

1. **"New app" 클릭**

2. **Repository 정보 입력**
   ```
   Repository: your-username/workfree-market
   Branch: main
   Main file path: ai-portrait-maker/app.py
   ```

3. **Advanced settings → Secrets 설정**
   ```toml
   GOOGLE_API_KEY = "your_api_key_here"
   ```

4. **"Deploy!" 클릭**

5. **배포 완료 대기 (2-3분)**
   - 배포 로그 확인
   - 에러 발생 시 로그 체크

#### 3. 배포된 URL 확인

배포 완료 후 URL 획득:
```
https://your-app-name.streamlit.app
```

---

### ✅ Phase 4: WorkFree Market 사이트 업데이트

배포된 Streamlit 앱 URL을 사이트에 업데이트:

#### 업데이트할 파일들:

1. **`src/app/gallery/page.tsx`**
   ```tsx
   // 기존
   href="https://ai-portrait-maker.streamlit.app"
   
   // 변경 (실제 배포 URL로)
   href="https://your-actual-url.streamlit.app"
   ```

2. **`src/app/kits/ai-portrait/page.tsx`**
   ```tsx
   // 동일하게 URL 업데이트
   ```

3. **Git 커밋 & 푸시**
   ```bash
   git add .
   git commit -m "chore: Update Streamlit app URL"
   git push origin main
   ```

---

## 🐛 트러블슈팅

### 문제 1: API Key 오류
```
❌ Error: Invalid API key
```
**해결방법:**
- API Key 재확인
- Streamlit Secrets에 올바르게 입력했는지 확인
- 따옴표 포함 여부 확인

### 문제 2: 이미지 업로드 실패
```
❌ Error: Image size too large
```
**해결방법:**
- 이미지 크기: 5MB 이하
- 해상도: 2048x2048 이하 권장

### 문제 3: Streamlit Cloud 배포 실패
```
❌ ModuleNotFoundError
```
**해결방법:**
- requirements.txt 확인
- 패키지 버전 호환성 체크

---

## 📊 배포 후 체크리스트

- [ ] 로컬에서 정상 작동 확인
- [ ] Streamlit Cloud 배포 완료
- [ ] 배포된 앱 URL 획득
- [ ] WorkFree Market 사이트 URL 업데이트
- [ ] 메인 페이지 → 갤러리 → Streamlit 앱 플로우 테스트
- [ ] 모바일에서 테스트
- [ ] 다양한 이미지로 테스트

---

## 🎯 최종 확인사항

### 사용자 플로우 테스트:
1. workfree-market.vercel.app 접속
2. "AI 화보 갤러리 보기" 클릭
3. "무료로 만들어보기" 클릭
4. Streamlit 앱으로 이동 확인
5. 이미지 업로드 → 스타일 선택 → 생성 테스트

### 성능 체크:
- [ ] 이미지 업로드 속도
- [ ] AI 생성 속도 (10-15초 이내)
- [ ] UI 반응성
- [ ] 모바일 최적화

---

## 📞 문의

문제 발생 시:
- GitHub Issues
- 이메일: contact@workfree.ai

---

## 🎉 배포 완료!

축하합니다! AI 화보 메이커가 성공적으로 배포되었습니다.

이제 사용자들이:
1. ✅ 무료로 AI 화보 생성 가능
2. ✅ 6가지 프리미엄 스타일 사용
3. ✅ 프롬프트 키트 구매 가능

**다음 단계:**
- 사용자 피드백 수집
- 새로운 스타일 추가
- 고급 기능 개발

