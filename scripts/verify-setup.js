#!/usr/bin/env node

/**
 * SFS Family Dashboard - Setup Verification
 *
 * This script verifies that everything is set up correctly
 * Run with: node scripts/verify-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('════════════════════════════════════════════════════════════════');
console.log('   SFS Family Dashboard - Setup Verification');
console.log('════════════════════════════════════════════════════════════════\n');

let allGood = true;

// Check 1: Node.js version
console.log('✓ Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion >= 18) {
  console.log(`  ✓ Node.js ${nodeVersion} (OK)\n`);
} else {
  console.log(`  ✗ Node.js ${nodeVersion} (Need 18+)\n`);
  allGood = false;
}

// Check 2: Required files exist
console.log('✓ Checking required files...');
const requiredFiles = [
  'package.json',
  '.env.example',
  'client/src/App.tsx',
  'server/index.ts',
  'shared/schema.ts',
  'QUICK_START.md',
  'DEPLOYMENT_GUIDE.md'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ Missing: ${file}`);
    allGood = false;
  }
});
console.log('');

// Check 3: node_modules installed
console.log('✓ Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('  ✓ node_modules exists\n');
} else {
  console.log('  ✗ node_modules not found');
  console.log('  → Run: npm install\n');
  allGood = false;
}

// Check 4: .env file
console.log('✓ Checking environment configuration...');
if (fs.existsSync('.env')) {
  console.log('  ✓ .env file exists');

  // Check if it has actual values
  const envContent = fs.readFileSync('.env', 'utf-8');

  if (envContent.includes('STRIPE_SECRET_KEY=sk_') && !envContent.includes('sk_test_your')) {
    console.log('  ✓ Stripe keys configured');
  } else {
    console.log('  ⚠ Stripe keys need to be added');
  }

  if (envContent.includes('DATABASE_URL=postgresql://') && !envContent.includes('user:password@host')) {
    console.log('  ✓ Database URL configured');
  } else {
    console.log('  ⚠ Database URL needs to be added');
  }
  console.log('');
} else {
  console.log('  ✗ .env file not found');
  console.log('  → Run: cp .env.example .env\n');
  allGood = false;
}

// Check 5: Key pages exist
console.log('✓ Checking dashboard pages...');
const pages = [
  'client/src/pages/dashboard.tsx',
  'client/src/pages/pricing.tsx',
  'client/src/pages/billing.tsx',
  'client/src/pages/marketplace.tsx',
  'client/src/pages/referrals.tsx'
];

pages.forEach(page => {
  if (fs.existsSync(page)) {
    const pageName = path.basename(page, '.tsx');
    console.log(`  ✓ ${pageName} page`);
  } else {
    console.log(`  ✗ Missing: ${page}`);
    allGood = false;
  }
});
console.log('');

// Check 6: Stripe integration files
console.log('✓ Checking Stripe integration...');
const stripeFiles = [
  'server/lib/stripe.ts',
  'server/routes/stripe.ts',
  'scripts/setup-stripe-products.js'
];

stripeFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ Missing: ${file}`);
    allGood = false;
  }
});
console.log('');

// Check 7: Scripts are executable
console.log('✓ Checking setup scripts...');
const scripts = [
  'scripts/setup.sh',
  'scripts/setup-stripe-products.js',
  'scripts/verify-setup.js'
];

scripts.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`  ✓ ${script}`);
  } else {
    console.log(`  ✗ Missing: ${script}`);
    allGood = false;
  }
});
console.log('');

// Final summary
console.log('════════════════════════════════════════════════════════════════');
if (allGood) {
  console.log('   ✓ All Checks Passed!');
  console.log('════════════════════════════════════════════════════════════════\n');
  console.log('Your SFS Family Dashboard is ready to run!\n');
  console.log('Next steps:');
  console.log('  1. Add Stripe keys to .env (optional)');
  console.log('  2. Add DATABASE_URL to .env (optional)');
  console.log('  3. Run: npm run dev');
  console.log('  4. Open: http://localhost:5000\n');
  console.log('Quick Setup Guide: ./QUICK_START.md');
  console.log('Full Guide: ./DEPLOYMENT_GUIDE.md\n');
} else {
  console.log('   ⚠ Some Issues Found');
  console.log('════════════════════════════════════════════════════════════════\n');
  console.log('Please fix the issues above and run this script again.\n');
  console.log('For help, check:');
  console.log('  - QUICK_START.md');
  console.log('  - DEPLOYMENT_GUIDE.md\n');
  process.exit(1);
}
