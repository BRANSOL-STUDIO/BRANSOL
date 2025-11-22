/**
 * API Route: Create Subscription Checkout for Connected Account
 * 
 * This endpoint creates a subscription checkout session for a connected account.
 * With V2 accounts, the connected account ID can be used as the customer_account.
 * 
 * POST /api/connect/subscription/create
 * 
 * Request body:
 * {
 *   accountId: string,        // Connected account ID (acct_...) - also used as customer
 *   priceId: string,          // Subscription price ID (price_...)
 * }
 * 
 * Response:
 * {
 *   sessionId: string,        // Checkout session ID
 *   url: string              // Checkout URL to redirect to
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, getConnectedAccountId } from '@/lib/stripe/connect';

export async function POST(request: NextRequest) {
  try {
    // Get Stripe client instance
    const stripeClient = getStripeClient();

    // Parse request body
    const body = await request.json();
    const { accountId, priceId } = body;

    // Validate required fields
    if (!accountId || !priceId) {
      return NextResponse.json(
        { error: 'accountId and priceId are required' },
        { status: 400 }
      );
    }

    // Validate price ID format
    if (!priceId.startsWith('price_')) {
      return NextResponse.json(
        { error: 'Invalid price ID format. Must start with "price_"' },
        { status: 400 }
      );
    }

    // Validate and get account ID
    const connectedAccountId = getConnectedAccountId(accountId);

    // Get origin for success/cancel URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    /**
     * IMPORTANT: For V2 accounts, the connected account ID (acct_...)
     * can be used directly as the customer_account.
     * 
     * Do NOT use .customer for V2 accounts - use .customer_account instead.
     */

    /**
     * Create a subscription checkout session at the platform level
     * 
     * This creates a subscription where:
     * - The connected account is the customer
     * - The platform manages the subscription
     * - Payments are handled by Stripe
     */
    const session = await stripeClient.checkout.sessions.create({
      // For V2 accounts, use customer_account with the account ID
      // This is the connected account subscribing to a platform service
      customer_account: connectedAccountId,

      // Subscription mode
      mode: 'subscription',

      // Line items for the subscription
      line_items: [
        {
          // Price ID for the subscription
          // IMPORTANT: This should be a price from your PLATFORM account,
          // not from the connected account
          // In production, get this from your database or environment variables
          price: priceId,
          quantity: 1,
        },
      ],

      // URL to redirect to after successful subscription
      success_url: `${origin}/dashboard/connect/subscription?session_id={CHECKOUT_SESSION_ID}`,

      // URL to redirect to if customer cancels
      cancel_url: `${origin}/dashboard/connect/subscription?canceled=true`,
    });

    if (!session.url) {
      throw new Error('Checkout session created but no URL returned');
    }

    /**
     * TODO: Store subscription checkout session in your database
     * 
     * Example:
     * await db.subscriptionCheckouts.create({
     *   data: {
     *     stripeSessionId: session.id,
     *     accountId: connectedAccountId,
     *     priceId: priceId,
     *     status: 'pending',
     *   }
     * });
     */

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      message: 'Subscription checkout session created. Redirect user to the URL.',
    });
  } catch (error: any) {
    console.error('Error creating subscription checkout:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to create subscription checkout',
        details: error.type || 'unknown_error',
      },
      { status: 500 }
    );
  }
}

