"""
Google Gemini API 테스트 스크립트
실행: python test_api.py
"""

import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

print("=" * 50)
print("🔍 Google Gemini API 테스트")
print("=" * 50)
print()

# API Key 확인
if not GOOGLE_API_KEY:
    print("❌ GOOGLE_API_KEY가 설정되지 않았습니다!")
    print()
    print("설정 방법:")
    print("1. .env 파일 생성")
    print("2. GOOGLE_API_KEY=your_key_here 추가")
    print()
    print("또는")
    print()
    print("환경변수로 설정:")
    print("  Windows: $env:GOOGLE_API_KEY=\"your_key_here\"")
    print("  Mac/Linux: export GOOGLE_API_KEY=\"your_key_here\"")
    exit(1)

print(f"✅ API Key 발견: {GOOGLE_API_KEY[:10]}...")
print()

# Gemini 라이브러리 설치 확인
try:
    import google.generativeai as genai
    print("✅ google-generativeai 패키지 설치됨")
except ImportError:
    print("❌ google-generativeai 패키지가 설치되지 않았습니다!")
    print("설치: pip install google-generativeai")
    exit(1)

# API 연결 테스트
try:
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    print("🔄 API 연결 테스트 중...")
    response = model.generate_content("Hello! This is a test.")
    
    print("✅ API 연결 성공!")
    print()
    print("응답:", response.text[:100] + "...")
    print()
    print("=" * 50)
    print("🎉 모든 테스트 통과!")
    print("=" * 50)
    print()
    print("다음 단계:")
    print("  streamlit run app.py")
    
except Exception as e:
    print(f"❌ API 연결 실패: {str(e)}")
    print()
    print("해결 방법:")
    print("1. API Key가 올바른지 확인")
    print("2. https://aistudio.google.com/app/apikey 에서 새 키 발급")
    exit(1)

