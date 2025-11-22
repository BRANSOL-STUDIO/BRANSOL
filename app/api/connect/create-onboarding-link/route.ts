/**
 * API Route: Create Account Onboarding Link
 * 
 * This endpoint creates a Stripe Account Link for onboarding a connected account.
 * The user will be redirected to this link to complete their onboarding.
 * 
 * POST /api/connect/create-onboarding-link
 * 
 * Request body:
 * {
 *   accountId: string,     // Connected account ID (acct_...)
 *   returnUrl: string       // URL to return to after onboarding (optional)
 * }
 * 
 * Response:
 * {
 *   url: string            // Onboarding URL to redirect user to
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

    // Get the origin for return URL (fallback if not provided)
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const defaultReturnUrl = `${origin}/dashboard/connect`;

    /**
     * Create an Account Link for onboarding
     * 
     * Account Links are one-time use URLs that allow users to:
     * - Complete their account setup
     * - Provide required information
     * - Verify their identity
     * 
     * The link expires after 24 hours or after one use.
     * 
     * IMPORTANT: Account Links use the v1 API even though accounts are created with V2.
     * The v1 API is more stable for account links.
     */
    const accountLink = await stripeClient.accountLinks.create({
      // The connected account to onboard (works with both V1 and V2 accounts)
      account: connectedAccountId,
      
      // Type of link - 'account_onboarding' for first-time setup
      type: 'account_onboarding',
      
      // URL to return to after onboarding completes
      return_url: returnUrl || defaultReturnUrl,
      
      // URL to return to if user cancels onboarding
      refresh_url: returnUrl || defaultReturnUrl,
    });

    return NextResponse.json({
      url: accountLink.url,
      expires_at: accountLink.expires_at,
      message: 'Onboarding link created. Redirect user to this URL.',
    });
  } catch (error: any) {
    console.error('Error creating onboarding link:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to create onboarding link',
        details: error.type || 'unknown_error',
      },
      { status: 500 }
    );
  }
}

