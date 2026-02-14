# 🚀 Quick Start Guide - Splitzy

Get Splitzy running in 5 minutes!

## ⚡ Fast Track Setup

### Step 1: Install Dependencies (30 seconds)
```bash
npm install
```

### Step 2: Firebase Setup (2 minutes)

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Google Authentication:
   - Go to Authentication → Sign-in method
   - Enable Google
3. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
4. Get your config:
   - Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy configuration values

### Step 3: Environment Variables (1 minute)

Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 4: Deploy Firestore Rules (1 minute)

1. Go to Firestore Database → Rules
2. Copy content from `firestore.rules`
3. Paste and publish

### Step 5: Run! (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000

## ✅ Test Checklist

- [ ] Sign in with Google works
- [ ] Can create a group
- [ ] Can join group with code
- [ ] Can add expense
- [ ] Balances calculate correctly

## 🎉 You're Done!

Your Splitzy app is running locally.

### Next Steps:

1. **Test with multiple users** (open in incognito for 2nd user)
2. **Deploy to Vercel** (see DEPLOYMENT.md)
3. **Share with friends**

## 🆘 Quick Troubleshooting

**Problem**: Login doesn't work
- ✅ Check Firebase config is correct
- ✅ Verify Google sign-in is enabled

**Problem**: Permission denied
- ✅ Deploy Firestore rules
- ✅ Check if user is signed in

**Problem**: Build errors
- ✅ Delete node_modules and reinstall
- ✅ Check Node.js version (need 18+)

## 📚 Full Documentation

- README.md - Complete documentation
- DEPLOYMENT.md - Vercel deployment guide
- SCHEMA.md - Database schema details

## 💡 Pro Tips

1. **Testing**: Use Chrome DevTools → Application → Clear Storage between tests
2. **Debugging**: Check browser console and Network tab for errors
3. **Multiple Users**: Use incognito windows to test with different accounts

---

Happy expense splitting! 💰✨
