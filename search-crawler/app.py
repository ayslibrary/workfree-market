"""
WorkFree Search Crawler API
구글/네이버 검색 자동화 & 이메일 발송
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import requests
from bs4 import BeautifulSoup
import csv
from io import StringIO, BytesIO
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from dotenv import load_dotenv
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

# .env 파일 로드
load_dotenv()

app = FastAPI(
    title="WorkFree 뉴스 크롤링 API",
    description="검색어 기반 뉴스 자동 크롤링 & 메일 발송 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://workfreemarket.com",
        "https://*.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 환경 변수
GMAIL_USER = os.getenv("GMAIL_USER", "ayoung1034@gmail.com")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "jpbxhzbbcehrheyt")

# Google Custom Search API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
GOOGLE_SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID", "")

# Naver Search API
NAVER_CLIENT_ID = os.getenv("NAVER_CLIENT_ID", "9TwaneM1ZKXAWzXY_AMp")
NAVER_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET", "GLKgCQiy96")

# Request Models
class SearchRequest(BaseModel):
    keyword: str
    engines: List[str] = ["google", "naver"]  # google, naver
    max_results: int = 10

class EmailRequest(BaseModel):
    keyword: str
    recipient_email: EmailStr
    engines: List[str] = ["google", "naver"]
    max_results: int = 10

# Response Models
class SearchResult(BaseModel):
    title: str
    url: str
    description: Optional[str] = None
    rank: int
    engine: str

@app.get("/")
async def root():
    return {
        "service": "WorkFree 뉴스 크롤링 API",
        "version": "1.0.0",
        "status": "running",
        "description": "검색어 기반 뉴스 자동 크롤링",
        "endpoints": {
            "search": "/api/search",
            "email": "/api/email",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "gmail_configured": bool(GMAIL_USER and GMAIL_APP_PASSWORD),
        "timestamp": datetime.now().isoformat()
    }

def search_google(keyword: str, max_results: int = 10) -> List[dict]:
    """구글 검색 - Custom Search API 사용"""
    results = []
    
    if not GOOGLE_API_KEY or not GOOGLE_SEARCH_ENGINE_ID:
        print("Google API 키가 설정되지 않았습니다. 데모 데이터를 반환합니다.")
        # 데모 데이터 반환
        for i in range(min(max_results, 5)):
            results.append({
                'title': f'[데모] {keyword} 관련 결과 {i+1}',
                'url': f'https://example.com/result-{i+1}',
                'description': f'{keyword}에 대한 검색 결과입니다. Google API 키를 설정하면 실제 검색 결과를 받을 수 있습니다.',
                'rank': i + 1,
                'engine': 'google'
            })
        return results
    
    try:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            'key': GOOGLE_API_KEY,
            'cx': GOOGLE_SEARCH_ENGINE_ID,
            'q': keyword,
            'num': min(max_results, 10),  # API 제한: 최대 10개
            'hl': 'ko'
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'items' in data:
            for idx, item in enumerate(data['items'], 1):
                results.append({
                    'title': item.get('title', ''),
                    'url': item.get('link', ''),
                    'description': item.get('snippet', '')[:200],
                    'rank': idx,
                    'engine': 'google'
                })
        
        print(f"Google API: {len(results)} 결과 반환")
                
    except Exception as e:
        print(f"Google API error: {e}")
    
    return results

def search_naver(keyword: str, max_results: int = 10) -> List[dict]:
    """네이버 뉴스 검색 - Naver News API 사용"""
    results = []
    
    print(f"[DEBUG] NAVER_CLIENT_ID: {NAVER_CLIENT_ID[:10] if NAVER_CLIENT_ID else 'NOT SET'}...")
    print(f"[DEBUG] NAVER_CLIENT_SECRET: {'SET' if NAVER_CLIENT_SECRET else 'NOT SET'}")
    
    if not NAVER_CLIENT_ID or not NAVER_CLIENT_SECRET:
        print("Naver API 키가 설정되지 않았습니다. 데모 데이터를 반환합니다.")
        # 데모 데이터 반환
        for i in range(min(max_results, 5)):
            results.append({
                'title': f'[데모] {keyword} 관련 뉴스 {i+1}',
                'url': f'https://example.com/naver-news-{i+1}',
                'description': f'{keyword}에 대한 최신 뉴스입니다. Naver API 키를 설정하면 실제 뉴스 결과를 받을 수 있습니다.',
                'rank': i + 1,
                'engine': 'naver'
            })
        return results
    
    try:
        url = "https://openapi.naver.com/v1/search/news.json"
        headers = {
            'X-Naver-Client-Id': NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
        }
        params = {
            'query': keyword,
            'display': min(max_results, 100),  # API 제한: 최대 100개
            'sort': 'date'  # date (최신순) or sim (관련도순)
        }
        
        print(f"[DEBUG] Naver API 요청 URL: {url}")
        print(f"[DEBUG] Naver API 요청 params: {params}")
        
        response = requests.get(url, headers=headers, params=params, timeout=10)
        print(f"[DEBUG] Naver API 응답 상태: {response.status_code}")
        
        response.raise_for_status()
        data = response.json()
        
        print(f"[DEBUG] Naver API 응답 데이터 키: {data.keys()}")
        
        if 'items' in data:
            for idx, item in enumerate(data['items'], 1):
                # HTML 태그 제거
                title = item.get('title', '').replace('<b>', '').replace('</b>', '')
                description = item.get('description', '').replace('<b>', '').replace('</b>', '')
                
                results.append({
                    'title': title,
                    'url': item.get('link', ''),
                    'description': description[:200],
                    'rank': idx,
                    'engine': 'naver'
                })
        
        print(f"Naver API: {len(results)} 결과 반환")
                
    except Exception as e:
        print(f"[ERROR] Naver API error: {e}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
    
    return results

def create_excel(results: List[dict]) -> bytes:
    """검색 결과를 Excel로 변환"""
    wb = Workbook()
    ws = wb.active
    ws.title = "뉴스 검색 결과"
    
    # 헤더 스타일
    header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF", size=12)
    header_alignment = Alignment(horizontal="center", vertical="center")
    
    # 헤더 작성
    headers = ['순위', '검색엔진', '제목', 'URL', '설명']
    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num, value=header)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = header_alignment
    
    # 데이터 작성
    for row_num, r in enumerate(results, 2):
        ws.cell(row=row_num, column=1, value=r['rank'])
        ws.cell(row=row_num, column=2, value=r['engine'].upper())
        ws.cell(row=row_num, column=3, value=r['title'])
        ws.cell(row=row_num, column=4, value=r['url'])
        ws.cell(row=row_num, column=5, value=r['description'])
    
    # 열 너비 조정
    ws.column_dimensions['A'].width = 8
    ws.column_dimensions['B'].width = 12
    ws.column_dimensions['C'].width = 50
    ws.column_dimensions['D'].width = 60
    ws.column_dimensions['E'].width = 80
    
    # BytesIO로 저장
    output = BytesIO()
    wb.save(output)
    output.seek(0)
    
    return output.getvalue()

def send_email(recipient: str, keyword: str, excel_content: bytes, results_count: int):
    """이메일 발송"""
    if not GMAIL_USER or not GMAIL_APP_PASSWORD:
        raise Exception("Gmail 설정이 없습니다")
    
    # 이메일 구성
    msg = MIMEMultipart()
    msg['From'] = GMAIL_USER
    msg['To'] = recipient
    msg['Subject'] = f"[WorkFree] '{keyword}' 뉴스 검색 결과 ({results_count}개)"
    
    # 본문
    body = f"""
안녕하세요, WorkFree입니다.

'{keyword}' 검색어에 대한 최신 뉴스 검색 결과를 보내드립니다.

📰 검색 결과: {results_count}개
📅 검색 일시: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
🔍 검색 엔진: 네이버 뉴스

첨부된 Excel 파일을 확인해주세요.

감사합니다.
WorkFree Team
    """
    
    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    
    # Excel 첨부
    attachment = MIMEBase('application', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    attachment.set_payload(excel_content)
    encoders.encode_base64(attachment)
    
    # 파일명 생성 (한글 지원)
    from email.utils import encode_rfc2231
    date_str = datetime.now().strftime('%Y%m%d_%H%M')
    filename = f"WorkFree_뉴스검색_{keyword}_{date_str}.xlsx"
    
    # RFC 2231 인코딩으로 한글 파일명 지원
    encoded_filename = encode_rfc2231(filename, charset='utf-8')
    attachment.add_header('Content-Disposition', 'attachment', filename=encoded_filename)
    msg.attach(attachment)
    
    # 발송
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        server.send_message(msg)

@app.post("/api/search")
async def search(request: SearchRequest):
    """검색 실행"""
    all_results = []
    
    if "google" in request.engines:
        google_results = search_google(request.keyword, request.max_results)
        all_results.extend(google_results)
    
    if "naver" in request.engines:
        naver_results = search_naver(request.keyword, request.max_results)
        all_results.extend(naver_results)
    
    if not all_results:
        raise HTTPException(status_code=404, detail="검색 결과를 찾을 수 없습니다")
    
    return {
        "keyword": request.keyword,
        "total_results": len(all_results),
        "results": all_results,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/email")
async def search_and_email(request: EmailRequest):
    """검색 후 이메일 발송"""
    try:
        # 검색 실행
        all_results = []
        
        if "google" in request.engines:
            google_results = search_google(request.keyword, request.max_results)
            all_results.extend(google_results)
        
        if "naver" in request.engines:
            naver_results = search_naver(request.keyword, request.max_results)
            all_results.extend(naver_results)
        
        if not all_results:
            raise HTTPException(status_code=404, detail="검색 결과를 찾을 수 없습니다")
        
        # Excel 생성
        excel_content = create_excel(all_results)
        
        # 이메일 발송
        send_email(request.recipient_email, request.keyword, excel_content, len(all_results))
        
        return {
            "success": True,
            "message": "이메일 발송 완료",
            "keyword": request.keyword,
            "recipient": request.recipient_email,
            "results_count": len(all_results),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"오류 발생: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

