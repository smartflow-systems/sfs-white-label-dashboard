import express from 'express';
import { db } from '../storage';
import { tenants, subscriptionPlans, activityLogs } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { requireTenant } from '../middleware/tenant';
import { createTenantDb } from '../lib/tenant-db';

const router = express.Router();

// Stripe configuration (will use env vars in production)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Initialize Stripe (conditional - only if key exists)
let stripe: any = null;
if (STRIPE_SECRET_KEY && STRIPE_SECRET_KEY.startsWith('sk_')) {
  try {
    const Stripe = require('stripe');
    stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });
  } catch (error) {
    console.warn('Stripe not initialized - install with: npm install stripe');
  }
}

/**
 * GET /api/billing/plans
 * Get all available subscription plans
 */
router.get('/plans', async (req, res) => {
  try {
    const plans = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.isActive, true))
      .where(eq(subscriptionPlans.isPublic, true));

    res.json(plans);
  } catch (error: any) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/billing/current
 * Get current subscription details
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

    // Get plan details
    const [plan] = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.slug, tenant.subscriptionTier))
      .limit(1);

    res.json({
      tier: tenant.subscriptionTier,
      status: tenant.subscriptionStatus,
      stripeCustomerId: tenant.stripeCustomerId,
      stripeSubscriptionId: tenant.stripeSubscriptionId,
      plan: plan || null,
      limits: {
        maxUsers: tenant.maxUsers,
        maxClients: tenant.maxClients,
        maxStorageGB: tenant.maxStorageGB,
      },
      features: tenant.enabledFeatures,
    });
  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/billing/create-checkout-session
 * Create Stripe checkout session for upgrading
 */
router.post('/create-checkout-session', requireTenant, async (req, res) => {
  try {
    const { planSlug, billingCycle } = req.body;

    if (!stripe) {
      return res.status(503).json({
        error: 'Stripe not configured',
        message: 'Please configure STRIPE_SECRET_KEY in environment variables',
      });
    }

    // Get plan
    const [plan] = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.slug, planSlug))
      .limit(1);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Get tenant
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, req.tenantId!))
      .limit(1);

    // Get or create Stripe customer
    let customerId = tenant.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: tenant.companyEmail,
        metadata: {
          tenantId: tenant.id,
          tenantName: tenant.name,
        },
      });
      customerId = customer.id;

      // Update tenant with customer ID
      await db
        .update(tenants)
        .set({ stripeCustomerId: customerId })
        .where(eq(tenants.id, tenant.id));
    }

    // Determine price ID based on billing cycle
    const priceId =
      billingCycle === 'yearly' ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly;

    if (!priceId) {
      return res.status(400).json({
        error: 'Invalid billing cycle',
        message: `${billingCycle} billing not available for this plan`,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5012'}/settings?billing=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5012'}/settings?billing=canceled`,
      metadata: {
        tenantId: tenant.id,
        planSlug: plan.slug,
      },
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/billing/create-portal-session
 * Create Stripe customer portal session
 */
router.post('/create-portal-session', requireTenant, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        error: 'Stripe not configured',
      });
    }

    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, req.tenantId!))
      .limit(1);

    if (!tenant.stripeCustomerId) {
      return res.status(400).json({
        error: 'No Stripe customer found',
        message: 'Please subscribe to a plan first',
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: tenant.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL || 'http://localhost:5012'}/settings`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/billing/usage
 * Get current usage statistics
 */
router.get('/usage', requireTenant, async (req, res) => {
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
        percentage: tenant.maxUsers ? Math.round((userCount / tenant.maxUsers) * 100) : 0,
      },
      clients: {
        current: clientCount,
        max: tenant.maxClients,
        percentage: tenant.maxClients ? Math.round((clientCount / tenant.maxClients) * 100) : 0,
      },
      storage: {
        current: 0, // TODO: Implement storage tracking
        max: tenant.maxStorageGB,
        percentage: 0,
        unit: 'GB',
      },
    });
  } catch (error: any) {
    console.error('Error fetching usage:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/billing/invoices
 * Get invoice history
 */
router.get('/invoices', requireTenant, async (req, res) => {
  try {
    if (!stripe) {
      return res.json([]);
    }

    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, req.tenantId!))
      .limit(1);

    if (!tenant.stripeCustomerId) {
      return res.json([]);
    }

    const invoices = await stripe.invoices.list({
      customer: tenant.stripeCustomerId,
      limit: 12,
    });

    const formattedInvoices = invoices.data.map((invoice: any) => ({
      id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status,
      created: invoice.created,
      invoicePdf: invoice.invoice_pdf,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      number: invoice.number,
    }));

    res.json(formattedInvoices);
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/billing/webhook
 * Handle Stripe webhooks
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).send('Stripe not configured');
    }

    const sig = req.headers['stripe-signature'] as string;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const tenantId = session.metadata.tenantId;
        const planSlug = session.metadata.planSlug;

        // Get plan details
        const [plan] = await db
          .select()
          .from(subscriptionPlans)
          .where(eq(subscriptionPlans.slug, planSlug))
          .limit(1);

        // Update tenant subscription
        await db
          .update(tenants)
          .set({
            subscriptionTier: planSlug,
            subscriptionStatus: 'active',
            stripeSubscriptionId: session.subscription as string,
            maxUsers: plan.maxUsers,
            maxClients: plan.maxClients,
            maxStorageGB: plan.maxStorageGB,
            enabledFeatures: plan.features,
            updatedAt: new Date(),
          })
          .where(eq(tenants.id, tenantId));

        // Log activity
        const tenantDb = createTenantDb(tenantId);
        await tenantDb.logActivity({
          action: 'subscription.upgraded',
          resource: 'subscription',
          resourceId: session.subscription as string,
          details: { plan: planSlug },
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        // Find tenant by customer ID
        const [tenant] = await db
          .select()
          .from(tenants)
          .where(eq(tenants.stripeCustomerId, customerId))
          .limit(1);

        if (tenant) {
          await db
            .update(tenants)
            .set({
              subscriptionStatus: subscription.status as string,
              updatedAt: new Date(),
            })
            .where(eq(tenants.id, tenant.id));
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        // Find tenant and downgrade to free
        const [tenant] = await db
          .select()
          .from(tenants)
          .where(eq(tenants.stripeCustomerId, customerId))
          .limit(1);

        if (tenant) {
          await db
            .update(tenants)
            .set({
              subscriptionTier: 'free',
              subscriptionStatus: 'canceled',
              stripeSubscriptionId: null,
              maxUsers: 3,
              maxClients: 10,
              maxStorageGB: 1,
              enabledFeatures: ['dashboard', 'basic_analytics'],
              updatedAt: new Date(),
            })
            .where(eq(tenants.id, tenant.id));
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        const [tenant] = await db
          .select()
          .from(tenants)
          .where(eq(tenants.stripeCustomerId, customerId))
          .limit(1);

        if (tenant) {
          await db
            .update(tenants)
            .set({
              subscriptionStatus: 'past_due',
              updatedAt: new Date(),
            })
            .where(eq(tenants.id, tenant.id));
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/billing/cancel-subscription
 * Cancel current subscription
 */
router.post('/cancel-subscription', requireTenant, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe not configured' });
    }

    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, req.tenantId!))
      .limit(1);

    if (!tenant.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription' });
    }

    // Cancel at period end (don't immediately cancel)
    await stripe.subscriptions.update(tenant.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    res.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
    });
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
