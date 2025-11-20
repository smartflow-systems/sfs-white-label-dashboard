import { Request, Response, NextFunction } from 'express';
import { db } from '../storage';
import { tenants } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// Extend Express Request to include tenant
declare global {
  namespace Express {
    interface Request {
      tenant?: {
        id: string;
        name: string;
        subdomain: string;
        customDomain?: string | null;
        subscriptionTier: string;
        subscriptionStatus: string;
        enabledFeatures: string[];
        primaryColor?: string | null;
        secondaryColor?: string | null;
        accentColor?: string | null;
      };
      tenantId?: string;
    }
  }
}

/**
 * Tenant Resolution Middleware
 *
 * Determines which tenant the request belongs to based on:
 * 1. Custom domain (e.g., agency.com)
 * 2. Subdomain (e.g., agency.sfsplatform.com)
 * 3. Header (X-Tenant-ID) for API requests
 * 4. Query parameter (?tenant=xxx) for development
 */
export async function resolveTenant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let tenantId: string | null = null;
    let tenant: any = null;

    // Method 1: Check for X-Tenant-ID header (API requests)
    const tenantHeader = req.headers['x-tenant-id'] as string;
    if (tenantHeader) {
      tenantId = tenantHeader;
    }

    // Method 2: Check subdomain (e.g., agency.sfsplatform.com)
    if (!tenantId) {
      const host = req.hostname;
      const parts = host.split('.');

      // If subdomain exists (more than 2 parts like agency.sfsplatform.com)
      if (parts.length > 2) {
        const subdomain = parts[0];

        // Find tenant by subdomain
        const [foundTenant] = await db
          .select()
          .from(tenants)
          .where(eq(tenants.subdomain, subdomain))
          .limit(1);

        if (foundTenant) {
          tenant = foundTenant;
          tenantId = foundTenant.id;
        }
      }
    }

    // Method 3: Check custom domain (e.g., agency.com)
    if (!tenantId) {
      const host = req.hostname;

      const [foundTenant] = await db
        .select()
        .from(tenants)
        .where(eq(tenants.customDomain, host))
        .limit(1);

      if (foundTenant) {
        tenant = foundTenant;
        tenantId = foundTenant.id;
      }
    }

    // Method 4: Development mode - check query parameter
    if (!tenantId && process.env.NODE_ENV === 'development') {
      const queryTenant = req.query.tenant as string;
      if (queryTenant) {
        tenantId = queryTenant;
      }
    }

    // If we have tenantId but no full tenant object, fetch it
    if (tenantId && !tenant) {
      const [foundTenant] = await db
        .select()
        .from(tenants)
        .where(eq(tenants.id, tenantId))
        .limit(1);

      if (foundTenant) {
        tenant = foundTenant;
      }
    }

    // Attach to request
    if (tenant) {
      // Check if tenant is active
      if (!tenant.isActive || tenant.isSuspended) {
        return res.status(403).json({
          error: 'Tenant account is suspended',
          reason: tenant.suspensionReason || 'Account inactive',
        });
      }

      // Check subscription status
      if (tenant.subscriptionStatus === 'past_due') {
        return res.status(402).json({
          error: 'Payment required',
          message: 'Subscription payment is past due',
        });
      }

      req.tenant = {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        customDomain: tenant.customDomain,
        subscriptionTier: tenant.subscriptionTier,
        subscriptionStatus: tenant.subscriptionStatus,
        enabledFeatures: tenant.enabledFeatures || [],
        primaryColor: tenant.primaryColor,
        secondaryColor: tenant.secondaryColor,
        accentColor: tenant.accentColor,
      };
      req.tenantId = tenant.id;
    }

    next();
  } catch (error) {
    console.error('Tenant resolution error:', error);
    next(error);
  }
}

/**
 * Require Tenant Middleware
 *
 * Ensures a tenant is present on the request.
 * Use this on routes that MUST have a tenant.
 */
export function requireTenant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.tenant || !req.tenantId) {
    return res.status(400).json({
      error: 'Tenant required',
      message: 'No tenant could be determined from this request',
      hint: 'Use subdomain, custom domain, or X-Tenant-ID header',
    });
  }

  next();
}

/**
 * Feature Gate Middleware
 *
 * Checks if tenant has access to a specific feature
 */
export function requireFeature(feature: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.tenant) {
      return res.status(400).json({
        error: 'Tenant required',
      });
    }

    const hasFeature = req.tenant.enabledFeatures.includes(feature);

    if (!hasFeature) {
      return res.status(403).json({
        error: 'Feature not available',
        feature,
        message: `This feature is not available on your current plan (${req.tenant.subscriptionTier})`,
        upgrade: '/pricing',
      });
    }

    next();
  };
}

/**
 * Subscription Tier Middleware
 *
 * Ensures tenant is on a specific tier or higher
 */
export function requireTier(minTier: 'free' | 'starter' | 'pro' | 'enterprise') {
  const tierHierarchy = ['free', 'starter', 'pro', 'enterprise'];

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.tenant) {
      return res.status(400).json({
        error: 'Tenant required',
      });
    }

    const currentTierIndex = tierHierarchy.indexOf(req.tenant.subscriptionTier);
    const requiredTierIndex = tierHierarchy.indexOf(minTier);

    if (currentTierIndex < requiredTierIndex) {
      return res.status(403).json({
        error: 'Upgrade required',
        currentTier: req.tenant.subscriptionTier,
        requiredTier: minTier,
        message: `This feature requires ${minTier} tier or higher`,
        upgrade: '/pricing',
      });
    }

    next();
  };
}

/**
 * Usage Limit Middleware
 *
 * Checks if tenant has exceeded usage limits
 */
export function checkUsageLimit(limitType: 'users' | 'clients' | 'storage') {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.tenant || !req.tenantId) {
      return res.status(400).json({ error: 'Tenant required' });
    }

    try {
      // This is a placeholder - in production, you'd query actual usage
      const currentUsage = 0; // TODO: Implement usage tracking
      let maxLimit = 0;

      switch (limitType) {
        case 'users':
          maxLimit = req.tenant.maxUsers || 3;
          break;
        case 'clients':
          maxLimit = req.tenant.maxClients || 10;
          break;
        case 'storage':
          maxLimit = req.tenant.maxStorageGB || 1;
          break;
      }

      if (currentUsage >= maxLimit) {
        return res.status(403).json({
          error: 'Usage limit exceeded',
          limitType,
          currentUsage,
          maxLimit,
          message: `You've reached your ${limitType} limit. Upgrade to add more.`,
          upgrade: '/pricing',
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
