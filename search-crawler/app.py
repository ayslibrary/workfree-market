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
from io import StringIO
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

app = FastAPI(
    title="WorkFree Search Crawler API",
    description="검색어 자동 검색 & 메일 발송 API",
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
GMAIL_USER = os.getenv("GMAIL_USER", "")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")

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
        "service": "WorkFree Search Crawler API",
        "version": "1.0.0",
        "status": "running",
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
    """구글 검색 크롤링"""
    results = []
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        url = f"https://www.google.com/search?q={keyword}&num={max_results}"
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 구글 검색 결과 파싱
        search_results = soup.find_all('div', class_='g')
        
        for idx, result in enumerate(search_results[:max_results], 1):
            try:
                title_elem = result.find('h3')
                link_elem = result.find('a')
                desc_elem = result.find('div', class_=['VwiC3b', 'yXK7lf'])
                
                if title_elem and link_elem:
                    title = title_elem.get_text()
                    url = link_elem.get('href', '')
                    description = desc_elem.get_text() if desc_elem else ""
                    
                    results.append({
                        'title': title,
                        'url': url,
                        'description': description[:200],
                        'rank': idx,
                        'engine': 'google'
                    })
            except Exception as e:
                print(f"Error parsing Google result: {e}")
                continue
                
    except Exception as e:
        print(f"Google search error: {e}")
    
    return results

def search_naver(keyword: str, max_results: int = 10) -> List[dict]:
    """네이버 검색 크롤링"""
    results = []
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        url = f"https://search.naver.com/search.naver?query={keyword}&where=web&sm=top_hty&fbm=0&ie=utf8"
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 네이버 검색 결과 파싱
        search_results = soup.find_all('div', class_='total_wrap')
        
        for idx, result in enumerate(search_results[:max_results], 1):
            try:
                title_elem = result.find('a', class_='link_tit')
                desc_elem = result.find('div', class_='total_dsc')
                
                if title_elem:
                    title = title_elem.get_text().strip()
                    url = title_elem.get('href', '')
                    description = desc_elem.get_text().strip() if desc_elem else ""
                    
                    results.append({
                        'title': title,
                        'url': url,
                        'description': description[:200],
                        'rank': idx,
                        'engine': 'naver'
                    })
            except Exception as e:
                print(f"Error parsing Naver result: {e}")
                continue
                
    except Exception as e:
        print(f"Naver search error: {e}")
    
    return results

def create_csv(results: List[dict]) -> str:
    """검색 결과를 CSV로 변환"""
    output = StringIO()
    fieldnames = ['순위', '검색엔진', '제목', 'URL', '설명']
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    
    writer.writeheader()
    for r in results:
        writer.writerow({
            '순위': r['rank'],
            '검색엔진': r['engine'].upper(),
            '제목': r['title'],
            'URL': r['url'],
            '설명': r['description']
        })
    
    return output.getvalue()

def send_email(recipient: str, keyword: str, csv_content: str, results_count: int):
    """이메일 발송"""
    if not GMAIL_USER or not GMAIL_APP_PASSWORD:
        raise Exception("Gmail 설정이 없습니다")
    
    # 이메일 구성
    msg = MIMEMultipart()
    msg['From'] = GMAIL_USER
    msg['To'] = recipient
    msg['Subject'] = f"[WorkFree] '{keyword}' 검색 결과 ({results_count}개)"
    
    # 본문
    body = f"""
    안녕하세요, WorkFree입니다.
    
    '{keyword}' 검색어에 대한 자동 검색 결과를 보내드립니다.
    
    📊 검색 결과: {results_count}개
    📅 검색 일시: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    
    첨부된 CSV 파일을 확인해주세요.
    
    감사합니다.
    WorkFree Team
    """
    
    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    
    # CSV 첨부
    attachment = MIMEBase('application', 'octet-stream')
    attachment.set_payload(csv_content.encode('utf-8-sig'))
    encoders.encode_base64(attachment)
    filename = f"search_results_{keyword}_{datetime.now().strftime('%Y%m%d')}.csv"
    attachment.add_header('Content-Disposition', f'attachment; filename={filename}')
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
        
        # CSV 생성
        csv_content = create_csv(all_results)
        
        # 이메일 발송
        send_email(request.recipient_email, request.keyword, csv_content, len(all_results))
        
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

