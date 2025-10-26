# 🚀 개발 서버 실행 가이드

## 방법 1: 터미널 2개로 실행 (권장)

### 터미널 1 - Python 백엔드

```powershell
# 1. image-finder 폴더로 이동
cd C:\cursor_ws\homepage.app\image-finder

# 2. Python 서버 실행
python -m uvicorn app:app --reload --port 8000
```

**실행 성공 시 출력:**
```
INFO:     Will watch for changes in these directories: ['C:\\cursor_ws\\homepage.app\\image-finder']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 터미널 2 - Next.js 프론트엔드

```powershell
# 1. 프로젝트 루트로 이동
cd C:\cursor_ws\homepage.app

# 2. Next.js 개발 서버 실행
npm run dev
```

**실행 성공 시 출력:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

---

## 방법 2: 한 번에 실행 (PowerShell 스크립트)

아래 스크립트를 복사해서 `start-dev.ps1` 파일로 저장 후 실행:

```powershell
# start-dev.ps1

# Python 백엔드 시작
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\cursor_ws\homepage.app\image-finder; python -m uvicorn app:app --reload --port 8000"

# 3초 대기
Start-Sleep -Seconds 3

# Next.js 프론트엔드 시작
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\cursor_ws\homepage.app; npm run dev"

Write-Host "✅ 두 개의 개발 서버가 시작되었습니다!" -ForegroundColor Green
Write-Host "   - Python API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "   - Next.js:    http://localhost:3000" -ForegroundColor Cyan
```

**실행:**
```powershell
.\start-dev.ps1
```

---

## ⚠️ 환경 변수 설정 필요

### .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 만들어주세요:

```bash
IMAGE_FINDER_API_URL=http://localhost:8000
```

**PowerShell로 빠르게 생성:**
```powershell
cd C:\cursor_ws\homepage.app
"IMAGE_FINDER_API_URL=http://localhost:8000" | Out-File -FilePath .env.local -Encoding UTF8
```

---

## ✅ 확인 방법

### 1. Python API 서버 확인
브라우저에서 http://localhost:8000 접속

**정상 응답:**
```json
{
  "service": "WorkFree Image Finder API",
  "status": "running",
  "version": "1.0.0"
}
```

### 2. 헬스 체크
브라우저에서 http://localhost:8000/health 접속

**정상 응답:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-26T...",
  "api_keys_configured": {
    "unsplash": false,
    "pexels": false,
    "pixabay": false
  }
}
```

> ⚠️ API 키를 아직 설정하지 않았다면 `api_keys_configured`가 모두 `false`입니다. 
> 이 상태에서도 UI는 확인할 수 있지만, 실제 검색은 작동하지 않습니다.

### 3. Next.js 서버 확인
브라우저에서 http://localhost:3000 접속

### 4. 이미지 파인더 페이지
브라우저에서 http://localhost:3000/tools/image-finder 접속

---

## 🛑 서버 중단하기

각 터미널에서 `Ctrl + C` 키를 눌러 서버를 중단합니다.

---

## 🐛 문제 해결

### "Address already in use" 오류
**원인:** 포트가 이미 사용 중

**해결:**
```powershell
# 포트 8000 사용 중인 프로세스 찾기
netstat -ano | findstr :8000

# PID 확인 후 종료
taskkill /PID [PID번호] /F

# 또는 다른 포트 사용
python -m uvicorn app:app --reload --port 8001
```

### Python 서버가 시작되지 않음
**원인:** 패키지가 설치되지 않음

**해결:**
```powershell
cd C:\cursor_ws\homepage.app\image-finder
pip install -r requirements.txt
```

### Next.js 서버가 시작되지 않음
**원인:** node_modules가 없음

**해결:**
```powershell
cd C:\cursor_ws\homepage.app
npm install
```

---

## 📝 빠른 명령어 모음

```powershell
# Python 서버만 재시작
cd C:\cursor_ws\homepage.app\image-finder
python -m uvicorn app:app --reload --port 8000

# Next.js 서버만 재시작
cd C:\cursor_ws\homepage.app
npm run dev

# 환경 변수 확인
cd C:\cursor_ws\homepage.app
cat .env.local

# Python 패키지 재설치
cd C:\cursor_ws\homepage.app\image-finder
pip install -r requirements.txt --upgrade

# Node 패키지 재설치
cd C:\cursor_ws\homepage.app
npm install
```

