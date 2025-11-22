import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripeInstance() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set. Please add it to your .env.local file.');
  }
  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
  });
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: { message: 'Stripe secret key is not configured. Please add STRIPE_SECRET_KEY to your .env.local file.' } },
        { status: 500 }
      );
    }

    const stripe = getStripeInstance();

    const formData = await request.formData();
    const lookupKey = formData.get('lookup_key') as string;
    const billingCycle = formData.get('billing_cycle') as string || 'monthly';
    const customerEmail = formData.get('email') as string;

    if (!lookupKey) {
      return NextResponse.json(
        { error: { message: 'Missing lookup_key' } },
        { status: 400 }
      );
    }

    // Get the price from Stripe using lookup_key
    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      expand: ['data.product'],
    });

    if (prices.data.length === 0) {
      return NextResponse.json(
        { error: { message: 'Price not found' } },
        { status: 404 }
      );
    }

    const price = prices.data[0];

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get('origin')}/subscriptions/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/subscriptions/checkout?canceled=true`,
      customer_email: customerEmail || undefined,
      metadata: {
        billing_cycle: billingCycle,
        plan_slug: lookupKey,
      },
    });

    // Return JSON with URL for client-side redirect
    if (!session.url) {
      return NextResponse.json(
        { error: { message: 'Checkout session created but no URL returned' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    // Ensure we always return valid JSON
    const errorMessage = error?.message || error?.error?.message || 'Failed to create checkout session';
    return NextResponse.json(
      { error: { message: errorMessage } },
      { status: 500 }
    );
  }
}

