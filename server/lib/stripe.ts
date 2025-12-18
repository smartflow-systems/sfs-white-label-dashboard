import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Pricing tier IDs
export const PRICE_IDS = {
  pro: {
    monthly: process.env.STRIPE_PRO_PRICE_ID || '',
    annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || '',
  },
  enterprise: {
    monthly: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    annual: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID || '',
  },
};

// Usage limits by tier
export const TIER_LIMITS = {
  free: {
    apiCalls: parseInt(process.env.FREE_TIER_API_CALLS || '1000'),
    storage: parseInt(process.env.FREE_TIER_STORAGE_MB || '100'),
    dataRetention: parseInt(process.env.FREE_TIER_DATA_RETENTION_DAYS || '7'),
  },
  pro: {
    apiCalls: parseInt(process.env.PRO_TIER_API_CALLS || '100000'),
    storage: parseInt(process.env.PRO_TIER_STORAGE_GB || '10') * 1024,
    dataRetention: parseInt(process.env.PRO_TIER_DATA_RETENTION_DAYS || '90'),
  },
  enterprise: {
    apiCalls: parseInt(process.env.ENTERPRISE_TIER_API_CALLS || '999999999'),
    storage: parseInt(process.env.ENTERPRISE_TIER_STORAGE_GB || '1000') * 1024,
    dataRetention: parseInt(process.env.ENTERPRISE_TIER_DATA_RETENTION_DAYS || '365'),
  },
};

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
  referralCode,
}: {
  userId: string;
  email: string;
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
  referralCode?: string;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      client_reference_id: userId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        referralCode: referralCode || '',
      },
      subscription_data: {
        metadata: {
          userId,
          referralCode: referralCode || '',
        },
        trial_period_days: 14, // 14-day free trial
      },
      success_url: successUrl || `${process.env.APP_URL || 'http://localhost:5000'}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.APP_URL || 'http://localhost:5000'}/pricing?canceled=true`,
      allow_promotion_codes: true,
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create a Stripe customer portal session
 */
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl?: string;
}) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.APP_URL || 'http://localhost:5000'}/billing`,
    });

    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error getting subscription:', error);
    throw error;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  try {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    return customers.data[0] || null;
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  }
}

/**
 * Create a new customer
 */
export async function createCustomer({
  email,
  name,
  metadata,
}: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });

    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

/**
 * Get invoices for customer
 */
export async function getInvoices(customerId: string, limit = 10) {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit,
    });

    return invoices.data;
  } catch (error) {
    console.error('Error getting invoices:', error);
    throw error;
  }
}

/**
 * Verify Stripe webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    return event;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw error;
  }
}

/**
 * Calculate referral commission
 */
export function calculateReferralCommission(amount: number): number {
  const commissionRate = parseFloat(process.env.REFERRAL_COMMISSION_RATE || '0.30');
  return Math.floor(amount * commissionRate); // Return in cents
}

/**
 * Get tier from subscription
 */
export function getTierFromPriceId(priceId: string): 'free' | 'pro' | 'enterprise' {
  if (priceId === PRICE_IDS.pro.monthly || priceId === PRICE_IDS.pro.annual) {
    return 'pro';
  }
  if (priceId === PRICE_IDS.enterprise.monthly || priceId === PRICE_IDS.enterprise.annual) {
    return 'enterprise';
  }
  return 'free';
}

/**
 * Check if usage exceeds limits for tier
 */
export function checkUsageLimits(
  tier: 'free' | 'pro' | 'enterprise',
  usage: {
    apiCalls?: number;
    storage?: number;
  }
): {
  withinLimits: boolean;
  exceededMetrics: string[];
} {
  const limits = TIER_LIMITS[tier];
  const exceededMetrics: string[] = [];

  if (usage.apiCalls && usage.apiCalls > limits.apiCalls) {
    exceededMetrics.push('apiCalls');
  }

  if (usage.storage && usage.storage > limits.storage) {
    exceededMetrics.push('storage');
  }

  return {
    withinLimits: exceededMetrics.length === 0,
    exceededMetrics,
  };
}

export default stripe;
