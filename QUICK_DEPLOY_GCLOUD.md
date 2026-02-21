# Quick Deploy to Google Cloud - Command Reference

## Prerequisites

```bash
# Install tools
npm install -g firebase-tools
# Install gcloud SDK: https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login
firebase login
```

## One-Command Deployment

### Linux/Mac:
```bash
chmod +x deploy-gcloud.sh
GCLOUD_PROJECT=your-project-id ./deploy-gcloud.sh
```

### Windows PowerShell:
```powershell
.\deploy-gcloud.ps1 -ProjectId "your-project-id"
```

---

## Manual Deployment (Step-by-Step)

### 1. Setup Project
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

### 2. Deploy ML Service
```bash
cd ml-service
gcloud run deploy mailguardx-ml-service \
  --source . \
  --dockerfile Dockerfile.cloudrun \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --set-env-vars "PCAP_BASE_PATH=/tmp,FLASK_ENV=production"
```

**Save ML Service URL:**
```bash
ML_SERVICE_URL=$(gcloud run services describe mailguardx-ml-service \
  --region us-central1 --format 'value(status.url)')
echo $ML_SERVICE_URL
```

### 3. Deploy Backend
```bash
cd ../backend
gcloud run deploy mailguardx-backend \
  --source . \
  --dockerfile Dockerfile.cloudrun \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "ML_MODEL_URL=$ML_SERVICE_URL/api/predict"
```

### 4. Deploy Frontend
```bash
cd ../frontend

# Set ML service URL
echo "VITE_ML_API_URL=$ML_SERVICE_URL/api/predict" > .env.production

# Build
npm install && npm run build

# Deploy
firebase deploy --only hosting
```

### 5. Update Backend CORS
```bash
FIREBASE_URL="https://YOUR_PROJECT_ID.web.app"
gcloud run services update mailguardx-backend \
  --region us-central1 \
  --update-env-vars "ALLOWED_ORIGINS=$FIREBASE_URL,http://localhost:5173"
```

---

## Verify Deployment

```bash
# ML Service
curl https://mailguardx-ml-service-xxxxx-uc.a.run.app/api/health

# Backend
curl https://mailguardx-backend-xxxxx-uc.a.run.app/api/health

# Frontend
open https://YOUR_PROJECT_ID.web.app
```

---

## Files Created

- `backend/Dockerfile.cloudrun` - Cloud Run Dockerfile (port 8080)
- `ml-service/Dockerfile.cloudrun` - Cloud Run Dockerfile (port 8080)
- `frontend/firebase.json` - Firebase hosting config
- `frontend/.firebaserc` - Firebase project config
- `deploy-gcloud.sh` - Automated deployment script
- `deploy-gcloud.ps1` - PowerShell deployment script

---

## Important Notes

1. **Port 8080**: Cloud Run requires port 8080. Dockerfiles handle this automatically.
2. **No code changes**: All source code remains unchanged.
3. **Environment variables**: Set via `--set-env-vars` flag.
4. **CORS**: Update backend after frontend deployment with Firebase URL.

---

See `DEPLOY_GCLOUD.md` for detailed documentation.
