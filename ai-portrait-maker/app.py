"""
AI 화보 메이커 - Gemini Vision 기반
WorkFree Market
"""

import streamlit as st
import google.generativeai as genai
from PIL import Image
import os
from io import BytesIO
import json

# 페이지 설정
st.set_page_config(
    page_title="AI 화보 메이커 | WorkFree Market",
    page_icon="🎨",
    layout="wide"
)

# CSS 스타일
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 15px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    .style-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        border: 2px solid #e2e8f0;
        margin: 1rem 0;
        transition: all 0.3s;
    }
    .style-card:hover {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }
</style>
""", unsafe_allow_html=True)

# API Key 설정
if 'GOOGLE_API_KEY' in st.secrets:
    GOOGLE_API_KEY = st.secrets['GOOGLE_API_KEY']
elif 'GOOGLE_API_KEY' in os.environ:
    GOOGLE_API_KEY = os.environ['GOOGLE_API_KEY']
else:
    GOOGLE_API_KEY = None

# 스타일 프롬프트 정의
STYLES = {
    "🎨 Vogue 매거진 커버": {
        "prompt": """Transform this portrait into an elegant Vogue magazine cover style:
- High-end fashion photography aesthetic
- Professional studio lighting with dramatic shadows
- Sophisticated and luxurious atmosphere
- Sharp focus with shallow depth of field
- Magazine cover quality
- Editorial fashion look
Describe the transformed image in detail.""",
        "description": "고급스러운 패션 매거진 스타일"
    },
    "💼 LinkedIn 비즈니스 프로필": {
        "prompt": """Transform this portrait into a professional LinkedIn business profile photo:
- Corporate and trustworthy appearance
- Clean and professional background
- Perfect business lighting
- Confident and approachable expression
- Professional attire
- High-quality headshot
Describe the transformed image in detail.""",
        "description": "전문적인 비즈니스 프로필"
    },
    "🎬 영화 포스터 스타일": {
        "prompt": """Transform this portrait into a cinematic movie poster style:
- Dramatic Hollywood movie poster aesthetic
- Cinematic color grading
- Epic and atmospheric lighting
- Film grain texture
- Theatrical and dramatic mood
- Blockbuster quality
Describe the transformed image in detail.""",
        "description": "할리우드 영화 포스터 느낌"
    },
    "📸 빈티지 1950s": {
        "prompt": """Transform this portrait into a 1950s vintage photograph style:
- Classic retro aesthetic
- Vintage color palette with warm tones
- Soft focus and film grain
- Nostalgic atmosphere
- Period-appropriate styling
- Analog photography look
Describe the transformed image in detail.""",
        "description": "레트로 빈티지 스타일"
    },
    "🎨 유화 초상화": {
        "prompt": """Transform this portrait into an oil painting portrait style:
- Classical oil painting technique
- Rich and vibrant colors
- Visible brush strokes
- Artistic and timeless quality
- Museum-worthy portrait
- Renaissance or Baroque inspiration
Describe the transformed image in detail.""",
        "description": "클래식 유화 스타일"
    },
    "💎 샤넬 하이패션": {
        "prompt": """Transform this portrait into a Chanel haute couture fashion style:
- Luxury Chanel brand aesthetic
- Parisian high fashion elegance
- Sophisticated and timeless
- Premium fashion photography
- Iconic luxury brand quality
- Elite fashion look
Describe the transformed image in detail.""",
        "description": "샤넬 럭셔리 패션"
    }
}

# 헤더
st.markdown("""
<div class="main-header">
    <h1>🎨 AI 화보 메이커</h1>
    <p>당신의 사진을 5분 만에 Vogue 커버로 만들어드립니다</p>
    <p style="font-size: 0.9em; opacity: 0.9;">Powered by Google Gemini Vision AI</p>
</div>
""", unsafe_allow_html=True)

# 메인 컨텐츠
col1, col2 = st.columns([1, 1])

with col1:
    st.markdown("### 📤 사진 업로드")
    uploaded_file = st.file_uploader(
        "기본 인물사진을 업로드하세요",
        type=['jpg', 'jpeg', 'png'],
        help="JPG, JPEG, PNG 형식 지원 (최대 5MB)"
    )
    
    if uploaded_file:
        image = Image.open(uploaded_file)
        st.image(image, caption="업로드한 원본 사진", use_container_width=True)
        
        # 이미지 정보
        st.info(f"""
        📊 이미지 정보
        - 크기: {image.size[0]} x {image.size[1]} px
        - 포맷: {image.format}
        - 파일명: {uploaded_file.name}
        """)

with col2:
    st.markdown("### 🎨 스타일 선택")
    
    if uploaded_file:
        selected_style = st.selectbox(
            "원하는 스타일을 선택하세요",
            options=list(STYLES.keys()),
            help="각 스타일은 AI가 자동으로 최적화된 프롬프트를 생성합니다"
        )
        
        st.info(f"💡 {STYLES[selected_style]['description']}")
        
        # 생성 버튼
        if st.button("✨ AI 화보 생성하기", type="primary", use_container_width=True):
            if not GOOGLE_API_KEY:
                st.error("⚠️ Google API Key가 설정되지 않았습니다. 환경변수 또는 Secrets에 설정해주세요.")
            else:
                with st.spinner("🎨 AI가 당신의 화보를 만들고 있습니다..."):
                    try:
                        # Gemini API 설정
                        genai.configure(api_key=GOOGLE_API_KEY)
                        model = genai.GenerativeModel('gemini-1.5-flash')
                        
                        # 프롬프트 생성
                        prompt = STYLES[selected_style]['prompt']
                        
                        # AI 생성
                        response = model.generate_content([prompt, image])
                        
                        # 결과 표시
                        st.success("✅ AI 화보 생성 완료!")
                        st.markdown("### 🎨 생성된 화보 컨셉")
                        st.markdown(response.text)
                        
                        # 프롬프트 표시 (접기)
                        with st.expander("📝 사용된 AI 프롬프트 보기"):
                            st.code(prompt, language="text")
                        
                        # 다운로드 안내
                        st.info("""
                        💡 **이 결과를 활용하는 방법:**
                        1. 위 설명을 Midjourney, DALL-E 등의 이미지 생성 AI에 입력
                        2. 원본 사진을 참고 이미지로 함께 업로드
                        3. 고품질 AI 화보 완성!
                        
                        📚 더 자세한 가이드가 필요하신가요?
                        → [프롬프트 키트 다운로드](https://workfree-market.vercel.app/kits/ai-portrait)
                        """)
                        
                    except Exception as e:
                        st.error(f"❌ 오류가 발생했습니다: {str(e)}")
                        st.info("API Key를 확인하거나 이미지를 다시 업로드해보세요.")
    else:
        st.info("👈 왼쪽에서 사진을 먼저 업로드해주세요!")

# 하단 정보
st.markdown("---")
st.markdown("### 💡 사용 가이드")

guide_col1, guide_col2, guide_col3 = st.columns(3)

with guide_col1:
    st.markdown("""
    #### 1️⃣ 사진 준비
    - 정면 또는 측면 인물 사진
    - 해상도: 최소 512x512px
    - 얼굴이 잘 보이는 사진
    """)

with guide_col2:
    st.markdown("""
    #### 2️⃣ 스타일 선택
    - 6가지 프리미엄 스타일
    - Vogue, 비즈니스, 영화 등
    - 각 스타일별 최적화된 AI
    """)

with guide_col3:
    st.markdown("""
    #### 3️⃣ 결과 활용
    - AI 설명 받기
    - 이미지 생성 AI에 적용
    - 고품질 화보 완성
    """)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; padding: 2rem;">
    <p>🚀 <strong>WorkFree Market</strong> - AI 자동화 키트 거래소</p>
    <p>더 많은 AI 프롬프트가 필요하신가요? 
    <a href="https://workfree-market.vercel.app/automation/prompts" target="_blank">프롬프트 키트 둘러보기 →</a></p>
</div>
""", unsafe_allow_html=True)

# 사이드바 - 정보
with st.sidebar:
    st.markdown("### ℹ️ 정보")
    st.markdown("""
    **AI 화보 메이커**는 Google Gemini Vision AI를 활용하여 
    당신의 사진을 프로페셔널한 화보 스타일로 변환합니다.
    
    #### 🎯 특징
    - ✅ 무료 사용
    - ✅ 6가지 프리미엄 스타일
    - ✅ 즉시 생성
    - ✅ 고품질 AI 프롬프트
    
    #### 📚 리소스
    - [사용 가이드](https://workfree-market.vercel.app)
    - [프롬프트 키트](https://workfree-market.vercel.app/automation/prompts)
    - [갤러리](https://workfree-market.vercel.app/gallery)
    """)
    
    st.markdown("---")
    st.markdown("💬 **문의**: contact@workfree.ai")

