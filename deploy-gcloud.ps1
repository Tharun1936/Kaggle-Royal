# MailGuardX Google Cloud Deployment Script (PowerShell)
# Usage: .\deploy-gcloud.ps1 -ProjectId "your-project-id"

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [string]$Region = "us-central1"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploying MailGuardX to Google Cloud..." -ForegroundColor Cyan
Write-Host "Project: $ProjectId" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host ""

# Set project
gcloud config set project $ProjectId

# Enable APIs
Write-Host "📦 Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com --quiet
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable artifactregistry.googleapis.com --quiet

# Step 1: Deploy ML Service
Write-Host ""
Write-Host "🤖 Step 1/3: Deploying ML Service..." -ForegroundColor Yellow
Set-Location ml-service

gcloud run deploy mailguardx-ml-service `
  --source . `
  --dockerfile Dockerfile.cloudrun `
  --platform managed `
  --region $Region `
  --allow-unauthenticated `
  --port 8080 `
  --memory 2Gi `
  --cpu 2 `
  --timeout 300 `
  --max-instances 10 `
  --set-env-vars "PCAP_BASE_PATH=/tmp,FLASK_ENV=production" `
  --quiet

$mlServiceUrl = gcloud run services describe mailguardx-ml-service `
  --platform managed `
  --region $Region `
  --format 'value(status.url)'
Write-Host "✅ ML Service deployed: $mlServiceUrl" -ForegroundColor Green

# Step 2: Deploy Backend
Write-Host ""
Write-Host "🔧 Step 2/3: Deploying Backend..." -ForegroundColor Yellow
Set-Location ..\backend

gcloud run deploy mailguardx-backend `
  --source . `
  --dockerfile Dockerfile.cloudrun `
  --platform managed `
  --region $Region `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --timeout 60 `
  --max-instances 10 `
  --set-env-vars "ML_MODEL_URL=$mlServiceUrl/api/predict" `
  --quiet

$backendUrl = gcloud run services describe mailguardx-backend `
  --platform managed `
  --region $Region `
  --format 'value(status.url)'
Write-Host "✅ Backend deployed: $backendUrl" -ForegroundColor Green

# Step 3: Deploy Frontend
Write-Host ""
Write-Host "🎨 Step 3/3: Deploying Frontend..." -ForegroundColor Yellow
Set-Location ..\frontend

# Build with ML service URL
"VITE_ML_API_URL=$mlServiceUrl/api/predict" | Out-File -FilePath .env.production -Encoding utf8
npm install --silent
npm run build

# Deploy to Firebase
firebase deploy --only hosting --project $ProjectId --non-interactive

$firebaseUrl = "https://$ProjectId.web.app"
Write-Host "✅ Frontend deployed: $firebaseUrl" -ForegroundColor Green

# Update backend CORS
Write-Host ""
Write-Host "🔐 Updating backend CORS..." -ForegroundColor Yellow
gcloud run services update mailguardx-backend `
  --platform managed `
  --region $Region `
  --update-env-vars "ALLOWED_ORIGINS=$firebaseUrl,http://localhost:5173" `
  --quiet

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  Frontend:  $firebaseUrl" -ForegroundColor White
Write-Host "  Backend:   $backendUrl" -ForegroundColor White
Write-Host "  ML Service: $mlServiceUrl" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Set-Location ..
