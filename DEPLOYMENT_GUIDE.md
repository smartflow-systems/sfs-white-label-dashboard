# SFS Family Dashboard - Complete Deployment Guide

This guide will walk you through deploying your SFS Family Dashboard with full monetization features enabled.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Replit)](#quick-start-replit)
3. [Environment Configuration](#environment-configuration)
4. [Stripe Setup](#stripe-setup)
5. [Database Setup](#database-setup)
6. [Production Deployment](#production-deployment)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before you begin, make sure you have:

- [ ] A GitHub account
- [ ] A Replit account (free tier works)
- [ ] A Stripe account ([sign up here](https://dashboard.stripe.com/register))
- [ ] PostgreSQL database (Replit provides this, or use Supabase/Railway)
- [ ] Node.js 20+ installed (for local development)

---

## 🚀 Quick Start (Replit)

### Step 1: Import from GitHub

1. Go to [Replit](https://replit.com)
2. Click "Create Repl"
3. Select "Import from GitHub"
4. Enter: `https://github.com/boweazy/sfs-white-label-dashboard`
5. Click "Import from GitHub"

### Step 2: Configure Secrets

In Replit, go to the "Secrets" tab (lock icon) and add these required variables:

```bash
PORT=5000
NODE_ENV=production
DATABASE_URL=your_postgres_connection_string
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Step 3: Run the Application

1. Click the "Run" button
2. Replit will:
   - Install dependencies (`npm install`)
   - Start the dev server (`npm run dev`)
   - Open your dashboard on port 5000

3. Your dashboard should open automatically!

---

## ⚙️ Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root (or use Replit Secrets):

```bash
# =================================
# SERVER
# =================================
PORT=5000
NODE_ENV=production

# =================================
# DATABASE
# =================================
DATABASE_URL=postgresql://user:password@host:5432/database

# =================================
# STRIPE (Get from https://dashboard.stripe.com/apikeys)
# =================================
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET

# =================================
# STRIPE PRODUCT IDs (Create in Stripe Dashboard)
# =================================
STRIPE_PRO_PRICE_ID=price_pro_monthly
STRIPE_PRO_ANNUAL_PRICE_ID=price_pro_annual
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_monthly
STRIPE_ENTERPRISE_ANNUAL_PRICE_ID=price_enterprise_annual

# =================================
# REFERRAL PROGRAM
# =================================
ENABLE_REFERRALS=true
REFERRAL_COMMISSION_RATE=0.30
```

### Optional Variables

```bash
# Authentication
JWT_SECRET=your-secret-key-here
SESSION_SECRET=another-secret-key

# Email (for notifications)
SENDGRID_API_KEY=SG.YOUR_KEY
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 💳 Stripe Setup

### Step 1: Create a Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Sign up for a free account
3. Complete your business profile

### Step 2: Get API Keys

1. Go to [API Keys](https://dashboard.stripe.com/apikeys)
2. Click "Reveal test key" for your Secret Key
3. Copy both:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

4. Add them to your `.env` or Replit Secrets:

```bash
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Step 3: Create Products & Prices

Create three subscription products in Stripe:

#### Pro Plan ($49/month)

1. Go to [Products](https://dashboard.stripe.com/products)
2. Click "Add product"
3. Enter:
   - Name: `SFS Pro Plan`
   - Description: `Professional tier with 100,000 API calls/month`
   - Pricing: **Recurring** - $49/month
4. Click "Save product"
5. Copy the **Price ID** (starts with `price_`) → Add to `.env` as `STRIPE_PRO_PRICE_ID`

6. Create an annual price:
   - Click "Add another price"
   - Amount: $490/year (save $98!)
   - Copy Price ID → `STRIPE_PRO_ANNUAL_PRICE_ID`

#### Enterprise Plan ($199/month)

1. Click "Add product"
2. Enter:
   - Name: `SFS Enterprise Plan`
   - Description: `Unlimited everything for enterprise clients`
   - Pricing: **Recurring** - $199/month
3. Save and copy Price IDs for monthly/annual

### Step 4: Set Up Webhooks

Webhooks let Stripe notify your app about events (payments, cancellations, etc.):

1. Go to [Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter endpoint URL:
   - **Replit**: `https://your-repl-name.yourusername.replit.app/api/stripe/webhook`
   - **Local**: `http://localhost:5000/api/stripe/webhook`

4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`) → `STRIPE_WEBHOOK_SECRET` in `.env`

### Step 5: Enable Customer Portal

Allow customers to manage their subscriptions:

1. Go to [Customer Portal](https://dashboard.stripe.com/settings/billing/portal)
2. Click "Activate test link"
3. Configure settings:
   - ✅ Allow customers to update payment methods
   - ✅ Allow customers to cancel subscriptions
   - ✅ Allow customers to switch plans
4. Save settings

---

## 🗄️ Database Setup

### Option 1: Use Replit Database (Easiest)

Replit provides a free PostgreSQL database:

1. In your Repl, go to the "Database" tab
2. Click "Create database"
3. Copy the connection string
4. Add to Secrets as `DATABASE_URL`

### Option 2: Supabase (Recommended for Production)

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the Connection String (URI mode)
5. Add to `.env` as `DATABASE_URL`

### Option 3: Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Provision PostgreSQL"
4. Copy connection string → `DATABASE_URL`

### Run Migrations

Once you have a database, run migrations to create tables:

```bash
npm run db:push
```

This will create all tables:
- `tenants`
- `users`
- `subscriptions`
- `referrals`
- `referral_commissions`
- `usage_records`
- `invoices`
- `activity_logs`

---

## 🌐 Production Deployment

### Deploy to Replit (Recommended)

Already covered in [Quick Start](#quick-start-replit)!

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard
4. Configure PostgreSQL connection

### Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your forked repo
5. Add environment variables
6. Deploy!

### Deploy to Render

1. Go to [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - Build Command: `npm run build`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

---

## 🧪 Testing

### Test the Application

1. **Visit the Dashboard**
   ```
   http://localhost:5000
   ```

2. **Test All Pages**
   - ✅ Dashboard - Metrics display
   - ✅ Analytics - Charts and exports
   - ✅ Pricing - 3 tiers visible
   - ✅ Billing - Usage tracking
   - ✅ Marketplace - Integrations
   - ✅ Referrals - Referral links work

3. **Test Stripe Checkout**
   - Go to `/pricing`
   - Click "Start Free Trial" on Pro plan
   - Should redirect to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`
   - Complete checkout
   - Should redirect back to `/billing?success=true`

4. **Test Webhooks**
   - Use Stripe CLI to test locally:
   ```bash
   stripe listen --forward-to localhost:5000/api/stripe/webhook
   ```

   - Trigger test events:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Stripe Test Cards

Use these for testing:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires 3D Secure**: `4000 0027 6000 3184`

Any future expiry date, any 3-digit CVC.

---

## 🔧 Troubleshooting

### Port Already in Use

If you see "EADDRINUSE":

```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=3000 npm run dev
```

### Stripe Webhook Failures

If webhooks aren't working:

1. Check webhook URL is correct
2. Verify `STRIPE_WEBHOOK_SECRET` is set
3. Check Stripe Dashboard → Webhooks → Event logs
4. Test with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:5000/api/stripe/webhook
   ```

### Database Connection Errors

If you see "connection refused":

1. Check `DATABASE_URL` is correct
2. Verify database is running
3. Check firewall settings
4. Try adding `?sslmode=require` to connection string

### Build Errors

If `npm run build` fails:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Environment Variables Not Loading

Make sure:
- `.env` file is in the project root
- Variables don't have quotes (except values with spaces)
- Replit Secrets are set correctly
- Restart the server after adding variables

---

## 📚 Next Steps

Once deployed:

1. **Switch to Live Mode**
   - Get production Stripe keys
   - Replace `pk_test_` with `pk_live_`
   - Replace `sk_test_` with `sk_live_`

2. **Configure Custom Domain**
   - Add custom domain in Replit/Vercel
   - Update Stripe webhook URL
   - Update `APP_URL` environment variable

3. **Set Up Email Notifications**
   - Add SendGrid API key
   - Configure email templates
   - Test invoice emails

4. **Enable Analytics**
   - Add Google Analytics ID
   - Set up conversion tracking
   - Monitor user behavior

5. **Launch Marketing**
   - Share on social media
   - Use referral program
   - Drive traffic to `/pricing`

---

## 🎉 Success Checklist

- [ ] Dashboard loads successfully
- [ ] All 7 pages render correctly
- [ ] Stripe checkout flow works
- [ ] Webhooks receive events
- [ ] Database migrations complete
- [ ] Environment variables set
- [ ] Production domain configured
- [ ] SSL certificate active
- [ ] Email notifications working
- [ ] Analytics tracking enabled

---

## 🆘 Support

Need help? Check these resources:

- **Documentation**: [ENHANCEMENTS.md](./ENHANCEMENTS.md)
- **Stripe Docs**: https://stripe.com/docs
- **Replit Docs**: https://docs.replit.com
- **GitHub Issues**: Create an issue on your repo

---

## 🎯 Revenue Goal Reminder

With 100 users:
- **MRR**: ~$4,100
- **Annual**: ~$50,000+
- **With referrals**: Add 20-30% more

**Now go make it happen!** 💰🚀

---

**Last Updated**: 2025-12-18
**Version**: 2.0.0
**Author**: SFS Family Team
