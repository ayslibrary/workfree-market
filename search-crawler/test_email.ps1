# WorkFree Email 발송 테스트 스크립트

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📧 WorkFree 이메일 발송 테스트" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 이메일 주소 입력
$email = Read-Host "받을 이메일 주소를 입력하세요"

# API URL
$url = "https://workfree-market-production.up.railway.app/api/email"

# 요청 데이터
$body = @{
    keyword = "워크프리 자동화 테스트"
    recipient_email = $email
    engines = @("naver")
    max_results = 3
} | ConvertTo-Json -Compress

Write-Host ""
Write-Host "📤 이메일 발송 중..." -ForegroundColor Yellow
Write-Host ""

# API 요청
try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "✅ 성공!" -ForegroundColor Green
    Write-Host ""
    Write-Host "발송 정보:" -ForegroundColor Cyan
    Write-Host "  - 수신자: $email"
    Write-Host "  - 검색 결과: $($response.total_results)개"
    Write-Host "  - 이메일 ID: $($response.email_id)"
    Write-Host ""
    Write-Host "📬 이메일함을 확인해보세요!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ 오류 발생!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "아무 키나 누르면 종료됩니다..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

