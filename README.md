# SFS Family Dashboard 💎

> A revenue-generating multi-tenant SaaS dashboard with luxurious gold & marble theme

Part of the **SmartFlow Systems** ecosystem - Built to sell.

![License](https://img.shields.io/badge/license-Proprietary-gold)
![Version](https://img.shields.io/badge/version-2.0.0-gold)
![Node](https://img.shields.io/badge/node-20%2B-gold)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-gold)

---

## ✨ What Makes This Special

This isn't just another dashboard template - it's a **complete selling machine** with:

- 💰 **3-tier monetization** (Free, Pro $49, Enterprise $199)
- 💳 **Stripe integration** ready to accept payments
- 🎁 **30% referral program** for viral growth
- 📊 **Usage tracking** with intelligent upgrade prompts
- 🛍️ **Integration marketplace** with 8+ premium connectors
- 🎨 **SFS gold & marble theme** with circuit flow animations
- ⚡ **Glass morphism design** with smooth transitions

**Target Revenue:** $4,100 MRR with 100 users

---

## 🎯 Key Features

### Monetization System
- **Pricing Page** - 3-tier subscription model with annual billing
- **Billing Dashboard** - Real-time usage tracking & quota monitoring
- **Stripe Checkout** - Seamless payment flow with 14-day free trials
- **Customer Portal** - Self-service subscription management
- **Referral Program** - 30% recurring commission tracking
- **Integration Marketplace** - Premium add-ons for additional revenue

### User Experience
- **Golden Circuit Flow** - Animated circuit board backgrounds
- **Glass Morphism** - Translucent cards with golden borders
- **Smooth Animations** - Fade-in, slide-up, scale transitions
- **Dark/Light Modes** - Theme toggle with persistence
- **Responsive Design** - Mobile-first, works everywhere
- **Command Palette** - Press ⌘K for quick navigation

### Technical Excellence
- **Multi-Tenant Architecture** - Isolated data per client
- **PostgreSQL Database** - Scalable with Drizzle ORM
- **TypeScript** - Type-safe throughout
- **React 19** - Latest features & performance
- **Vite Build** - Lightning-fast development
- **shadcn/ui** - Beautiful, accessible components

---

## 🚀 Quick Start

### Option 1: Deploy to Replit (Fastest)

1. Click: [![Run on Repl.it](https://replit.com/badge/github/boweazy/sfs-white-label-dashboard)](https://replit.com/new/github/boweazy/sfs-white-label-dashboard)
2. Add Secrets (Environment Variables):
   ```
   PORT=5000
   DATABASE_URL=your_postgres_url
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```
3. Click "Run"
4. Your dashboard is live! 🎉

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/boweazy/sfs-white-label-dashboard.git
cd sfs-white-label-dashboard

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your .env file with:
# - Database URL (PostgreSQL)
# - Stripe API keys
# - Other settings

# Run database migrations
npm run db:push

# Start development server
npm run dev

# Open http://localhost:5000
```

---

## 📁 Project Structure

```
sfs-white-label-dashboard/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── circuit-background.tsx
│   │   │   └── upgrade-modal.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── dashboard.tsx
│   │   │   ├── analytics.tsx
│   │   │   ├── pricing.tsx        # 💰 Monetization
│   │   │   ├── billing.tsx        # 💳 Usage tracking
│   │   │   ├── marketplace.tsx    # 🛍️ Integrations
│   │   │   └── referrals.tsx      # 🎁 Referral program
│   │   ├── lib/             # Utilities
│   │   └── styles/          # SFS theme CSS
│   └── index.html
├── server/                    # Express backend
│   ├── routes/
│   │   └── stripe.ts        # 💳 Stripe API routes
│   ├── lib/
│   │   └── stripe.ts        # 💰 Stripe utilities
│   └── index.ts
├── shared/
│   └── schema.ts            # 🗄️ Database schema (Drizzle)
├── .env.example             # Environment template
├── .replit                  # Replit configuration
├── DEPLOYMENT_GUIDE.md      # 📖 Complete setup guide
├── ENHANCEMENTS.md          # 📋 Feature documentation
└── README.md                # This file
```

---

## 💰 Revenue Model

### Subscription Tiers

| Tier | Price | API Calls | Storage | Features |
|------|-------|-----------|---------|----------|
| **Free** | $0 | 1,000/mo | 100 MB | Basic dashboard, 7-day retention |
| **Pro** | $49/mo | 100,000/mo | 10 GB | Custom branding, 90-day retention, Premium integrations |
| **Enterprise** | $199/mo | Unlimited | 1 TB | White-label, API access, Dedicated support |

### Revenue Projections (100 users)

- 50 Free users: $0
- 40 Pro users: $1,960/mo
- 10 Enterprise: $1,990/mo
- **Base MRR: $3,950**
- With referrals (+10%): **$4,100 MRR**
- **Annual: ~$50,000**

### Referral Program

- **30% recurring commission** on all payments
- Unique referral codes for each user
- Automatic commission tracking
- 4 reward tiers (Bronze → Platinum)

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Query** - Data fetching
- **Wouter** - Routing

### Backend
- **Node.js 20+** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe queries
- **Stripe** - Payment processing
- **JWT** - Authentication

### Infrastructure
- **Replit** - Hosting (recommended)
- **Vercel** - Alternative hosting
- **Railway** - Database hosting
- **GitHub Actions** - CI/CD

---

## ⚙️ Environment Variables

Required variables:

```bash
# Server
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Product IDs (create in Stripe Dashboard)
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# Referrals
ENABLE_REFERRALS=true
REFERRAL_COMMISSION_RATE=0.30
```

See [.env.example](./.env.example) for complete list.

---

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment walkthrough
- **[ENHANCEMENTS.md](./ENHANCEMENTS.md)** - Feature documentation
- **[design_guidelines.md](./design_guidelines.md)** - Design system guide

---

## 🧪 Testing

### Test Locally

```bash
npm run dev
```

Visit: `http://localhost:5000`

### Test Stripe Integration

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Test Webhooks

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5000/api/stripe/webhook

# Trigger events
stripe trigger checkout.session.completed
```

---

## 📊 Pages & Routes

| Route | Description | Features |
|-------|-------------|----------|
| `/` | Dashboard | Metrics, charts, API stats |
| `/analytics` | Analytics | Data exports, performance tracking |
| `/connections` | API Connections | Integration management |
| `/marketplace` | Integration Marketplace | 8+ premium integrations |
| `/pricing` | Pricing Plans | 3-tier pricing, annual toggle |
| `/billing` | Billing Dashboard | Usage tracking, invoices |
| `/referrals` | Referral Program | Commission tracking, sharing |
| `/settings` | Account Settings | Profile, preferences |

---

## 🎨 SFS Gold Theme

The dashboard features a luxurious gold & marble aesthetic:

```css
/* Primary Gold */
--gold: #D4AF37;

/* Dark Marble */
--bg-dark: hsl(20 10% 12%);

/* Glass Effect */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(212, 175, 55, 0.2);
```

### Custom CSS Classes

- `.glass-card` - Glass morphism background
- `.border-border-gold` - Golden border
- `.hover-elevate-gold` - Gold glow on hover
- `.text-gold-shimmer` - Animated shimmer
- `.animate-fade-in` - Fade-in animation
- `.animate-slide-up` - Slide-up animation

---

## 🚀 Deployment

### Replit (Recommended)

1. Import from GitHub
2. Add environment secrets
3. Click "Run"
4. Done! ✅

### Vercel

```bash
vercel
```

### Railway

```bash
railway up
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
npm run check        # TypeScript type check
npm run db:push      # Push database schema
npm run db:studio    # Open Drizzle Studio
```

---

## 📈 Next Steps

1. **Set up Stripe**
   - Create products & prices
   - Configure webhooks
   - Test checkout flow

2. **Deploy**
   - Push to Replit/Vercel
   - Configure environment variables
   - Test production build

3. **Launch Marketing**
   - Share pricing page
   - Activate referral program
   - Drive traffic

4. **Monitor & Optimize**
   - Track conversions
   - Analyze usage patterns
   - Optimize pricing

---

## 🤝 Contributing

This is a proprietary project by **SmartFlow Systems**. Internal contributions follow organization standards.

---

## 📄 License

Proprietary - SmartFlow Systems

Copyright © 2025 SmartFlow Systems. All rights reserved.

---

## 💎 Built With

- Love ❤️
- TypeScript 💙
- Golden luxury 💛
- Revenue in mind 💰

---

**Ready to start generating revenue?**

👉 [Deploy to Replit](https://replit.com/new/github/boweazy/sfs-white-label-dashboard) | 👉 [Read Deployment Guide](./DEPLOYMENT_GUIDE.md) | 👉 [View Demo](#)

**Questions?** Check out [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) or create an issue.

---

Made with 💛 by the **SFS Family** team
