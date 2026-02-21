#!/bin/bash

# MailGuardX Deployment Script
# Usage: ./scripts/deploy.sh [docker|railway|render]

set -e

DEPLOY_METHOD=${1:-docker}

echo "🚀 Deploying MailGuardX using: $DEPLOY_METHOD"

case $DEPLOY_METHOD in
  docker)
    echo "📦 Building and starting Docker containers..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    echo "✅ Deployment complete!"
    echo "Frontend: http://localhost:5173"
    echo "Backend: http://localhost:5000"
    echo "ML Service: http://localhost:8000"
    ;;
  railway)
    echo "🚂 Deploying to Railway..."
    cd backend && railway up
    cd ../ml-service && railway up
    echo "✅ Railway deployment initiated!"
    ;;
  render)
    echo "🎨 Deploying to Render..."
    echo "Please deploy via Render dashboard:"
    echo "1. Connect GitHub repo"
    echo "2. Create Web Services for backend and ml-service"
    echo "3. Set environment variables"
    ;;
  *)
    echo "❌ Unknown deployment method: $DEPLOY_METHOD"
    echo "Usage: ./scripts/deploy.sh [docker|railway|render]"
    exit 1
    ;;
esac
