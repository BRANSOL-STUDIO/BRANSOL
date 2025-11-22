# Stripe Connect Quick Reference

Quick reference for all API endpoints and their usage.

## API Endpoints

### Account Management

#### Create Account
```typescript
POST /api/connect/create-account
Body: {
  displayName: string,
  contactEmail: string,
  country: string (optional, default: 'us')
}
Response: { accountId: string, account: object }
```

#### Get Account Status
```typescript
GET /api/connect/account-status?accountId=acct_...
Response: {
  accountId: string,
  readyToProcessPayments: boolean,
  onboardingComplete: boolean,
  requirementsStatus: string
}
```

#### Create Onboarding Link
```typescript
POST /api/connect/create-onboarding-link
Body: {
  accountId: string,
  returnUrl: string (optional)
}
Response: { url: string, expires_at: number }
```

### Product Management

#### Create Product
```typescript
POST /api/connect/products/create
Body: {
  accountId: string,
  name: string,
  description: string (optional),
  priceInCents: number,
  currency: string (optional, default: 'usd')
}
Response: { product: object, price: object }
```

#### List Products
```typescript
GET /api/connect/products/list?accountId=acct_...
Response: { products: array, count: number }
```

### Checkout

#### Create Checkout Session
```typescript
POST /api/connect/checkout/create
Body: {
  accountId: string,
  priceId: string,
  quantity: number (optional, default: 1),
  applicationFeeAmount: number (optional, default: 0)
}
Response: { sessionId: string, url: string }
```

#### Create Subscription Checkout
```typescript
POST /api/connect/subscription/create
Body: {
  accountId: string,
  priceId: string (platform price ID)
}
Response: { sessionId: string, url: string }
```

#### Create Billing Portal Session
```typescript
POST /api/connect/billing-portal
Body: {
  accountId: string,
  returnUrl: string (optional)
}
Response: { url: string }
```

### Webhooks

#### Webhook Endpoint
```typescript
POST /api/connect/webhook
Headers: {
  'stripe-signature': string
}
Body: Raw webhook payload
```

## UI Pages

- `/dashboard/connect` - Account creation and onboarding
- `/dashboard/connect/products` - Product management
- `/dashboard/connect/subscription` - Subscription management
- `/storefront/[accountId]` - Customer storefront
- `/storefront/[accountId]/success` - Checkout success page

## Key Concepts

### V2 Accounts
- Use `customer_account` instead of `customer` for V2 accounts
- Account ID (acct_...) can be used as customer_account
- No top-level `type` property when creating accounts

### Stripe-Account Header
- Use `stripeAccount` option to perform operations on connected accounts
- Required for: products, checkout sessions, etc.

### Thin Events
- V2 account events use thin payloads
- Must parse with `parseThinEvent()` then retrieve full event
- Configure webhook with "Thin" payload style

### Direct Charge
- Payments go directly to connected account
- Platform receives application fee
- Use `payment_intent_data.application_fee_amount`

## Common Patterns

### Get Account ID from User
```typescript
// TODO: In production, get from database
const accountId = await db.users.findUnique({
  where: { id: userId },
  select: { stripeAccountId: true }
});
```

### Check if Account Can Accept Payments
```typescript
const status = await fetch(`/api/connect/account-status?accountId=${accountId}`);
const { readyToProcessPayments } = await status.json();
```

### Create Product on Connected Account
```typescript
await fetch('/api/connect/products/create', {
  method: 'POST',
  body: JSON.stringify({
    accountId: 'acct_...',
    name: 'My Product',
    priceInCents: 1000, // $10.00
    currency: 'usd'
  })
});
```

### Process Payment with Application Fee
```typescript
await fetch('/api/connect/checkout/create', {
  method: 'POST',
  body: JSON.stringify({
    accountId: 'acct_...',
    priceId: 'price_...',
    applicationFeeAmount: 100 // $1.00 fee
  })
});
```

