/**
 * API Route: Create Checkout Session for Connected Account
 * 
 * This endpoint creates a Stripe Checkout session for a connected account's customer
 * to purchase a product. Uses Direct Charge with application fee.
 * 
 * POST /api/connect/checkout/create
 * 
 * Request body:
 * {
 *   accountId: string,        // Connected account ID (acct_...)
 *   priceId: string,          // Stripe price ID (price_...)
 *   quantity: number,         // Quantity to purchase (default: 1)
 *   applicationFeeAmount: number  // Application fee in cents (optional)
 * }
 * 
 * Response:
 * {
 *   sessionId: string,        // Checkout session ID
 *   url: string              // Checkout URL to redirect customer to
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
    const {
      accountId,
      priceId,
      quantity = 1,
      applicationFeeAmount = 0, // Default to 0 if not specified
    } = body;

    // Validate required fields
    if (!accountId || !priceId) {
      return NextResponse.json(
        { error: 'accountId and priceId are required' },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate and get account ID
    const connectedAccountId = getConnectedAccountId(accountId);

    // Get origin for success/cancel URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    /**
     * Create a Checkout Session for the connected account
     * 
     * This uses Direct Charge with application fee:
     * - Payment goes directly to the connected account
     * - Platform receives an application fee
     * - Connected account receives the remainder
     * 
     * IMPORTANT: Use the stripeAccount option to create the session
     * on behalf of the connected account.
     */
    const session = await stripeClient.checkout.sessions.create(
      {
        // Line items for the checkout
        line_items: [
          {
            // Price ID from the connected account's product
            price: priceId,
            quantity: quantity,
          },
        ],

        // Payment intent data for Direct Charge
        payment_intent_data: {
          // Application fee in cents
          // This is the amount the platform keeps
          // Connected account receives: total_amount - application_fee_amount
          application_fee_amount: applicationFeeAmount,
        },

        // Payment mode - 'payment' for one-time purchases
        mode: 'payment',

        // URL to redirect to after successful payment
        success_url: `${origin}/storefront/${connectedAccountId}/success?session_id={CHECKOUT_SESSION_ID}`,

        // URL to redirect to if customer cancels
        cancel_url: `${origin}/storefront/${connectedAccountId}?canceled=true`,

        // Optional: Collect customer email
        customer_email: undefined, // Can be set if you have customer email
      },
      {
        // CRITICAL: This sets the Stripe-Account header
        // Checkout session is created on the connected account
        stripeAccount: connectedAccountId,
      }
    );

    if (!session.url) {
      throw new Error('Checkout session created but no URL returned');
    }

    /**
     * TODO: Store checkout session information in your database
     * 
     * Example:
     * await db.checkoutSessions.create({
     *   data: {
     *     stripeSessionId: session.id,
     *     accountId: connectedAccountId,
     *     priceId: priceId,
     *     quantity: quantity,
     *     status: 'pending',
     *   }
     * });
     */

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      message: 'Checkout session created. Redirect customer to the URL.',
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to create checkout session',
        details: error.type || 'unknown_error',
      },
      { status: 500 }
    );
  }
}

