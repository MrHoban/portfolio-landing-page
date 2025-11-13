# Quick Deployment Guide

## 🚀 Fastest Way to Deploy

### Step 1: Deploy Backend (Render - 5 minutes)

1. **Go to https://render.com** and sign up with GitHub
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. **Settings:**
   - **Name:** `portfolio-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `cd backend && gunicorn app:app`
   - **Root Directory:** (leave empty)

5. **Environment Variables** (click "Environment"):
   ```
   MONGO_URI=mongodb+srv://joshuahobandb:Ilovedad%4020052306@cluster-portfolio.ewxrccw.mongodb.net/portfolio_db?retryWrites=true&w=majority
   DB_NAME=portfolio_db
   GITHUB_USERNAME=MrHoban
   GITHUB_TOKEN=your_token_here
   MEDIUM_USERNAME=joshuawhoban
   PORT=10000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (~5 minutes)
8. Copy your backend URL (e.g., `https://portfolio-backend.onrender.com`)

---

### Step 2: Deploy Frontend (Vercel - 3 minutes)

1. **Go to https://vercel.com** and sign up with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository
4. **Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Environment Variables:**
   ```
   VITE_API_URL=https://portfolio-backend.onrender.com
   ```
   (Use the URL from Step 1)

6. Click **"Deploy"**
7. Wait ~2 minutes
8. Your portfolio is live! 🎉

---

## ✅ Post-Deployment Checklist

- [ ] Test backend health: `https://your-backend.onrender.com/api/health`
- [ ] Test frontend loads correctly
- [ ] Test GitHub repos load
- [ ] Test blog posts load
- [ ] Test resume download
- [ ] Test contact form
- [ ] Test dark/light mode toggle

---

## 🔧 Troubleshooting

**CORS Errors:**
- Make sure `FRONTEND_URL` in backend matches your Vercel URL exactly

**API Not Working:**
- Check `VITE_API_URL` in Vercel environment variables
- Check backend logs in Render dashboard

**MongoDB Connection:**
- Verify MongoDB Atlas network access allows all IPs (0.0.0.0/0)
- Check connection string is correct

---

## 📝 Notes

- **Free tiers available** on both Vercel and Render
- **Auto-deploys** on every git push
- **Custom domains** can be added later
- **SSL/HTTPS** included automatically

Your portfolio will be live at: `https://your-project.vercel.app` 🚀

