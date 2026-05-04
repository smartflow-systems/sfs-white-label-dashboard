# sfs-white-label-dashboard — Claude Context

Role: Multi-tenant white-label admin platform for agencies and clients.
Repo: https://github.com/smartflow-systems/sfs-white-label-dashboard
Local: /home/garet/SFS/sfs-white-label-dashboard

## Purpose
White-label dashboard — agencies and clients get their own branded
instance with isolated data, custom branding, and role-based access.

## Key Features
- Multi-tenancy (isolated per tenant)
- Custom branding per tenant (logo, colours, name)
- Role-based access (Owner, Admin, Staff, Analyst)
- Stripe Connect per-tenant billing
- Client admin and user management

## Stack
Full-stack, Prisma ORM, PostgreSQL, JWT auth, Stripe Connect

## Key Files
- [src/tenants/] — tenant management
- [src/auth/] — JWT + RBAC
- [src/billing/] — Stripe Connect
- [src/dashboard/] — shared UI
- [prisma/schema.prisma] — multi-tenant data model
- [.github/workflows/ci.yml] — CI pipeline

## Health Check
GET /health → {"ok":true}

## Common Commands
npm run dev                    → Start dev server
npx prisma migrate dev         → Run migrations
npx prisma studio              → Open Prisma Studio

## Secrets
DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY,
STRIPE_WEBHOOK_SECRET, SFS_PAT

## Tenant Branding Defaults
Primary colour: #8B6914 (gold)
Background: #1a1008 (dark brown/black)
Accent: #C9A84C (light gold)

## Agent Reference
See: /mnt/c/Users/garet/OneDrive/Documents/SFS-ChatGPT-Upload/agents/white-label-agent.md


## Design System

All UI, brand, and visual decisions must follow the SmartFlow Systems Design System.

**Skill:** `sfs-design-system`
**Source:** https://github.com/smartflow-systems/sfs-claude-skills/tree/main/sfs-design-system/SKILL.md

### Non-negotiables
- Background: `#0D0D0D` always
- Gold gradient CTAs: `linear-gradient(135deg, #FFD700, #E6C200)` — black text
- Font: Inter (Google Fonts) only
- Cards: glass morphism, `rgba(255,215,0,0.22)` gold border
- Circuit canvas on all hero/landing sections
- Icons: Lucide React only — no emoji as icons
- No emoji in UI or headlines. No exclamation points in headlines.

**Before building any UI:** "Use the sfs-design-system skill"

