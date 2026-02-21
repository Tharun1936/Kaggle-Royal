# MailGuardX Quick Start Guide

## 🚀 Fastest Deployment (Docker)

### Prerequisites
- Docker Desktop installed
- Git

### Steps

1. **Clone and navigate**
```bash
git clone <your-repo-url>
cd "Kaggle Royal - Copy"
```

2. **Start all services**
```bash
docker-compose up -d
```

3. **Access the app**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health
- ML Service: http://localhost:8000/api/health

4. **View logs**
```bash
docker-compose logs -f
```

5. **Stop services**
```bash
docker-compose down
```

---

## 🌐 Cloud Deployment (5 minutes)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set root directory to `frontend`
5. Add environment variable:
   - `VITE_ML_API_URL` = `https://your-ml-service.railway.app/api/predict`
6. Deploy!

### Backend → Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select repository
4. Set root directory to `backend`
5. Add environment variables:
   - `PORT` = `5000`
   - `ML_MODEL_URL` = `https://your-ml-service.railway.app/api/predict`
6. Deploy!

### ML Service → Railway

1. In Railway, click "New" → "GitHub Repo"
2. Set root directory to `ml-service`
3. Add environment variables:
   - `PCAP_BASE_PATH` = `/tmp`
   - `FLASK_ENV` = `production`
4. Deploy!

**Note**: Railway auto-detects Python and installs dependencies from `requirements.txt`

---

## 📋 Environment Variables Checklist

### Frontend (Vercel/Netlify)
```
VITE_ML_API_URL=https://your-ml-service-url/api/predict
```

### Backend (Railway/Render)
```
PORT=5000
ML_MODEL_URL=https://your-ml-service-url/api/predict
```

### ML Service (Railway/Render)
```
PCAP_BASE_PATH=/tmp
FLASK_ENV=production
```

---

## ✅ Post-Deployment Verification

1. **Frontend loads** → Check browser console for errors
2. **Backend health** → Visit `https://your-backend-url/api/health`
3. **ML Service health** → Visit `https://your-ml-service-url/api/health`
4. **Submit test complaint** → Verify ML prediction works

---

## 🐛 Common Issues

**Frontend can't reach ML service**
- Check `VITE_ML_API_URL` is correct
- Verify ML service is deployed and running
- Check CORS settings in ML service

**Backend errors**
- Verify `ML_MODEL_URL` points to ML service
- Check backend logs in Railway/Render dashboard

**ML service fails**
- Ensure model files (`*.pkl`) are in `ml-service/model/` directory
- Check Python version (3.9+)
- Verify all dependencies installed

---

## 📚 Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.
