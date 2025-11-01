"""
Search Crawler API 테스트 스크립트
"""

import requests
import json

# API URL (로컬)
BASE_URL = "http://localhost:8000"

# Railway 배포 URL (배포 후 변경)
# BASE_URL = "https://your-app.railway.app"

def test_health():
    """헬스 체크"""
    print("\n🏥 헬스 체크 테스트...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_search():
    """검색 테스트"""
    print("\n🔍 검색 테스트...")
    payload = {
        "keyword": "워크프리",
        "engines": ["google", "naver"],
        "max_results": 5
    }
    response = requests.post(f"{BASE_URL}/api/search", json=payload)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"총 결과: {result['total_results']}개")
    print(f"\n처음 3개 결과:")
    for r in result['results'][:3]:
        print(f"  [{r['engine'].upper()}] {r['title']}")
        print(f"  -> {r['url']}\n")

def test_email():
    """이메일 발송 테스트"""
    print("\n📧 이메일 발송 테스트...")
    recipient = input("수신 이메일 주소: ")
    
    payload = {
        "keyword": "워크프리 테스트",
        "recipient_email": recipient,
        "engines": ["google"],
        "max_results": 5
    }
    
    response = requests.post(f"{BASE_URL}/api/email", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 WorkFree Search Crawler API 테스트")
    print("=" * 60)
    
    try:
        # 1. 헬스 체크
        test_health()
        
        # 2. 검색 테스트
        test_search()
        
        # 3. 이메일 테스트 (선택)
        email_test = input("\n이메일 발송 테스트를 하시겠습니까? (y/n): ")
        if email_test.lower() == 'y':
            test_email()
        
        print("\n✅ 모든 테스트 완료!")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ 서버에 연결할 수 없습니다.")
        print("서버가 실행 중인지 확인하세요: python app.py")
    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")

