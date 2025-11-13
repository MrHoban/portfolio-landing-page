# Deployment Guide

This guide will help you deploy your portfolio to production.

## Overview

Your portfolio has two parts:
1. **Frontend** (React + Vite) - Deploy to Vercel/Netlify
2. **Backend** (Python Flask) - Deploy to Render/Railway/Heroku

---

## Part 1: Frontend Deployment (Vercel - Recommended)

### Option A: Vercel (Easiest & Free)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/portfolio-landing-page.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - **Configure:**
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`
   - Click "Deploy"

3. **Update API Proxy**
   - After deployment, update `vite.config.js` to point to your backend URL
   - Or use environment variables in Vercel

### Option B: Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to https://netlify.com
   - Sign up/login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - **Configure:**
     - **Base directory:** `frontend`
     - **Build command:** `npm run build`
     - **Publish directory:** `frontend/dist`
   - Click "Deploy site"

---

## Part 2: Backend Deployment

### Option A: Render (Recommended - Free Tier Available)

1. **Prepare for Deployment**
   - Make sure your `backend/.env` is NOT committed (it's in .gitignore)
   - Create a `Procfile` or use Render's Python settings

2. **Deploy to Render**
   - Go to https://render.com
   - Sign up/login with GitHub
   - Click "New" → "Web Service"
   - Connect your repository
   - **Configure:**
     - **Name:** `portfolio-backend`
     - **Environment:** `Python 3`
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `gunicorn app:app --chdir backend`
     - **Root Directory:** Leave empty (or set to project root)

3. **Set Environment Variables in Render**
   - Go to your service → "Environment"
   - Add all variables from your `.env`:
     ```
     MONGO_URI=your_mongodb_atlas_connection_string
     DB_NAME=portfolio_db
     GITHUB_USERNAME=MrHoban
     GITHUB_TOKEN=your_token
     MEDIUM_USERNAME=joshuawhoban
     PORT=10000
     ```
   - **Important:** Use your MongoDB Atlas connection string (not localhost)

4. **Update Frontend API URL**
   - After backend deploys, you'll get a URL like: `https://portfolio-backend.onrender.com`
   - Update your frontend `vite.config.js` proxy or use environment variables

### Option B: Railway

1. **Deploy to Railway**
   - Go to https://railway.app
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Python
   - **Configure:**
     - **Root Directory:** Leave as root
     - **Start Command:** `cd backend && gunicorn app:app`

2. **Set Environment Variables**
   - Go to your project → "Variables"
   - Add all your `.env` variables

### Option C: Heroku

1. **Create `Procfile` in backend folder:**
   ```
   web: gunicorn app:app
   ```

2. **Deploy to Heroku**
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set MONGO_URI=your_mongodb_uri
   heroku config:set GITHUB_USERNAME=MrHoban
   heroku config:set MEDIUM_USERNAME=joshuawhoban
   git subtree push --prefix backend heroku main
   ```

---

## Part 3: Update Frontend for Production

### Update API Endpoints

After deploying your backend, update the frontend to use the production API URL.

**Option 1: Environment Variables (Recommended)**

1. Create `frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. Update `frontend/src/App.jsx`:
   ```jsx
   const API_URL = import.meta.env.VITE_API_URL || ''
   const response = await fetch(`${API_URL}/api/repos`)
   ```

**Option 2: Update vite.config.js**

Update the proxy to point to your production backend:
```js
proxy: {
  '/api': {
    target: 'https://your-backend-url.onrender.com',
    changeOrigin: true,
  }
}
```

---

## Part 4: MongoDB Atlas Setup (Already Done!)

✅ You already have MongoDB Atlas configured! Just make sure:
- Your connection string in production uses the Atlas URL (not localhost)
- Network Access allows connections from anywhere (or your deployment IPs)
- Database user has proper permissions

---

## Part 5: Environment Variables Checklist

### Backend (.env in production):
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db?retryWrites=true&w=majority
DB_NAME=portfolio_db
GITHUB_USERNAME=MrHoban
GITHUB_TOKEN=your_github_token
MEDIUM_USERNAME=joshuawhoban
PORT=10000  # Or whatever your hosting provider uses
```

### Frontend (if using env vars):
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## Part 6: Testing Your Deployment

1. **Test Backend:**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"healthy"}`

2. **Test Frontend:**
   - Visit your frontend URL
   - Check browser console for errors
   - Test all features:
     - GitHub repos loading
     - Blog posts loading
     - Resume download
     - Contact form

---

## Part 7: Custom Domain (Optional)

### Vercel/Netlify:
1. Go to your project settings
2. Add your domain
3. Update DNS records as instructed

### Backend:
- Most providers support custom domains
- Update CORS settings if needed

---

## Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas connection string ready
- [ ] Environment variables documented
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Backend deployed (Render/Railway/Heroku)
- [ ] Environment variables set in hosting platform
- [ ] Frontend API URL updated
- [ ] Test all features
- [ ] Custom domain configured (optional)

---

## Recommended Stack

- **Frontend:** Vercel (free, fast, easy)
- **Backend:** Render (free tier, easy setup)
- **Database:** MongoDB Atlas (already set up!)

---

## Need Help?

Common issues:
- **CORS errors:** Make sure backend CORS allows your frontend domain
- **API not working:** Check environment variables are set correctly
- **Build fails:** Check build logs for missing dependencies
- **MongoDB connection fails:** Verify connection string and network access

Good luck with your deployment! 🚀

