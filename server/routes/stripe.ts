import { Router, Request, Response } from 'express';
import {
  createCheckoutSession,
  createPortalSession,
  getInvoices,
  constructWebhookEvent,
  calculateReferralCommission,
  getTierFromPriceId,
} from '../lib/stripe';

const router = Router();

/**
 * POST /api/stripe/create-checkout-session
 * Create a Stripe Checkout session for subscription
 */
router.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { priceId, email, userId, referralCode } = req.body;

    if (!priceId || !email || !userId) {
      return res.status(400).json({
        error: 'Missing required fields: priceId, email, userId',
      });
    }

    const session = await createCheckoutSession({
      userId,
      email,
      priceId,
      referralCode,
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

/**
 * POST /api/stripe/create-portal-session
 * Create a Stripe Customer Portal session
 */
router.post('/create-portal-session', async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customerId' });
    }

    const session = await createPortalSession({ customerId });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message || 'Failed to create portal session' });
  }
});

/**
 * GET /api/stripe/invoices/:customerId
 * Get invoices for a customer
 */
router.get('/invoices/:customerId', async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const invoices = await getInvoices(customerId, limit);

    res.json({ invoices });
  } catch (error: any) {
    console.error('Error getting invoices:', error);
    res.status(500).json({ error: error.message || 'Failed to get invoices' });
  }
});

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhooks
 */
router.post(
  '/webhook',
  async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    try {
      // Verify webhook signature
      const event = constructWebhookEvent(
        req.body,
        signature
      );

      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          console.log('Checkout session completed:', session.id);

          // TODO: Update user subscription in database
          const userId = session.client_reference_id;
          const subscriptionId = session.subscription;
          const customerId = session.customer;
          const referralCode = session.metadata?.referralCode;

          console.log('New subscription created for user:', userId);

          // If there's a referral code, calculate commission
          if (referralCode) {
            const amount = session.amount_total;
            const commission = calculateReferralCommission(amount);
            console.log(`Referral commission: $${commission / 100} for code: ${referralCode}`);

            // TODO: Credit referrer's account with commission
          }

          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as any;
          console.log('Subscription updated:', subscription.id);

          // TODO: Update subscription status in database
          const tier = getTierFromPriceId(subscription.items.data[0].price.id);
          console.log('Subscription tier:', tier);

          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as any;
          console.log('Subscription canceled:', subscription.id);

          // TODO: Downgrade user to free tier
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as any;
          console.log('Invoice paid:', invoice.id);

          // TODO: Record payment in database
          // TODO: Calculate and credit referral commission
          if (invoice.metadata?.referralCode) {
            const commission = calculateReferralCommission(invoice.amount_paid);
            console.log(`Recurring commission: $${commission / 100}`);
          }

          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as any;
          console.log('Invoice payment failed:', invoice.id);

          // TODO: Send payment failed notification
          // TODO: Update subscription status
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: error.message || 'Webhook verification failed' });
    }
  }
);

export default router;
