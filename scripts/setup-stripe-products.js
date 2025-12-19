#!/usr/bin/env node

/**
 * SFS Family Dashboard - Stripe Products Setup
 *
 * This script automatically creates the subscription products in Stripe
 * Run with: node scripts/setup-stripe-products.js
 */

const https = require('https');
require('dotenv').config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in .env file');
  console.error('   Get your key from: https://dashboard.stripe.com/apikeys');
  process.exit(1);
}

if (STRIPE_SECRET_KEY.includes('your_stripe_key') || STRIPE_SECRET_KEY === 'sk_test_') {
  console.error('❌ Please set your actual Stripe secret key in .env');
  console.error('   Current value is a placeholder');
  process.exit(1);
}

console.log('════════════════════════════════════════════════════════════════');
console.log('   SFS Family Dashboard - Stripe Products Setup');
console.log('════════════════════════════════════════════════════════════════\n');

// Products to create
const products = [
  {
    name: 'SFS Pro Plan',
    description: 'Professional tier with 100,000 API calls per month, custom branding, and premium integrations',
    prices: [
      { amount: 4900, interval: 'month', nickname: 'Pro Monthly' },
      { amount: 49000, interval: 'year', nickname: 'Pro Annual (Save $98!)' }
    ]
  },
  {
    name: 'SFS Enterprise Plan',
    description: 'Unlimited everything for enterprise clients with dedicated support and white-label options',
    prices: [
      { amount: 19900, interval: 'month', nickname: 'Enterprise Monthly' },
      { amount: 199000, interval: 'year', nickname: 'Enterprise Annual (Save $389!)' }
    ]
  }
];

// Helper function to make Stripe API requests
function stripeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(STRIPE_SECRET_KEY + ':').toString('base64');

    const options = {
      hostname: 'api.stripe.com',
      path: `/v1${path}`,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error?.message || 'Stripe API error'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);

    if (data) {
      const params = new URLSearchParams(data);
      req.write(params.toString());
    }

    req.end();
  });
}

// Main setup function
async function setupStripeProducts() {
  const envUpdates = [];

  for (const product of products) {
    console.log(`\n📦 Creating product: ${product.name}`);

    try {
      // Create product
      const createdProduct = await stripeRequest('POST', '/products', {
        name: product.name,
        description: product.description,
        metadata: {
          created_by: 'sfs_setup_script'
        }
      });

      console.log(`   ✓ Product created: ${createdProduct.id}`);

      // Create prices
      for (const price of product.prices) {
        const priceData = {
          product: createdProduct.id,
          unit_amount: price.amount,
          currency: 'usd',
          recurring: JSON.stringify({ interval: price.interval }),
          nickname: price.nickname
        };

        const createdPrice = await stripeRequest('POST', '/prices', priceData);

        console.log(`   ✓ Price created: ${createdPrice.id} ($${price.amount/100}/${price.interval})`);

        // Determine env variable name
        const productSlug = product.name.includes('Pro') ? 'PRO' : 'ENTERPRISE';
        const intervalSlug = price.interval === 'month' ? 'PRICE_ID' : 'ANNUAL_PRICE_ID';
        const envVar = `STRIPE_${productSlug}_${intervalSlug}`;

        envUpdates.push({
          key: envVar,
          value: createdPrice.id,
          name: price.nickname
        });
      }

    } catch (error) {
      console.error(`   ✗ Error creating ${product.name}:`, error.message);
    }
  }

  // Print environment variable updates
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('   Setup Complete! Add these to your .env file:');
  console.log('════════════════════════════════════════════════════════════════\n');

  envUpdates.forEach(({ key, value, name }) => {
    console.log(`${key}=${value}  # ${name}`);
  });

  console.log('\n════════════════════════════════════════════════════════════════\n');
  console.log('Next steps:');
  console.log('  1. Copy the variables above to your .env file');
  console.log('  2. Set up webhooks: https://dashboard.stripe.com/webhooks');
  console.log('     → Endpoint URL: https://your-domain.com/api/stripe/webhook');
  console.log('     → Events: checkout.session.completed, invoice.payment_succeeded');
  console.log('  3. Copy webhook signing secret to STRIPE_WEBHOOK_SECRET in .env');
  console.log('  4. Start your server: npm run dev');
  console.log('  5. Test checkout: Visit http://localhost:5000/pricing');
  console.log('\n💡 Tip: Use test card 4242 4242 4242 4242 for testing\n');
}

// Run the setup
setupStripeProducts().catch(error => {
  console.error('\n❌ Setup failed:', error.message);
  process.exit(1);
});
