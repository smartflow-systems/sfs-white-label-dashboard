# 🚀 Quick Start - Get Running in 5 Minutes

This is the **fastest way** to get your SFS Family Dashboard up and running.

---

## Option 1: One-Command Setup (Recommended)

```bash
chmod +x scripts/setup.sh && ./scripts/setup.sh
```

This script will:
- ✅ Install all dependencies
- ✅ Create .env file
- ✅ Check your configuration
- ✅ Tell you exactly what's needed

Then just:
```bash
npm run dev
```

Open: http://localhost:5000

---

## Option 2: Manual 3-Step Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Environment File
```bash
cp .env.example .env
```

### Step 3: Start Server
```bash
npm run dev
```

Open: http://localhost:5000

**That's it!** The dashboard will run with demo data.

---

## 💳 To Enable Payments (Optional)

### 1. Get Stripe Keys (2 minutes)

1. Go to https://dashboard.stripe.com/register
2. Sign up (free)
3. Go to https://dashboard.stripe.com/apikeys
4. Copy your **test keys**

### 2. Add to .env

```bash
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

### 3. Create Products Automatically

```bash
node scripts/setup-stripe-products.js
```

This creates Pro & Enterprise plans automatically!

Copy the output to your `.env` file.

### 4. Test It

1. Restart server: `npm run dev`
2. Visit: http://localhost:5000/pricing
3. Click "Start Free Trial"
4. Use test card: `4242 4242 4242 4242`
5. Done! ✅

---

## 🗄️ To Add Database (Optional)

The dashboard works without a database, but to save real data:

### Option A: Replit (Easiest)
If deploying to Replit, database is auto-configured!

### Option B: Supabase (Free)
1. Go to https://supabase.com
2. Create project
3. Copy database URL
4. Add to `.env`:
```bash
DATABASE_URL=postgresql://...
```

5. Run migrations:
```bash
npm run db:push
```

---

## 🚀 Deploy to Production

### Replit (Fastest)

1. Go to https://replit.com
2. Click "Create Repl"
3. Choose "Import from GitHub"
4. Enter: `boweazy/sfs-white-label-dashboard`
5. Click "Import"
6. Add Secrets (same as .env variables)
7. Click "Run"
8. **LIVE!** 🎉

Your URL: `https://your-repl.yourusername.replit.app`

---

## 📊 What You Get

Even without any setup, you get:

- ✅ Full dashboard with golden theme
- ✅ 7 pages (Dashboard, Analytics, Pricing, etc.)
- ✅ Circuit flow animations
- ✅ Glass morphism design
- ✅ All UI components working

**With Stripe:** Accept real payments
**With Database:** Save user data
**With Both:** Full SaaS platform!

---

## 🆘 Troubleshooting

### Port Already in Use?
```bash
PORT=3000 npm run dev
```

### Can't Find Module?
```bash
npm install
```

### TypeScript Errors?
```bash
npm run check
```

### Still Stuck?
Check the full guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📖 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete setup (30 min read)
- **[ENHANCEMENTS.md](./ENHANCEMENTS.md)** - All features explained
- **[README.md](./README.md)** - Project overview

---

## 🎯 Next Steps

Once running:

1. **Customize Branding**
   - Update colors in `client/src/styles/sfs-complete-theme.css`
   - Add your logo

2. **Set Up Stripe**
   - Run `node scripts/setup-stripe-products.js`
   - Configure webhooks

3. **Deploy**
   - Push to Replit/Vercel
   - Share your pricing page!

4. **Start Earning**
   - Drive traffic to `/pricing`
   - Share referral links
   - Watch revenue grow! 💰

---

**Questions?** Create an issue on GitHub or check the docs.

**Ready to earn?** Follow this guide and you'll be accepting payments in 30 minutes!

---

Made with 💛 by the SFS Family team
