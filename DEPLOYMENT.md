# MailGuardX Deployment Guide

This guide covers deploying the MailGuardX application (Frontend, Backend, ML Service).

## Architecture Overview

- **Frontend**: React + Vite (Port 5173)
- **Backend**: Node.js + Express (Port 5000)
- **ML Service**: Python Flask (Port 8000)

---

## Option 1: Docker Deployment (Recommended)

### Prerequisites
- Docker & Docker Compose installed
- Git

### Steps

1. **Clone repository**
```bash
git clone <your-repo-url>
cd "Kaggle Royal - Copy"
```

2. **Build and run**
```bash
docker-compose up -d --build
```

3. **Access services**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- ML Service: http://localhost:8000

4. **View logs**
```bash
docker-compose logs -f
```

5. **Stop services**
```bash
docker-compose down
```

---

## Option 2: Platform Deployment

### Frontend → Vercel/Netlify

#### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Set environment variables** (in Vercel dashboard):
```
VITE_ML_API_URL=https://your-ml-service-url/api/predict
```

4. **Build settings** (auto-detected):
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

#### Netlify Deployment

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Deploy**
```bash
cd frontend
netlify deploy --prod
```

3. **Set environment variables** (in Netlify dashboard):
```
VITE_ML_API_URL=https://your-ml-service-url/api/predict
```

---

### Backend → Railway/Render

#### Railway Deployment

1. **Install Railway CLI**
```bash
npm i -g @railway/cli
railway login
```

2. **Initialize project**
```bash
cd backend
railway init
railway up
```

3. **Set environment variables** (in Railway dashboard):
```
PORT=5000
ML_MODEL_URL=https://your-ml-service-url/api/predict
MONGODB_URI=mongodb://... (optional, if using MongoDB)
```

4. **Deploy**
```bash
railway up
```

#### Render Deployment

1. **Create new Web Service** on Render
2. **Connect GitHub repository**
3. **Configure**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

4. **Set environment variables**:
```
PORT=5000
ML_MODEL_URL=https://your-ml-service-url/api/predict
```

---

### ML Service → Railway/Render

#### Railway Deployment

1. **Create new service**
```bash
cd ml-service
railway init
```

2. **Set environment variables**:
```
PCAP_BASE_PATH=/tmp (optional)
FLASK_ENV=production
```

3. **Create `Procfile`** (already created):
```
web: gunicorn app:app --bind 0.0.0.0:$PORT
```

4. **Deploy**
```bash
railway up
```

#### Render Deployment

1. **Create new Web Service**
2. **Configure**:
   - Root Directory: `ml-service`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`
   - Environment: `Python 3`

3. **Set environment variables**:
```
PCAP_BASE_PATH=/tmp
FLASK_ENV=production
```

---

## Option 3: Manual Server Deployment

### Prerequisites
- Ubuntu 20.04+ server
- Node.js 18+
- Python 3.9+
- Nginx (for reverse proxy)

### Steps

#### 1. Frontend Deployment

```bash
# Clone repository
git clone <your-repo-url>
cd "Kaggle Royal - Copy/frontend"

# Install dependencies
npm install

# Build
npm run build

# Serve with Nginx (see nginx config below)
```

#### 2. Backend Deployment

```bash
cd ../backend

# Install dependencies
npm install

# Install PM2
npm install -g pm2

# Create .env file
nano .env
# Add: PORT=5000, ML_MODEL_URL=http://localhost:8000/api/predict

# Start with PM2
pm2 start server.js --name mailguardx-backend
pm2 save
pm2 startup
```

#### 3. ML Service Deployment

```bash
cd ../ml-service

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt gunicorn

# Create .env file
echo "PCAP_BASE_PATH=/tmp" > .env

# Start with Gunicorn
gunicorn app:app --bind 0.0.0.0:8000 --workers 2 --timeout 120
```

**Or use PM2**:
```bash
pm2 start "gunicorn app:app --bind 0.0.0.0:8000" --name mailguardx-ml
pm2 save
```

#### 4. Nginx Configuration

Create `/etc/nginx/sites-available/mailguardx`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # ML Service
    location /ml {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/mailguardx /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Environment Variables Reference

### Frontend (.env or Vercel/Netlify)
```
VITE_ML_API_URL=http://localhost:8000/api/predict
```

### Backend (.env)
```
PORT=5000
ML_MODEL_URL=http://localhost:8000/api/predict
MONGODB_URI=mongodb://localhost:27017/mailguardx (optional)
```

### ML Service (.env)
```
PCAP_BASE_PATH=/tmp
FLASK_ENV=production
```

---

## Post-Deployment Checklist

- [ ] Frontend accessible
- [ ] Backend API responding (`/api/health`)
- [ ] ML Service responding (`/api/health`)
- [ ] Frontend can call ML service
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] SSL/HTTPS configured (production)
- [ ] Domain DNS configured
- [ ] Monitoring/logging setup

---

## Troubleshooting

### Frontend can't reach ML service
- Check `VITE_ML_API_URL` is set correctly
- Verify ML service is running
- Check CORS settings

### Backend errors
- Verify `ML_MODEL_URL` points to ML service
- Check backend logs: `pm2 logs mailguardx-backend`

### ML service errors
- Verify model files exist in `ml-service/model/`
- Check Python dependencies: `pip list`
- Check logs: `pm2 logs mailguardx-ml`

### Port conflicts
- Change ports in `.env` files
- Update Nginx config accordingly

---

## Production Recommendations

1. **Use HTTPS**: Configure SSL certificates (Let's Encrypt)
2. **Set up monitoring**: PM2 monitoring, Sentry, or similar
3. **Enable logging**: Centralized logging (Winston, Morgan)
4. **Rate limiting**: Add rate limiting to backend
5. **Database**: Use managed MongoDB (MongoDB Atlas) if needed
6. **CDN**: Use CDN for frontend assets
7. **Backup**: Regular backups of model files and data

---

## Quick Deploy Scripts

See `scripts/` directory for automated deployment scripts.
