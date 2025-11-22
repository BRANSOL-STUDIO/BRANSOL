/**
 * API Route: Get Account Status
 * 
 * This endpoint retrieves the current status of a connected account,
 * including onboarding status and payment capability status.
 * 
 * GET /api/connect/account-status?accountId=acct_...
 * 
 * Response:
 * {
 *   accountId: string,
 *   readyToProcessPayments: boolean,
 *   onboardingComplete: boolean,
 *   requirementsStatus: string,
 *   account: object
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, getConnectedAccountId } from '@/lib/stripe/connect';

export async function GET(request: NextRequest) {
  try {
    // Get Stripe client instance
    const stripeClient = getStripeClient();

    // Get account ID from query parameters
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    // Validate and get account ID
    const connectedAccountId = getConnectedAccountId(accountId);

    /**
     * Retrieve the connected account with expanded data
     * 
     * We include:
     * - configuration.merchant: To check payment capabilities
     * - requirements: To check onboarding status
     */
    const account = await stripeClient.v2.core.accounts.retrieve(connectedAccountId, {
      include: ['configuration.merchant', 'requirements'],
    });

    /**
     * Check if account is ready to process payments
     * 
     * The account can process payments when:
     * - card_payments capability status is 'active'
     */
    const readyToProcessPayments =
      account?.configuration?.merchant?.capabilities?.card_payments?.status === 'active';

    /**
     * Check onboarding completion status
     * 
     * Onboarding is complete when:
     * - requirements.summary.minimum_deadline.status is NOT 'currently_due' or 'past_due'
     * 
     * Status values:
     * - 'currently_due': Requirements need to be completed
     * - 'past_due': Requirements are overdue
     * - 'eventually_due': Requirements will be due in the future
     * - null/undefined: No requirements currently due
     */
    const requirementsStatus =
      account.requirements?.summary?.minimum_deadline?.status;

    const onboardingComplete =
      requirementsStatus !== 'currently_due' && requirementsStatus !== 'past_due';

    return NextResponse.json({
      accountId: connectedAccountId,
      readyToProcessPayments,
      onboardingComplete,
      requirementsStatus: requirementsStatus || 'complete',
      account: {
        id: account.id,
        display_name: account.display_name,
        contact_email: account.contact_email,
        dashboard: account.dashboard,
      },
    });
  } catch (error: any) {
    console.error('Error retrieving account status:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to retrieve account status',
        details: error.type || 'unknown_error',
      },
      { status: 500 }
    );
  }
}

