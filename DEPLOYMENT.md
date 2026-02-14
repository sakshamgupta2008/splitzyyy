# Deployment Guide - Splitzy

This guide walks you through deploying Splitzy to Vercel step-by-step.

## Prerequisites

- Git repository with your code
- Vercel account (free tier is sufficient)
- Firebase project set up
- All environment variables ready

## Step 1: Prepare Your Code

1. Ensure all code is committed to Git:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Verify `.gitignore` excludes:
   - `.env.local`
   - `node_modules/`
   - `.next/`

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub/GitLab/Bitbucket

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your Git repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_value
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
   NEXT_PUBLIC_FIREBASE_APP_ID=your_value
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Get your deployment URL

### Option B: Using Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Add Environment Variables**
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
# Repeat for all variables
```

5. **Redeploy with variables**
```bash
vercel --prod
```

## Step 3: Update Firebase Configuration

1. **Add Authorized Domain**
   - Go to Firebase Console
   - Navigate to Authentication → Settings → Authorized domains
   - Click "Add domain"
   - Add your Vercel domain: `your-project.vercel.app`
   - Click "Add"

2. **Verify Firestore Rules**
   - Go to Firestore Database → Rules
   - Ensure rules from `firestore.rules` are deployed
   - Click "Publish"

## Step 4: Test Deployment

1. **Open your Vercel URL**
   - Visit `https://your-project.vercel.app`

2. **Test Authentication**
   - Click "Continue with Google"
   - Verify successful login
   - Check if user profile appears

3. **Test Group Creation**
   - Create a test group
   - Verify join code generation
   - Check if group appears in dashboard

4. **Test Expense Addition**
   - Add a test expense
   - Verify balance calculations
   - Check real-time updates

5. **Test on Mobile**
   - Open site on mobile device
   - Verify responsive design
   - Test all features

## Step 5: Configure Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Click "Add"
   - Enter your custom domain
   - Follow DNS configuration instructions

2. **Update Firebase**
   - Add custom domain to Firebase authorized domains
   - Update environment variables if needed

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Solution: Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: Environment variables not found**
- Double-check all variables in Vercel dashboard
- Ensure no typos in variable names
- Redeploy after adding variables

### Authentication Issues

**Error: Unauthorized domain**
- Add Vercel domain to Firebase authorized domains
- Wait 2-3 minutes for changes to propagate
- Clear browser cache

**Error: Firebase initialization failed**
- Verify all Firebase environment variables
- Check Firebase project ID matches
- Ensure Firebase API key is correct

### Firestore Permission Denied

**Error: Missing or insufficient permissions**
- Deploy Firestore rules from `firestore.rules`
- Verify user is authenticated
- Check if user is group member
- Test rules in Firebase Console

### Deployment Not Updating

**Changes not visible**
```bash
# Force new deployment
vercel --prod --force
```

**Old build cached**
- Clear browser cache
- Try incognito/private window
- Check Vercel deployment logs

## Performance Optimization

1. **Enable Vercel Analytics** (Optional)
   - Go to Project Settings → Analytics
   - Enable Web Analytics
   - View performance metrics

2. **Configure Edge Functions** (Optional)
   - Vercel automatically optimizes Next.js
   - No additional configuration needed

3. **Monitor Build Times**
   - Check build logs for warnings
   - Optimize dependencies if needed
   - Use dynamic imports for large components

## Continuous Deployment

Vercel automatically deploys when you push to your repository:

1. **Push to Git**
```bash
git add .
git commit -m "Update feature"
git push origin main
```

2. **Automatic Build**
   - Vercel detects push
   - Starts build automatically
   - Deploys to production

3. **Preview Deployments**
   - Push to feature branch
   - Get preview URL
   - Test before merging

## Environment Management

### Production Environment
```bash
vercel env add VARIABLE_NAME production
```

### Preview Environment
```bash
vercel env add VARIABLE_NAME preview
```

### Development Environment
```bash
vercel env add VARIABLE_NAME development
```

## Rollback Deployment

If something goes wrong:

1. Go to Vercel Dashboard
2. Navigate to Deployments
3. Find previous working deployment
4. Click "..." → "Promote to Production"

Or using CLI:
```bash
vercel rollback
```

## Monitoring

1. **Vercel Logs**
   - View in dashboard under "Deployment" → "Logs"
   - Or use: `vercel logs`

2. **Firebase Logs**
   - Check Firebase Console
   - Monitor authentication events
   - Review Firestore usage

3. **Error Tracking** (Optional)
   - Integrate Sentry or similar
   - Track production errors
   - Get alerts for issues

## Security Checklist

- [ ] Environment variables set correctly
- [ ] Firebase rules deployed
- [ ] Authorized domains updated
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] No sensitive data in code
- [ ] Git repository is private (recommended)

## Cost Considerations

**Vercel Free Tier**
- 100 GB bandwidth per month
- Unlimited deployments
- Sufficient for personal/small projects

**Firebase Free Tier (Spark Plan)**
- 10 GB/month Firestore storage
- 50,000 reads/day
- 20,000 writes/day
- Good for testing and small apps

**Upgrade when needed:**
- Firebase Blaze Plan: Pay as you go
- Vercel Pro: $20/month for team features

## Next Steps

After successful deployment:

1. Share your app URL with users
2. Monitor usage and performance
3. Gather user feedback
4. Plan feature updates
5. Set up proper monitoring

## Support

For deployment issues:
- Check Vercel documentation
- Firebase documentation
- GitHub issues
- Community forums

---

**Congratulations!** Your Splitzy app is now live! 🎉
