# Payment & Account Creation Setup

This guide explains how to set up automatic account creation and receipt emails after successful Stripe payments.

## Features

✅ **Automatic Account Creation** - Creates user account in Supabase when payment succeeds  
✅ **Receipt Email** - Sends professional receipt email with account details  
✅ **Subscription Tracking** - Stores subscription info in database  
✅ **Password Generation** - Auto-generates secure password for new users  

## Environment Variables

Add these to your `.env.local` file:

```env
# Stripe (already configured)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # Required for account creation

# Resend (for email sending)
RESEND_API_KEY=re_...  # Get from https://resend.com/api-keys
RESEND_FROM_EMAIL=noreply@yourdomain.com  # Optional, defaults to onboarding@resend.dev

# Site URL (for email links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Change to your production URL
```

## Database Migration

Run this SQL in your Supabase SQL Editor to add subscription tracking columns:

```sql
-- See: supabase/migrations/add_stripe_subscription_fields.sql
```

Or run the migration file directly in Supabase Dashboard → SQL Editor.

## Resend Setup

1. **Sign up for Resend**: Go to [resend.com](https://resend.com) and create an account
2. **Get API Key**: 
   - Go to API Keys section
   - Create a new API key
   - Copy the key (starts with `re_`)
   - Add to `.env.local` as `RESEND_API_KEY`
3. **Verify Domain** (for production):
   - Add your domain in Resend dashboard
   - Add DNS records as instructed
   - Update `RESEND_FROM_EMAIL` to use your domain

## Webhook Configuration

### For Local Development:

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhook`
4. Copy the webhook signing secret and add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### For Production:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL: `https://yourdomain.com/api/webhook`
4. Select events:
   - ✅ `checkout.session.completed` (required)
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
5. Copy the webhook signing secret and add to your production environment variables

## How It Works

1. **User completes checkout** → Stripe processes payment
2. **Stripe sends webhook** → `checkout.session.completed` event
3. **Webhook handler**:
   - Extracts customer email and subscription details
   - Creates user account in Supabase (or updates if exists)
   - Generates secure password for new users
   - Stores subscription info in database
   - Sends receipt email with account details

## Email Template

The receipt email includes:
- Welcome message
- Plan name and amount
- Account creation confirmation
- Temporary password (for new users)
- Link to login/dashboard
- Invoice link (if available)

## Testing

### Test the Webhook Locally:

1. Start your dev server: `npm run dev`
2. Start Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook`
3. Complete a test checkout
4. Check console logs for account creation
5. Check email inbox for receipt

### Test Cards:

- **Success**: `4242 4242 4242 4242`
- Use any future expiry date, any CVC, any ZIP

## Troubleshooting

### Account Not Created

- ✅ Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- ✅ Check webhook is receiving events (check Stripe Dashboard → Webhooks → Recent events)
- ✅ Check server logs for errors
- ✅ Verify database migration has been run

### Email Not Sending

- ✅ Check `RESEND_API_KEY` is set correctly
- ✅ Check Resend dashboard for email status
- ✅ Verify `RESEND_FROM_EMAIL` is configured (or using default)
- ✅ Check spam folder
- ✅ Check server logs for email errors

### User Already Exists

- The system will update the existing user's subscription info
- No new account will be created
- Receipt email will still be sent

## Security Notes

- **Service Role Key**: Only used server-side, never exposed to client
- **Passwords**: Auto-generated secure passwords (16 characters, mixed case, numbers, symbols)
- **Email**: Users should change password after first login
- **Webhook Verification**: All webhooks are verified using Stripe signature

## Next Steps

After setup:
1. ✅ Test a complete checkout flow
2. ✅ Verify account creation in Supabase
3. ✅ Check receipt email arrives
4. ✅ Test login with generated password
5. ✅ Update password after first login

