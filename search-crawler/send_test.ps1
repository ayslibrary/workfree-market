$body = @{
    keyword = "AI automation"
    recipient_email = "ayoung1034@gmail.com"
    engines = @("naver")
    max_results = 5
} | ConvertTo-Json

Write-Host "Sending email to ayoung1034@gmail.com..." -ForegroundColor Yellow
Write-Host "Keyword: AI automation" -ForegroundColor Cyan

$response = Invoke-RestMethod -Uri "https://workfree-market-production.up.railway.app/api/email" -Method Post -Body $body -ContentType "application/json; charset=utf-8"

Write-Host "Success!" -ForegroundColor Green
Write-Host "Email ID: $($response.email_id)" -ForegroundColor Cyan
Write-Host "Results: $($response.total_results)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check your inbox at ayoung1034@gmail.com!" -ForegroundColor Green

