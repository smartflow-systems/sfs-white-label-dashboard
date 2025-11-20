# 🏢 Multi-Tenant White-Label System - Complete Guide

**SFS White-Label Dashboard - Agency Partner Platform**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Tenant Isolation](#tenant-isolation)
5. [API Endpoints](#api-endpoints)
6. [Usage Examples](#usage-examples)
7. [Subscription Tiers](#subscription-tiers)
8. [Security](#security)
9. [Development](#development)
10. [Deployment](#deployment)

---

## Overview

The SFS White-Label Dashboard is a **multi-tenant SaaS platform** that allows agencies to:

- ✅ Resell SFS tools under their own brand
- ✅ Manage multiple clients from one dashboard
- ✅ Customize branding (logo, colors, domain)
- ✅ Track usage and billing per tenant
- ✅ Isolate data completely between agencies

### Business Model

**Target Customers:** Marketing agencies, web development agencies, consultants

**Pricing:**
- Free: 3 users, 10 clients, 1GB storage
- Starter ($29/mo): 10 users, 50 clients, 10GB storage
- Pro ($99/mo): 50 users, 500 clients, 100GB storage
- Enterprise (custom): Unlimited everything

**Revenue:** Recurring monthly subscriptions from agencies

---

## Architecture

### Core Concepts

1. **Tenant** = Agency/Partner (e.g., "Acme Marketing Agency")
2. **User** = Agency employee (belongs to ONE tenant)
3. **Client** = Agency's customer (belongs to ONE tenant)

### Data Isolation Strategy

**Every table has `tenantId`** - all queries are scoped to the current tenant.

```
┌─────────────────────────────────────────┐
│         Request from agency.com         │
└─────────────────┬───────────────────────┘
                  │
                  ▼
          ┌───────────────┐
          │ Tenant        │
          │ Middleware    │ ← Resolves tenant from domain/subdomain
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │ Tenant-Scoped │
          │ Database      │ ← All queries filtered by tenantId
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │ PostgreSQL    │
          │ + Drizzle ORM │
          └───────────────┘
```

---

## Database Schema

### Tenants Table

```typescript
{
  id: UUID (primary key)
  name: string
  subdomain: string (unique) // e.g., "acme"
  customDomain?: string      // e.g., "dashboard.acme.com"

  // Branding
  logo?: string
  primaryColor: string       // Default: #FFD700 (SFS Gold)
  secondaryColor: string     // Default: #3B2F2F (SFS Brown)
  accentColor: string        // Default: #0D0D0D (SFS Black)

  // Billing
  subscriptionTier: 'free' | 'starter' | 'pro' | 'enterprise'
  subscriptionStatus: 'trial' | 'active' | 'past_due' | 'canceled'
  stripeCustomerId?: string
  stripeSubscriptionId?: string

  // Limits
  maxUsers: number
  maxClients: number
  maxStorageGB: number

  // Features
  enabledFeatures: string[] // e.g., ['dashboard', 'analytics', 'api_access']

  // Status
  isActive: boolean
  isSuspended: boolean
  suspensionReason?: string

  // Timestamps
  createdAt: timestamp
  updatedAt: timestamp
  lastLoginAt?: timestamp
}
```

### Users Table

```typescript
{
  id: UUID (primary key)
  tenantId: UUID (foreign key → tenants.id) ← CRITICAL!

  // Auth
  username: string
  email: string
  password: string (hashed)

  // Profile
  firstName?: string
  lastName?: string
  avatar?: string

  // Role within their tenant
  role: 'owner' | 'admin' | 'member' | 'viewer'
  permissions: string[] // e.g., ['read', 'write', 'admin', 'billing']

  // Status
  isActive: boolean
  emailVerified: boolean

  // Timestamps
  createdAt: timestamp
  lastLoginAt?: timestamp
}
```

### Clients Table

```typescript
{
  id: UUID (primary key)
  tenantId: UUID (foreign key → tenants.id) ← CRITICAL!

  // Client Info
  name: string
  email?: string
  phone?: string
  company?: string

  // Status
  status: 'active' | 'inactive' | 'churned'

  // Custom Fields (tenant-defined)
  customFields: JSONB

  // Timestamps
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Other Tables

All other tables follow the same pattern:
- **API Connections** - tenant-scoped
- **Dashboard Widgets** - tenant-scoped
- **Activity Logs** - tenant-scoped
- **Subscription Plans** - global (not scoped)

---

## Tenant Isolation

### How Tenant Resolution Works

**Request Flow:**

1. **Domain/Subdomain Detection**
   ```
   Request: https://acme.sfsplatform.com/dashboard
   → Extract subdomain: "acme"
   → Query: SELECT * FROM tenants WHERE subdomain = 'acme'
   → Attach tenant to req.tenant
   ```

2. **Custom Domain Detection**
   ```
   Request: https://dashboard.acme.com/clients
   → Check custom domains: SELECT * FROM tenants WHERE customDomain = 'dashboard.acme.com'
   → Attach tenant to req.tenant
   ```

3. **Header-Based (API requests)**
   ```
   Request: GET /api/clients
   Headers: { 'X-Tenant-ID': 'uuid-here' }
   → Attach tenant to req.tenant
   ```

4. **Query Parameter (Dev only)**
   ```
   Request: http://localhost:3000/api/users?tenant=uuid-here
   → Attach tenant to req.tenant
   ```

### Middleware Stack

```typescript
// server/middleware/tenant.ts
app.use(resolveTenant);        // Determine which tenant
app.use(requireTenant);         // Ensure tenant exists
app.use(requireFeature('api')); // Check feature access
app.use(requireTier('pro'));    // Check subscription tier
```

### Data Access Layer

```typescript
// server/lib/tenant-db.ts
const tenantDb = createTenantDb(req.tenantId);

// All queries automatically scoped
const users = await tenantDb.getUsers();
// SELECT * FROM users WHERE tenantId = 'current-tenant-id'

const client = await tenantDb.createClient({ name: 'New Client' });
// INSERT INTO clients (tenantId, name) VALUES ('current-tenant-id', 'New Client')
```

**Security Guarantee:** It's **impossible** for Tenant A to access Tenant B's data.

---

## API Endpoints

### Public Endpoints (No Auth)

#### `POST /api/tenants/register`

Register a new agency.

**Request:**
```json
{
  "name": "Acme Marketing Agency",
  "subdomain": "acme",
  "email": "owner@acme.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "companyEmail": "info@acme.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Agency registered successfully!",
  "tenant": {
    "id": "uuid",
    "name": "Acme Marketing Agency",
    "subdomain": "acme",
    "subscriptionTier": "free",
    "url": "https://acme.sfsplatform.com"
  },
  "user": {
    "id": "uuid",
    "email": "owner@acme.com",
    "role": "owner"
  }
}
```

#### `GET /api/tenants/check-subdomain/:subdomain`

Check if subdomain is available.

**Response:**
```json
{
  "available": true,
  "subdomain": "acme"
}
```

---

### Protected Endpoints (Require Tenant)

#### `GET /api/tenants/current`

Get current tenant information.

**Headers:**
```
X-Tenant-ID: uuid-here
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Acme Marketing Agency",
  "subdomain": "acme",
  "customDomain": "dashboard.acme.com",
  "logo": "https://...",
  "primaryColor": "#FF5733",
  "secondaryColor": "#3B2F2F",
  "subscriptionTier": "pro",
  "subscriptionStatus": "active",
  "maxUsers": 50,
  "maxClients": 500,
  "enabledFeatures": ["dashboard", "analytics", "api_access"]
}
```

#### `PATCH /api/tenants/current`

Update tenant settings.

**Request:**
```json
{
  "name": "New Agency Name",
  "logo": "https://new-logo-url.com/logo.png",
  "primaryColor": "#FF5733",
  "companyEmail": "hello@acme.com"
}
```

#### `GET /api/tenants/stats`

Get usage statistics.

**Response:**
```json
{
  "users": {
    "current": 5,
    "max": 50,
    "percentage": 10
  },
  "clients": {
    "current": 120,
    "max": 500,
    "percentage": 24
  },
  "storage": {
    "current": 0,
    "max": 100,
    "percentage": 0
  },
  "subscription": {
    "tier": "pro",
    "status": "active",
    "features": ["dashboard", "analytics", "api_access"]
  }
}
```

#### `GET /api/tenants/subscription-plans`

Get available subscription plans.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Starter",
    "slug": "starter",
    "priceMonthly": 2900,
    "maxUsers": 10,
    "maxClients": 50,
    "features": ["dashboard", "basic_analytics"]
  }
]
```

#### `POST /api/tenants/upgrade`

Initiate subscription upgrade.

**Request:**
```json
{
  "planSlug": "pro",
  "billingCycle": "monthly"
}
```

---

## Usage Examples

### Example 1: Agency Registration Flow

```typescript
// Step 1: Check if subdomain is available
const checkResponse = await fetch('/api/tenants/check-subdomain/acme');
const { available } = await checkResponse.json();

if (!available) {
  alert('Subdomain taken');
  return;
}

// Step 2: Register agency
const registerResponse = await fetch('/api/tenants/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Acme Marketing',
    subdomain: 'acme',
    email: 'owner@acme.com',
    password: 'secure123',
    firstName: 'John',
    lastName: 'Doe',
  }),
});

const { tenant, user } = await registerResponse.json();

// Step 3: Redirect to their dashboard
window.location.href = `https://${tenant.subdomain}.sfsplatform.com/dashboard`;
```

### Example 2: Tenant-Scoped Data Access

```typescript
// In your API route (server-side)
import { requireTenant } from '../middleware/tenant';
import { createTenantDb } from '../lib/tenant-db';

app.get('/api/clients', requireTenant, async (req, res) => {
  const tenantDb = createTenantDb(req.tenantId!);

  // This query is automatically scoped to current tenant
  const clients = await tenantDb.getClients();

  res.json(clients);
});
```

### Example 3: Feature Gating

```typescript
import { requireFeature } from '../middleware/tenant';

// Only tenants with 'api_access' feature can use this
app.get('/api/integrations', requireFeature('api_access'), async (req, res) => {
  // ... API integration logic
});
```

### Example 4: Subscription Tier Check

```typescript
import { requireTier } from '../middleware/tenant';

// Only Pro or Enterprise can export data
app.post('/api/export', requireTier('pro'), async (req, res) => {
  // ... export logic
});
```

---

## Subscription Tiers

| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| **Price** | $0 | $29/mo | $99/mo | Custom |
| **Users** | 3 | 10 | 50 | Unlimited |
| **Clients** | 10 | 50 | 500 | Unlimited |
| **Storage** | 1 GB | 10 GB | 100 GB | Unlimited |
| **Custom Domain** | ❌ | ✅ | ✅ | ✅ |
| **API Access** | ❌ | ❌ | ✅ | ✅ |
| **Advanced Analytics** | ❌ | ❌ | ✅ | ✅ |
| **White Glove Support** | ❌ | ❌ | ❌ | ✅ |
| **SLA** | - | - | 99.9% | 99.99% |

---

## Security

### Data Isolation

1. **Database Level:** Every query includes `WHERE tenantId = ?`
2. **Middleware Level:** Requests without valid tenant are rejected
3. **Application Level:** TenantDatabase class enforces scoping

### Best Practices

1. **Never trust client-provided tenantId**
   ```typescript
   // ❌ BAD
   const tenantId = req.body.tenantId; // User could fake this!

   // ✅ GOOD
   const tenantId = req.tenant.id; // From middleware (trusted)
   ```

2. **Always use TenantDatabase**
   ```typescript
   // ❌ BAD
   const users = await db.select().from(users); // NO TENANT SCOPE!

   // ✅ GOOD
   const tenantDb = createTenantDb(req.tenantId);
   const users = await tenantDb.getUsers(); // Auto-scoped
   ```

3. **Encrypt sensitive data**
   - API keys in `api_connections` table
   - Payment information
   - Personal information

---

## Development

### Setup

```bash
# Install dependencies
npm install

# Copy environment
cp .env.example .env

# Add database connection
echo "DATABASE_URL=postgresql://..." >> .env

# Push schema to database
npm run db:push

# Start dev server
npm run dev
```

### Testing Multi-Tenancy

**Option 1: Subdomains (requires DNS)**
```bash
# Add to /etc/hosts
127.0.0.1 acme.localhost
127.0.0.1 beta.localhost

# Access
http://acme.localhost:3000
```

**Option 2: Query Parameter (dev only)**
```bash
http://localhost:3000/dashboard?tenant=uuid-here
```

**Option 3: Header**
```bash
curl -H "X-Tenant-ID: uuid-here" http://localhost:3000/api/clients
```

---

## Deployment

### Production Checklist

- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Enable SSL/TLS
- [ ] Set up wildcard subdomain DNS (*.sfsplatform.com → your server)
- [ ] Configure Stripe for billing
- [ ] Set up email service (SendGrid, AWS SES)
- [ ] Enable database backups
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Configure CDN for assets

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Server
NODE_ENV=production
PORT=3000

# Domain
BASE_DOMAIN=sfsplatform.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SENDGRID_API_KEY=SG...

# Session
SESSION_SECRET=random-secret-here
```

### Wildcard Subdomain Setup

**Cloudflare/DNS:**
```
A    *     → 123.45.67.89
CNAME @     → main-domain.com
```

This allows:
- `acme.sfsplatform.com` → Your server
- `beta.sfsplatform.com` → Your server
- `anything.sfsplatform.com` → Your server

---

## Next Steps

### Immediate (MVP)

- [x] Multi-tenant database schema
- [x] Tenant middleware and isolation
- [x] Tenant-scoped data access layer
- [x] Agency registration API
- [ ] Frontend UI for agency signup
- [ ] Frontend dashboard for agencies

### Phase 2 (Revenue Ready)

- [ ] Stripe billing integration
- [ ] Subscription upgrade/downgrade
- [ ] Usage tracking and limits
- [ ] Email verification
- [ ] Password reset

### Phase 3 (Scale)

- [ ] Analytics dashboard
- [ ] Webhook system
- [ ] API documentation
- [ ] Partner program
- [ ] Reseller tiers

---

## Support

**Documentation:** See README.md, AGENTS.md

**Issues:** https://github.com/smartflow-systems/sfs-white-label-dashboard/issues

**Internal:** This is a SmartFlow Systems internal tool

---

**Built with:** TypeScript, React, Express, PostgreSQL, Drizzle ORM

**Part of:** SmartFlow Systems Ecosystem

**Last Updated:** November 20, 2025
