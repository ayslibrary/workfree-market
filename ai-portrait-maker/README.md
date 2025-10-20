# 🎨 AI 화보 메이커

Google Gemini Vision AI를 활용한 프로페셔널 AI 화보 생성기

![WorkFree Market](https://img.shields.io/badge/WorkFree-Market-purple)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Streamlit](https://img.shields.io/badge/Streamlit-1.29-red)

## ✨ 특징

- 🎨 **6가지 프리미엄 스타일**: Vogue, 비즈니스, 영화, 빈티지, 유화, 샤넬
- 🚀 **즉시 생성**: 5분 만에 프로페셔널 화보 컨셉 생성
- 💎 **고품질 AI 프롬프트**: 최적화된 프롬프트 자동 생성
- 🆓 **완전 무료**: Google Gemini API 무료 사용

## 🚀 빠른 시작

### 1. API Key 발급

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. "Get API Key" 클릭
3. API Key 복사

### 2. 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/ai-portrait-maker.git
cd ai-portrait-maker

# 패키지 설치
pip install -r requirements.txt

# 환경변수 설정
cp .env.example .env
# .env 파일에 API Key 입력
```

### 3. 실행

```bash
streamlit run app.py
```

브라우저에서 `http://localhost:8501` 접속

## 📸 사용법

1. **사진 업로드**: 인물 사진 업로드 (JPG, PNG)
2. **스타일 선택**: 원하는 화보 스타일 선택
3. **생성하기**: AI가 자동으로 프롬프트 생성
4. **활용하기**: 생성된 설명을 이미지 AI에 적용

## 🎨 지원 스타일

| 스타일 | 설명 |
|--------|------|
| 🎨 Vogue 매거진 | 고급스러운 패션 매거진 스타일 |
| 💼 비즈니스 프로필 | 전문적인 LinkedIn 프로필 |
| 🎬 영화 포스터 | 할리우드 영화 포스터 느낌 |
| 📸 빈티지 1950s | 레트로 빈티지 스타일 |
| 🎨 유화 초상화 | 클래식 유화 스타일 |
| 💎 샤넬 하이패션 | 샤넬 럭셔리 패션 |

## 🌐 배포 (Streamlit Cloud)

1. GitHub에 Push
2. [Streamlit Cloud](https://streamlit.io/cloud) 접속
3. "New app" → GitHub repo 선택
4. Secrets에 `GOOGLE_API_KEY` 추가
5. Deploy!

## 📚 더 알아보기

- [WorkFree Market](https://workfree-market.vercel.app)
- [AI 프롬프트 키트](https://workfree-market.vercel.app/automation/prompts)
- [화보 갤러리](https://workfree-market.vercel.app/gallery)

## 💡 문의

- 이메일: contact@workfree.ai
- 웹사이트: https://workfree-market.vercel.app

## 📄 라이선스

MIT License

---

Made with ❤️ by [WorkFree Market](https://workfree-market.vercel.app)

