# VettCode Seller Web - Deployment Guide

## ✅ Routing Fix Applied

The `vercel.json` file has been added to handle client-side routing properly on Vercel.

## 🚀 Deploying to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Repository**
   - Select your GitHub repository: `mixifys33/vettcodedev`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `vettcode-seller-web` (if it's in a subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**
   Add these environment variables in Vercel:
   ```
   VITE_API_URL=https://easyshop-d00e.onrender.com/api
   VITE_PROJECT_ID=91912c3f-b71d-46a0-ae44-b811bd0d8966
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd vettcode-seller-web
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (first time) or **Y** (subsequent deploys)
   - What's your project's name? `vettcode-seller-web`
   - In which directory is your code located? `./`
   - Want to override the settings? **N**

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🔧 Vercel Configuration

The `vercel.json` file is already configured:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all routes are handled by React Router instead of Vercel's routing.

## 🌐 Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## 🔍 Troubleshooting

### Issue: 404 on page refresh
**Solution**: The `vercel.json` file should fix this. If not, ensure:
- The file is in the root of your project
- You've redeployed after adding it

### Issue: Environment variables not working
**Solution**: 
- Ensure variables start with `VITE_`
- Redeploy after adding environment variables
- Check they're set in Vercel dashboard under Settings → Environment Variables

### Issue: Build fails
**Solution**:
- Check build logs in Vercel dashboard
- Ensure `package.json` has correct dependencies
- Try building locally first: `npm run build`

### Issue: API calls failing
**Solution**:
- Verify `VITE_API_URL` is set correctly in Vercel
- Check CORS settings on your backend
- Ensure backend API is accessible from Vercel's servers

## 📊 Monitoring

After deployment, monitor your app:
- **Analytics**: Vercel provides built-in analytics
- **Logs**: Check function logs in Vercel dashboard
- **Performance**: Use Vercel Speed Insights

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

To disable auto-deployment:
1. Go to Project Settings
2. Navigate to Git
3. Adjust deployment settings

## 🎯 Post-Deployment Checklist

- [ ] Verify login works
- [ ] Test all main routes (/seller/dashboard, /seller/applications, etc.)
- [ ] Check API integration
- [ ] Test image uploads
- [ ] Verify responsive design on mobile
- [ ] Test all forms and validations
- [ ] Check browser console for errors

## 📝 Important Notes

1. **First Load**: The first visit might be slow as Vercel cold-starts the serverless functions
2. **Caching**: Vercel caches static assets automatically
3. **SSL**: HTTPS is enabled by default
4. **Redirects**: All routes redirect to index.html for client-side routing

## 🆘 Need Help?

- Vercel Documentation: https://vercel.com/docs
- Vite Documentation: https://vitejs.dev/guide/
- GitHub Issues: Create an issue in your repository

## 🎉 Success!

Once deployed, your app will be accessible at:
- **Production**: `https://vettcodedev.vercel.app` (or your custom domain)
- **Preview**: Unique URL for each branch/PR

Share the link with your team and start testing! 🚀
