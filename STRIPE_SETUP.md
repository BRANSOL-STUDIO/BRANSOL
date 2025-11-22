# Stripe Checkout Integration Setup

This guide will help you set up Stripe Checkout for subscription payments.

## Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Secret Key (from your Stripe Dashboard)
# Get this from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...

# Stripe Webhook Secret (get this from Stripe Dashboard or `stripe listen`)
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Stripe Publishable Key (if needed for client-side)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Stripe Dashboard Setup

### 1. Create Products and Prices

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Create products for each subscription plan:
   - Essentials
   - Growth Kit
   - Ecosystem

3. For each product, create prices with **lookup keys**:
   - Set the lookup key format: `Essentials-c7c18be` (or similar)
   - Configure billing period (monthly/quarterly/annual)

### 2. Update Lookup Keys in Code

Edit `/app/subscriptions/checkout/page.tsx` and update the `stripeLookupKeys` object with your actual Stripe Price lookup keys:

```typescript
const stripeLookupKeys: Record<string, string> = {
  'essentials': 'Essentials-c7c18be', // Replace with your actual lookup key
  'growth-kit': 'GrowthKit-c7c18be', // Replace with your actual lookup key
  'ecosystem': 'Ecosystem-c7c18be', // Replace with your actual lookup key
};
```

### 3. Configure Customer Portal

1. Go to [Stripe Dashboard → Settings → Billing → Customer portal](https://dashboard.stripe.com/settings/billing/portal)
2. Enable the features you want customers to manage:
   - Update payment method
   - Cancel subscription
   - Update billing information
   - etc.

### 4. Set Up Webhooks

#### For Local Development:

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhook`
4. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env.local`

#### For Production:

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL: `https://yourdomain.com/api/webhook`
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `entitlements.active_entitlement_summary.updated`
5. Copy the webhook signing secret and add it to your production environment variables

## API Routes

The following API routes have been created:

- **POST `/api/create-checkout-session`** - Creates a Stripe Checkout session
- **POST `/api/create-portal-session`** - Creates a Stripe Customer Portal session
- **POST `/api/webhook`** - Handles Stripe webhook events

## Testing

### Test Cards

Use these test card numbers in Stripe Checkout:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiry date, any CVC, and any ZIP code.

### Testing Webhooks Locally

1. Run `stripe listen --forward-to localhost:3000/api/webhook`
2. Trigger test events: `stripe trigger customer.subscription.created`

## Stripe Accounts v2 (Connect)

The implementation supports both:
- **Stripe Accounts v2 (Connect)** - Uses `customer_account` parameter
- **Stripe Customers v1** - Uses `customer` parameter

The code automatically detects which one to use based on the checkout session.

## Next Steps

1. ✅ Add environment variables
2. ✅ Create products and prices in Stripe Dashboard
3. ✅ Update lookup keys in code
4. ✅ Configure Customer Portal
5. ✅ Set up webhooks
6. ✅ Test the checkout flow
7. ✅ Implement database updates in webhook handlers (see TODOs in `/app/api/webhook/route.ts`)

## Troubleshooting

- **"Price not found"**: Check that your lookup keys match exactly in Stripe Dashboard
- **"Customer account not found"**: Ensure the checkout session completed successfully
- **Webhook signature verification failed**: Check that `STRIPE_WEBHOOK_SECRET` is correct
- **Redirect not working**: Check that success/cancel URLs are correct in the checkout session

