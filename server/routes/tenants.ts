import express from 'express';
import { db } from '../storage';
import { tenants, users, subscriptionPlans, type InsertTenant } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { resolveTenant, requireTenant } from '../middleware/tenant';
import { createTenantDb } from '../lib/tenant-db';

const router = express.Router();

// Apply tenant resolution to all routes
router.use(resolveTenant);

// ==================== PUBLIC ROUTES (No Auth Required) ====================

/**
 * POST /api/tenants/register
 * Register a new agency/tenant
 */
router.post('/register', async (req, res) => {
  try {
    const { name, subdomain, email, password, firstName, lastName, companyEmail } = req.body;

    // Validation
    if (!name || !subdomain || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'subdomain', 'email', 'password'],
      });
    }

    // Check if subdomain is already taken
    const [existing] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.subdomain, subdomain.toLowerCase()))
      .limit(1);

    if (existing) {
      return res.status(409).json({
        error: 'Subdomain already taken',
        message: `The subdomain "${subdomain}" is not available`,
      });
    }

    // Create tenant (agency)
    const [tenant] = await db
      .insert(tenants)
      .values({
        name,
        subdomain: subdomain.toLowerCase(),
        companyEmail: companyEmail || email,
        subscriptionTier: 'free',
        subscriptionStatus: 'trial',
        maxUsers: 3,
        maxClients: 10,
        maxStorageGB: 1,
        enabledFeatures: ['dashboard', 'basic_analytics'],
        isActive: true,
      } as InsertTenant)
      .returning();

    // Create owner user for this tenant
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const [owner] = await db
      .insert(users)
      .values({
        tenantId: tenant.id,
        username: email.split('@')[0],
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'owner',
        permissions: ['read', 'write', 'admin', 'billing'],
        isActive: true,
        emailVerified: false,
      })
      .returning();

    // Return success (without password!)
    const { password: _, ...userWithoutPassword } = owner;

    res.status(201).json({
      success: true,
      message: 'Agency registered successfully!',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        subscriptionTier: tenant.subscriptionTier,
        url: `https://${tenant.subdomain}.sfsplatform.com`,
      },
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Tenant registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/tenants/check-subdomain/:subdomain
 * Check if a subdomain is available
 */
router.get('/check-subdomain/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;

    const [existing] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.subdomain, subdomain.toLowerCase()))
      .limit(1);

    res.json({
      available: !existing,
      subdomain: subdomain.toLowerCase(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PROTECTED ROUTES (Require Tenant) ====================

/**
 * GET /api/tenants/current
 * Get current tenant information
 */
router.get('/current', requireTenant, async (req, res) => {
  try {
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, req.tenantId!))
      .limit(1);

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Don't expose sensitive data
    const { stripeCustomerId, stripeSubscriptionId, ...safeTenant } = tenant;

    res.json(safeTenant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/tenants/current
 * Update current tenant settings
 */
router.patch('/current', requireTenant, async (req, res) => {
  try {
    const {
      name,
      logo,
      primaryColor,
      secondaryColor,
      accentColor,
      companyEmail,
      companyPhone,
      companyAddress,
      customDomain,
    } = req.body;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (logo) updateData.logo = logo;
    if (primaryColor) updateData.primaryColor = primaryColor;
    if (secondaryColor) updateData.secondaryColor = secondaryColor;
    if (accentColor) updateData.accentColor = accentColor;
    if (companyEmail) updateData.companyEmail = companyEmail;
    if (companyPhone) updateData.companyPhone = companyPhone;
    if (companyAddress) updateData.companyAddress = companyAddress;
    if (customDomain) updateData.customDomain = customDomain;

    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(tenants)
      .set(updateData)
      .where(eq(tenants.id, req.tenantId!))
      .returning();

    // Log activity
    const tenantDb = createTenantDb(req.tenantId!);
    await tenantDb.logActivity({
      action: 'tenant.updated',
      resource: 'tenant',
      resourceId: req.tenantId!,
      details: { fields: Object.keys(updateData) },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/tenants/stats
 * Get usage statistics for current tenant
 */
router.get('/stats', requireTenant, async (req, res) => {
  try {
    const tenantDb = createTenantDb(req.tenantId!);

    const [userCount, clientCount] = await Promise.all([
      tenantDb.countUsers(),
      tenantDb.countClients(),
    ]);

    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, req.tenantId!))
      .limit(1);

    res.json({
      users: {
        current: userCount,
        max: tenant.maxUsers,
        percentage: tenant.maxUsers ? (userCount / tenant.maxUsers) * 100 : 0,
      },
      clients: {
        current: clientCount,
        max: tenant.maxClients,
        percentage: tenant.maxClients ? (clientCount / tenant.maxClients) * 100 : 0,
      },
      storage: {
        current: 0, // TODO: Implement storage tracking
        max: tenant.maxStorageGB,
        percentage: 0,
      },
      subscription: {
        tier: tenant.subscriptionTier,
        status: tenant.subscriptionStatus,
        features: tenant.enabledFeatures,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/tenants/subscription-plans
 * Get available subscription plans
 */
router.get('/subscription-plans', async (req, res) => {
  try {
    const plans = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.isPublic, true))
      .where(eq(subscriptionPlans.isActive, true));

    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/tenants/upgrade
 * Initiate subscription upgrade
 */
router.post('/upgrade', requireTenant, async (req, res) => {
  try {
    const { planSlug, billingCycle } = req.body; // billingCycle: 'monthly' | 'yearly'

    if (!planSlug) {
      return res.status(400).json({ error: 'planSlug is required' });
    }

    // Get the plan
    const [plan] = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.slug, planSlug))
      .limit(1);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // In production, this would:
    // 1. Create Stripe checkout session
    // 2. Redirect to Stripe
    // 3. Handle webhook after payment
    // For now, return mock data

    res.json({
      message: 'Upgrade initiated',
      plan,
      billingCycle,
      checkoutUrl: '/checkout?plan=' + planSlug,
      // TODO: Implement Stripe integration
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
