# 🚀 Vercel Deployment Guide

## Deploy Your BoutiqueManager to Vercel

### Prerequisites
- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**
   ```bash
   cd /home/gajendra-singh-bislawat/Desktop/BoutiqueManager
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name: **boutique-manager** (or your preferred name)
   - Directory: **./** (current directory)
   - Override settings? **No**

### Method 2: Deploy via GitHub Integration

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/boutique-manager.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings

### Method 3: Drag & Drop Deployment

1. **Build your project locally**
   ```bash
   npm run build
   ```

2. **Upload to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Drag and drop the `dist/public` folder
   - Your app will be deployed instantly!

## 🔧 Configuration Files

### vercel.json
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Framework**: Vite
- **SPA Routing**: All routes redirect to `index.html`
- **Caching**: Optimized for static assets
- **Security Headers**: XSS protection, content type options

### .vercelignore
- Excludes unnecessary files from deployment
- Reduces build time and deployment size

## 🌐 Environment Variables (if needed)

If you need environment variables:

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Add environment variables in the "Environment Variables" section

2. **Via CLI:**
   ```bash
   vercel env add VARIABLE_NAME
   ```

## 📱 Custom Domain (Optional)

1. **Add domain in Vercel dashboard**
2. **Update DNS settings** as instructed
3. **SSL certificate** will be automatically provisioned

## 🔄 Automatic Deployments

- **GitHub Integration**: Every push to main branch triggers deployment
- **Preview Deployments**: Pull requests get preview URLs
- **Branch Deployments**: Each branch can have its own deployment

## 🚨 Troubleshooting

### Build Fails
- Check `package.json` scripts
- Ensure all dependencies are in `dependencies` (not `devDependencies`)
- Verify Node.js version compatibility

### Routing Issues
- The `vercel.json` includes SPA routing configuration
- All routes redirect to `index.html` for client-side routing

### Image Loading Issues
- External images (Unsplash) should work fine
- For local images, ensure they're in the `public` folder

## 📊 Performance Tips

- **Image Optimization**: Consider using Vercel's Image Optimization
- **CDN**: Vercel automatically provides global CDN
- **Caching**: Static assets are cached for 1 year

## 🎉 Success!

Once deployed, you'll get:
- **Production URL**: `https://your-project.vercel.app`
- **Automatic HTTPS**: SSL certificate included
- **Global CDN**: Fast loading worldwide
- **Analytics**: Built-in performance monitoring

Your BoutiqueManager is now live and ready for customers! 🎨👗
