/**
 * API Route: Create Billing Portal Session
 * 
 * This endpoint creates a billing portal session for a connected account
 * to manage their subscription (upgrade, downgrade, cancel, etc.).
 * 
 * POST /api/connect/billing-portal
 * 
 * Request body:
 * {
 *   accountId: string,        // Connected account ID (acct_...)
 *   returnUrl: string         // URL to return to after portal (optional)
 * }
 * 
 * Response:
 * {
 *   url: string              // Billing portal URL to redirect to
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
    const { accountId, returnUrl } = body;

    // Validate and get account ID
    const connectedAccountId = getConnectedAccountId(accountId);

    // Get origin for return URL (fallback if not provided)
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const defaultReturnUrl = `${origin}/dashboard/connect/subscription`;

    /**
     * Create a billing portal session
     * 
     * The billing portal allows connected accounts to:
     * - View their subscription details
     * - Upgrade or downgrade their subscription
     * - Cancel their subscription
     * - Update payment methods
     * - View billing history
     * 
     * IMPORTANT: For V2 accounts, use customer_account with the account ID
     */
    const session = await stripeClient.billingPortal.sessions.create({
      // For V2 accounts, use customer_account with the connected account ID
      // This is the account that will manage their subscription
      customer_account: connectedAccountId,

      // URL to return to after leaving the billing portal
      return_url: returnUrl || defaultReturnUrl,
    });

    if (!session.url) {
      throw new Error('Billing portal session created but no URL returned');
    }

    return NextResponse.json({
      url: session.url,
      message: 'Billing portal session created. Redirect user to the URL.',
    });
  } catch (error: any) {
    console.error('Error creating billing portal session:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to create billing portal session',
        details: error.type || 'unknown_error',
      },
      { status: 500 }
    );
  }
}

