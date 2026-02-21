# Google Cloud Deployment Guide

Deploy MailGuardX to Google Cloud Platform:
- **Frontend** → Firebase Hosting
- **Backend** → Cloud Run
- **ML Service** → Cloud Run

---

## Prerequisites

1. **Install required tools:**
```bash
# Install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# Install Firebase CLI
npm install -g firebase-tools

# Verify installations
gcloud --version
firebase --version
```

2. **Authenticate:**
```bash
# Login to Google Cloud
gcloud auth login

# Set default project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

---

## Deployment Order

### Step 1: Deploy ML Service (Cloud Run)

**Why first?** Backend needs ML service URL as environment variable.

```bash
# Navigate to ml-service directory
cd ml-service

# Build and deploy to Cloud Run
gcloud run deploy mailguardx-ml-service \
  --source . \
  --dockerfile Dockerfile.cloudrun \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars "PCAP_BASE_PATH=/tmp,FLASK_ENV=production"

# Get ML service URL (save this for backend deployment)
ML_SERVICE_URL=$(gcloud run services describe mailguardx-ml-service \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)')

echo "ML Service URL: $ML_SERVICE_URL"
```

**Expected output:**
```
Service URL: https://mailguardx-ml-service-xxxxx-uc.a.run.app
```

---

### Step 2: Deploy Backend (Cloud Run)

```bash
# Navigate to backend directory
cd ../backend

# Build and deploy to Cloud Run
gcloud run deploy mailguardx-backend \
  --source . \
  --dockerfile Dockerfile.cloudrun \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --max-instances 10 \
  --set-env-vars "ML_MODEL_URL=$ML_SERVICE_URL/api/predict,ALLOWED_ORIGINS=https://YOUR_FIREBASE_URL.web.app"

# Get backend URL (save this for frontend)
BACKEND_URL=$(gcloud run services describe mailguardx-backend \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)')

echo "Backend URL: $BACKEND_URL"
```

**Note:** Replace `YOUR_FIREBASE_URL` with your actual Firebase hosting URL (you'll get this after frontend deployment).

---

### Step 3: Deploy Frontend (Firebase Hosting)

```bash
# Navigate to frontend directory
cd ../frontend

# Initialize Firebase (if not already done)
firebase init hosting

# Select options:
# - Use existing project: YES
# - Public directory: dist
# - Single-page app: YES
# - Set up automatic builds: NO
# - Overwrite index.html: NO

# Build frontend
npm install
npm run build

# Set environment variable for ML service (create .env.production)
echo "VITE_ML_API_URL=$ML_SERVICE_URL/api/predict" > .env.production

# Rebuild with production env
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Get Firebase URL
FIREBASE_URL=$(firebase hosting:sites:list | grep -oP 'https://\S+\.web\.app' | head -1)
echo "Frontend URL: $FIREBASE_URL"
```

**After deployment, update backend CORS:**
```bash
# Update backend with Firebase URL
gcloud run services update mailguardx-backend \
  --platform managed \
  --region us-central1 \
  --update-env-vars "ALLOWED_ORIGINS=$FIREBASE_URL,http://localhost:5173"
```

---

## Complete Deployment Script

Save as `deploy-gcloud.sh`:

```bash
#!/bin/bash
set -e

PROJECT_ID="YOUR_PROJECT_ID"
REGION="us-central1"
FIREBASE_PROJECT="YOUR_PROJECT_ID"

echo "🚀 Deploying MailGuardX to Google Cloud..."

# Set project
gcloud config set project $PROJECT_ID

# Enable APIs
echo "📦 Enabling required APIs..."
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Step 1: Deploy ML Service
echo "🤖 Deploying ML Service..."
cd ml-service
gcloud run deploy mailguardx-ml-service \
  --source . \
  --dockerfile Dockerfile.cloudrun \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars "PCAP_BASE_PATH=/tmp,FLASK_ENV=production"

ML_SERVICE_URL=$(gcloud run services describe mailguardx-ml-service \
  --platform managed \
  --region $REGION \
  --format 'value(status.url)')
echo "✅ ML Service: $ML_SERVICE_URL"

# Step 2: Deploy Backend
echo "🔧 Deploying Backend..."
cd ../backend
gcloud run deploy mailguardx-backend \
  --source . \
  --dockerfile Dockerfile.cloudrun \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --max-instances 10 \
  --set-env-vars "ML_MODEL_URL=$ML_SERVICE_URL/api/predict"

BACKEND_URL=$(gcloud run services describe mailguardx-backend \
  --platform managed \
  --region $REGION \
  --format 'value(status.url)')
echo "✅ Backend: $BACKEND_URL"

# Step 3: Deploy Frontend
echo "🎨 Deploying Frontend..."
cd ../frontend

# Build with ML service URL
echo "VITE_ML_API_URL=$ML_SERVICE_URL/api/predict" > .env.production
npm install
npm run build

# Deploy to Firebase
firebase deploy --only hosting --project $FIREBASE_PROJECT

FIREBASE_URL=$(firebase hosting:sites:list --project $FIREBASE_PROJECT | grep -oP 'https://\S+\.web\.app' | head -1)
echo "✅ Frontend: $FIREBASE_URL"

# Update backend CORS
echo "🔐 Updating backend CORS..."
gcloud run services update mailguardx-backend \
  --platform managed \
  --region $REGION \
  --update-env-vars "ALLOWED_ORIGINS=$FIREBASE_URL,http://localhost:5173"

echo "🎉 Deployment complete!"
echo ""
echo "Frontend: $FIREBASE_URL"
echo "Backend: $BACKEND_URL"
echo "ML Service: $ML_SERVICE_URL"
```

---

## Manual Step-by-Step Commands

### 1. Setup Google Cloud Project

```bash
# Create project (or use existing)
gcloud projects create mailguardx --name="MailGuardX"

# Set as default
gcloud config set project mailguardx

# Enable billing (required for Cloud Run)
# Do this in Cloud Console: https://console.cloud.google.com/billing

# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 2. Deploy ML Service

```bash
cd ml-service

# Build and deploy
gcloud run deploy mailguardx-ml-service \
  --source . \
  --dockerfile Dockerfile.cloudrun \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars "PCAP_BASE_PATH=/tmp,FLASK_ENV=production"

# Get URL
gcloud run services describe mailguardx-ml-service \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

### 3. Deploy Backend

```bash
cd ../backend

# Replace ML_SERVICE_URL with actual URL from step 2
ML_SERVICE_URL="https://mailguardx-ml-service-xxxxx-uc.a.run.app"

gcloud run deploy mailguardx-backend \
  --source . \
  --dockerfile Dockerfile.cloudrun \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --max-instances 10 \
  --set-env-vars "ML_MODEL_URL=$ML_SERVICE_URL/api/predict"

# Get URL
gcloud run services describe mailguardx-backend \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

### 4. Deploy Frontend

```bash
cd ../frontend

# Login to Firebase
firebase login

# Initialize Firebase (first time only)
firebase init hosting
# Select: Use existing project, dist, Single-page app: YES

# Set ML service URL
ML_SERVICE_URL="https://mailguardx-ml-service-xxxxx-uc.a.run.app"
echo "VITE_ML_API_URL=$ML_SERVICE_URL/api/predict" > .env.production

# Build
npm install
npm run build

# Deploy
firebase deploy --only hosting

# Get URL
firebase hosting:sites:list
```

### 5. Update Backend CORS

```bash
# Replace with actual Firebase URL
FIREBASE_URL="https://mailguardx-xxxxx.web.app"

gcloud run services update mailguardx-backend \
  --platform managed \
  --region us-central1 \
  --update-env-vars "ALLOWED_ORIGINS=$FIREBASE_URL,http://localhost:5173"
```

---

## Environment Variables Reference

### ML Service (Cloud Run)
```
PCAP_BASE_PATH=/tmp
FLASK_ENV=production
PORT=8080 (set automatically by Cloud Run)
```

### Backend (Cloud Run)
```
PORT=8080 (set automatically by Cloud Run)
ML_MODEL_URL=https://mailguardx-ml-service-xxxxx-uc.a.run.app/api/predict
ALLOWED_ORIGINS=https://mailguardx-xxxxx.web.app,http://localhost:5173
```

### Frontend (Firebase Hosting)
```
VITE_ML_API_URL=https://mailguardx-ml-service-xxxxx-uc.a.run.app/api/predict
```

---

## Verification Commands

```bash
# Check ML service
curl https://mailguardx-ml-service-xxxxx-uc.a.run.app/api/health

# Check backend
curl https://mailguardx-backend-xxxxx-uc.a.run.app/api/health

# Test ML prediction
curl -X POST https://mailguardx-ml-service-xxxxx-uc.a.run.app/api/predict \
  -H "Content-Type: application/json" \
  -d '{"complaint_type": "Hacking / Unauthorized Access"}'

# View logs
gcloud run services logs read mailguardx-ml-service --region us-central1
gcloud run services logs read mailguardx-backend --region us-central1
```

---

## Troubleshooting

### ML Service fails to start
- Check model files exist in `ml-service/model/`
- Verify Dockerfile.cloudrun uses correct port
- Check logs: `gcloud run services logs read mailguardx-ml-service --region us-central1`

### Backend can't reach ML service
- Verify ML_MODEL_URL is correct
- Check ML service is deployed and accessible
- Verify CORS settings

### Frontend build fails
- Ensure `npm run build` works locally
- Check `.env.production` has correct ML service URL
- Verify `dist/` directory is created

### CORS errors
- Update backend `ALLOWED_ORIGINS` with Firebase URL
- Ensure Firebase URL is in allowed origins list

---

## Cost Estimation

**Cloud Run:**
- ML Service: ~$0.10/hour when running (pay per request)
- Backend: ~$0.05/hour when running
- Free tier: 2 million requests/month

**Firebase Hosting:**
- Free tier: 10 GB storage, 360 MB/day transfer
- Paid: $0.026/GB storage, $0.15/GB transfer

**Estimated monthly cost:** $0-20 (depending on traffic)

---

## Cleanup Commands

```bash
# Delete services
gcloud run services delete mailguardx-ml-service --region us-central1
gcloud run services delete mailguardx-backend --region us-central1

# Delete Firebase hosting
firebase hosting:channel:delete production
```
