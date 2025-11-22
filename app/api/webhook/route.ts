import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Disable body parsing, need raw body for webhook signature verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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

