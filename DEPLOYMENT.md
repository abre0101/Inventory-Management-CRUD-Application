# Deployment Guide - Vercel

This guide will help you deploy your Inventory Management App to Vercel.

## Prerequisites

- A GitHub account with your code pushed to a repository
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your Supabase credentials ready

## ⚠️ IMPORTANT: Root Directory Issue

Vercel's dashboard may not correctly detect the `inventory-app` folder. If you see only `app`, `lib`, and `public` as options (which are folders INSIDE inventory-app), **use Option B (CLI) instead** - it's more reliable for this setup.

## Option A: Deploy via Vercel Dashboard

### Step 1: Prepare Your Repository

1. Ensure all your code is committed and pushed to GitHub
2. Make sure `.env.local` is in your `.gitignore` (it should be by default)

### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it as a Next.js project

### Step 3: Configure Root Directory

**Problem**: Vercel shows `app`, `lib`, `public` but NOT `inventory-app`

**Solution**: 
1. Click "Edit" next to Root Directory
2. In the text field, manually type: `inventory-app`
3. If it won't let you type, try:
   - Selecting the root option (`Inventory-Management-CRUD-Application` or `.`)
   - Then go to project Settings after creation and change it
   - OR use **Option B (CLI)** below instead

### Step 4: Other Settings

- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### Step 5: Add Environment Variables

Add these three environment variables in the Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://khtpuihswtvspwuhuooq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtodHB1aWhzd3R2c3B3dWh1b29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTcyOTcsImV4cCI6MjA4MTAzMzI5N30.ejGThFsiBP1gxNemlLVAVfYvgdJdgRLF3nBQJVknt5c
DATABASE_URL=postgresql://postgres.khtpuihswtvspwuhuooq:Abre2003!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

**Important**: These should be added to the "Production" environment (and optionally Preview/Development)

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-3 minutes)
3. Once deployed, you'll get a live URL like `https://your-app.vercel.app`

**If deployment fails**, the root directory is likely wrong. Go to project Settings → General → Root Directory and change it to `inventory-app`, then redeploy.

---

## Option B: Deploy via Vercel CLI (Recommended if Dashboard doesn't work)

This method is more reliable when Vercel can't detect your folder structure correctly.

### Step 1: Install Vercel CLI

Open your terminal and run:

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate.

### Step 3: Navigate to Repository Root

Make sure you're in the `Inventory-Management-CRUD-Application` directory (not inside `inventory-app`):

```bash
cd path/to/Inventory-Management-CRUD-Application
```

### Step 4: Deploy

Run:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → `Y`
- **Which scope?** → Select your account
- **Link to existing project?** → `N` (first time)
- **What's your project's name?** → `inventory-app` (or your choice)
- **In which directory is your code located?** → `./inventory-app`

Vercel will now deploy your app!

### Step 5: Add Environment Variables

After the initial deployment, add your environment variables:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
```
When prompted, paste: `https://khtpuihswtvspwuhuooq.supabase.co`

```bash
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```
When prompted, paste: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtodHB1aWhzd3R2c3B3dWh1b29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTcyOTcsImV4cCI6MjA4MTAzMzI5N30.ejGThFsiBP1gxNemlLVAVfYvgdJdgRLF3nBQJVknt5c`

```bash
vercel env add DATABASE_URL production
```
When prompted, paste: `postgresql://postgres.khtpuihswtvspwuhuooq:Abre2003!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres`

### Step 6: Deploy to Production

Now deploy with environment variables:

```bash
vercel --prod
```

You'll get your production URL!

---

## Post-Deployment Steps

### 1. Verify Environment Variables

Go to your Vercel project dashboard:
- Navigate to **Settings** → **Environment Variables**
- Ensure all three variables are present

### 2. Configure Supabase CORS (if needed)

If you encounter CORS issues:
1. Go to your Supabase dashboard
2. Navigate to **Settings** → **API**
3. Add your Vercel domain to allowed origins

### 3. Test Your Deployment

Visit your deployed URL and test:
- ✅ Homepage loads
- ✅ Dashboard displays data
- ✅ Can add/edit inventory items
- ✅ Categories and suppliers work
- ✅ Stock movements are tracked

---

## Troubleshooting

### Build Fails

**Issue**: Build fails with TypeScript errors
- **Solution**: Run `npm run build` locally first to catch errors
- Fix any TypeScript issues before deploying

**Issue**: Missing dependencies
- **Solution**: Ensure `package.json` includes all dependencies
- Run `npm install` to verify

### Runtime Errors

**Issue**: "Failed to fetch" or database connection errors
- **Solution**: Verify environment variables are set correctly in Vercel
- Check that `DATABASE_URL` uses the connection pooler URL

**Issue**: 404 errors on routes
- **Solution**: 
  - Ensure root directory is set to `inventory-app` (not `Inventory-Management-CRUD-Application`)
  - Verify Next.js app structure is correct
  - The root should point to where `package.json` and `next.config.ts` are located

### Environment Variables Not Working

**Issue**: App can't connect to Supabase
- **Solution**: 
  - Redeploy after adding environment variables
  - Ensure variables are added to "Production" environment
  - Check for typos in variable names

---

## Continuous Deployment

Once set up, Vercel automatically deploys:
- **Production**: When you push to your main/master branch
- **Preview**: When you create a pull request

To disable auto-deployment:
1. Go to project **Settings** → **Git**
2. Configure deployment branches

---

## Custom Domain (Optional)

To add a custom domain:
1. Go to project **Settings** → **Domains**
2. Add your domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

---

## Monitoring and Analytics

Vercel provides built-in:
- **Analytics**: Track page views and performance
- **Logs**: View runtime logs in the dashboard
- **Speed Insights**: Monitor Core Web Vitals

Access these from your project dashboard.

---

## Security Notes

⚠️ **Important Security Considerations**:

1. **Never commit `.env.local`** to your repository
2. **Rotate credentials** if accidentally exposed
3. **Use Supabase RLS** (Row Level Security) for data protection
4. **Enable Vercel Authentication** if needed for admin access
5. **Monitor usage** in Supabase dashboard to detect anomalies

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Supabase + Vercel Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

**Your app is ready to deploy! 🚀**
