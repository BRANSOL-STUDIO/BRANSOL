/**
 * Stripe Connect Helper Functions
 * 
 * This file contains helper functions for Stripe Connect operations.
 * All functions use the Stripe Client pattern as required.
 */

import Stripe from 'stripe';

/**
 * Get or create a Stripe client instance
 * 
 * IMPORTANT: Replace 'YOUR_STRIPE_SECRET_KEY' with your actual Stripe secret key
 * from your .env.local file. The key should start with 'sk_test_' for test mode
 * or 'sk_live_' for production.
 * 
 * @returns Stripe client instance
 * @throws Error if STRIPE_SECRET_KEY is not configured
 */
export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not configured. ' +
      'Please add STRIPE_SECRET_KEY=sk_test_... to your .env.local file. ' +
      'Get your key from https://dashboard.stripe.com/apikeys'
    );
  }

  // Create Stripe client - the SDK will automatically use the latest preview version
  // No need to set apiVersion explicitly
  const stripeClient = new Stripe(secretKey, {
    apiVersion: '2025-08-27.preview',
  });

  return stripeClient;
}

/**
 * Get connected account ID from request
 * 
 * In a real application, you would:
 * 1. Get the authenticated user from your session/auth system
 * 2. Look up their connected account ID from your database
 * 
 * For this demo, we're using the account ID from the URL/request.
 * In production, you should use a more secure identifier.
 * 
 * @param accountId - The connected account ID (acct_...)
 * @returns The account ID or throws an error if not provided
 */
export function getConnectedAccountId(accountId: string | null): string {
  if (!accountId) {
    throw new Error(
      'Connected account ID is required. ' +
      'In production, get this from the authenticated user\'s database record.'
    );
  }

  if (!accountId.startsWith('acct_')) {
    throw new Error('Invalid connected account ID format. Must start with "acct_"');
  }

  return accountId;
}

