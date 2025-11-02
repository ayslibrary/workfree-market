# WorkFree 뉴스 크롤링 스케줄러 테스트 (PowerShell)

$API_URL = "http://localhost:8000"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🧪 WorkFree 뉴스 크롤링 스케줄러 테스트" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. 헬스 체크
Write-Host "`n🏥 헬스 체크..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/health" -Method Get
    Write-Host "✅ 성공!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ 실패: $_" -ForegroundColor Red
}

# 2. 스케줄 생성
Write-Host "`n📅 스케줄 생성..." -ForegroundColor Yellow
$scheduleData = @{
    user_id = "test_user_123"
    email = "your-email@example.com"  # ⚠️ 실제 이메일로 변경하세요
    keywords = @("AI 투자", "스타트업")
    time = "09:00"
    weekdays = @(0, 1, 2, 3, 4)  # 월-금
    max_results = 5
    engines = @("naver")
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/schedule" -Method Post -Body $scheduleData -ContentType "application/json"
    Write-Host "✅ 스케줄 등록 성공!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ 실패: $_" -ForegroundColor Red
}

# 3. 스케줄 조회
Write-Host "`n🔍 스케줄 조회..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/schedule/test_user_123" -Method Get
    Write-Host "✅ 조회 성공!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ 실패: $_" -ForegroundColor Red
}

# 4. 모든 스케줄 조회
Write-Host "`n📋 모든 스케줄 조회..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/schedules" -Method Get
    Write-Host "✅ 조회 성공! (총 $($response.total)개)" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ 실패: $_" -ForegroundColor Red
}

# 5. 즉시 이메일 발송 테스트 (선택사항)
Write-Host "`n📧 즉시 이메일 발송 테스트 (스킵)..." -ForegroundColor Gray
Write-Host "   필요시 주석 해제하여 실행하세요" -ForegroundColor Gray

<#
$emailData = @{
    keyword = "워크프리"
    recipient_email = "your-email@example.com"
    engines = @("naver")
    max_results = 5
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/email" -Method Post -Body $emailData -ContentType "application/json"
    Write-Host "✅ 이메일 발송 성공!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ 실패: $_" -ForegroundColor Red
}
#>

# 6. 스케줄 삭제 (선택사항)
Write-Host "`n🗑️ 스케줄 삭제 (스킵)..." -ForegroundColor Gray
Write-Host "   필요시 주석 해제하여 실행하세요" -ForegroundColor Gray

<#
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/schedule/test_user_123" -Method Delete
    Write-Host "✅ 삭제 성공!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ 실패: $_" -ForegroundColor Red
}
#>

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "✅ 테스트 완료!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan

Write-Host "`n💡 팁:" -ForegroundColor Yellow
Write-Host "  - API 문서: http://localhost:8000/docs" -ForegroundColor White
Write-Host "  - 스케줄 DB: search-crawler/schedules.db" -ForegroundColor White
Write-Host "  - 가이드: search-crawler/SCHEDULE_GUIDE.md" -ForegroundColor White

