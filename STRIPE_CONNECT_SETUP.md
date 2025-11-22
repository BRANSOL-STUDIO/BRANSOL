# Stripe Connect Integration Setup Guide

This guide explains how to set up and use the Stripe Connect integration in your application.

## Overview

The Stripe Connect integration allows you to:
- Onboard users to Stripe Connect (V2 accounts)
- Let connected accounts create and sell products
- Process payments with application fees
- Manage subscriptions for connected accounts
- Handle webhook events for account and subscription updates

## Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Stripe Secret Key**: Get from [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys)
3. **Webhook Secret**: Configure webhook endpoint (see below)

## Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Secret Key (required)
# Get from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...

# Stripe Connect Webhook Secret (required for webhooks)
# Get from: https://dashboard.stripe.com/webhooks
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_...

# Platform Subscription Price ID (optional, for subscription feature)
# Create a product/price in your Stripe Dashboard for platform subscriptions
NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PRICE_ID=price_...
```

## Installation

The Stripe beta SDK is already installed. If you need to reinstall:

```bash
npm install stripe@beta
```

## API Routes

All API routes are located in `/app/api/connect/`:

### Account Management
- `POST /api/connect/create-account` - Create a connected account
- `GET /api/connect/account-status` - Get account status
- `POST /api/connect/create-onboarding-link` - Create onboarding link

### Product Management
- `POST /api/connect/products/create` - Create a product on connected account
- `GET /api/connect/products/list` - List products from connected account

### Checkout
- `POST /api/connect/checkout/create` - Create checkout session (Direct Charge)
- `POST /api/connect/subscription/create` - Create subscription checkout
- `POST /api/connect/billing-portal` - Create billing portal session

### Webhooks
- `POST /api/connect/webhook` - Handle webhook events

## Webhook Configuration

### For Local Development

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward webhooks:
   ```bash
   stripe listen \
     --thin-events 'v2.core.account[requirements].updated,v2.core.account[configuration.merchant].capability_status_updated,v2.core.account[configuration.customer].capability_status_updated,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,payment_method.attached,payment_method.detached,customer.updated,customer.tax_id.*,billing_portal.*,invoice.paid,invoice.payment_failed' \
     --forward-thin-to http://localhost:3000/api/connect/webhook
   ```
4. Copy the webhook signing secret and add to `.env.local` as `STRIPE_CONNECT_WEBHOOK_SECRET`

### For Production

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **+ Add endpoint**
3. Set endpoint URL: `https://yourdomain.com/api/connect/webhook`
4. Select **Thin** payload style (required for V2 events)
5. Select events:
   - `v2.core.account[requirements].updated`
   - `v2.core.account[configuration.merchant].capability_status_updated`
   - `v2.core.account[configuration.customer].capability_status_updated`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_method.attached`
   - `payment_method.detached`
   - `customer.updated`
   - `customer.tax_id.created`
   - `customer.tax_id.updated`
   - `customer.tax_id.deleted`
   - `billing_portal.configuration.created`
   - `billing_portal.configuration.updated`
   - `billing_portal.session.created`
   - `invoice.paid`
   - `invoice.payment_failed`
6. Copy the webhook signing secret and add to your production environment variables

## Usage Flow

### 1. Create Connected Account

Navigate to `/dashboard/connect` and:
1. Fill in business information (name, email, country)
2. Click "Create Account"
3. Account ID will be stored (in production, store in your database)

### 2. Onboard Account

1. Click "Onboard to Collect Payments"
2. You'll be redirected to Stripe's onboarding flow
3. Complete required information
4. Return to your app to check status

### 3. Create Products

Navigate to `/dashboard/connect/products` and:
1. Click "Create Product"
2. Fill in product details (name, description, price)
3. Product is created on the connected account

### 4. View Storefront

Navigate to `/storefront/[accountId]` to see products:
- Replace `[accountId]` with the connected account ID
- Customers can browse and purchase products
- Payments go directly to the connected account (with application fee)

### 5. Manage Subscriptions

Navigate to `/dashboard/connect/subscription` to:
- Subscribe to platform services
- Manage subscription via billing portal

## Database Integration

**IMPORTANT**: The code includes TODO comments where you should integrate with your database:

1. **Store Account Mappings**: When creating accounts, store the mapping from user ID to account ID
2. **Store Products**: When creating products, store product information
3. **Store Subscriptions**: When subscriptions are created/updated, store subscription status
4. **Store Payment Methods**: Track customer payment methods
5. **Store Webhook Events**: Log important webhook events for debugging

Example database schema:

```sql
-- Accounts table
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_account_id TEXT UNIQUE,
  display_name TEXT,
  contact_email TEXT,
  requirements_status TEXT,
  can_accept_payments BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY,
  account_id UUID REFERENCES accounts(id),
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  name TEXT,
  description TEXT,
  price_cents INTEGER,
  currency TEXT,
  created_at TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  account_id UUID REFERENCES accounts(id),
  stripe_subscription_id TEXT UNIQUE,
  status TEXT,
  price_id TEXT,
  quantity INTEGER,
  cancel_at_period_end BOOLEAN,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Security Considerations

1. **Account ID Storage**: Store account IDs securely in your database, not in localStorage
2. **Authentication**: Always verify user authentication before allowing account operations
3. **Authorization**: Ensure users can only access their own accounts
4. **Webhook Verification**: Always verify webhook signatures
5. **API Keys**: Never expose secret keys to the client

## Testing

### Test Cards

Use these test card numbers in Stripe Checkout:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiry date, any CVC, any ZIP code.

### Test Account Onboarding

1. Create a test account
2. Complete onboarding with test data
3. Verify account status updates correctly
4. Test product creation and checkout

## Troubleshooting

### "STRIPE_SECRET_KEY is not configured"
- Add `STRIPE_SECRET_KEY` to your `.env.local` file
- Restart your dev server after adding

### "Webhook signature verification failed"
- Check that `STRIPE_CONNECT_WEBHOOK_SECRET` is correct
- Ensure you're using the correct webhook secret for your endpoint
- For local testing, use the secret from `stripe listen`

### "Platform subscription price ID not configured"
- Create a product and price in your Stripe Dashboard
- Add the price ID to `.env.local` as `NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PRICE_ID`

### Account not ready to process payments
- Complete the onboarding process
- Check account requirements status
- Verify all required information is provided

## Next Steps

1. ✅ Set up environment variables
2. ✅ Configure webhook endpoint
3. ✅ Test account creation and onboarding
4. ✅ Create test products
5. ✅ Test checkout flow
6. ✅ Integrate with your database (see TODO comments)
7. ✅ Add authentication/authorization
8. ✅ Customize UI to match your brand
9. ✅ Set up production webhook endpoint
10. ✅ Test with real accounts

## Additional Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe Connect V2 API Reference](https://docs.stripe.com/api/v2/core/accounts)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Thin Events Documentation](https://docs.stripe.com/webhooks?snapshot-or-thin=thin)

