# WorkFree 개발 서버 자동 시작 스크립트

Write-Host "🚀 WorkFree 개발 서버를 시작합니다..." -ForegroundColor Green
Write-Host ""

# Python 백엔드 시작
Write-Host "📦 Python API 서버 시작 중..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\image-finder'; Write-Host '🐍 Python API Server' -ForegroundColor Yellow; python -m uvicorn app:app --reload --port 8000"

# 3초 대기
Start-Sleep -Seconds 3

# Next.js 프론트엔드 시작
Write-Host "⚡ Next.js 개발 서버 시작 중..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host '⚛️ Next.js Server' -ForegroundColor Blue; npm run dev"

# 5초 대기 (서버 시작 시간)
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ 두 개의 개발 서버가 시작되었습니다!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 서버 주소:" -ForegroundColor Yellow
Write-Host "   - Python API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "   - Next.js:    http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 테스트 페이지:" -ForegroundColor Yellow
Write-Host "   - 이미지 파인더: http://localhost:3000/tools/image-finder" -ForegroundColor Cyan
Write-Host ""
Write-Host "🛑 서버 중단: 각 터미널 창에서 Ctrl+C" -ForegroundColor Red
Write-Host ""

