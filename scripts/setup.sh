#!/bin/bash

# SFS Family Dashboard - Automated Setup Script
# This script automates the entire setup process

set -e  # Exit on error

echo "════════════════════════════════════════════════════════════════"
echo "   SFS Family Dashboard - Automated Setup"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Step 1: Check Node.js version
echo "Step 1: Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    print_success "Node.js version is compatible (v$(node -v))"
else
    print_error "Node.js version 18+ required. Current: $(node -v)"
    exit 1
fi
echo ""

# Step 2: Install dependencies
echo "Step 2: Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi
echo ""

# Step 3: Check for .env file
echo "Step 3: Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    print_warning ".env file created from template"
    print_warning "You need to add your actual credentials to .env"
else
    print_success ".env file already exists"
fi
echo ""

# Step 4: Check if DATABASE_URL is set
echo "Step 4: Checking database configuration..."
if grep -q "DATABASE_URL=postgresql://" .env 2>/dev/null && ! grep -q "DATABASE_URL=postgresql://user:password@host" .env; then
    print_success "Database URL is configured"
else
    print_warning "DATABASE_URL needs to be set in .env"
    echo "   You can use:"
    echo "   - Replit Database (auto-configured)"
    echo "   - Supabase: https://supabase.com"
    echo "   - Railway: https://railway.app"
fi
echo ""

# Step 5: Check if Stripe keys are set
echo "Step 5: Checking Stripe configuration..."
if grep -q "STRIPE_SECRET_KEY=sk_" .env 2>/dev/null && ! grep -q "STRIPE_SECRET_KEY=sk_test_your" .env; then
    print_success "Stripe keys are configured"

    # Try to verify Stripe connection
    if command -v stripe &> /dev/null; then
        print_success "Stripe CLI is installed"
    else
        print_warning "Stripe CLI not installed (optional)"
        echo "   Install: https://stripe.com/docs/stripe-cli"
    fi
else
    print_warning "Stripe keys need to be set in .env"
    echo "   Get keys from: https://dashboard.stripe.com/apikeys"
fi
echo ""

# Step 6: Database migrations
echo "Step 6: Setting up database..."
if grep -q "DATABASE_URL=postgresql://" .env 2>/dev/null && ! grep -q "DATABASE_URL=postgresql://user:password@host" .env; then
    print_warning "Skipping database setup (DATABASE_URL not configured)"
    echo "   Run 'npm run db:push' after configuring DATABASE_URL"
else
    if npm run db:push 2>/dev/null; then
        print_success "Database schema created"
    else
        print_warning "Could not run database migrations"
        echo "   Run 'npm run db:push' manually after configuring database"
    fi
fi
echo ""

# Step 7: TypeScript type check
echo "Step 7: Running TypeScript type check..."
if npm run check 2>/dev/null; then
    print_success "TypeScript types are valid"
else
    print_warning "TypeScript errors found (may be expected)"
fi
echo ""

# Step 8: Create necessary directories
echo "Step 8: Creating necessary directories..."
mkdir -p server/lib server/routes uploads/logos
print_success "Directory structure created"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "   Setup Summary"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Check what's done and what's needed
SETUP_COMPLETE=true

if [ ! -f .env ]; then
    print_error ".env file missing"
    SETUP_COMPLETE=false
fi

if grep -q "DATABASE_URL=postgresql://user:password@host" .env 2>/dev/null; then
    print_warning "DATABASE_URL needs configuration"
    SETUP_COMPLETE=false
else
    print_success "Environment file ready"
fi

if grep -q "STRIPE_SECRET_KEY=sk_test_your" .env 2>/dev/null; then
    print_warning "Stripe keys need configuration"
    SETUP_COMPLETE=false
else
    print_success "Stripe configured (or skipped)"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"

if [ "$SETUP_COMPLETE" = true ]; then
    echo -e "${GREEN}"
    echo "   ✓ Setup Complete! Ready to start"
    echo -e "${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review .env file and add any missing credentials"
    echo "  2. Run: npm run dev"
    echo "  3. Open: http://localhost:5000"
else
    echo -e "${YELLOW}"
    echo "   ⚠ Setup Incomplete - Action Required"
    echo -e "${NC}"
    echo ""
    echo "What you need to do:"
    echo ""
    echo "1. Get Stripe API keys:"
    echo "   → Visit: https://dashboard.stripe.com/register"
    echo "   → Copy test keys to .env"
    echo ""
    echo "2. Set up database:"
    echo "   → Option A: Use Replit Database (auto-configured on Replit)"
    echo "   → Option B: Create free database at https://supabase.com"
    echo "   → Add DATABASE_URL to .env"
    echo ""
    echo "3. Run database migrations:"
    echo "   → npm run db:push"
    echo ""
    echo "4. Start the server:"
    echo "   → npm run dev"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Documentation:"
echo "  - Full guide: ./DEPLOYMENT_GUIDE.md"
echo "  - Features: ./ENHANCEMENTS.md"
echo "  - Quick start: ./README.md"
echo ""
echo "Need help? Check the docs or create an issue on GitHub"
echo ""
