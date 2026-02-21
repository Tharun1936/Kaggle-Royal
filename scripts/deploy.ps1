# MailGuardX Deployment Script for Windows PowerShell
# Usage: .\scripts\deploy.ps1 [docker|railway]

param(
    [Parameter(Position=0)]
    [ValidateSet("docker", "railway")]
    [string]$Method = "docker"
)

Write-Host "🚀 Deploying MailGuardX using: $Method" -ForegroundColor Cyan

switch ($Method) {
    "docker" {
        Write-Host "📦 Building and starting Docker containers..." -ForegroundColor Yellow
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
        Write-Host "✅ Deployment complete!" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
        Write-Host "Backend: http://localhost:5000" -ForegroundColor Green
        Write-Host "ML Service: http://localhost:8000" -ForegroundColor Green
    }
    "railway" {
        Write-Host "🚂 Deploying to Railway..." -ForegroundColor Yellow
        Set-Location backend
        railway up
        Set-Location ..\ml-service
        railway up
        Set-Location ..
        Write-Host "✅ Railway deployment initiated!" -ForegroundColor Green
    }
    default {
        Write-Host "❌ Unknown deployment method: $Method" -ForegroundColor Red
        Write-Host "Usage: .\scripts\deploy.ps1 [docker|railway]" -ForegroundColor Yellow
        exit 1
    }
}
