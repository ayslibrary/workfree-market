"""
WorkFree Image Finder API 테스트 스크립트
"""

import requests
import json

# API 기본 URL (로컬 테스트용)
BASE_URL = "http://localhost:8000"

def test_health():
    """헬스 체크 테스트"""
    print("\n🔍 헬스 체크 테스트...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    return response.ok

def test_search():
    """이미지 검색 테스트"""
    print("\n🔍 이미지 검색 테스트...")
    
    payload = {
        "keyword": "강아지",
        "count": 5,
        "sources": ["unsplash", "pexels"]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/search",
        json=payload
    )
    
    print(f"Status: {response.status_code}")
    
    if response.ok:
        data = response.json()
        print(f"검색 결과: {data['total']}장")
        print(f"검색어: {data['keyword']}")
        
        if data['images']:
            print("\n첫 번째 이미지 정보:")
            first_img = data['images'][0]
            print(f"  - 출처: {first_img['source']}")
            print(f"  - 작가: {first_img['author']}")
            print(f"  - 해상도: {first_img['width']}x{first_img['height']}")
            print(f"  - URL: {first_img['url'][:50]}...")
    else:
        print(f"오류: {response.text}")
    
    return response.ok

def test_download():
    """ZIP 다운로드 테스트"""
    print("\n📦 ZIP 다운로드 테스트...")
    
    payload = {
        "keyword": "자연",
        "count": 3,
        "sources": ["unsplash"]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/download",
        json=payload
    )
    
    print(f"Status: {response.status_code}")
    
    if response.ok:
        # ZIP 파일 저장
        filename = "test_download.zip"
        with open(filename, "wb") as f:
            f.write(response.content)
        print(f"✅ ZIP 파일 저장 완료: {filename}")
        print(f"   파일 크기: {len(response.content)} bytes")
    else:
        print(f"오류: {response.text}")
    
    return response.ok

if __name__ == "__main__":
    print("=" * 60)
    print("🐰 WorkFree Image Finder API 테스트")
    print("=" * 60)
    
    # 서버 연결 확인
    try:
        requests.get(BASE_URL, timeout=5)
        print("✅ API 서버 연결 성공")
    except:
        print("❌ API 서버에 연결할 수 없습니다.")
        print(f"   다음 명령어로 서버를 먼저 실행하세요:")
        print(f"   uvicorn app:app --reload")
        exit(1)
    
    # 테스트 실행
    results = {
        "헬스 체크": test_health(),
        "이미지 검색": test_search(),
        "ZIP 다운로드": test_download()
    }
    
    # 결과 요약
    print("\n" + "=" * 60)
    print("📊 테스트 결과 요약")
    print("=" * 60)
    for test_name, result in results.items():
        status = "✅ 성공" if result else "❌ 실패"
        print(f"{test_name}: {status}")
    
    all_passed = all(results.values())
    if all_passed:
        print("\n🎉 모든 테스트 통과!")
    else:
        print("\n⚠️ 일부 테스트 실패. API 키 설정을 확인하세요.")

