import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createUserAccount, sendReceiptEmail } from '@/lib/utils/accountCreation';

function getStripeInstance() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set. Please add it to your .env.local file.');
  }
  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
  });
}

// Disable body parsing, need raw body for webhook signature verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured. Please add STRIPE_SECRET_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const stripe = getStripeInstance();
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_12345';

    let event: Stripe.Event;

    try {
      if (webhookSecret && webhookSecret !== 'whsec_12345' && sig) {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      } else {
        // For testing without signature verification
        event = JSON.parse(body) as Stripe.Event;
      }
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Get the type of webhook event sent
    const eventType = event.type;
  const data = event.data;
  const dataObject = data.object as any;

  // Handle different event types
  switch (eventType) {
    case 'checkout.session.completed': {
      // Payment successful - create account and send receipt
      const session = dataObject as Stripe.Checkout.Session;
      
      console.log(`Checkout session completed: ${session.id}`);
      
      // Only process subscription checkouts
      if (session.mode !== 'subscription') {
        console.log('Not a subscription checkout, skipping account creation');
        break;
      }

      try {
        const customerEmail = session.customer_email || session.customer_details?.email;
        const customerName = session.customer_details?.name || 'Customer';
        
        if (!customerEmail) {
          console.error('No customer email found in checkout session');
          break;
        }

        // Get subscription details
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        
        let subscription: Stripe.Subscription | null = null;
        let planName = 'Subscription';
        let amount = 0;
        let currency = 'usd';
        let invoiceUrl: string | undefined;

        if (subscriptionId) {
          subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price.id;
          
          if (priceId) {
            const price = await stripe.prices.retrieve(priceId);
            amount = (price.unit_amount || 0) / 100;
            currency = price.currency;
            planName = price.nickname || price.product as string;
            
            // Get product name if available
            if (typeof price.product === 'string') {
              const product = await stripe.products.retrieve(price.product);
              planName = product.name;
            }
          }
        }

        // Get invoice URL if available
        const invoiceId = session.invoice as string;
        if (invoiceId) {
          const invoice = await stripe.invoices.retrieve(invoiceId);
          invoiceUrl = invoice.hosted_invoice_url || undefined;
        }

        // Get plan details from metadata
        const planSlug = session.metadata?.plan_slug || 'essentials';
        const billingCycle = session.metadata?.billing_cycle || 'monthly';

        // Map plan slug to plan name if not already set
        const planNameMap: Record<string, string> = {
          'essentials': 'Essentials',
          'growth-kit': 'Growth Kit',
          'ecosystem': 'Ecosystem',
        };
        planName = planNameMap[planSlug] || planName;

        // Create user account
        console.log(`Creating account for ${customerEmail}...`);
        const accountResult = await createUserAccount(
          customerEmail,
          customerName,
          {
            planName,
            planSlug,
            billingCycle,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
          }
        );

        console.log(`Account ${accountResult.isNewUser ? 'created' : 'updated'} for ${customerEmail}`);

        // Send receipt email
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const loginUrl = `${baseUrl}/login`;

        console.log(`Sending receipt email to ${customerEmail}...`);
        await sendReceiptEmail(
          customerEmail,
          customerName,
          {
            planName,
            amount,
            currency: currency.toUpperCase(),
            invoiceUrl,
            accountCreated: accountResult.isNewUser,
            password: accountResult.password || undefined,
            loginUrl,
          }
        );

        console.log(`Successfully processed checkout for ${customerEmail}`);
      } catch (error: any) {
        console.error('Error processing checkout.session.completed:', error);
        // Don't throw - we still want to return 200 to Stripe
        // Log the error for debugging
      }
      break;
    }

    case 'customer.subscription.deleted':
      // Handle subscription canceled automatically based
      // upon your subscription settings. Or if the user cancels it.
      console.log(`Subscription canceled: ${event.id}`);
      // TODO: Update your database to reflect subscription cancellation
      break;

    case 'customer.subscription.updated':
      // Handle subscription updated
      console.log(`Subscription updated: ${event.id}`);
      // TODO: Update your database with new subscription details
      break;

    case 'customer.subscription.created':
      // Handle subscription created
      console.log(`Subscription created: ${event.id}`);
      // TODO: Create subscription record in your database
      break;

    case 'customer.subscription.trial_will_end':
      // Handle subscription trial ending
      console.log(`Subscription trial will end: ${event.id}`);
      // TODO: Send notification to user about trial ending
      break;

    case 'entitlements.active_entitlement_summary.updated':
      // Handle active entitlement summary updated
      console.log(`Active entitlement summary updated: ${event.id}`);
      // TODO: Update entitlements in your database
      break;

    default:
      console.log(`Unhandled event type: ${eventType}`);
  }

  return NextResponse.json({ status: 'success' });
}

