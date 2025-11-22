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
    const sessionId = formData.get('session_id') as string;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session to get the customer account ID
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // Use customer_account for Stripe Accounts v2 (Connect)
    // If using Customers v1, use checkoutSession.customer instead
    const hasCustomerAccount = checkoutSession.customer_account;

    if (!hasCustomerAccount && !checkoutSession.customer) {
      return NextResponse.json(
        { error: 'Customer account not found in session' },
        { status: 404 }
      );
    }

    // Create portal session
    // Use customer_account for Accounts v2, or customer for v1
    const portalSessionParams: any = {
      return_url: `${request.headers.get('origin')}/subscriptions/checkout?success=true&session_id=${sessionId}`,
    };

    if (hasCustomerAccount) {
      portalSessionParams.customer_account = checkoutSession.customer_account as string;
    } else {
      portalSessionParams.customer = checkoutSession.customer as string;
    }

    const portalSession = await stripe.billingPortal.sessions.create(portalSessionParams);

    // Return JSON with URL for client-side redirect
    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    );
  }
}

