#!/bin/bash
set -e

# Configuration
PROJECT_ID="${GCLOUD_PROJECT:-YOUR_PROJECT_ID}"
REGION="${GCLOUD_REGION:-us-central1}"
FIREBASE_PROJECT="${FIREBASE_PROJECT:-$PROJECT_ID}"

echo "🚀 Deploying MailGuardX to Google Cloud..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Validate project ID
if [ "$PROJECT_ID" = "YOUR_PROJECT_ID" ]; then
    echo "❌ Error: Set GCLOUD_PROJECT environment variable or edit PROJECT_ID in script"
    exit 1
fi

# Set project
gcloud config set project $PROJECT_ID

# Enable APIs
echo "📦 Enabling required APIs..."
gcloud services enable run.googleapis.com --quiet || true
gcloud services enable cloudbuild.googleapis.com --quiet || true
gcloud services enable artifactregistry.googleapis.com --quiet || true

# Step 1: Deploy ML Service
echo ""
echo "🤖 Step 1/3: Deploying ML Service..."
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
  --set-env-vars "PCAP_BASE_PATH=/tmp,FLASK_ENV=production" \
  --quiet

ML_SERVICE_URL=$(gcloud run services describe mailguardx-ml-service \
  --platform managed \
  --region $REGION \
  --format 'value(status.url)')
echo "✅ ML Service deployed: $ML_SERVICE_URL"

# Step 2: Deploy Backend
echo ""
echo "🔧 Step 2/3: Deploying Backend..."
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
  --set-env-vars "ML_MODEL_URL=$ML_SERVICE_URL/api/predict" \
  --quiet

BACKEND_URL=$(gcloud run services describe mailguardx-backend \
  --platform managed \
  --region $REGION \
  --format 'value(status.url)')
echo "✅ Backend deployed: $BACKEND_URL"

# Step 3: Deploy Frontend
echo ""
echo "🎨 Step 3/3: Deploying Frontend..."
cd ../frontend

# Build with ML service URL
echo "VITE_ML_API_URL=$ML_SERVICE_URL/api/predict" > .env.production
npm install --silent
npm run build

# Deploy to Firebase
firebase deploy --only hosting --project $FIREBASE_PROJECT --non-interactive

FIREBASE_URL=$(firebase hosting:sites:list --project $FIREBASE_PROJECT --json | grep -oP '"defaultSite":\s*"\K[^"]+' | head -1)
if [ -z "$FIREBASE_URL" ]; then
    FIREBASE_URL="https://$FIREBASE_PROJECT.web.app"
fi
echo "✅ Frontend deployed: $FIREBASE_URL"

# Update backend CORS
echo ""
echo "🔐 Updating backend CORS..."
gcloud run services update mailguardx-backend \
  --platform managed \
  --region $REGION \
  --update-env-vars "ALLOWED_ORIGINS=$FIREBASE_URL,http://localhost:5173" \
  --quiet

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Frontend:  $FIREBASE_URL"
echo "  Backend:   $BACKEND_URL"
echo "  ML Service: $ML_SERVICE_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
