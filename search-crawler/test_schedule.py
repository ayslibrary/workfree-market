"""
스케줄러 테스트 스크립트
"""
import requests
import json
from datetime import datetime

API_URL = "http://localhost:8000"

def test_health():
    """헬스 체크"""
    print("\n🏥 헬스 체크...")
    response = requests.get(f"{API_URL}/health")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))

def test_create_schedule():
    """스케줄 생성 테스트"""
    print("\n📅 스케줄 생성...")
    
    data = {
        "user_id": "test_user_123",
        "email": "your-email@example.com",  # 실제 이메일로 변경
        "keywords": ["AI 투자", "스타트업"],
        "time": "09:00",
        "weekdays": [0, 1, 2, 3, 4],  # 월-금
        "max_results": 5,
        "engines": ["naver"]
    }
    
    response = requests.post(f"{API_URL}/api/schedule", json=data)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))

def test_get_schedule():
    """스케줄 조회 테스트"""
    print("\n🔍 스케줄 조회...")
    
    user_id = "test_user_123"
    response = requests.get(f"{API_URL}/api/schedule/{user_id}")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    else:
        print(response.json())

def test_list_schedules():
    """모든 스케줄 조회"""
    print("\n📋 모든 스케줄 조회...")
    
    response = requests.get(f"{API_URL}/api/schedules")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))

def test_delete_schedule():
    """스케줄 삭제 테스트"""
    print("\n🗑️ 스케줄 삭제...")
    
    user_id = "test_user_123"
    response = requests.delete(f"{API_URL}/api/schedule/{user_id}")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))

def test_instant_email():
    """즉시 이메일 발송 테스트"""
    print("\n📧 즉시 이메일 발송...")
    
    data = {
        "keyword": "워크프리",
        "recipient_email": "your-email@example.com",  # 실제 이메일로 변경
        "engines": ["naver"],
        "max_results": 5
    }
    
    response = requests.post(f"{API_URL}/api/email", json=data)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))

if __name__ == "__main__":
    print("="*60)
    print("🧪 WorkFree 뉴스 크롤링 스케줄러 테스트")
    print("="*60)
    
    try:
        # 1. 헬스 체크
        test_health()
        
        # 2. 스케줄 생성
        test_create_schedule()
        
        # 3. 스케줄 조회
        test_get_schedule()
        
        # 4. 모든 스케줄 조회
        test_list_schedules()
        
        # 5. 즉시 이메일 발송 (선택사항)
        # test_instant_email()
        
        # 6. 스케줄 삭제 (필요시)
        # test_delete_schedule()
        
        print("\n" + "="*60)
        print("✅ 테스트 완료!")
        print("="*60)
        
    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")

