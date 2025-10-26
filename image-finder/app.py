"""
WorkFree Image Finder API - Step 2.1
Unsplash API 연동 추가
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import requests
import os
from typing import List, Optional
from dotenv import load_dotenv
import zipfile
from io import BytesIO
from datetime import datetime

# .env 파일 로드 (일단 주석 처리)
# load_dotenv()

app = FastAPI(
    title="WorkFree Image Finder API",
    description="합법적 이미지 검색 API",
    version="1.0.0"
)

# 테스트용: API 키 직접 입력
UNSPLASH_ACCESS_KEY = "tYJaN2hzn_j1UEZCH5vd2YfayTwShagHAnmfiyqtYb0"

# 디버그 출력
print("=" * 60)
print(f"🔍 DEBUG: UNSPLASH_ACCESS_KEY = '{UNSPLASH_ACCESS_KEY}'")
print(f"🔍 DEBUG: API Key Length = {len(UNSPLASH_ACCESS_KEY)}")
print(f"🔍 DEBUG: Is Configured = {bool(UNSPLASH_ACCESS_KEY)}")
print("=" * 60)


class ImageSearchRequest(BaseModel):
    """이미지 검색 요청"""
    keyword: str
    count: int = 10


class ImageResult(BaseModel):
    """이미지 결과"""
    id: str
    url: str
    thumbnail_url: str
    author: str
    author_url: str
    source: str
    license: str


class SearchResponse(BaseModel):
    """검색 응답"""
    total: int
    images: List[ImageResult]
    keyword: str


@app.get("/")
def root():
    """API 루트 - 기본 정보 반환"""
    return {
        "message": "WorkFree Image Finder API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    """헬스 체크 엔드포인트"""
    return {
        "status": "healthy",
        "message": "API is running properly",
        "unsplash_api_configured": bool(UNSPLASH_ACCESS_KEY)
    }


@app.post("/api/search", response_model=SearchResponse)
def search_images(request: ImageSearchRequest):
    """
    이미지 검색 API (Unsplash만)
    
    - keyword: 검색어
    - count: 가져올 이미지 개수 (기본 10장)
    """
    
    # API 키 체크
    if not UNSPLASH_ACCESS_KEY:
        raise HTTPException(
            status_code=500,
            detail="Unsplash API 키가 설정되지 않았습니다. .env 파일을 확인하세요."
        )
    
    results = []
    
    try:
        # Unsplash API 호출
        response = requests.get(
            "https://api.unsplash.com/search/photos",
            params={
                "query": request.keyword,
                "per_page": min(request.count, 30),
                "client_id": UNSPLASH_ACCESS_KEY
            },
            timeout=10
        )
        
        if response.ok:
            data = response.json()
            for photo in data.get("results", []):
                results.append(ImageResult(
                    id=f"unsplash_{photo['id']}",
                    url=photo["urls"]["regular"],
                    thumbnail_url=photo["urls"]["thumb"],
                    author=photo["user"]["name"],
                    author_url=photo["user"]["links"]["html"],
                    source="Unsplash",
                    license="Unsplash License (무료, 상업적 이용 가능)"
                ))
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Unsplash API 오류: {response.text}"
            )
    
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"API 호출 오류: {str(e)}"
        )
    
    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"'{request.keyword}' 검색 결과가 없습니다."
        )
    
    return SearchResponse(
        total=len(results),
        images=results,
        keyword=request.keyword
    )


@app.post("/api/download")
def download_images(request: ImageSearchRequest):
    """
    이미지 ZIP 파일 다운로드 API
    
    검색 결과를 ZIP 파일로 압축하여 반환
    크레딧 정보가 포함된 credits.txt 파일도 함께 제공
    """
    
    print(f"📦 ZIP 다운로드 요청: keyword={request.keyword}, count={request.count}")
    
    # API 키 체크
    if not UNSPLASH_ACCESS_KEY:
        print("❌ API 키 없음!")
        raise HTTPException(
            status_code=500,
            detail="Unsplash API 키가 설정되지 않았습니다."
        )
    
    # 먼저 이미지 검색
    results = []
    try:
        print(f"🔍 Unsplash API 호출 중...")
        response = requests.get(
            "https://api.unsplash.com/search/photos",
            params={
                "query": request.keyword,
                "per_page": min(request.count, 30),
                "client_id": UNSPLASH_ACCESS_KEY
            },
            timeout=10
        )
        print(f"✅ Unsplash API 응답: {response.status_code}")
        
        if response.ok:
            data = response.json()
            for photo in data.get("results", []):
                results.append({
                    "id": f"unsplash_{photo['id']}",
                    "url": photo["urls"]["regular"],
                    "download_url": photo["urls"]["full"],
                    "author": photo["user"]["name"],
                    "author_url": photo["user"]["links"]["html"],
                    "source": "Unsplash",
                    "license": "Unsplash License (무료, 상업적 이용 가능)"
                })
        print(f"📸 검색된 이미지: {len(results)}장")
    except Exception as e:
        print(f"❌ 검색 오류: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"이미지 검색 오류: {str(e)}"
        )
    
    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"'{request.keyword}' 검색 결과가 없습니다."
        )
    
    # ZIP 파일 생성
    print(f"📦 ZIP 파일 생성 시작...")
    zip_buffer = BytesIO()
    
    try:
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            print(f"🔄 이미지 다운로드 시작...")
            credits = []
            
            for i, img in enumerate(results):
                try:
                    # 이미지 다운로드
                    print(f"  ⬇️  이미지 {i+1}/{len(results)} 다운로드 중...")
                    img_response = requests.get(img["download_url"], timeout=30)
                    if img_response.ok:
                        # 이미지 저장
                        img_name = f"{request.keyword}_{i+1:03d}.jpg"
                        zip_file.writestr(f"images/{img_name}", img_response.content)
                        
                        # 크레딧 정보 수집
                        credits.append(
                            f"📷 {img_name}\n"
                            f"   작가: {img['author']}\n"
                            f"   출처: {img['source']}\n"
                            f"   URL: {img['author_url']}\n"
                            f"   라이선스: {img['license']}\n"
                        )
                except Exception as e:
                    print(f"이미지 다운로드 실패 ({img['id']}): {str(e)}")
                    continue
            
            # 크레딧 파일 생성
            credits_header = f"""
🐰 WorkFree Image Finder - 이미지 출처 및 크레딧
{'='*60}

검색어: {request.keyword}
다운로드 일시: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
총 이미지 수: {len(results)}장

{'='*60}

📸 이미지 상세 정보:

"""
            credits_text = credits_header + "\n".join(credits)
            credits_text += f"""
{'='*60}

⚖️ 라이선스 안내:
- Unsplash: 무료, 상업적 이용 가능, 크레딧 권장 (필수 아님)

🔗 더 자세한 정보:
- Unsplash: https://unsplash.com/license

© 2025 WorkFree - 퇴근에 날개를 달다
"""
            zip_file.writestr("credits.txt", credits_text.encode("utf-8"))
        
        print(f"✅ ZIP 파일 생성 완료!")
    
    except Exception as e:
        print(f"❌ ZIP 생성 오류: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"ZIP 파일 생성 오류: {str(e)}"
        )
    
    zip_buffer.seek(0)
    
    # 파일명 생성
    safe_keyword = "".join(c for c in request.keyword if c.isalnum() or c in (' ', '-', '_')).strip()
    filename = f"workfree_{safe_keyword}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"
    
    print(f"🎉 ZIP 다운로드 준비 완료: {filename} ({zip_buffer.getbuffer().nbytes} bytes)")
    
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )
